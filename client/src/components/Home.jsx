import { React, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { userSessionAtom } from "./LoginPage";
import axios from "axios";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LoadingBar from "./LoadingBar"

function Home() {
  const sessionData = useAtom(userSessionAtom)[0];
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [userData, setUserData] = useState();
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

  const handleClick = (ACTION) => {
    if (ACTION === "users") {
      navigate(`/users`);
    } else if (ACTION === "app") {
      navigate(`/app/home`);
    }
  };

  const handleEdit = (action) => {
    if (action === "password") {
      navigate(`/profile/edit/pass/${sessionData.user_id}/`);
    } else if (action === "profile") {
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
            {/* <li>Role: {userData.role_name}</li> */}
            <li>
              Role Groups:
              <br />
              {userData.role_groups.map((e, i) => {
                return (
                  <span key={i} style={{ fontWeight: "bold" }}>
                    {e}
                    <br />
                  </span>
                );
              })}
            </li>
            <li>Assigned Team: {userData.group_name}</li>

            <li>
              Status:{" "}
              {userData.user_status === 1 ? (
                <span style={{ color: "green" }}>● Active</span>
              ) : (
                <span style={{ color: "red" }}>● Inactive</span>
              )}
            </li>
          </ul>
          <button onClick={() => handleEdit("password")}> Edit password</button>
          <button onClick={() => handleEdit("profile")}> Edit profile</button>
          <p />
          <div style={{gap: "10px", display: "flex"}}>
          {sessionData.role_groups.includes("Admin") ? (
            <Button
            sx={{
              bgcolor: "#ff8aae",
              color: "#f9f1f1",
              ":hover": {
                backgroundColor: "pink",
                color: "black",
              },
            }}
            onClick={() => handleClick("users")}>
            <Typography>User Management</Typography>
          </Button>
          ) : null}
          <Button
            sx={{
              bgcolor: "#ff8aae",
              color: "#f9f1f1",
              ":hover": {
                backgroundColor: "pink",
                color: "black",
              },
            }}
            onClick={() => handleClick("app")}>
            <Typography>Application Management</Typography>
          </Button>
          </div>
          {/* {sessionData.role_groups.includes("Admin") ||
          sessionData.role_groups.includes("Project Manager") ? (
            <button onClick={() => handleClick("app")}>
              Application Management
            </button>
          ) : null} */}
          
        </>
      ) : <LoadingBar />}
    </>
  );
}

export default Home;
