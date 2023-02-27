const App = () => {
    const [data, setData] = React.useState([]);
    const [curData, setCurData] = React.useState(null);

    //App渲染完成后，请求数据，并通知子组件更新
    React.useEffect(() => {
        (async function () {
            const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
            const res = await fetch(url);
            const json = await res.json();
            setData(json.data);
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
            <h1 id='title'>United States GDP</h1>
            <BarChart
                data={data}
                handleMouseover={handleMouseover}
                handleMouseout={handleMouseout} />
            <Tooltip data={curData} />
            <footer>More information:&nbsp;
                <a href='http://www.bea.gov/national/pdf/nipaguid.pdf' target='_blank'>http://www.bea.gov/national/pdf/nipaguid.pdf</a>
            </footer>
        </div>
    );
}

const BarChart = (props) => {
    const d3node = React.useRef(null);

    React.useEffect(() => {
        //data还没解析出来
        if (props.data.length === 0) return;

        const width = 880;
        const height = 410;
        const padding = 0.2;
        const paddingTop = 10;
        const paddingRight = 40;
        const axisWidth = 60;
        const axisHeight = 20;

        //创建svg，通过useRef锁定DOM
        const svg = d3.select(d3node.current).append('svg')
            .attr('width', width).attr('height', height);

        //x轴按时间的比例尺
        const years = props.data.map(d => new Date(d[0]));
        const xScale = d3.scaleTime()
            .domain([d3.min(years), d3.max(years)])
            .range([axisWidth, width - paddingRight]);
        //y轴线性比例尺
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(props.data, d => d[1])]).range([height - axisHeight, paddingTop]);

        //纵坐标的说明文本
        svg.append('text').text('Gross Domestic Product')
            .attr('transform', `rotate(-90),translate(-200,80)`);

        //绘制rect并添加事件
        svg.selectAll('rect').data(props.data).enter().append('rect')
            .attr('class', 'bar')
            .attr('data-date', d => d[0]).attr('data-gdp', d => d[1])
            .attr('width', (width - axisWidth - paddingRight) / props.data.length - padding)
            .attr('height', d => height - axisHeight - yScale(d[1]))
            .attr('x', (_, i) => xScale(years[i])).attr('y', d => yScale(d[1]))
            .attr('fill', d3.rgb(51, 173, 255))
            .on('mouseover', function () {    //监听鼠标移入
                const data = {
                    'x': d3.select(this).attr('x'),
                    'date': d3.select(this).attr('data-date'),
                    'gdp': d3.select(this).attr('data-gdp'),
                };
                props.handleMouseover(data);
            })
            .on('mouseout', props.handleMouseout);    //监听鼠标移出

        //绘制坐标轴
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);
        svg.append('g').attr('id', 'x-axis')
            .attr('transform', `translate(0,${height - axisHeight})`)
            .call(xAxis);
        svg.append('g').attr('id', 'y-axis')
            .attr('transform', `translate(${axisWidth},0)`)
            .call(yAxis);

    }, [props.data]);

    return <div className='chart' ref={d3node} ></div>;
}

const Tooltip = (props) => {
    const tt = React.useRef(null);

    React.useEffect(() => {    //监听data变动
        if (!props.data) {
            tt.current.style.opacity = 0;
        } else {
            tt.current.style.opacity = 0.9;
            tt.current.style.left = 30 + +props.data.x + 'px';
        }
    }, [props.data]);

    const formatDate = (date) => {
        const arr = date.split('-');
        switch (arr[1]) {
            case '01':
                return arr[0] + ' Q1';
            case '04':
                return arr[0] + ' Q2';
            case '07':
                return arr[0] + ' Q3';
            case '10':
                return arr[0] + ' Q4';
        }
    }

    const formatGdp = (gdp) => {
        return d3.format('$,')(+gdp) + ' Billlion';
    }

    return (
        <div id='tooltip' ref={tt} data-date={props.data ? props.data.date : ''}>
            {props.data ? formatDate(props.data.date) : ''}<br />
            {props.data ? formatGdp(props.data.gdp) : ''}
        </div>
    );
}

const container = document.getElementById('container');
const root = ReactDOM.createRoot(container);
root.render(<App />);