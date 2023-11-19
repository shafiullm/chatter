import React from "react";
import "./App.css";

function UserCard({
  username = "John Doe",
  lastMsg,
  avatarSrc = "https://avatar.iran.liara.run/public/boy",
  isLastTexter = false,
  isMyself = false,
  isActive = false,
}) {
  const cardClass = `user-card ${isMyself ? "myself" : ""} ${
    isActive ? "active" : ""
  }`;

  return (
    <div className={cardClass}>
      <div className="user-info">
        <h3>{isMyself ? `Myself (${username})` : username}</h3>
        {/* {!isMyself && (
          <p>{isLastTexter ? `You: ${lastMsg}` : <b>{lastMsg}</b>}</p>
        )} */}
      </div>
      <div className="user-image">
        <img src={avatarSrc} alt="User Avatar" />
      </div>
    </div>
  );
}

export default UserCard;
