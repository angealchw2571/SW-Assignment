import { React, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function NewUser() {
  // const [session, setSession] = useAtom(userSessionAtom);
  const [networkStatus, setNetworkStatus] = useState("pending");
  const [validPassword, setValidPassword] = useState();
  let navigate = useNavigate();

  const handleQuery = async (data) => {
    console.log(data);
    await axios
      .post(`/api/user/new`, data)
      .then((res) => {
        if (res) {
          setNetworkStatus("resolved");
          // setSession(res.data);
          alert("Success!");
          navigate("/login");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    const email = event.target.email.value;
    handleQuery({ username: username, password: password, email: email });
  };

  const validation = (event) => {
    console.log(">>>>>>>>>>", event.target.value);
    setValidPassword(event.target.value);
  };

  const message = () => {
    if (validPassword.length < 8) {
      return <h1> too short</h1>;
    } else return <h1> good</h1>;
  };

  return (
    <>
      <h1>NewUser</h1>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" />
        <input name="password" placeholder="Password" onChange={validation} />
        <input name="email" placeholder="Email" />
        <button>Create New User</button>
      </form>
      {message()}
      <p />
      <Link to="/users">
        <button>Home</button>
      </Link>
    </>
  );
}

export default NewUser;
