import React from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userSessionAtom } from "./LoginPage";

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
    {sessionData.user_id === undefined ? null: (
      <>
      <div style={{background:"pink", padding:10}}>

      <span>Welcome, {sessionData.username} </span><br/>
      <span>Team assigned: {sessionData.group_name} </span>
      <button style={{float: "right", marginRight:50}} onClick={handleLogout}>Logout</button>
      </div>
      </>
    )}
    </>
  );
}

export default Navbar;
