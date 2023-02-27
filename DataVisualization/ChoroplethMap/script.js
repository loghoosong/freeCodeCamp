const App = () => {
    const [geoJson, setGeoJson] = React.useState(null);
    const [dataMap, setDataMap] = React.useState(null);
    const [curData, setCurData] = React.useState(null);

    //App渲染完成后，请求数据，并通知子组件更新
    React.useEffect(() => {     //地图
        (async function () {
            const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
            const res = await fetch(url);
            const json = await res.json();
            setGeoJson(json);
        })();
    }, []);
    React.useEffect(() => {     //受教育数据
        (async function () {
            const url = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
            const res = await fetch(url);
            const json = await res.json();
            const map = new Map(json.map(d => [d.fips, d]));
            setDataMap(map);
        })();
    }, []);

    const handleMouseover = (d) => {
        setCurData(d);
    }

    const handleMouseout = () => {
        setCurData(null);
    }

    return (
        <div className='app'>
            <h1 id='title'>United States Educational Attainment</h1>
            <p id='description'>Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)</p>
            <Tooltip data={curData} />
            <ChoroplethMap
                geoJson={geoJson}
                dataMap={dataMap}
                handleMouseover={handleMouseover}
                handleMouseout={handleMouseout} />
            <footer>Source:
                <a href='https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx' target='_blank'
                >USDA Economic Research Service</a></footer>
        </div>
    );
}

const ChoroplethMap = (props) => {
    const d3node = React.useRef(null);

    const width = 960;
    const height = 600;

    React.useEffect(() => {
        //地图或数据还没解析出来
        if (!props.geoJson || !props.dataMap) return;

        const svg = d3.select(d3node.current);
        //图例
        const padding = 20;
        const legendRectWidth = 32;
        const legendRectHeight = 8;

        const legendRectCnt = 8;
        const colors = d3.schemeGreens[legendRectCnt];
        const minEdu = d3.min(props.dataMap.values(), d => d.bachelorsOrHigher),
            maxEdu = d3.max(props.dataMap.values(), d => d.bachelorsOrHigher);
        const educations = new Array(legendRectCnt + 1).fill()
            .map((_, i) => minEdu + (maxEdu - minEdu) / legendRectCnt * i);

        const legend = svg.append('g').attr('id', 'legend')
            .attr('width', legendRectWidth * legendRectCnt + padding * 2)
            .attr('height', legendRectHeight + padding)
            .attr('transform', `translate(${width * 0.6},${height * 0.05})`);
        const legendScale = d3.scaleLinear()
            .domain([d3.min(educations), d3.max(educations)])
            .range([padding, padding + legendRectWidth * legendRectCnt]);
        const legendAxis = d3.axisBottom(legendScale)
            .tickValues(educations).tickFormat(d => Math.round(d) + '%')
            .tickSize(legendRectHeight + 6);
        legend.selectAll('rect').data(educations.slice(0, legendRectCnt))
            .enter().append('rect')
            .attr('width', legendRectWidth).attr('height', legendRectHeight)
            .attr('x', d => legendScale(d))
            .attr('fill', (_, i) => colors[i]);
        legend.append('g').call(legendAxis)
            .select('.domain').remove();

        //地图
        const colorScale = d3.scaleThreshold()
            .domain(educations).range(colors);
        svg.append('g').attr('class', 'counties')
            .selectAll('path')
            .data(topojson.feature(props.geoJson, props.geoJson.objects.counties).features)
            .enter().append('path')
            .attr('class', 'county')
            .attr('data-fips', d => d.id).attr('data-education', d => props.dataMap.get(d.id).bachelorsOrHigher)
            .attr('fill', d => colorScale(props.dataMap.get(d.id).bachelorsOrHigher))
            .attr('d', d3.geoPath())
            .on('mouseover', (event, d) => {
                const data = {
                    'county': props.dataMap.get(d.id).area_name,
                    'state': props.dataMap.get(d.id).state,
                    'education': props.dataMap.get(d.id).bachelorsOrHigher,
                    'x': event.pageX,
                    'y': event.pageY,
                }
                props.handleMouseover(data);
            })
            .on('mouseout', props.handleMouseout);

        svg.append('path')
            .datum(topojson.mesh(props.geoJson, props.geoJson.objects.states, (a, b) => a !== b))
            .attr('class', 'states')
            .attr('d', d3.geoPath());
    }, [props.geoJson, props.dataMap]);

    return (
        <svg
            className='choropleth-map'
            ref={d3node}
            width={width}
            height={height}>
        </svg>
    );
}

const Tooltip = (props) => {
    const tt = React.useRef(null);

    const getText = () => {
        if (props.data === null) return '';
        return `${props.data.county}, ${props.data.state}: ${props.data.education}%`;
    }

    React.useEffect(() => {    //监听data变动
        if (!props.data) {
            tt.current.style.opacity = 0;
        } else {
            tt.current.style.opacity = 0.9;
            tt.current.innerHTML = getText();
            tt.current.style.left = props.data.x + 'px';
            tt.current.style.top = -40 + props.data.y + 'px';
        }
    }, [props.data]);

    return <div id='tooltip' ref={tt} data-education={props.data ? props.data.education : ''}></div>;
}

const container = document.getElementById('container');
const root = ReactDOM.createRoot(container);
root.render(<App />);