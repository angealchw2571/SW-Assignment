import { React, useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
const FormDataHandler = require("./FormDataHandler.js");

function UpdatePermissions() {
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [userData, setUserData] = useState();
  const [roleData, setRoleData] = useState();
  const [formData, setFormData] = useState([]);
  const [groupData, setGroupData] = useState();

  const array = useRef([]);
  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/user/checkroles`);
        const res2 = await axios.get(`/api/user/${id}`);
        const res3 = await axios.get(`/api/user/groups`);

        setnetworkStatus("loading");
        setRoleData(res.data);
        setUserData(res2.data);
        setGroupData(res3.data)
        array.current = new Array(res.data.length).fill(false);
        const result = FormDataHandler(res2.data, array.current, res.data);
        setFormData(result);
        setnetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, [id]);

  const handleQuery = async (data) => {
    await axios
      .post(`/api/user/permissions/${id}`, data)
      .then((res) => {
        if (res) {
          alert(res.data.message);
          navigate("/users");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleFormData = (formData, roleData) => {
    let ans = [];
    formData.map((e, i) => {
      if (e === true) {
        ans.push(roleData[i].role_name);
      }
      return ans;
    });
    return ans;
  };

  const handleOnChange = (position) => {
    const newData = [...formData];
    newData[position] = !newData[position];
    setFormData(newData);
    console.log("formData", formData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const groupName = event.target.groupName.value
    const result = handleFormData(formData, roleData);
    handleQuery({ role_groups: result, groupName:groupName });
  };

  return (
    <>
      {networkStatus === "resolved" ? (
        <>
          <h1>Update Permissions</h1>
          <h3>User: {userData.name}</h3>
          <form onSubmit={handleSubmit}>
            <div className="container" style={{ display: "flex" }}>
              {roleData.map((e, i) => {
                return (
                  <div key={i} style={{ margin: 10, paddingBottom: 20 }}>
                    <label>{e.role_name}</label>
                    <input
                      type="checkbox"
                      value={e.role_id}
                      name={e.role_name}
                      defaultChecked={
                        userData.role_groups.includes(e.role_name)
                          ? true
                          : false
                      }
                      onChange={() => handleOnChange(i)}
                    />
                  </div>
                );
              })}
            </div>
            <p/>
            <select name="groupName">
              {groupData.map((e)=> {
                if (userData.group_name === e.group_name){
                  return <option key={e.group_id} selected="selected">{e.group_name}</option>
                } else {

                  return <option key={e.group_id}>{e.group_name}</option>
                }
              })}
            </select>
            <p />
            <button>Submit</button>
          </form>
          <p />
          <Link to="/users">
            <button>Back</button>
          </Link>
        </>
      ) : (
        <h1>Loading</h1>
      )}
    </>
  );
}

export default UpdatePermissions;
