import { React, useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

function Status() {
  const [networkStatus, setnetworkStatus] = useState("pending");
  const [userData, setUserData] = useState()
  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/user/${id}`);
        setnetworkStatus("loading");
        setUserData(res.data);
        setnetworkStatus("resolved");
      } catch (error) {
        console.log("error", error);
      }
    };
    getData();
  }, [id]);



  const handleQuery = async (data) => {
    await axios
      .put(`/api/user/edit/status/${id}`, data)
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
    const newStatus = event.target.status.value;
    handleQuery({ status: newStatus });
  };

  return (
    <>
    {networkStatus === "resolved" ? (<>
      <h1>Update Status</h1>
      <h3>User: {userData.name}</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Status:
          <select name="status" defaultValue="">
            <option value="" hidden="hidden">
              Select
            </option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </label>
        <p />
        <button>Submit</button>
      </form>
      <p/>
      <Link to={`/user/${id}`}>
        <button>Back</button>
      </Link>
    </>) : null}
    </>
    
    
  );
}

export default Status;
