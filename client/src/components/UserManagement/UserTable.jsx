import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import TaskNoteForm from "../TaskManagement/TaskNoteForm";
import EditModalForm from "./EditModalForm";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#E1D6EE",
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function UserTable({ userData, roleData, groupData, handleQuery }) {
  let navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [EditUserModal, setEditUserModal] = useState();
  // const handleReFetch = handleQuery()

  const handleEdit = (e) => {
    const userID = e;
    navigate(`/profile/edit/${userID}`);
    // navigate("/user/${userID}");
  };

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 700, my: 5, marginBottom: 10 }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Username</StyledTableCell>
              <StyledTableCell align="center" sx={{ px: 3 }}>
                Name
              </StyledTableCell>
              <StyledTableCell align="center">Group Name</StyledTableCell>
              <StyledTableCell align="center" sx={{ paddingLeft: 0 }}>
                Role Groups
              </StyledTableCell>
              <StyledTableCell align="left">Status</StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userData.map((e, i) => (
              <StyledTableRow key={e.username}>
                <StyledTableCell component="th" scope="row">
                  {e.username}
                </StyledTableCell>
                <StyledTableCell align="center">{e.name}</StyledTableCell>
                <StyledTableCell align="center">
                  <div style={{ display: "flex", transform: `translate(15%)` }}>
                    <div
                      style={{
                        width: 50,
                      }}
                    >
                      <span style={{ color: `${e.group_color}` }}>●</span>
                    </div>
                    <div style={{ textAlign: "left" }}>{e.group_name}</div>
                  </div>
                </StyledTableCell>

                <StyledTableCell align="left">
                  <div
                    style={{
                      marginLeft: 10,
                      position: "relative",
                      width: 170,
                      transform: `translate(30%)`,
                    }}
                  >
                    <span>
                      {e.role_groups.map((e, i) => {
                        return (
                          <li key={i} style={{ textWeight: "bold" }}>
                            {e}
                          </li>
                        );
                      })}
                    </span>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="left">
                  <span>
                    {e.user_status === 1 ? (
                      <span style={{ color: "green" }}>● Active</span>
                    ) : (
                      <span style={{ color: "red" }}>● Inactive</span>
                    )}
                  </span>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <div
                    style={{ fontSize: 20 }}
                    onClick={() => {
                      handleOpen();
                      setEditUserModal(userData[i]);
                    }}
                    className="no-select"
                  >
                    ⚙️
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            ))}
            <Modal
              open={modalOpen}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 800,
                  bgcolor: "white",
                  border: "2px solid #000",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <EditModalForm
                  roleData={roleData}
                  groupData={groupData}
                  userData={EditUserModal}
                  handleReFetch={handleQuery}
                />
              </Box>
            </Modal>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default UserTable;
