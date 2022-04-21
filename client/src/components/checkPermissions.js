const checkPermissions = (app_permit_action, role_groups) => {
  let value = false;
  if (role_groups.includes("Admin")) {
    value = true;
    return value;
  } else {
    app_permit_action.forEach((e) => {
      // console.log("e",e)
      role_groups.forEach((x) => {
        // console.log("x",x)
        if (e === x) {
          value = true;
        }
      });
    });

    return value;
  }
};

module.exports = checkPermissions;
