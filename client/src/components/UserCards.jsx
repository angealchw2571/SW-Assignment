import { React } from "react";
const CheckGroup = require("./CheckGroup");

function UserCards({
  userListData,
  handleClickProfile,
  setUserListData,
  setRefresh,
  refresh
}) {
  const SUPERUSER = "superuser";
  const ADMIN = "admin";
  const USER = "user";
  
  const clickRefresh = () => {
    setRefresh(!refresh)
    console.log("refresh")
  }
  const clickHandler = (ROLE) => {
    if (ROLE === USER){
      setUserListData(CheckGroup(userListData, USER))
      console.log("show user")
    } else if (ROLE === ADMIN){
      setUserListData(CheckGroup(userListData, ADMIN))
      console.log("show admin")
    } if (ROLE === SUPERUSER){
      setUserListData(CheckGroup(userListData, SUPERUSER))
      console.log("show superuser")
    }
    
  }
const buttonStyle = {margin: 10}

  
  return (
    <>
    <button style ={buttonStyle} onClick={()=>clickHandler(ADMIN)}>Admin</button>
    <button style ={buttonStyle} onClick={()=>clickHandler(USER)}>User</button>
    <button style ={buttonStyle} onClick={()=>clickHandler(SUPERUSER)}>SuperUser</button>
    <button style ={buttonStyle} onClick={clickRefresh}>All</button>

      <ul>
        {userListData.map((e) => {
          return (
            <div
              key={e.user_id}
              style={{ border: "2px solid red", width: 200, margin: 15 , textAlign: "center"}}
              onClick={() => handleClickProfile(e.user_id)}
            >
              <div>UserID: {e.user_id}</div>
              Username: {e.username}
              <br />
              Email: {e.email} <br />
              Role: {e.role} <br />
              Active Status: {e.status === 1 ? "Active" : "Inactive"} <p />
            </div>
          );
        })}
      </ul>
    </>
  );
}

export default UserCards;
