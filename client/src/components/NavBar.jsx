import React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userSessionAtom } from "./LoginPage";
// import { styled } from '@mui/material/styles';


function Navbar() {
  const [sessionData, setSessionData] = useAtom(userSessionAtom);

  const handleLogout = async () => {
    await axios
      .delete(`/api/session/logout`)
      .then((res) => {
        console.log("res", res)
        setSessionData([]);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
    {sessionData.user_id === undefined ? null : (
      <>
      <div style={{background:"pink", padding:10}}>
      <span>Welcome, {sessionData.username} </span><br/>
      <button style={{float: "right", marginRight:50, marginTop:10}} onClick={handleLogout}>Logout</button>
      <span>Team assigned: {sessionData.group_name} </span> <br/>
      <span>Permission Groups: {sessionData.role_groups.map((e)=> {
        return(<li key={e}>{e}</li>)
      })} </span>
      </div>
      </>
    )}
    </>
  );
}

export default Navbar;
