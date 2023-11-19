import React, { useState, useEffect } from "react";
import UserCard from "./UserCard";
import "./App.css";
import axios from "axios";

const UserList = ({ userData, onUserChange }) => {
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (username) => {
    localStorage.setItem("to", username);
    setSelectedUser(username);
    onUserChange();
  };

  useEffect(() => {
    axios.get("http://localhost:5000/users").then((res) => {
      setUserList(res.data);
    });
  }, []);

  return (
    <div className="column left-body">
      <h2>User List</h2>
      <div className="user-list">
        <div className="userlist-wrapper">
          {userData && (
            <UserCard
              username={userData.username}
              avatarSrc={userData.avatar}
              isMyself
            />
          )}
          {userList.map((user) => {
            const shouldRenderUserCard = userData
              ? user.username !== userData.username
              : true;

            return shouldRenderUserCard ? (
              <div
                key={user.username}
                onClick={() => handleUserClick(user.username)}
              >
                <UserCard
                  username={user.username}
                  avatarSrc={user.avatar_src}
                  isActive={selectedUser === user.username}
                />
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default UserList;
