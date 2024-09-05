import React from "react";
import ReactDOM from "react-dom/client";
import Main from "./components/Main";

import "./index.css";

const App = () => (
  <div className="container">
    <div>Name: card-list</div>
    <div>Framework: react</div>
    <div>Language: JavaScript</div>
    <div>CSS: Empty CSS</div>
    <Main/>
  </div>
);
const rootElement = document.getElementById("app")
if (!rootElement) throw new Error("Failed to find the root element")

const root = ReactDOM.createRoot(rootElement)

root.render(<App />)