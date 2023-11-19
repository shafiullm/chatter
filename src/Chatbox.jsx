import React, { useState, useEffect } from "react";
import "./App.css";
import socket from "./socket";
const Chatbox = ({ oldChat }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [from, setFrom] = useState("");

  useEffect(() => {
    setFrom(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    setMessages(oldChat);
  }, [oldChat]);

  useEffect(() => {
    socket.on("message", (data) => {
      setFrom(localStorage.getItem("token"));
      let to = localStorage.getItem("to");
      let from = localStorage.getItem("token");
      setMessages((prevMessages) => {
        let filtered = prevMessages.filter(
          (m) =>
            (m.to == to && m.from == from) || (m.from == to && m.to == from)
        );
        if (
          (data.to == to && data.from == from) ||
          (data.from == to && data.to == from)
        ) {
          return [...filtered, data];
        }
        return filtered;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      if (message.length > 0) {
        let to = localStorage.getItem("to");
        let from = localStorage.getItem("token");
        let msg = message;
        socket.emit("message", { from: from, to: to, msg: msg });
        setMessage("");
      }
    }
  };

  return (
    <div className="column right-body">
      <h2>Chatbox</h2>
      <div className="chatbox">
        <div className="chatbox-wrapper">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.from === from ? "user-msg" : "friend-msg"
              }`}
            >
              <p>{msg.msg}</p>
            </div>
          ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            placeholder="Write your message here.."
            value={message}
            onChange={handleInputChange}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
