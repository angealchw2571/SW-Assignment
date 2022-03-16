import {React, useState} from 'react'
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAtom } from "jotai";
import { userSessionAtom } from "./LoginPage";

function Password() {
  const sessionData = useAtom(userSessionAtom)[0];
  const[networkStatus, setNetworkStatus] = useState("pending");
  const[password1, setPassword1] = useState("")
  const[password2, setPassword2] = useState("")
  const [errMessage, setErrMessage] = useState()
  let navigate = useNavigate();

  const handleQuery = async (data) => {
    console.log(">>>>>",data)
    await axios
      .put(`/api/user/edit/pass/${sessionData.user_id}`, data)
      .then((res) => {
        if (res) {
          setNetworkStatus("resolved");
          alert("success!");
          navigate('/home')

        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    const currentPassword = event.target.currentPassword.value;
    if (currentPassword.length === 0) {
      setErrMessage("Please do not leave fields empty")
    } else if (password1 === password2) {
      console.log("success")
      handleQuery({"password" : password2});
    }
  
  };

  const handlePassword1 = (event) => {
    setPassword1(event.target.value)
  }
  const handlePassword2 = (event) => {
    setPassword2(event.target.value)
  }

  const message = () => {
    if (password1.length === 0 || password2.length === 0) {
      // return <h1>Please do not leave empty fields.</h1>;
      return null
    } else if (password1 !== password2) {
      return <h1>Password do not match</h1>;
    } else return <h1> Password match</h1>;
  };


  return (
    <>
    <h1>Password change</h1>
    <form onSubmit={handleSubmit}>
          <input name="currentPassword" placeholder="Current Password" /><br/>
          <input name="newPassword" placeholder="New Password" onChange = {handlePassword1}/><br/>
          <input name="newpassword2" placeholder="Reconfirm Password"  onChange = {handlePassword2}/><br/>
          <button>Submit</button>
        </form>
        {errMessage}
          {/* {password1 === password2 ? (<h1>Password match</h1>) : (<h1>Password do not match</h1>)} */}
          {message()}
          <p/>
    <Link to='/users'><button>Home</button></Link>

    </>
  )
}

export default Password