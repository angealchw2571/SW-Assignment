


const FormDataHandler = (userData, array, roleData) => {
    const newData = [...array];
    for (let i = 0; i < roleData.length; i++) {
    //   console.log("rowData.length", roleData.length)
    //   console.log("roleData", roleData[i].role_name);
      for (let x = 0; x < userData.role_groups.length; x++) {
        // console.log("userData.roleGroups", userData.role_groups[x]);
        if (roleData[i].role_name === userData.role_groups[x]) {
        //   console.log("we found a pair!", roleData[i].role_name);
          newData[i] = !newData[i];
        }
      }
    }
    return newData
}


module.exports = FormDataHandler;
