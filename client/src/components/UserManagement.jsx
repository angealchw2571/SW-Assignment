import { React, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userSessionAtom } from "./LoginPage";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import UserCards from "./UserCards";

function UserManagement() {
  const sessionData = useAtom(userSessionAtom)[0];
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [userListData, setUserListData] = useState();
  const [refresh, setRefresh] = useState(true);
  let navigate = useNavigate();

  useEffect(() => {
    setnetworkStatus("loading");
    const getData = async () => {
      try {
        const res = await axios.get(`/api/user/`);
        setnetworkStatus("loading");
        setUserListData(res.data);
        setnetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, [refresh]);

  const handleClickProfile = (user_id) => {
    navigate(`/user/${user_id}`);
  };
  const handleClick = (user_id, ACTION) => {
    if (ACTION === "PASSWORD") {
      navigate(`/profile/edit/pass/${user_id}`);
    } else if (ACTION === "EMAIL") {
      navigate(`/profile/edit/email/${user_id}`);
    }
  };

  return (
    <>
      <h1> User Management Admin Board</h1>
      <Link to="/home">
        <button>Back To Home</button>
      </Link>
      <p/>

      {sessionData.role === "admin" ? (
        <div>
          <button onClick={() => handleClick(sessionData.user_id, "PASSWORD")}>
            Change Own Password
          </button>
          <button onClick={() => handleClick(sessionData.user_id, "EMAIL")}>
            Change Own Email
          </button>
          <Link to="/new">
            <button>Create New User</button>
          </Link>
        </div>
      ) : null}

      {networkStatus === "resolved" ? (
        <UserCards
          userListData={userListData}
          handleClickProfile={handleClickProfile}
          setUserListData= {setUserListData}
          setRefresh = {setRefresh}
          refresh = {refresh}
        />
      ) : (<h3>Loading</h3>)}
      <br />
    </>
  );
}

export default UserManagement;
