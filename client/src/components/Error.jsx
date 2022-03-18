import React from 'react'
import {Link} from 'react-router-dom'

function Error() {
  return (
    <p>
          Seems like you're not logged in. Please{" "}
          <Link to="/login">log in</Link>.
        </p>

  )
}

export default Error