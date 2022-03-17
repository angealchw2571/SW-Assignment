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


//   for (const r of role) {
//     arr.map((e) => {
//       if (e.role === r) {
//         newArr.push(e);
//       }
//       return newArr;
//     });
//   }
  return result
}

// const result = CheckGroup(arr,role)
// console.log(result);

module.exports = CheckGroup;
