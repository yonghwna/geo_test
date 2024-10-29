import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LiveLocationTracker from "./components/Geo";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <LiveLocationTracker />
    </>
  );
}

export default App;
