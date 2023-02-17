const BREAK = 'break';
const SESSION = 'session';
let timer;
const App = () => {
    const [breakLength, setBreakLength] = React.useState(5);
    const [sessionLength, setSessionLength] = React.useState(25);

    const [period, setPeriod] = React.useState(SESSION);
    const [timeLeft, setTimeLeft] = React.useState(1500000);
    const [timeStart, setTimeStart] = React.useState();
    const [timerDisplay, setTimerDisplay] = React.useState(1500);
    const [timerRunning, setTimerRunning] = React.useState(false);
    const beep = React.useRef();

    const handleSettingChange = (id, value) => {
        if (timerRunning) return;
        if (value <= 0 || value > 60) return;
        switch (id) {
            case BREAK:
                setBreakLength(value);
                break;
            case SESSION:
                setSessionLength(value);
        }

        if (period == id) {
            setTimeLeft(value * 60000);
            setTimerDisplay(value * 60);
            clearInterval(timer);
        }
    }

    const ref = React.useRef();
    ref.period = period;
    const runTimer = () => {
        const now = Date.now();
        setTimeStart(now);
        timer = setInterval(() => {
            let nowLeft = Math.ceil((timeLeft - (Date.now() - now)) / 1000);
            if (nowLeft != timerDisplay) {
                if (nowLeft == 0) {
                    beep.current.currentTime = 0;
                    beep.current.play();
                } else if (nowLeft < 0) {
                    if (ref.period == BREAK) {
                        nowLeft = sessionLength * 60;
                        setTimeLeft(sessionLength * 60000);
                        setPeriod(SESSION);
                    } else {
                        nowLeft = breakLength * 60;
                        setTimeLeft(breakLength * 60000);
                        setPeriod(BREAK);
                    }
                    setTimeStart(Date.now());
                    clearInterval(timer);
                    runTimer();
                }
                setTimerDisplay(nowLeft);
            }
        }, 30);
    }

    React.useEffect(() => clearInterval(timer), []);

    const pauseTimer = () => {
        setTimeLeft(prev => prev - (Date.now() - timeStart));
        clearInterval(timer);
    }

    const handlePlayPause = () => {
        if (timerRunning) {
            pauseTimer();
            setTimerRunning(false);
        } else {
            runTimer();
            setTimerRunning(true);
        }
    }

    const handleReset = () => {
        setBreakLength(5);
        setSessionLength(25);
        setPeriod(SESSION);
        setTimeLeft(1500000);
        setTimerDisplay(1500);
        setTimerRunning(false);
        clearInterval(timer);
        beep.current.pause();
        beep.current.currentTime = 0;
    }

    return (
        <div className='app'>
            <h1>25 + 5 Clock</h1>
            <Settings
                breakLength={breakLength}
                sessionLength={sessionLength}
                handleSettingChange={handleSettingChange} />
            <Display
                timerDisplay={timerDisplay}
                period={period} />
            <Controller
                timerRunning={timerRunning}
                handlePlayPause={handlePlayPause}
                handleReset={handleReset} />
            <audio ref={beep} id='beep'
                src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'></audio>
            <footer>Designed and Coded By<br />
                <span id='author'>loghooSong</span></footer>
        </div>
    );
}

const Settings = (props) => {
    return (
        <div className='settings'>
            <SettingUnit
                id={BREAK}
                label={BREAK + ' Length'}
                length={props.breakLength}
                handleChange={props.handleSettingChange} />
            <SettingUnit
                id={SESSION}
                label={SESSION + ' Length'}
                length={props.sessionLength}
                handleChange={props.handleSettingChange} />
        </div>
    );
}

const Display = (props) => {
    const format = (time) => {
        let m = Math.trunc(time / 60);
        let s = time % 60;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        return m + ':' + s;
    }

    const className = props.timerDisplay >= 60
        ? 'display' : 'display alert'

    return (
        <div className={className}>
            <h2 id='timer-label'>{props.period}</h2>
            <p id='time-left'>{format(props.timerDisplay)}</p>
        </div>
    );
}

const Controller = (props) => {
    return (<div>
        <SwitchPad id='start_stop'
            truthyFa='fa fa-pause'
            falsyFa='fa fa-play'
            depends={props.timerRunning}
            handleClick={props.handlePlayPause} />
        <Pad id='reset'
            fa='fa fa-refresh'
            handleClick={props.handleReset} />
    </div>);
}

const SettingUnit = (props) => {
    return (
        <div className='setting-unit' id={props.id}>
            <h2 id={props.id + '-label'}>{props.label}</h2>
            <Pad id={props.id + '-decrement'}
                fa='fa fa-arrow-down'
                handleClick={() => { props.handleChange(props.id, props.length - 1); }} />
            <span id={props.id + '-length'}>{props.length}</span>
            <Pad id={props.id + '-increment'}
                fa='fa fa-arrow-up'
                handleClick={() => { props.handleChange(props.id, props.length + 1); }} />
        </div>
    );
}

const Pad = (props) => {
    return (
        <button className='pad' id={props.id} onClick={props.handleClick}>
            <i className={props.fa}></i>
        </button>
    );
}

const SwitchPad = (props) => {
    const fa = props.depends ? props.truthyFa : props.falsyFa;
    return (
        <button className='pad switch' id={props.id} onClick={props.handleClick}>
            <i className={fa}></i>
        </button>
    );
}

const container = document.getElementById('container');
const root = ReactDOM.createRoot(container);
root.render(<App />);