import { Reactive, useEffect, useState, apply, set, deref } from "./reactive/reactive";
import { getData, staticStore } from "./utils";
import "./Post.css";

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

function CommentIcon(props) {
    return Reactive.createElement(
        "svg",
        {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "#333",
            width: "24px",
            height: "24px"
        },
        Reactive.createElement(
            "path",
            {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            }
        )
    );
}

function Comment(props) {
    return Reactive.createElement(
        "div",
        { className: "Comment" },
        Reactive.createElement(
            "a",
            {
                className: "Comment__email",
                href: apply(comment => "mailto:" + comment.email, [props.comment])
            },
            apply(comment => comment.email, [props.comment])
        ),
        Reactive.createElement(
            "p",
            { className: "Comment__body" },
            apply(comment => comment.body, [props.comment])
        )
    )
}

function CommentSection(props) {
    return Reactive.createElement(
        "div",
        { className: "CommentSection" },
        apply(comments => {
            if (comments === false) {
                return Reactive.createElement("p", null, "[COULD NOT RETRIEVE COMMENTS]");
            } else if (comments === null) {
                return Reactive.createElement("p", null, "Loading comments...");
            } else {
                return comments.map(comment => Reactive.createElement(
                    Comment,
                    { comment: comment }
                ))
            }
        }, [props.comments])
    );
}

function Post(props) {
    const title = apply(info => info.title, [props.info]);
    const body = apply(info => info.body, [props.info]);
    const userId = apply(info => info.userId, [props.info]);
    
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(null);
    
    useEffect((showComments, userId) => {
        if (showComments) {
            getData("https://jsonplaceholder.typicode.com/posts/" + userId.toString() + "/comments", xhr => {
                if (xhr.status === 200) {
                    setComments(JSON.parse(xhr.response));
                } else {
                    setComments(false);
                }
            })
        }
    }, [showComments, userId]);
    
    return Reactive.createElement(
        "div",
        { className: "Post" },
        Reactive.createElement(
            UserIcon,
            { userId: userId }
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
        ),
        Reactive.createElement(
            "button",
            {
                className: "Post__comment-button",
                onClick: () => setShowComments(!deref(showComments))
            },
            Reactive.createElement(
                CommentIcon,
                null
            ),
            Reactive.createElement(
                "span",
                null,
                apply(showComments => showComments ? "Hide Comments" : "Show Comments", [showComments])
            )
        ),
        apply(showComments => {
            if (showComments) {
                return Reactive.createElement(
                    CommentSection,
                    { comments: comments }
                )
            }
        }, [showComments])
    );
}

export default Post;