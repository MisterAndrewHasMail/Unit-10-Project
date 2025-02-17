import React, { createContext, useState } from 'react'
import Cookies from 'js-cookie'
import { api } from '../link/api'

// Creating an authentication context
const AuthContext = createContext(null)

// AuthProvider component to manage authentication state
export const AuthProvider = (props) => {
  // Retrieve authenticated user data from cookie
  const cookie = Cookies.get('authenticatedUser')

  // State to hold authenticated user information
  const [authUser, setAuthUser] = useState(cookie ? JSON.parse(cookie) : null)

  // Function to sign in user using provided credentials
  const signIn = async (credentials) => {
    try {
      // Send GET request to authenticate user
      const response = await api('/users', 'GET', null, credentials)

      // Handle successful authentication
      if (response.status === 200) {
        const user = await response.json()
        user.password = credentials.password // Attach password for future use (not recommended for production)
        setAuthUser(user) // Set authenticated user in state
        Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 }) // Set cookie with user data
        return user
      } else if (response.status === 401) { // Handle unauthorized access
        return null
      } else {
        throw new Error() // Throw error for unexpected response status
      }
    } catch (error) {
      console.error(error)
      throw new Error('Authentication failed') // Throw error for failed authentication
    }
  }

  // Function to sign out user and clear authentication data
  const signOut = () => {
    setAuthUser(null) // Clear authenticated user from state
    Cookies.remove('authenticatedUser') // Remove authentication cookie
  }

  // Provide authentication context value to child components
  return (
    <AuthContext.Provider value={{
      authUser, // Current authenticated user
      actions: {
        signIn, // Function to sign in
        signOut // Function to sign out
      }
    }}>
      {props.children} {/* Render child components */}
    </AuthContext.Provider>
  )
}

export default AuthContext // Export authentication context for use in other components
