import React, { useRef, useState, useContext } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import ValidatonErrors from './ValidationErrors'

const UserSignIn = () => {
  // Access signIn action from AuthContext
  const { actions } = useContext(AuthContext)

  // Setup navigation
  const navigate = useNavigate()

  // Get current location
  const location = useLocation()

  // State for validation errors
  const [errors, setErrors] = useState([])

  // Refs for form inputs
  const emailAddress = useRef(null)
  const password = useRef(null)

  // Handle sign-in process
  const handleSignIn = async (e) => {
    e.preventDefault()

    // Default redirection path
    let from = '/'

    // Check if redirected from another page
    if (location.state && location.state.from) {
      from = location.state.from
    }

    // User credentials from form
    const credentials = {
      emailAddress: emailAddress.current.value,
      password: password.current.value
    }

    try {
      // Attempt sign-in
      const user = await actions.signIn(credentials)
      if (user) {
        // Redirect upon successful sign-in
        navigate(from)
      } else {
        // Handle unsuccessful sign-in
        setErrors(['Sign-in was unsuccessful'])
      }
    } catch (error) {
      // Handle errors
      navigate('/error')
    }
  }

  // Handle cancel button click
  const handleCancel = (e) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className='form--centered'>
      <h2>Sign In</h2>
      <ValidatonErrors errors={errors} />
      <form onSubmit={handleSignIn}>
        <label htmlFor='emailAddress'>Email Address</label>
        <input
          id='emailAddress'
          name='emailAddress'
          type='email'
          ref={emailAddress}
        />
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          name='password'
          type='password'
          ref={password}
        />
        <button className='button' type='submit'>Sign In</button>
        <button className='button button-secondary' onClick={handleCancel} type='button'>Cancel</button>
      </form>
      <p>
        Don't have a user account? Click here to <Link to='/signup'>sign up</Link>!
      </p>
    </div>
  )
}

export default UserSignIn
