import { React, useEffect, useState } from "react";
// import { useAtom } from "jotai";
// import { userSessionAtom } from "./LoginPage";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

function User() {
  // const sessionData = useAtom(userSessionAtom)[0];
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [userData, setUserData] = useState();
  let navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/user/${id}`);
        setnetworkStatus("loading");
        setUserData(res.data[0]);
        setnetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, [id]);


  const handleClick = (ACTION) => {
    if (ACTION === "password"){
      navigate(`/profile/edit/pass/${userData.user_id}`)
    } 
    else if (ACTION === "email"){
      navigate(`/profile/edit/email/${userData.user_id}`)
    }
    else if (ACTION === "status"){
      navigate(`/profile/edit/status/${userData.user_id}`)
    }
  }




  return (
    <>
      <h1>Individual User</h1>
      {networkStatus === "resolved" ? (
        <>
          <div> UserID: {userData.user_id} </div>
          <div>
            Username: {userData.username} <br />
            Role: {userData.role} <br />
            Active Status: {(userData.status === 1) ? "True": 'False'}
          </div><p/>
          <button onClick={()=>handleClick('password')}>Change Password</button>
          <button onClick={()=>handleClick('email')}>Change Email</button>
          <button onClick={()=>handleClick('status')}>Change Status</button>
          <p />
      <Link to="/users">
        <button>Back</button>
      </Link>
        </>
      ) : null}
    </>
  );
}

export default User;
