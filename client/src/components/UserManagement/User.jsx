import { React, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

function User() {
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [userData, setUserData] = useState();
  let navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/user/${id}`);
        setnetworkStatus("loading");
        setUserData(res.data);
        setnetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, [id]);

  const handleClick = (ACTION) => {
    
    if (ACTION === "profile") {
      navigate(`/profile/edit/${userData.user_id}`);
    } else if (ACTION === "status") {
      navigate(`/profile/edit/status/${userData.user_id}`);
    } else if (ACTION === "resetPassword") {
      navigate(`/profile/edit/reset/${userData.user_id}`);
    }
     else if (ACTION === "role") {
      navigate(`/profile/edit/role/${userData.user_id}`);
    }
  };

  return (
    <>
      {networkStatus === "resolved" ? (
        <>
        <h1> User: {userData.name}</h1>
          <div> UserID: {userData.user_id} </div>
          <div>
            Name: {userData.name} <br />
            Age: {userData.age} <br />
            Email: {userData.email} <br />
            Role Groups:
            <br/>
              {userData.role_groups.map((e,i)=> {
                return (
                  <span key={i} style={{fontWeight: "bold"}}>
                    {e} 
                    <br/>
                  </span>
                )
              })}
              
              Assigned Team: {userData.group_name}<br/>
          
            Status:
            {userData.user_status === 1 ? (
              <span style={{ color: "green" }}>● Active</span>
            ) : (
              <span style={{ color: "red" }}>● Inactive</span>
            )}
          </div>
          <p />
          <button onClick={() => handleClick("profile")}>Edit Profile Details</button>
          <button onClick={() => handleClick("resetPassword")}>Reset Password</button><p/>
          <button onClick={() => handleClick("status")}>Change User Status</button>
          <button onClick={() => handleClick("role")}>Change User Permissions</button>
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
