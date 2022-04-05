import { React, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const PasswordValidation = require("./PasswordValidation");

function NewUser() {
  // const [session, setSession] = useAtom(userSessionAtom);
  const [networkStatus, setNetworkStatus] = useState("pending");
  const [roleData, setRoleData] = useState();
  const [groupData, setGroupData] = useState();
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [formData, setFormData] = useState([]);

  let navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/user/checkroles`);
        const res2 = await axios.get(`/api/user/groups`);
        setNetworkStatus("loading");
        setRoleData(res.data);
        setGroupData(res2.data);
        setNetworkStatus("resolved");
        setFormData(new Array(res.data.length).fill(false));
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, []);

  const handleQuery = async (data) => {
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

  const fetchFormDataValues = (formData) => {
    let roleArr = [];
    formData.map((e, i) => {
      if (e === true) {
        roleArr.push(roleData[i].role_name);
      }
      return roleArr;
    });
    return roleArr;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const groupName = event.target.groupName.value
    if (
      username.length === 0 ||
      password1.length === 0 ||
      password2.length === 0
    ) {
      alert("Please do not leave empty fields.");
    } else if (!formData.includes(true)) {
      alert("Please select a role for the user");
    } else if (rank < 3) {
      alert("Password do not meet the requirements");
    } else if (password1 === password2 && rank === 3) {
      const role_groups = fetchFormDataValues(formData);
      handleQuery({
        username: username,
        password: password1,
        role_groups: role_groups,
        groupName:groupName
      });
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

  const handleOnChange = (position) => {
    const newData = [...formData];
    newData[position] = !newData[position];
    setFormData(newData);
  };

  return (
    <>
      {networkStatus === "resolved" ? (
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

            <div className="container" style={{width:450}}>

            {roleData.map((e, i) => {
              return (
                <span key={i} style={{ margin: 15 }}>
                  <label>{e.role_name}</label>
                  <input
                    type="checkbox"
                    value={e.role_id}
                    name={e.role_name}
                    onChange={() => handleOnChange(i)}
                    />
                </span>
              );
            })}
            </div>
            <p/>
            <select name="groupName">
              <option disabled={true} selected="selected" >Select group</option>
              {groupData.map((e)=> {
               return <option key={e.group_id}>{e.group_name}</option>
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
      ) : null}
    </>
  );
}

export default NewUser;
