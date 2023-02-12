class RandomQuoteMachine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            themeColor: "#16a085",
        };
        this.colors = [
            '#16a085', '#27ae60', '#2c3e50', '#f39c12',
            '#e74c3c', '#9b59b6', '#FB6964', '#342224',
            '#472E32', '#BDBB99', '#77B1A9', '#73A857'
        ];
        this.handleThemeColor = this.handleThemeColor.bind(this);
    }

    handleThemeColor() {
        let rand = Math.trunc(Math.random() * this.colors.length);
        let color = this.colors[rand];

        while (color == this.state.themeColor) {
            rand = Math.trunc(Math.random() * this.colors.length);
            color = this.colors[rand];
        }

        this.setState({
            themeColor: color,
        });
        container.style.backgroundColor = color;
    }

    render() {
        return (
            <React.Fragment>
                <QuoteBox
                    handleThemeColor={this.handleThemeColor}
                    themeColor={this.state.themeColor}
                    textOpacity={0} />
                <footer id="app-author">by loghooSong</footer>
            </React.Fragment>
        );
    }
}

class QuoteBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            author: "",
            textOpacity: 0,
        };
        this.handleClick = this.handleClick.bind(this);
        this.setRandQuote = this.setRandQuote.bind(this);
    }

    async componentDidMount() {
        const promise = await fetch("https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json");
        const json = await promise.json();
        this.quotes = json.quotes;
        this.setRandQuote();
    }

    setRandQuote() {
        const rand = Math.trunc(Math.random() * this.quotes.length);
        const quote = this.quotes[rand];
        this.setState({
            text: quote.quote,
            author: quote.author,
            textOpacity: 1,
        });
    }

    handleClick() {
        if (!this.quotes) return;
        this.props.handleThemeColor();
        this.setState({
            textOpacity: 0,
        });
        setTimeout(this.setRandQuote, 500);
    }

    render() {
        return (
            <div id="quote-box">
                <QuoteText
                    value={this.state.text}
                    color={this.props.themeColor}
                    opacity={this.state.textOpacity} />
                <QuoteAuthor
                    value={this.state.author}
                    color={this.props.themeColor}
                    opacity={this.state.textOpacity} />
                <div id='buttons'>
                    <PostQuote
                        id='tweet-quote'
                        value={<i className="fa fa-twitter"></i>}
                        href="https://twitter.com/intent/tweet"
                        title="Tweet this quote!"
                        bgColor={this.props.themeColor} />
                    <PostQuote
                        id='tumblr-quote'
                        value={<i className="fa fa-tumblr"></i>}
                        href="https://www.tumblr.com/widgets/share/tool"
                        title="Post this quote on tumblr!"
                        bgColor={this.props.themeColor} />
                    <QuoteButton
                        handleClick={this.handleClick}
                        bgColor={this.props.themeColor} />
                </div>
            </div>
        );
    }
}

function QuoteText(props) {
    return (<blockquote
        id="text"
        style={{ color: props.color, opacity: props.opacity }}
    ><i className="fa fa-quote-left"></i>{props.value}</blockquote>);
}

function QuoteAuthor(props) {
    return (<p
        id="author"
        style={{ color: props.color, opacity: props.opacity }}
    > - {props.value}</p>);
}

function QuoteButton(props) {
    return (<button
        onClick={props.handleClick}
        className="quote-button"
        id="new-quote"
        style={{ backgroundColor: props.bgColor }}
    >New Quote</button>);
}

function PostQuote(props) {
    return (<a
        className="quote-button font-awesome"
        id={props.id}
        href={props.href}
        title={props.title}
        target='_blank'
        style={{ backgroundColor: props.bgColor }}
    > {props.value}</a>);
}

const container = document.getElementById("random-quote-machine");
const root = ReactDOM.createRoot(container);
root.render(<RandomQuoteMachine />);