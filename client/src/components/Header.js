import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
  // Context hook to access authentication information
  const { authUser } = useContext(AuthContext)

  // Render component JSX
  return (
    <header>
      <div className='wrap header--flex'>
        <h1 className='header--logo'><Link to='/'>Courses</Link></h1> {/* Logo linking to home */}
        <nav>
          {
            authUser ? ( // Conditional rendering based on authentication status
              <ul className="header--signedin">
                <li>Welcome, {authUser.firstName} {authUser.lastName}</li> {/* Display user's name */}
                <li><Link to="/signout">Sign Out</Link></li> {/* Link to sign out */}
              </ul>
            ) : (
              <ul className="header--signedout">
                <li><Link to="/signup">Sign Up</Link></li> {/* Link to sign up */}
                <li><Link to="/signin">Sign In</Link></li> {/* Link to sign in */}
              </ul>
            )
          }
        </nav>
      </div>
    </header>
  )
}

export default Header
