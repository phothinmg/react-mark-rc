import React from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
const domNode = document.getElementById("root");
const root = createRoot(domNode as HTMLElement);

const App = () => {
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
};

root.render(<App />);
