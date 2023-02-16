const Calculator = () => {
    const DLM = 'DIGIT LIMIT MET';
    const [calc, setCalc] = React.useState('');
    const [curr, setCurr] = React.useState('0');

    const doCalc = (expression) => {
        expression = expression.replace(/[-+*/]+$/, '');
        const temp = expression.replace('--', '+');    //连续的减号
        const res = eval(temp);
        return [res, expression];
    }

    const handleClick = (padType, padValue) => {
        if (curr == DLM) return;

        switch (padType) {
            case 'clear':
                setCalc('');
                setCurr('0');
                break;
            case 'num':
                if (curr.length > 21) {    //数位限制
                    setTimeout(() => {
                        setCurr(curr);
                    }, 1000);
                    setCurr(DLM);
                    break;
                }

                if (curr == '0' || /=|([-+*/]$)/.test(calc)) {    //如果为0或calc尾部为操作符就重置
                    if (padValue == '.') padValue = '0.';    //小数点前补0
                    setCurr(curr == '-' ? curr + padValue : padValue);
                } else {
                    if (padValue == '.') {
                        if (/\./.test(curr)) break    //两个小数点
                        if (!/\d$/.test(calc)) padValue = '0.';    //小数点前补0
                    }
                    setCurr(curr + padValue);
                }

                setCalc(calc == '0' || /=/.test(calc)    //如果为0或刚做完计算就重置
                    ? padValue : calc + padValue);
                break;
            case 'operator':
                if (padValue == 'x') padValue = '*';

                if (calc == ''    //没有任何输入
                    && (padValue == '*' || padValue == '/')) {
                    break;
                } else if (/=/.test(calc)) {    //刚做完计算
                    setCalc(calc.match(/(?<==).*/) + padValue)
                } else if (/[-+*/]/.test(calc)) {    //calc包含操作符
                    if (padValue == '-' && /[-+*/]$/.test(calc) && curr != '-') {    //单独处理减号
                        setCalc(calc + '-');
                        setCurr('-');
                    } else {
                        const res = doCalc(calc);
                        setCalc(res[0] + padValue);
                        setCurr(res[0]);
                    }
                } else if ((/[-+*/]/.test(calc))) {    //中间是操作符
                    const res = doCalc(calc);
                    setCalc(res + padValue);
                    setCurr(res);
                } else {
                    setCalc(calc + padValue);
                }
                break;
            case 'equals':
                const res = doCalc(calc);
                setCalc(res[1] + '=' + res[0]);
                setCurr(res[0]);
        }
    }

    return (
        <React.Fragment>
            <div className="calculator ">
                <Display calc={calc} curr={curr} />
                <Pads handleClick={handleClick} />
            </div>
            <footer>Designed and Coded By<br />loghooSong</footer>
        </React.Fragment>
    );
}

const Display = (props) => {
    return (
        <div>
            <p id="expression">{props.calc}</p>
            <p id="display">{props.curr}</p>
        </div>
    );
}

const Pads = (props) => {
    const pads = calculatorPads.map((p, i) => {
        return (
            <Pad key={i}
                id={p.id}
                type={p.type}
                content={p.content}
                handleClick={props.handleClick} />
        );
    });

    return <div className="pads">{pads}</div>;
}

const Pad = (props) => {
    return (
        <button
            className={"pad " + props.type}
            id={props.id}
            onClick={() => props.handleClick(props.type, props.content)}
            tabIndex={-1}
        >{props.content}</button>
    );
}

const container = document.getElementById('container');
const root = ReactDOM.createRoot(container);
root.render(<Calculator />);

const calculatorPads = [
    {
        id: 'clear',
        content: 'AC',
        type: 'clear'
    }, {
        id: 'divide',
        content: '/',
        type: 'operator'
    }, {
        id: 'multiply',
        content: 'x',
        type: 'operator'
    }, {
        id: 'seven',
        content: '7',
        type: 'num'
    }, {
        id: 'eight',
        content: '8',
        type: 'num'
    }, {
        id: 'nine',
        content: '9',
        type: 'num'
    }, {
        id: 'subtract',
        content: '-',
        type: 'operator'
    }, {
        id: 'four',
        content: '4',
        type: 'num'
    }, {
        id: 'five',
        content: '5',
        type: 'num'
    }, {
        id: 'six',
        content: '6',
        type: 'num'
    }, {
        id: 'add',
        content: '+',
        type: 'operator'
    }, {
        id: 'one',
        content: '1',
        type: 'num'
    }, {
        id: 'two',
        content: '2',
        type: 'num'
    }, {
        id: 'three',
        content: '3',
        type: 'num'
    }, {
        id: 'zero',
        content: '0',
        type: 'num'
    }, {
        id: 'decimal',
        content: '.',
        type: 'num'
    }, {
        id: 'equals',
        content: '=',
        type: 'equals'
    },
];