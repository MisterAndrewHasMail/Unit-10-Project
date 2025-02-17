import React, { useContext } from "react"
import AuthContext from "../context/AuthContext"
import { Navigate, Outlet, useLocation } from "react-router-dom"

const PrivateRoute = () => {
  // Access authUser from AuthContext
  const { authUser } = useContext(AuthContext)

  // Get current location
  const location = useLocation()

  // Render Outlet if user is authenticated, otherwise redirect to sign-in page
  if (authUser) {
    return <Outlet />
  } else {
    return <Navigate to="/signin" state={{ from: location.pathname }} />
  }
}

export default PrivateRoute
