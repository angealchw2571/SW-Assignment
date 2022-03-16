import { React, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userSessionAtom } from "./LoginPage";
import { useNavigate, Link } from "react-router-dom";

function Email() {
  const sessionData = useAtom(userSessionAtom)[0];
  let navigate = useNavigate();
  const [networkStatus, setNetworkStatus] = useState("pending");
  const [newEmail1, setNewEmail1] = useState("");
  const [newEmail2, setNewEmail2] = useState("");
  const [errMessage, setErrMessage] = useState();

  const handleQuery = async (data) => {
    await axios
      .put(`/api/user/edit/email/${sessionData.user_id}`, data)
      .then((res) => {
        if (res) {
          setNetworkStatus("resolved");
          alert("Success!");
          navigate('/home')
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentEmail = event.target.newEmail2.value;
    if (currentEmail.length === 0) {
      setErrMessage("Please do not leave empty fields.");
    } else if (newEmail1 === newEmail2) {
      console.log("success");
      handleQuery({ email: newEmail2 });
    }

    // handleQuery();
  };

  const handleEmail1 = (event) => {
    setNewEmail1(event.target.value);
  };
  const handleEmail2 = (event) => {
    setNewEmail2(event.target.value);
  };

  const message = () => {
    if (newEmail1.length === 0 || newEmail2.length === 0) {
      return <h1>Please do not leave empty fields.</h1>;
    } else if (newEmail1 !== newEmail2) {
      return <h1>Emails do not match</h1>;
    } else return <h1>Emails match</h1>;
  };

  return (
    <>
      <h1>Change Email</h1>
      
      <form onSubmit={handleSubmit}>
        <input
          name="newEmail1"
          placeholder="New Email"
          onChange={handleEmail1}
        />
        <br />
        <input
          name="newEmail2"
          placeholder="Reconfirm Email"
          onChange={handleEmail2}
        />
        <br />
        <button>Submit</button>
      </form>
      {errMessage}
      {message()}
      <p/>
    <Link to='/users'><button>Home</button></Link>

    </>
  );
}

export default Email;
