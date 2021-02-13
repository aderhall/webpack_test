import "./App.css";
import { Reactive, useEffect, useState, apply, set, deref } from "./reactive/reactive";
import Post from "./Post";
import { shuffleArray, getData, staticStore } from "./utils"



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

function NetworkMessage(props) {
    return Reactive.createElement(
        "p",
        { className: "NetworkMessage" },
        props.children
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
                setGotData(xhr.status);
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
                } else if (gotData === null) {
                    return Reactive.createElement(
                        NetworkMessage,
                        null,
                        "Getting posts..."
                    );
                } else {
                    return Reactive.createElement(
                        NetworkMessage,
                        null,
                        `Could not get posts: server responded with ${gotData}`
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
                    NetworkMessage,
                    null,
                    "Getting profile info..."
                );
            } else if (userInfo === false) {
                return Reactive.createElement(
                    NetworkMessage,
                    null,
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