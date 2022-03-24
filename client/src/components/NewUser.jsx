import { React, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const PasswordValidation = require("./PasswordValidation");

function NewUser() {
  // const [session, setSession] = useAtom(userSessionAtom);
  const [networkStatus, setNetworkStatus] = useState("pending");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const role_arr = ["admin", "superuser", "user"];

  let navigate = useNavigate();

  const handleQuery = async (data) => {
    console.log(data);
    await axios
      .post(`/api/user/new`, data)
      .then((res) => {
        if (res) {
          setNetworkStatus("resolved");
          alert("Success!");
          navigate("/users");
        }
      })
      .catch(function (error) {
        alert(error);
        console.log(error);
      });
  };

  const rank = PasswordValidation(password1);
  const labels = ["Too Short", "Weak", "Medium", "Strong", "Very Strong"];
  const passwordMessage = labels[rank];

  const handleSubmit = (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const role_name = event.target.role_name.value;

    if (
      username.length === 0 ||
      role_name.length === 0 ||
      password1.length === 0 ||
      password2.length === 0
    ) {
      alert("Please do not leave empty fields.");
    } else if (rank < 3) {
      alert("Password do not meet the requirements");
    } else if (password1 === password2 && rank === 3) {
      handleQuery({ username: username, password: password1, role_name: role_name });
    } else {
      alert("Please check your password again");
    }
  };

  const handlePassword1 = (event) => {
    setPassword1(event.target.value);
  };
  const handlePassword2 = (event) => {
    setPassword2(event.target.value);
  };

  return (
    <>
      <h1>NewUser</h1>
      <label>Name</label>
      <br />
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" /> <br />
        <div style={{ display: "flex" }}>
          <div>
            <label>Password</label>
            <br />
            <input
              name="password1"
              placeholder="Password"
              onChange={handlePassword1}
              maxLength={10}
            />
          </div>
          <div>
            <label>Reconfirm Password</label>
            <br />

            <input
              name="password2"
              placeholder="Reconfirm Password"
              maxLength="10"
              onChange={handlePassword2}
            />
          </div>
        </div>
        <p />
        <select id="role_name" name="role_name">
          <option value="" hidden="hidden">
            Select Role
          </option>
          {role_arr.map((e, i) => {
            return (
              <option
                key={i}
                value={`${e}`}
                style={{ textTransform: "capitalize" }}
              >
                {e}
              </option>
            );
          })}
        </select>
        <p />
        <button>Create New User</button>
      </form>
      {password1.length <= 2 ? null : passwordMessage}

      <p />
      <Link to="/users">
        <button>Back</button>
      </Link>
    </>
  );
}

export default NewUser;
