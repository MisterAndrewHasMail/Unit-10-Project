import React, { useEffect, useContext } from "react"
import { Navigate } from "react-router-dom"
import AuthContext from "../context/AuthContext"

const UserSignOut = () => {
  // Access signOut function from AuthContext
  const { actions } = useContext(AuthContext)

  // Effect to sign out the user on component mount
  useEffect(() => {
    actions.signOut()
  }, [actions])

  // Redirect to the home page after signing out
  return (
    <Navigate to="/" replace />
  )
}

export default UserSignOut
