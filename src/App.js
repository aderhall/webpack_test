import "./App.css";
import { Reactive, useEffect, useState, apply } from "./reactive/reactive";

function getData(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = () => callback(xhr);
    xhr.send();
}

function AppBar(props) {
    return Reactive.createElement(
        "div",
        { className: "AppBar" },
        Reactive.createElement(
            "span",
            { className: "AppBar__title" },
            props.name
        )
    )
}

function Post(props) {
    const title = apply(info => info.title, [props.info]);
    const body = apply(info => info.body, [props.info]);
    const [username, setUsername] = useState("loading...");
    
    useEffect((info) => {
        getData("https://jsonplaceholder.typicode.com/users/" + info.userId.toString(), xhr => {
            if (xhr.status === 200) {
                setUsername(JSON.parse(xhr.response).username)
            } else {
                setUsername("[USER NOT FOUND]");
            }
        })
    }, [props.info])
    
    return Reactive.createElement(
        "div",
        { className: "Post" },
        Reactive.createElement(
            "div",
            { className: "Post__header" },
            Reactive.createElement(
                "p",
                { className: "Post__title" },
                title
            ),
            Reactive.createElement(
                "p",
                { className: "Post__username" },
                username
            )
        ),
        Reactive.createElement(
            "p",
            { className: "Post__body" },
            body
        )
    );
}

function Feed(props) {
    const [posts, setPosts] = useState([]);
    const [gotData, setGotData] = useState(null);
    useEffect((url) => {
        getData(url, (xhr) => {
            if (xhr.status === 200) {
                setPosts(JSON.parse(xhr.response));
                setGotData(true);
            } else {
                setGotData(false);
            }
        });
    }, [props.url]);
    
    return Reactive.createElement(
        "div",
        { className: "Feed" },
        Reactive.createElement(
            "div",
            null,
            apply((gotData) => {
                if (gotData === true) {
                    return apply((posts) => {
                        //return JSON.stringify(posts);
                        return posts.map(item => {
                            return Reactive.createElement(
                                Post,
                                { info: item }
                            )
                        });
                    }, [posts]);
                } else if (gotData === false) {
                    return Reactive.createElement(
                        "p",
                        { className: "Feed__network-message" },
                        "Error: could not get posts from server"
                    );
                } else {
                    return Reactive.createElement(
                        "p",
                        { className: "Feed__network-message" },
                        "Getting posts..."
                    );
                }
            }, [gotData])
        )
    )
}

function App(props) {
    const appName = "KillerApp"
    return Reactive.createElement(
        "div",
        { className: "App" },
        Reactive.createElement(
            AppBar,
            { name: appName }
        ),
        Reactive.createElement(
            "main",
            null,
            Reactive.createElement(
                Feed,
                { url: "https://jsonplaceholder.typicode.com/posts"}
            )
        )
    )
}

export default App;