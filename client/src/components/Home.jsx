import { React, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { userSessionAtom } from "./LoginPage";
import axios from "axios";

function Home() {
  const sessionData = useAtom(userSessionAtom)[0];
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [userData, setUserData] = useState();

  let navigate = useNavigate();
  console.log("sessionData", sessionData);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/user/${sessionData.user_id}`);
        setnetworkStatus("loading");
        setUserData(res.data[0]);
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

  return (
    <>
      <h1>Home Page</h1>

      {/* {test()} */}
      {networkStatus === "resolved" ? (<>
          <h3>Profile Details</h3>
          <ul>
            <li>Username: {userData.username}</li>
            <li>Email: {userData.email}</li>
            <li>Role: {userData.role}</li>
            <li>Status: {userData.status === 1 ? "Active" : "Inactive"}</li>
          </ul>
          
          {sessionData.role === "admin" ? (<button onClick={handleClick}> User Management</button>) : null}
          
        </>): null} 
    </>
  );
}

export default Home;
