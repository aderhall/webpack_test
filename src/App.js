import "./App.css";
import { Reactive, useEffect, useState, apply, set, deref } from "./reactive/reactive";

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

const staticStore = {
    setPage: () => {},
    setRoute: () => {},
    myId: 3
}

function AppBar(props) {
    return Reactive.createElement(
        "div",
        { className: "AppBar" },
        Reactive.createElement(
            "h1",
            { className: "AppBar__title" },
            props.name
        ),
        apply(links => {
            return links.map(link => 
                Reactive.createElement(
                "a",
                {
                    className: "AppBar__link",
                    href: "#",
                    onClick: link[1]
                },
                link[0]
            ))
        }, [props.links])
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
            "a",
            {
                className: "UserIcon__username",
                href: "#",
                onClick: () => (staticStore.setRoute(deref(props.userId)), staticStore.setPage("profile"), console.log(props.userId))
            },
            apply(username => "@" + username, [username])
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

function Profile(props) {
    const [userInfo, setUserInfo] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);
    
    useEffect(userId => {
        getData("https://jsonplaceholder.typicode.com/users/" + userId.toString(), xhr => {
            if (xhr.status === 200) {
                setUserInfo(JSON.parse(xhr.response));
            } else {
                setUserInfo(false);
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
        { className: "Profile__container" },
        apply(userInfo => {
            if (userInfo === null) {
                return Reactive.createElement(
                    "span",
                    { className: "Profile__network-message" },
                    "Getting profile info..."
                );
            } else if (userInfo === false) {
                return Reactive.createElement(
                    "span",
                    { className: "Profile__network-message" },
                    "Error: profile data not found"
                )
            } else {
                return Reactive.createElement(
                    "div",
                    { className: "Profile" },
                    Reactive.createElement(
                        "div",
                        { className: "Profile__head" },
                        Reactive.createElement(
                            "img",
                            {
                                className: "Profile__image",
                                src: apply(imgUrl => imgUrl ? imgUrl : "", [imgUrl])
                            },
                        ),
                        Reactive.createElement(
                            "div",
                            { className: "Profile__names" },
                            Reactive.createElement(
                                "span",
                                { className: "Profile__name" },
                                apply(userInfo => userInfo.name, [userInfo])
                            ),
                            Reactive.createElement(
                                "span",
                                { className: "Profile__username" },
                                apply(userInfo => "@" + userInfo.username, [userInfo])
                            )
                        )
                    ),
                    Reactive.createElement(
                        "dl",
                        { className: "Profile__info" },
                        Reactive.createElement(
                            "dt",
                            null,
                            "Email:"
                        ),
                        Reactive.createElement(
                            "dd",
                            null,
                            apply(userInfo => Reactive.createElement(
                                "a",
                                { href: "mailto:" + userInfo.email },
                                userInfo.email
                            ), [userInfo])
                        ),
                        Reactive.createElement(
                            "dt",
                            null,
                            "Phone:"
                        ),
                        Reactive.createElement(
                            "dd",
                            null,
                            apply(userInfo => Reactive.createElement(
                                "a",
                                { href: "tel:" + userInfo.phone },
                                userInfo.phone
                            ), [userInfo])
                        )
                    )
                )
            }
        }, [userInfo])
    )
}

function App(props) {
    const appName = "Social Network";
    
    const [page, setPage] = useState("feed");
    const [route, setRoute] = useState(null);
    staticStore.setPage = setPage;
    staticStore.setRoute = setRoute;

    return Reactive.createElement(
        "div",
        { className: "App" },
        Reactive.createElement(
            AppBar,
            {
                name: appName,
                links: [
                    ["Feed", () => setPage("feed")],
                    ["My Profile", () => setPage("my-profile")]
                ]
            }
        ),
        Reactive.createElement(
            "main",
            null,
            apply(page => {
                if (page === "feed") {
                    return Reactive.createElement(
                        Feed,
                        { url: "https://jsonplaceholder.typicode.com/posts"}
                    );
                } else if (page === "my-profile") {
                    return Reactive.createElement(
                        Profile,
                        { userId: staticStore.myId }
                    );
                } else if (page === "profile") {
                    return apply(route => Reactive.createElement(
                        Profile,
                        { userId: route }
                    ), [route]);
                }
                
            }, [page])
        )
    )
}

export default App;