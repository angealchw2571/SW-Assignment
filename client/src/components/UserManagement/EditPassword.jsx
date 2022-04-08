import { React, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
const PasswordValidation = require("./PasswordValidation");


function EditPassword() {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const { id } = useParams();
  let navigate = useNavigate();

  const handleQuery = async (data) => {
    await axios
      .put(`/api/user/edit/pass/${id}`, data)
      .then((res) => {
        if (res) {
          alert("Successfully Changed Password");
          navigate("/home");
        }
      })
      .catch(function (error) {
        alert(error.response.data.message)
        console.log(error);
      });
  };

  const labels = ["Too Short", "Weak", "Medium", "Strong", "Very Strong"];
  const rank = PasswordValidation(password1);
  const passwordMessage = labels[rank];

  const handleSubmit = (event) => {
    event.preventDefault();
    const currentPassword = event.target.currentPassword.value;
    if (
      currentPassword.length === 0 ||
      password1.length === 0 ||
      password2.length === 0
    ) {
      alert("Please do not leave empty fields.");
    } else if (rank < 3) {
      alert("Password do not meet the requirements");
    } else if (password1 === password2 && rank === 3) {
      handleQuery({currentPassword: currentPassword, password: password2 });
    } else {
      alert("Please check your password again");
    }
  };

  const handlePassword1 = (event) => {
    setPassword1(event.target.value);
    // console.log(event.target.value)
  };
  const handlePassword2 = (event) => {
    setPassword2(event.target.value);
  };

  return (
    <>
      <h1>Password change</h1>
      <form onSubmit={handleSubmit}>
        <input name="currentPassword" placeholder="Current Password" />
        <p />
        <input
          name="newPassword"
          placeholder="New Password"
          maxLength="10"
          onChange={handlePassword1}
        />
        <br />
        <input
          name="newpassword2"
          placeholder="Reconfirm Password"
          maxLength="10"
          onChange={handlePassword2}
        />
        <br />
        <button>Submit</button>
      </form>
      {passwordMessage}
      <p />
      <Link to="/home">
        <button>Back</button>
      </Link>
    </>
  );
}

export default EditPassword;
