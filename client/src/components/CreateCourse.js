import React, { useRef, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../link/api'
import AuthContext from '../context/AuthContext'
import ValidatonErrors from './ValidationErrors'

const CreateCourse = () => {
	// Context hook to access authentication information
	const { authUser } = useContext(AuthContext)

	// Destructuring to get password from authUser
	const { password } = authUser

	// Navigation hook for routing
	const navigate = useNavigate()

	// State hook to manage validation errors
	const [errors, setErrors] = useState([])

	// Refs for input fields
	const courseTitle = useRef(null)
	const courseDescription = useRef(null)
	const courseEstimatedTime = useRef(null)
	const courseMaterialsNeeded = useRef(null)

	// Function to handle form submission to create a course
	const handleCreateCourse = async (e) => {
		e.preventDefault()

		const course = {
			title: courseTitle.current.value,
			description: courseDescription.current.value,
			estimatedTime: courseEstimatedTime.current.value,
			materialsNeeded: courseMaterialsNeeded.current.value,
			userId: authUser.id
		}

		try {
			// POST request to create a new course
			const data = await api(`/courses`, 'POST', course, { ...authUser, password: password })

			if (data.status === 201) {
				navigate(`/`) // Redirect to home page after successful creation
			} else if (data.status === 400) {
				const res = await data.json()
				console.log("res", res)
				if (res.errors) {
					setErrors(res.errors) // Set validation errors if any
				}
			} else if (data.status === 500) {
				navigate('/error') // Navigate to error page on server error
			} else {
				throw new Error() // Throw generic error for unexpected responses
			}
		} catch (error) {
			console.error(error)
		}
	}

	// Function to handle cancel button click
	const handleCancel = (e) => {
		e.preventDefault()
		navigate('/') // Navigate back to home page
	}

	// Render component JSX
	return (
		<div className='wrap'>
			<h2>Create Course</h2>
			<ValidatonErrors errors={errors} /> {/* Display validation errors if any */}
			<form onSubmit={handleCreateCourse}>
				<div className='main--flex'>
					<div>
						<label htmlFor='courseTitle'>Course Title</label>
						<input id='courseTitle' name='courseTitle' type='text' ref={courseTitle} />
						<p>
							by {authUser?.firstName} {authUser?.lastName}
						</p>
						<label htmlFor='courseDescription'>Course Description</label>
						<textarea id='courseDescription' name='courseDescription' ref={courseDescription} />
					</div>
					<div>
						<label htmlFor='estimatedTime'>Estimated Time</label>
						<input id='estimatedTime' name='estimatedTime' type='text' ref={courseEstimatedTime} />
						<label htmlFor='materialsNeeded'>Materials Needed</label>
						<textarea id='materialsNeeded' name='materialsNeeded' ref={courseMaterialsNeeded} />
					</div>
				</div>
				<button className='button' type='submit'>Create Course</button>
				<button className='button button-secondary' onClick={handleCancel}>Cancel</button>
			</form>
		</div>
	)
}

export default CreateCourse
