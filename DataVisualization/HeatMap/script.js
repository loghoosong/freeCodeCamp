const App = () => {
    const [baseTemperature, setBaseTemperature] = React.useState(0)
    const [data, setData] = React.useState([]);
    const [curData, setCurData] = React.useState('');

    //App渲染完成后，请求数据，并通知子组件更新
    React.useEffect(() => {
        (async function () {
            const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
            const res = await fetch(url);
            const json = await res.json();
            setData(json.monthlyVariance);
            setBaseTemperature(json.baseTemperature);
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
            <h1 id='title'>Monthly Global Land-Surface Temperature</h1>
            <p id='description'>1753 - 2015: base temperature {baseTemperature}℃</p>
            <Tooltip data={curData} baseTemperature={baseTemperature} />
            <HeatMap
                baseTemperature={baseTemperature}
                data={data}
                handleMouseover={handleMouseover}
                handleMouseout={handleMouseout} />
        </div>
    );
}

const HeatMap = (props) => {
    const d3node = React.useRef(null);

    React.useEffect(() => {
        //data还没解析出来
        if (props.data.length === 0) return;

        //主图
        const rectWidth = 5;
        const rectHeight = 33;
        const paddingLeft = 120, paddingRight = 80;
        const paddingBottom = 60, paddingTop = 10;
        const svg = d3.select(d3node.current).append('svg')
            .attr('width', Math.ceil(props.data.length / 12) * rectWidth + paddingLeft + paddingRight)
            .attr('height', rectHeight * 12 + paddingBottom + paddingTop);

        //主图坐标轴
        const years = Array.from(new Set(props.data.map(d => d.year)));     //去重
        const months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        const xScale = d3.scaleBand()
            .domain(years)
            .range([paddingLeft, Math.ceil(props.data.length / 12) * rectWidth + paddingLeft]);
        const yScale = d3.scaleBand()
            .domain(months).range([paddingTop, rectHeight * 12 + paddingTop]);
        const xAxis = d3.axisBottom(xScale)
            .tickValues(years.filter(y => y % 10 === 0));
        const yAxis = d3.axisLeft(yScale)
            .tickFormat(m => {
                const date = new Date(1970, 0);
                date.setMonth(m);
                return d3.timeFormat('%B')(date);
            });
        svg.append('g').call(xAxis).attr('id', 'x-axis')
            .attr('transform', `translate(0,${rectHeight * 12 + paddingTop})`);
        svg.append('g').call(yAxis).attr('id', 'y-axis')
            .attr('transform', `translate(${paddingLeft},0)`);

        //坐标轴说明文字
        svg.append('text').text('years')
            .attr('transform', `translate(${Math.ceil(props.data.length / 24) * rectWidth + paddingLeft},${rectHeight * 12 + paddingBottom})`)
            .attr('font-size', 10);
        svg.append('text').text('months')
            .attr('transform', `rotate(-90),translate(${-rectHeight * 6},${paddingLeft - 100})`)
            .attr('font-size', 10);

        //生成图例
        const legendWidth = 400;
        const colorsLength = 11;
        const legendRectHeight = 30;
        const variances = props.data.map(d => d.variance);
        const minTemp = props.baseTemperature + d3.min(variances);
        const maxTemp = props.baseTemperature + d3.max(variances);

        const colors = d3.schemeRdYlBu[colorsLength].reverse();    //颜色分布
        const temps = new Array(colorsLength - 1).fill()
            .map((_, i) => minTemp + (maxTemp - minTemp) * (i + 1) / colorsLength);    //温度分布

        const legend = d3.select(d3node.current).append('svg').attr('id', 'legend')
            .attr('width', 500)
            .attr('transform', 'translate(120,0)');
        const legendScale = d3.scaleLinear().domain([minTemp, maxTemp]).range([0, legendWidth]);
        const legendAxis = d3.axisBottom(legendScale)
            .tickValues(temps)
            .tickFormat(d3.format('.2f'));
        legend.append('g').call(legendAxis).attr('transform', `translate(0,${legendRectHeight})`);

        legend.selectAll('rect').data(temps.slice(0, temps.length - 1))
            .enter().append('rect')
            .attr('width', legendWidth / colorsLength).attr('height', legendRectHeight)
            .attr('x', d => legendScale(d))
            .attr('fill', (_, i) => d3.color(colors[i + 1]))
            .attr('stroke', 'black');

        //数据Rect 并绑定事件
        const legendThreshold = d3.scaleThreshold().domain(temps).range(colors);
        svg.selectAll('.cell').data(props.data).enter()
            .append('rect').attr('class', 'cell')
            .attr('width', rectWidth).attr('height', rectHeight)
            .attr('x', d => xScale(d.year)).attr('y', d => yScale(d.month - 1))
            .attr('fill', d => legendThreshold(d.variance + props.baseTemperature))
            .attr('data-month', d => d.month - 1).attr('data-year', d => d.year)
            .attr('data-temp', d => d.variance + props.baseTemperature)
            .on('mouseover', function (event, d) {
                const data = {
                    'year': d.year,
                    'month': d.month,
                    'variance': d.variance,
                    'x': event.pageX,
                    'y': d3.select(this).attr('y'),
                }
                props.handleMouseover(data);
            })
            .on('mouseout', props.handleMouseout);


    }, [props.data])

    return <div className='heat-map' ref={d3node}></div>;
}

const Tooltip = (props) => {
    const tt = React.useRef(null);

    const getText = () => {
        if (props.data === null) return '';
        return `${props.data.year} - ${d3.timeFormat('%B')(new Date(1970, 0).setMonth(props.data.month))}<br />
                Temperature: ${d3.format('.3f')(props.data.variance + props.baseTemperature)}<br />
                Varianve: ${props.data.variance}`;
    }

    React.useEffect(() => {    //监听data变动
        if (!props.data) {
            tt.current.style.opacity = 0;
        } else {
            tt.current.style.opacity = 0.9;
            tt.current.innerHTML = getText();
            tt.current.style.left = -tt.current.offsetWidth / 2 + props.data.x + 'px';
            tt.current.style.top = props.data.y + 'px';
        }
    }, [props.data]);


    return <div id='tooltip' ref={tt} data-year={props.data ? props.data.year : ''}></div>;
}

const container = document.getElementById('container');
const root = ReactDOM.createRoot(container);
root.render(<App />);