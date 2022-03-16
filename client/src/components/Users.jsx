import { React, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userSessionAtom } from "./LoginPage";
import { useNavigate, Link} from "react-router-dom";
import axios from "axios";

function Users() {
  const sessionData = useAtom(userSessionAtom)[0];
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [userListData, setUserListData] = useState();
  let navigate = useNavigate();

  useEffect(() => {
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
  }, []);


  const handleClickProfile = (user_id) => {
    navigate(`/user/${user_id}`);
  };
  const handleClick = (user_id, ACTION) => {
    if (ACTION === "PASSWORD") {
      navigate(`/profile/edit/${user_id}`);
    } else if (ACTION === "EMAIL") {
      navigate(`/profile/edit/email/${user_id}`);
    }
  };

  return (
    <>
      <h1> User Management</h1>

      <button onClick={() => handleClick(sessionData.user_id, "PASSWORD")}>
        Change Own Password
      </button>
      <button onClick={() => handleClick(sessionData.user_id, "EMAIL")}>
        Change Own Email
      </button>


      <Link to='/new'>
      <button>Create New User</button></Link>



      {networkStatus === "resolved" ? (
        <ul>
          {userListData.map((e) => {
            return (
              <>
                <div
                  key={e.user_id}
                  style={{ border: "2px solid red", width: 100, margin: 15 }}
                  onClick={() => handleClickProfile(e.user_id)}
                >
                  <div>UserID: {e.user_id}</div>
                  Username: {e.username}
                  <br />
                  Role: {e.role} <p />
                </div>
              </>
            );
          })}
        </ul>
      ) : null}
      <br />
    </>
  );
}

export default Users;
