import React, { useRef, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../link/api'
import AuthContext from '../context/AuthContext'
import ValidatonErrors from './ValidationErrors'

const UserSignUp = () => {
	// Context and navigation
	const { actions } = useContext(AuthContext)
	const navigate = useNavigate()

	// Refs for form inputs
	const firstName = useRef(null)
	const lastName = useRef(null)
	const emailAddress = useRef(null)
	const password = useRef(null)

	// State for validation errors
	const [errors, setErrors] = useState([])

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault()

		// Construct user object from form data
		const user = {
			firstName: firstName.current.value,
			lastName: lastName.current.value,
			emailAddress: emailAddress.current.value,
			password: password.current.value
		}

		try {
			// POST request to create user
			const response = await api('/users', 'POST', user)
			if (response.status === 201) {
				// Successful sign-up
				console.log(`${user.firstName} ${user.lastName} is successfully signed up and authenticated!`)
				// Sign in with newly created credentials
				const credentials = {
					emailAddress: user.emailAddress,
					password: user.password
				}
				await actions.signIn(credentials)
				navigate('/')
			} else if (response.status === 400) {
				// Validation errors
				const data = await response.json()
				setErrors(data.errors)
			} else if (response.status === 500) {
				// Server error
				navigate('/error')
			} else {
				throw Error()
			}
		} catch (error) {
			// Catch any errors and navigate to home
			console.log(error)
			navigate("/")
		}
	}

	// Handle cancel button click
	const handleCancel = () => {
		navigate('/')
	}

	return (
		<div className="form--centered">
			<h2>Sign Up</h2>
			<ValidatonErrors errors={errors} />
			<form onSubmit={handleSubmit}>
				<label htmlFor='firstName'>First Name</label>
				<input id='firstName' name='firstName' type='text' ref={firstName} placeholder='First Name' />
				<label htmlFor='lastName'>Last Name</label>
				<input id='lastName' name='lastName' type='text' ref={lastName} placeholder='Last Name' />
				<label htmlFor='emailAddress'>Email Address</label>
				<input id='emailAddress' name='emailAddress' type='email' ref={emailAddress} placeholder='Email Address' />
				<label htmlFor='password'>Password</label>
				<input id='password' name='password' type='password' ref={password} placeholder='Password' />
				<button className='button' type='submit'>Sign Up</button>
				<button className='button button-secondary' onClick={handleCancel} type='button'>Cancel</button>
			</form>
			<p>
				Already have a user account? Click here to <Link to='/signin'>sign in</Link>!
			</p>
		</div>
	)
}

export default UserSignUp
