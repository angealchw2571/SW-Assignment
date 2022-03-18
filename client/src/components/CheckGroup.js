// const SUPERUSER = "superuser";
// const ADMIN = "admin";
// const USER = "user";

// const role = SUPERUSER;
// const arr = [
//   { role: "user" },
//   { role: "user" },
//   { role: "user" },
//   { role: "user" },
//   { role: "user" },
//   { role: "user" },
//   { role: "user" },
//   { role: "superuser" },
//   { role: "superuser" },
// ];

function CheckGroup(arr, role) {
    const result = arr.filter(e =>e.role === role )
  return result
}

// const result = CheckGroup(arr,role)
// console.log(result);

module.exports = CheckGroup;
