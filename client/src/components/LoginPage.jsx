import { React, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { atom, useAtom } from "jotai";

export const userSessionAtom = atom([]);


function LoginPage() {
  const [session, setSession] = useAtom(userSessionAtom);
  const [networkStatus, setNetworkStatus] = useState("pending");
  let navigate = useNavigate();

  const handleLogin = async (loginDetails) => {
    await axios
      .post(`/api/session/login`, loginDetails)
      .then((res) => {
        if (res) {
          setNetworkStatus("resolved");
          delete res.data.password
          setSession(res.data);
          alert("Success!")
          navigate('/home')
        }
      })
      .catch(function (error) {
        alert(error.response.data.message)
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;
    handleLogin({ username: username, password: password });
  };

  return (
    <>
      <div>
        <h1>Login page</h1>
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="username" />
          <input name="password" placeholder="Password" type="password" />
          <button>Login</button>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
