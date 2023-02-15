const DrumMachine = () => {
    const [power, setPower] = React.useState(true);
    const [bank, setBank] = React.useState(false);
    const [volumeValue, setVolumeValue] = React.useState(35);
    const [displayContent, setDisplayContent] = React.useState('');

    const handleToggleChange = (event) => {
        switch (event.target.closest('div').id) {
            case 'power-toggle':
                setPower(!power);
                handleDisplay('');
                break;
            case 'bank-toggle':
                setBank(!bank);
                handleDisplay(bank ? "Smooth Piano Kit" : "Heater Kit");
        }
    }

    let displayVolumeChange;
    const handleVolumeChange = (event) => {
        setVolumeValue(event.target.value);
        handleDisplay("Volume: " + event.target.value);
        displayVolumeChange = setTimeout(() => { setDisplayContent("") }, 1000);
    }
    const handleDisplay = (content) => {
        setDisplayContent(content);
        if (displayVolumeChange) clearTimeout(displayVolumeChange);
    }

    return (
        <div id="drum-machine">
            <p id="logo"><em>FCC <i className="fa fa-free-code-camp"></i></em></p>
            <KeyBoard
                power={power}
                bank={bank}
                volumeValue={volumeValue}
                handleDisplay={handleDisplay} />
            <ControlBoard
                power={power}
                bank={bank}
                handleToggleChange={handleToggleChange}
                volumeValue={volumeValue}
                handleVolumeChange={handleVolumeChange}
                displayContent={displayContent} />
        </div>
    );
}

const KeyBoard = (props) => {
    const createKeys = (kit) => kit.map((k, i) => (
        <DrumPad
            key={i}
            power={props.power}
            volumeValue={props.volumeValue}
            code={k.code}
            id={k.id}
            content={k.content}
            src={k.src}
            handleDisplay={props.handleDisplay} />
    ));

    const keys = props.bank
        ? createKeys(smoothPianoKit)
        : createKeys(heaterKit);

    return <div id="keyboard">{keys}</div>;
}

const ControlBoard = (props) => {
    return (
        <div id="controlboard">
            <Toggle
                id="power-toggle"
                label="Power"
                checked={props.power}
                handleChange={props.handleToggleChange} />
            <Display
                value={props.displayContent} />
            <Slider
                id="volume-slider"
                value={props.volumeValue}
                handleChange={props.handleVolumeChange} />
            <Toggle
                id="bank-toggle"
                label="Bank"
                checked={props.bank}
                handleChange={props.handleToggleChange} />
        </div>
    );
}

const DrumPad = (props) => {
    const audio = React.useRef();

    React.useEffect(() => {
        audio.current.volume = props.volumeValue / 100;
    }, [props.volumeValue]);

    React.useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.code == props.code) {
                playSound();
            }
        }

        document.addEventListener('keypress', handleKeyPress);
        return () => {
            document.removeEventListener('keypress', handleKeyPress);
        }
    });

    const playSound = () => {
        if (!props.power) return;
        audio.current.currentTime = 0;
        audio.current.play();
        props.handleDisplay(props.id);
    }

    return (
        <button
            className="drum-pad"
            id={props.id}
            onClick={playSound}
            tabIndex={-1}
        > {props.content}
            <audio
                ref={audio}
                className="clip"
                id={props.content}
                src={props.src} >
            </audio>
        </button>
    )
}

const Toggle = (props) => {
    return (
        <div className="toggle" id={props.id}>
            <p>{props.label}</p>
            <label>
                <input
                    type="checkbox"
                    className="toggle-checkbox"
                    checked={props.checked}
                    onChange={props.handleChange}
                    tabIndex={-1}>
                </input>
                <div className="select"><div className="select-inner"></div></div>
            </label>
        </div>
    );
}

const Slider = (props) => {
    return (
        <input
            type="range"
            id={props.id}
            className="slider"
            value={props.value}
            onChange={props.handleChange}
            tabIndex={-1}>
        </input>
    );
}

const Display = (props) => {
    return <div id="display">{props.value}</div>;
}

const container = document.getElementById('container');
const root = ReactDOM.createRoot(container);
root.render(<DrumMachine />);

const heaterKit = [
    {
        code: "KeyQ",
        content: "Q",
        id: "Heater-1",
        src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3"
    }, {
        code: "KeyW",
        content: "W",
        id: "Heater-2",
        src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3"
    }, {
        code: "KeyE",
        content: "E",
        id: "Heater-3",
        src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3"
    }, {
        code: "KeyA",
        content: "A",
        id: "Heater-4",
        src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"
    }, {
        code: "KeyS",
        content: "S",
        id: "Clap",
        src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3"
    }, {
        code: "KeyD",
        content: "D",
        id: "Open-HH",
        src: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"
    }, {
        code: "KeyZ",
        content: "Z",
        id: "Kick-n'-Hat",
        src: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3"
    }, {
        code: "KeyX",
        content: "X",
        id: "Kick",
        src: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3"
    }, {
        code: "KeyC",
        content: "C",
        id: "Closed-HH",
        src: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"
    }
];

const smoothPianoKit = [
    {
        code: "KeyQ",
        content: "Q",
        id: "Chord-1",
        src: "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3"
    }, {
        code: "KeyW",
        content: "W",
        id: "Chord-2",
        src: "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3"
    }, {
        code: "KeyE",
        content: "E",
        id: "Chord-3",
        src: "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3"
    }, {
        code: "KeyA",
        content: "A",
        id: "Shaker",
        src: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3"
    }, {
        code: "KeyS",
        content: "S",
        id: "Open-HH",
        src: "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3"
    }, {
        code: "KeyD",
        content: "D",
        id: "Closed-HH",
        src: "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3"
    }, {
        code: "KeyZ",
        content: "Z",
        id: "Punchy-Kick",
        src: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3"
    }, {
        code: "KeyX",
        content: "X",
        id: "Side-Stick",
        src: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3"
    }, {
        code: "KeyC",
        content: "C",
        id: "Snare",
        src: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3"
    }
];