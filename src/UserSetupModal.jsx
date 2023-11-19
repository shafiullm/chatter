import React, { useState } from "react";
import "./App.css";
import axios from "axios";

const UserSetupModal = ({ onClose, onUserSetup }) => {
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const avatars = [
    "https://avatar.iran.liara.run/public/1",
    "https://avatar.iran.liara.run/public/2",
    "https://avatar.iran.liara.run/public/70",
    "https://avatar.iran.liara.run/public/95",
  ];

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleSetup = () => {
    if (username.trim() && selectedAvatar) {
      onUserSetup(username, selectedAvatar);
      axios
        .post("http://localhost:5000/login", {
          username: username.trim(),
          avatar: selectedAvatar,
        })
        .then((res) => {
          if (res.data && res.data.token) {
            localStorage.setItem("token", res.data.token);
          }
        });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="user-setup-modal">
        <h2>Enter Your Name</h2>
        <input
          className="default-border"
          type="text"
          placeholder="Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <h2>Select Your Avatar</h2>
        <div className="avatar-container">
          {avatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className={selectedAvatar === avatar ? "selected" : ""}
              onClick={() => handleAvatarClick(avatar)}
            />
          ))}
        </div>

        <button className="default-button" onClick={handleSetup}>
          Okay
        </button>
      </div>
    </div>
  );
};

export default UserSetupModal;
