import { useTable } from "react-table";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Table({ userData }) {
  const data = React.useMemo(() => userData, [userData]);
  let navigate = useNavigate();
  console.log("userData", userData);

  const handleEdit = (e) => {
    const userID = e.row.original.user_id;
    navigate(`/user/${userID}`);
  };

  const columns = React.useMemo(
    (e) => [
      // {
      //   Header: "User ID",
      //   accessor: "user_id", // accessor is the "key" in the data
      // },
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      // {
      //   Header: "Age",
      //   accessor: "age",
      // },
      {
        Header: "Role Groups",
        accessor: "role_groups",
        Cell: (e) => (
          <span>
            {e.row.original.role_groups.map((e, i) => {
              return (
                <li key={i} style={{ textWeight: "bold" }}>
                  {e}{" "}
                </li>
              );
            })}
          </span>
        ),
      },
      {
        Header: "Assigned Group",
        accessor: "group_name",
      },
      // {
      //   Header: "Email",
      //   accessor: "email",
      // },
      {
        Header: "Status",
        accessor: "user_status",
        Cell: (e) => (
          <span>
            {e.row.original.user_status === 1 ? (
              <span style={{ color: "green" }}>● Active</span>
            ) : (
              <span style={{ color: "red" }}>● Inactive</span>
            )}
          </span>
        ),
      },
      {
        Header: "Links",
        Cell: (e) => <button onClick={() => handleEdit(e)}>Edit</button>,
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const handleClick = (userID) => {
    // console.log("userID", userID);
  };

  return (
    <div style={{ position: "absolute", right:"0%" }}>
      <table
        {...getTableProps()}
        style={{ border: "solid 1px blue"}}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  style={{
                    // background: "mediumpurple",
                    color: "black",
                    // fontWeight: "bold",
                  }}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                onClick={() => handleClick(row.values.user_id)}
                {...row.getRowProps()}
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        padding: "3px",
                        border: "solid 1px gray",
                        // background: "papayawhip",
                      }}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
