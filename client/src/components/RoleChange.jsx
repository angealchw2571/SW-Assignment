import { React, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

function RoleChange() {
  const { id } = useParams();
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [roleData, setRoleData] = useState();
  let navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/user/checkroles`);
        setnetworkStatus("loading");
        setRoleData(res.data);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const role_name = event.target.role_name.value;
    handleQuery({ role_name: role_name });
  };

  return (
    <>
      {networkStatus === "resolved" ? (
        <div>
          <h1>Change User Permisions</h1>
          <form onSubmit={handleSubmit}>
            <label>Select new role</label>
            <br />
            <select name="role_name" defaultValue="">
              <option value="" hidden="hidden">
                Select Group
              </option>
              {roleData.map((e)=> {
                return (

                  <option key={e.role_id} value={e.role_name}>{e.role_name}</option>
                )
              })}
            </select>
            <p />
            <button>Submit</button>
          </form>
          <p />
          <Link to={`/user/${id}`}>
            <button>Back</button>
          </Link>
        </div>
      ) : null}
    </>
  );
}

export default RoleChange;
