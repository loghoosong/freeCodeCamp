const App = () => {
    const [data, setData] = React.useState([]);
    const [curData, setCurData] = React.useState('');

    //App渲染完成后，请求数据，并通知子组件更新
    React.useEffect(() => {
        (async function () {
            const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
            const res = await fetch(url);
            const json = await res.json();
            setData(json);
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
            <h1 id='title'>Doping in Professional Bicycle Racing</h1>
            <p>35 Fastest times up Alpe d'Huez</p>
            <Tooltip data={curData} />
            <Scatter
                data={data}
                handleMouseover={handleMouseover}
                handleMouseout={handleMouseout} />
        </div>
    );
}

const Scatter = (props) => {
    const d3node = React.useRef(null);

    React.useEffect(() => {
        //data还没解析出来
        if (props.data.length === 0) return;

        const width = 900;
        const height = 530;
        const paddingLeft = 60, paddingRight = 15;
        const paddingBottom = 20, paddingTop = 10;
        const radius = 6;
        const dopingColor = '#1f77b4', noDopingColor = '#ff7f0e';

        //创建svg，通过useRef锁定DOM
        const svg = d3.select(d3node.current).append('svg')
            .attr('width', width).attr('height', height)

        //区分数据
        const noDoping = props.data.filter(d => d.doping === '');
        const withDoping = props.data.filter(d => d.doping !== '');

        //处理纵轴的时间数据
        const times = props.data.map(d => {
            const split = d.Time.split(':');
            return new Date(1970, 0, 1, 0, split[0], split[1]);
        });

        //比例尺
        const xScale = d3.scaleLinear()
            .domain([d3.min(props.data, d => d.Year) - 1, d3.max(props.data, d => d.Year) + 1])
            .range([paddingLeft, width - paddingRight]);
        const yScale = d3.scaleTime()
            .domain([d3.min(times), d3.max(times)])
            .range([paddingTop, height - paddingBottom]);

        //坐标轴
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format(''));
        const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
        svg.append('g').attr('id', 'x-axis')
            .attr('transform', `translate(0,${height - paddingBottom})`)
            .call(xAxis);
        svg.append('g').attr('id', 'y-axis')
            .attr('transform', `translate(${paddingLeft},0)`)
            .call(yAxis);

        //纵轴的说明文本
        svg.append('text').text('Time in Minutes')
            .attr('transform', `rotate(-90),translate(${-height * 0.4},${paddingLeft - 45})`)
            .attr('font-size', '20');

        //散点并添加事件
        svg.selectAll('circle').data(props.data).enter().append('circle')
            .attr('class', 'dot')
            .attr('r', radius)
            .attr('cx', d => xScale(d.Year)).attr('cy', (_, i) => yScale(times[i]))
            .attr('data-xvalue', d => d.Year).attr('data-yvalue', (_, i) => times[i].toISOString())
            .attr('fill', d => d.Doping === '' ? d3.color(noDopingColor) : d3.color(dopingColor))
            .attr('stroke', 'black').attr('index', (_, i) => i)
            .on('mouseover', function (event, d) {
                const data = {
                    'name': d.Name,
                    'nationality': d.Nationality,
                    'year': d.Year,
                    'time': d.Time,
                    'doping': d.Doping,
                    'x': event.pageX,
                    'y': event.pageY,
                };
                props.handleMouseover(data);
            })
            .on('mouseout', props.handleMouseout);

        //图例
        const legendSize = 18;
        const legend = svg.append('g').attr('id', 'legend')
            .attr('transform', `translate(${width - legendSize - 2},${height * 0.45})`);
        legend.append('rect')
            .attr('width', legendSize).attr('height', legendSize)
            .attr('fill', noDopingColor)
        legend.append('text').text('No doping allegations')
            .attr('font-size', 10)
            .style('text-anchor', 'end')
            .attr('x', -5).attr('y', 12);
        legend.append('rect')
            .attr('width', legendSize).attr('height', legendSize)
            .attr('fill', dopingColor).attr('y', legendSize + 2);
        legend.append('text').text('Riders with doping allegations')
            .attr('font-size', 10)
            .style('text-anchor', 'end')
            .attr('x', -5).attr('y', 14 + legendSize);

    }, [props.data]);

    return <div className='scatter' ref={d3node}></div>;
}

const Tooltip = (props) => {
    const tt = React.useRef(null);

    const getText = () => {
        if (props.data === null) return '';
        return `${props.data.name}: ${props.data.nationality}<br />
                Year:${props.data.year}, Time:${props.data.time}
                ${props.data.doping === '' ? '' : '<br /><br />' + props.data.doping}`;
    }

    React.useEffect(() => {    //监听data变动
        if (!props.data) {
            tt.current.style.opacity = 0;
        } else {
            tt.current.style.opacity = 0.9;
            tt.current.innerHTML = getText();
            tt.current.style.left = props.data.x + 'px';
            tt.current.style.top = -30 + props.data.y + 'px';
        }
    }, [props.data]);


    return <div id='tooltip' ref={tt} data-year={props.data ? props.data.year : ''}></div>;
}

const container = document.getElementById('container');
const root = ReactDOM.createRoot(container);
root.render(<App />);