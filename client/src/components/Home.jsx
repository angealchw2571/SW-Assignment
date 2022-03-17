import { React, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useNavigate, Link } from "react-router-dom";
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

  // const test = () => {
  //   if (sessionData.user_id === undefined) {
  //     return (
  //       <p>
  //         {" "}
  //         Seems like you're not logged in. Please{" "}
  //         <Link to="/login">log in</Link>.
  //       </p>
  //     );
  //   } else if (networkStatus === "resolved") {
  //     return (
  //       <>
  //         <h3>Profile Details</h3>
  //         <ul>
  //           <li>Username: {userData.username}</li>
  //           <li>Email: {userData.email}</li>
  //           <li>Role: {userData.role}</li>
  //         </ul>
          
  //         {sessionData.role === "admin" ? null : (<button onClick={handleClick}> User Management</button>)}
          
  //       </>
  //     );
  //   }
  // };

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
          </ul>
          
          {sessionData.role === "admin" ? (<button onClick={handleClick}> User Management</button>) : null}
          
        </>): null} 
    </>
  );
}

export default Home;
