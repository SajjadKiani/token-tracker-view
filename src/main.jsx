import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;

import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <App />
);
