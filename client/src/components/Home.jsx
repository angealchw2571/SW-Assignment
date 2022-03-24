import { React, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { userSessionAtom } from "./LoginPage";
import axios from "axios";

function Home() {
  const sessionData = useAtom(userSessionAtom)[0];
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [userData, setUserData] = useState();
  // console.log("sessionData", sessionData)
  let navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/user/${sessionData.user_id}`);
        setnetworkStatus("loading");
        setUserData(res.data);
        setnetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, [sessionData.user_id]);

  const handleClick = () => {
    navigate(`/users`);
  };

  const handleEdit = (action) => {
    if (action === 'password') {
      navigate(`/profile/edit/pass/${sessionData.user_id}/`);
    } else if (action === 'profile'){
      navigate(`/profile/edit/${sessionData.user_id}/`);
    }
  };

  return (
    <>
      <h1>Home Page</h1>
      {networkStatus === "resolved" ? (
        <>
          <h3>Profile Details</h3>
          <ul>
            <li>Username: {userData.username}</li>
            <li>Name: {userData.name}</li>
            <li>Age: {userData.age}</li>
            <li>Email: {userData.email}</li>
            <li>Role: {userData.role_name}</li>
            <li>Role Description: {userData.role_description}</li>
            <li>
              Status:{" "}
              {userData.user_status === 1 ? (
                <span style={{ color: "green" }}>● Active</span>
              ) : (
                <span style={{ color: "red" }}>● Inactive</span>
              )}
            </li>
          </ul>
          <button onClick={()=>handleEdit('password')}> Edit password</button>
          <button onClick={()=>handleEdit('profile')}> Edit profile</button><p/>
          {userData.role_name === "admin" ? (
            <button onClick={handleClick}> User Management</button>
          ) : null}
        </>
      ) : null}
    </>
  );
}

export default Home;
