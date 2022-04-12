import { React, useState } from "react";
import { useAtom } from "jotai";
import { userSessionAtom } from "../LoginPage";
import { Link } from "react-router-dom";
import Table from "./Table";
import axios from "axios";

function UserManagement() {
  const sessionData = useAtom(userSessionAtom)[0];
  const [networkStatus, setNetworkStatus] = useState("pending");
  const [userData, setUserData] = useState();
  const SUPERUSER = "Superuser";
  const ADMIN = "Admin";
  const USER = "User";
  const ALL = "ALL";

  const handleQuery = async (role_name) => {
    const url = () => {
      if (role_name === "0") {
        const url = "/api/user/";
        return url;
      } else {
        const url = `/api/user/checkgroup/${role_name}`;
        return url;
      }
    };
    setNetworkStatus("pending");

    await axios
      .get(url())
      .then((res) => {
        if (res) {
          setUserData(res.data);
          setNetworkStatus("resolved");
        }
      })
      .catch(function (error) {
        alert(error.response.data.message);
        console.log(error);
      });
  };
  const handleQuery2 = async (groupName) => {
    const url = `/api/user/checkgroup2/${groupName}`;
    setNetworkStatus("pending");
    await axios
      .get(url)
      .then((res) => {
        if (res) {
          setUserData(res.data);
          setNetworkStatus("resolved");
        }
      })
      .catch(function (error) {
        alert(error.response.data.message);
        console.log(error);
      });
  };

  const handleClick = (ACTION) => {
    if (ACTION === ALL) {
      handleQuery("0");
    } else if (ACTION === ADMIN) {
      handleQuery(ADMIN);
    } else if (ACTION === SUPERUSER) {
      handleQuery(SUPERUSER);
    } else if (ACTION === USER) {
      handleQuery(USER);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    console.log("event", event.target.search.value);
    handleQuery(event.target.search.value);
  };

  const handleSearchGroup = (event) => {
    event.preventDefault();
    const groupName = event.target.searchGroup.value;
    handleQuery2(groupName);
  };
  return (
    <>
      <h1> User Management Admin Board</h1>
      {sessionData.role_groups.includes("Admin") ? (
        <span>
          <Link to="/new">
            <button>Create New User</button>
          </Link>
          <Link to="/newrole">
            <button>Create new role</button>
          </Link>
          <Link to="/newgroup">
            <button>Create new group</button>
          </Link>
        </span>
      ) : null}
      <p />
      <button onClick={() => handleClick(ALL)}>Fetch all users</button>
      <button onClick={() => handleClick(ADMIN)}>Fetch Admins</button>
      <button onClick={() => handleClick(SUPERUSER)}>Fetch Superusers</button>
      <button onClick={() => handleClick(USER)}>Fetch Users</button>
      <span>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="search"
            placeholder="Role name (Case Sensitive)"
          />
          <button type="submit">Search</button>
        </form>
        <form onSubmit={handleSearchGroup}>
          <input
            type="text"
            name="searchGroup"
            placeholder="Group name (Case Sensitive)"
          />
          <button type="submit">Search</button>
        </form>
      </span>
      <p />
      {networkStatus === "resolved" ? <Table userData={userData} /> : null}
      <p />
      <Link to="/home">
        <button>Back To Home</button>
      </Link>

      <br />
    </>
  );
}

export default UserManagement;
