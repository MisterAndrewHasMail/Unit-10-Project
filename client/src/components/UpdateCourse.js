import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../link/api'
import AuthContext from '../context/AuthContext'
import ValidatonErrors from './ValidationErrors'

const UpdateCourse = () => {
	// Get authenticated user from context
	const { authUser } = useContext(AuthContext)
	// Navigate function for routing
	const navigate = useNavigate()
	// Extract course ID from URL params
	const courseId = useParams()

	// State variables
	const [course, setCourse] = useState({})
	const [errors, setErrors] = useState([])

	// Fetch course details by ID
	useEffect(() => {
		async function fetchCourse() {
			try {
				const data = await api(`/courses/${courseId.id}`, 'GET', null)
				if (data.status === 200) {
					const courseData = await data.json()
					if (authUser?.id !== courseData?.userId) {
						navigate('/forbidden')
					} else {
						setCourse(courseData)
					}
				} else if (data.status === 404) {
					navigate('/notfound')
				} else if (data.status === 500) {
					navigate('/error')
				}
			} catch (error) {
				console.log('Error fetching and parsing data in Course Detail', error)
				navigate('/notfound')
			}
		}
		fetchCourse()
	}, [courseId, navigate, authUser])

	// Handle course update
	const handleUpdateCourse = async (e) => {
		e.preventDefault()
		// PUT request to update course
		const data = await api(`/courses/${courseId.id}`, 'PUT', course, authUser)
		if (data.status === 204) {
			navigate(`/courses/${courseId.id}`)
		} else if (data.status === 400) {
			const res = await data.json()
			setErrors(res.errors)
		} else if (data.status === 404) {
			navigate('/notfound')
		} else if (data.status === 500) {
			navigate('/error')
		} else {
			throw new Error()
		}
		e.target.reset()
	}

	// Handle cancel action
	const handleCancel = (e) => {
		e.preventDefault()
		navigate(`/courses/${course.id}`)
	}

	return (
		<div className='wrap'>
			<h2>Update Course</h2>
			<ValidatonErrors errors={errors} />
			<form onSubmit={handleUpdateCourse}>
				<div className='main--flex'>
					<div>
						<label htmlFor='courseTitle'>Course Title</label>
						<input id='courseTitle' name='courseTitle' type='text' value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} />
						<p>
							By {course.User?.firstName} {course.User?.lastName}
						</p>
						<label htmlFor='courseDescription'>Course Description</label>
						<textarea id='courseDescription' name='courseDescription' value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} />
					</div>
					<div>
						<label htmlFor='estimatedTime'>Estimated Time</label>
						<input id='estimatedTime' name='estimatedTime' type='text' value={course.estimatedTime} onChange={(e) => setCourse({ ...course, estimatedTime: e.target.value })} />
						<label htmlFor='materialsNeeded'>Materials Needed</label>
						<textarea id='materialsNeeded' name='materialsNeeded' value={course.materialsNeeded} onChange={(e) => setCourse({ ...course, materialsNeeded: e.target.value })} />
					</div>
				</div>
				<button className='button' type='submit'>Update Course</button>
				<button className='button button-secondary' onClick={handleCancel}>Cancel</button>
			</form>
		</div>
	)
}

export default UpdateCourse
