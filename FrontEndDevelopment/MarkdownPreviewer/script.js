const Normal = 'normal',
    None = 'none',
    Maximize = 'maximize';

class MarkdownPreviewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: InitInputValue,
            maximizeWrap: '',
        };

        this.handleCompress = this.handleCompress.bind(this);
        this.handleMaximize = this.handleMaximize.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleCompress() {
        this.setState({
            maximizeWrap: '',
        });
    }

    handleMaximize(e) {
        this.setState({
            maximizeWrap: e.target.closest('.wrap').id,
        });
    }

    handleInput(e) {
        this.setState({
            inputValue: e.target.value,
        });
    }

    render() {
        let editorDisplay, previewerDisplay;
        switch (this.state.maximizeWrap) {
            case 'editor-wrap':
                editorDisplay = Maximize;
                previewerDisplay = None;
                break;
            case 'previewer-wrap':
                editorDisplay = None;
                previewerDisplay = Maximize;
                break;
            case '':
                editorDisplay = Normal;
                previewerDisplay = Normal;
        }

        return (
            <React.Fragment>
                <Wrap
                    id="editor-wrap"
                    title={<React.Fragment><i className="fa fa-free-code-camp"></i> Editor</React.Fragment>}
                    body={<Editor value={this.state.inputValue} handleInput={this.handleInput} />}
                    display={editorDisplay}
                    handleCompress={this.handleCompress}
                    handleMaximize={this.handleMaximize} />
                <Wrap
                    id="previewer-wrap"
                    title={<React.Fragment><i className="fa fa-free-code-camp"></i> Previewer</React.Fragment>}
                    body={<Previewer value={this.state.inputValue} />}
                    display={previewerDisplay}
                    handleCompress={this.handleCompress}
                    handleMaximize={this.handleMaximize} />
            </React.Fragment>
        );
    }
}

function Wrap(props) {
    return (
        <div className={'wrap ' + props.display} id={props.id}>
            <Header
                title={props.title}
                display={props.display}
                handleCompress={props.handleCompress}
                handleMaximize={props.handleMaximize} />
            {props.body}
        </div>
    );
}

function Header(props) {
    return (
        <div className="header">
            <span className="title">{props.title}</span>
            <MaximizeButton
                display={props.display}
                handleCompress={props.handleCompress}
                handleMaximize={props.handleMaximize} />
        </div>
    );
}

function MaximizeButton(props) {
    return (
        props.display === Maximize
            ? <button
                className="maximize-button"
                onClick={props.handleCompress}
            ><i className="fa fa-compress"></i></button>
            : <button
                className="maximize-button"
                onClick={props.handleMaximize}
            ><i className="fa fa-arrows-alt"></i></button>
    );
}

function Editor(props) {
    return (
        <textarea
            id="editor"
            value={props.value}
            onChange={props.handleInput}>
        </textarea>
    );
}


function Previewer(props) {
    const createMarkup = () => ({
        __html: marked.parse(props.value),
    });
    return (
        <div id="preview" dangerouslySetInnerHTML={createMarkup()} />
    );
}

marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function (code) {
        return hljs.highlightAuto(code).value;
    },
    langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
    pedantic: false,
    gfm: true,
    breaks: true,
    sanitize: false,
    smartypants: false,
    xhtml: false
});

const container = document.getElementById("markdown-previewer");
const root = ReactDOM.createRoot(container);
root.render(<MarkdownPreviewer />);

const InitInputValue = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`< div ></div> \`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
    if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
        return multiLineCode;
    }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`;