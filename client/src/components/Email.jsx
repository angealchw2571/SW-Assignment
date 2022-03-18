import { React, useState } from "react";
import axios from "axios";
// import { useAtom } from "jotai";
// import { userSessionAtom } from "./LoginPage";
import { useNavigate, Link, useParams } from "react-router-dom";


function Email() {
  let navigate = useNavigate();
  const [newEmail1, setNewEmail1] = useState("");
  const [newEmail2, setNewEmail2] = useState("");
  const { id } = useParams();


  const handleQuery = async (data) => {
    await axios
      .put(`/api/user/edit/email/${id}`, data)
      .then((res) => {
        if (res) {
          alert("Success!");
          navigate('/users')
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
      alert("Please do not leave empty fields.");
    } else if (newEmail1 === newEmail2) {
      handleQuery({ email: newEmail2 });
    } else {
      alert("Please check your email again")
    }
  };

  const handleEmail1 = (event) => {
    setNewEmail1(event.target.value);
  };
  const handleEmail2 = (event) => {
    setNewEmail2(event.target.value);
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
      <p/>
    <Link to='/users'><button>Back</button></Link>

    </>
  );
}

export default Email;
