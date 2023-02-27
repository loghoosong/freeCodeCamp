const App = () => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [data, setData] = React.useState('');
    const [curData, setCurData] = React.useState(null);

    const navData = [
        {
            'navContext': 'Video Game Data Set',
            'title': 'Video Game Sales',
            'desc': 'Top 100 Most Sold Video Games Grouped by Platform',
            'url': 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json',
        },
        {
            'navContext': 'Movies Data Set',
            'title': 'Movie Sales',
            'desc': 'Top 100 Highest Grossing Movies Grouped By Genre',
            'url': 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json',
        },
        {
            'navContext': 'Kickstarter Data Set',
            'title': 'Kickstarter Pledges',
            'desc': 'Top 100 Most Pledged Kickstarter Campaigns Grouped By Category',
            'url': 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json',
        }
    ];

    const handleClick = (i) => {
        setActiveIndex(i);
        handleJsonData(i);
    }

    const handleJsonData = (i) => {
        const jsonStr = sessionStorage.getItem('jsonData' + i);
        if (jsonStr) {
            setData(JSON.parse(jsonStr));
        } else {
            (async (url) => {
                const res = await fetch(url);
                const jsonObj = await res.json();
                setData(jsonObj);
                sessionStorage.setItem('jsonData' + i, JSON.stringify(jsonObj));
            })(navData[i].url);
        }
    }

    //App渲染完成后初始化一次jsondata，离开时清楚缓存
    React.useEffect(() => {
        handleJsonData(activeIndex);
        return sessionStorage.clear();
    }, []);

    const handleMouseover = (d) => {
        setCurData(d);
    }

    const handleMouseout = () => {
        setCurData(null);
    }

    return (
        <div className='app'>
            <Nav
                activeIndex={activeIndex}
                context={navData.map(item => item.navContext)}
                handleClick={handleClick} />
            <h1 id='title'>{navData[activeIndex].title}</h1>
            <p id='description'>{navData[activeIndex].desc}</p>
            <TreeMap
                data={data}
                handleMouseover={handleMouseover}
                handleMouseout={handleMouseout} />
            <Tooltip data={curData} />
        </div>
    );
}

const Nav = (props) => {
    const li = props.context.map((c, i) =>
    (<li
        key={i}
        className={`navli${i === props.activeIndex ? ' active' : ''}`}
        onClick={() => { props.handleClick(i) }}>{c}
    </li>));

    return (
        <nav>
            <ul>{li}</ul>
        </nav>
    )
}

const TreeMap = (props) => {
    const treemapNode = React.useRef(null);
    const legendNode = React.useRef(null);

    React.useEffect(() => {
        //未读取完数据
        if (!props.data) return;

        const width = 960;
        const height = 570;
        const colors = [
            '#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c',
            '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5',
            '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f',
            '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];

        const svg = d3.select(treemapNode.current)
            .attr('width', width).attr('height', height);

        //层次化数据
        const root = d3.hierarchy(props.data).sum(d => d.value)
            .sort((a, b) => b.value - a.value);
        const categories = root.children.map(d => d.data.name);
        const colorScale = d3.scaleOrdinal()
            .domain(categories).range(colors.slice(0, categories.length));

        //treemap
        d3.treemap().size([width, height]).padding(1)
            (root);
        const g = svg.selectAll('.group').data(root.leaves())
            .join('g').attr('class', 'group')
            .attr('transform', d => `translate(${d.x0},${d.y0})`)
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
        //画rect
        g.selectAll('.tile').data(d => d)
            .join('rect').attr('class', 'tile')
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .attr('data-name', d => d.data.name).attr('data-category', d => d.data.category)
            .attr('data-value', d => d.value)
            .attr('fill', d => colorScale(d.data.category))
            .on('mouseover', (event, d) => {
                const data = {
                    'name': d.data.name,
                    'category': d.data.category,
                    'value': d.value,
                    'x': event.pageX,
                    'y': event.pageY,
                };
                props.handleMouseover(data);
            })
            .on('mouseout', props.handleMouseout)
        //文字
        g.selectAll('text').data(d => d)
            .join('text').attr('class', 'tile-text')
            .selectAll('tspan').data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
            .join('tspan').text(d => d)
            .attr('font-size', 10)
            .attr('x', 3).attr('y', (_, i) => 13 + 10 * i);

        //图例
        const legendRectSize = 15;
        const legendRectRowGap = 10;
        const legendRectColGap = 135;
        const legendCols = 3;

        const legend = d3.select(legendNode.current)
            .attr('width', (legendRectSize + legendRectColGap) * legendCols)
            .attr('height', (legendRectSize + legendRectRowGap) * Math.ceil(categories.length / legendCols));
        const lg = legend.selectAll('.legend-group').data(categories)
            .join('g').attr('class', 'legend-group')
            .attr('transform', (_, i) => `translate(${(legendRectSize + legendRectColGap) * (i % legendCols)},${(legendRectSize + legendRectRowGap) * Math.trunc(i / legendCols)})`)
        console.log(categories)
        lg.selectAll('.legend-item').data(d => [d])
            .join('rect').attr('class', 'legend-item')
            .attr('width', legendRectSize).attr('height', legendRectSize)
            .attr('fill', d => colorScale(d));
        lg.selectAll('text').data(d => [d])
            .join('text').text(d => d)
            .attr('x', legendRectSize + 3).attr('y', legendRectSize);
    }, [props.data]);

    return (
        <React.Fragment>
            <svg className='tree-map' ref={treemapNode}></svg>
            <svg id='legend' ref={legendNode}></svg>
        </React.Fragment>
    )
}

const Tooltip = (props) => {
    const tt = React.useRef(null);

    const getText = () => {
        if (props.data === null) return '';
        return `Name: ${props.data.name}<br />
            Category: ${props.data.category}<br />
            Value: ${props.data.value}`;
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

    return <div id='tooltip' ref={tt} data-value={props.data ? props.data.value : 0}></div>;
}

const container = document.getElementById('container');
const root = ReactDOM.createRoot(container);
root.render(<App />);