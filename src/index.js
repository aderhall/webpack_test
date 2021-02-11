import {Reactive, apply, set, useState, deref} from './reactive/reactive';
import ReactiveDOM from "./reactive/reactive-dom";
import "./index.css";
import App from "./App.js";

ReactiveDOM.render(Reactive.createElement(App), document.getElementById("root"));