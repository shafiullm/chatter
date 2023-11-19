import React, { useState, useEffect } from "react";
import "./App.css";
import UserList from "./UserList";
import UserSetupModal from "./UserSetupModal";
import Chatbox from "./Chatbox";
import axios from "axios";

function App() {
  const [showModal, setShowModal] = useState(true);
  const [userData, setUserData] = useState(null);
  const [oldChat, setOldChat] = useState([]);

  const handleUserSetup = (username, avatar) => {
    setUserData({ username, avatar });
    setShowModal(false);
  };

  const handleUserChange = () => {
    setOldChat([]);
    axios.get("http://localhost:5000/chats").then((res) => {
      let msgs = res.data;
      let to = localStorage.getItem("to");
      let from = localStorage.getItem("token");
      let filteredMsgs = msgs.filter(
        (m) =>
          (m.to_msg == to && m.from_msg == from) ||
          (m.from_msg == to && m.to_msg == from)
      );
      let mappedMsgs = filteredMsgs.map((o) => ({
        to: o.to_msg,
        from: o.from_msg,
        timets: o.timestamp,
        msg: o.msg,
      }));

      setOldChat((prevChat) => mappedMsgs);

      console.log("MAPPED:", mappedMsgs);
      console.log("OLDCHAT:", oldChat);
    });
  };

  useEffect(() => {
    setOldChat(oldChat);
  }, [oldChat]);

  return (
    <div className="main-content">
      <h1>Chatter</h1>
      {showModal && <UserSetupModal onUserSetup={handleUserSetup} />}
      <div className="row">
        <UserList userData={userData} onUserChange={handleUserChange} />
        <Chatbox oldChat={oldChat} />
      </div>
    </div>
  );
}

export default App;
