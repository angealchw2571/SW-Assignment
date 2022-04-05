import React from 'react'

function test({userData, roleData, formData, setFormData}) {
    console.log("userData", userData)
    console.log("roleData", roleData)
    console.log("formData", formData)

    const newData = [...formData];
    for (let i = 0; i < roleData.length; i++) {
      console.log("rowData.length", roleData.length)
      console.log("roleData", roleData[i].role_name);
      for (let x = 0; x < userData.role_groups.length; x++) {
        console.log("userData.roleGroups", userData.role_groups[x]);
        if (roleData[i].role_name === userData.role_groups[x]) {
          console.log("we found a pair!", roleData[i].role_name);
          newData[i] = !newData[i];
          console.log("newData", newData);
        }
      }
    }
    setFormData(newData)
    console.log("after", formData)
  return (
    <div>test</div>
  )
}

export default test