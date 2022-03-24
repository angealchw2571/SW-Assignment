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
      <span>Welcome, {sessionData.role_name} {sessionData.username} </span>
      <button style={{float: "right", marginRight:50}} onClick={handleLogout}>Logout</button>
      </>
    )}
    </>
  );
}

export default Navbar;
