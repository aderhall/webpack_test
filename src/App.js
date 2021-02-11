import "./App.css";
import { Reactive, useEffect, useState, apply } from "./reactive/reactive";

function shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex, newArray = [...array];
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = newArray[currentIndex];
      newArray[currentIndex] = newArray[randomIndex];
      newArray[randomIndex] = temporaryValue;
    }
  
    return newArray;
}

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

function UserIcon(props) {
    const [username, setUsername] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);
    useEffect((userId) => {
        getData("https://jsonplaceholder.typicode.com/users/" + userId.toString(), xhr => {
            if (xhr.status === 200) {
                setUsername(JSON.parse(xhr.response).username)
            } else {
                setUsername("[USER NOT FOUND]");
            }
        });
        getData("https://jsonplaceholder.typicode.com/photos/" + userId.toString(), xhr => {
            if (xhr.status === 200) {
                setImgUrl(JSON.parse(xhr.response).thumbnailUrl);
            }
        })
    }, [props.userId]);
    
    return Reactive.createElement(
        "div",
        { className: "UserIcon" },
        Reactive.createElement(
            "img",
            {
                className: "UserIcon__image",
                src: apply(imgUrl => imgUrl ? imgUrl : "", [imgUrl])
            }
        ),
        Reactive.createElement(
            "span",
            { className: "UserIcon__username" },
            username
        )
    )
}

function Post(props) {
    const title = apply(info => info.title, [props.info]);
    const body = apply(info => info.body, [props.info]);
    
    
    return Reactive.createElement(
        "div",
        { className: "Post" },
        Reactive.createElement(
            UserIcon,
            { userId: apply(info => info.userId, [props.info]) }
        ),
        Reactive.createElement(
            "span",
            { className: "Post__title" },
            title
        ),
        Reactive.createElement(
            "span",
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
                        return shuffleArray(posts).map(item => {
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