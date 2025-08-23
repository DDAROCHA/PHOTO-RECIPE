import { useState } from "react";
import "./Input.css";

export const Input = ({ onSubmit }) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSubmit(input);
    setInput("");
  };

  return (
    <div className="input-container">
      <input
        className="input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter question here..."
      />
      <button onClick={handleSubmit} className="menu-link">
        Ask
      </button>
    </div>
  );
};
