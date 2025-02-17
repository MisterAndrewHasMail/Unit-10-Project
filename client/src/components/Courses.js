import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"

const Courses = () => {
	// Navigation hook for routing
	const navigate = useNavigate()

	// State hook to manage courses list
	const [courses, setCourses] = useState([])

	// Effect hook to fetch courses from the server when component mounts
	useEffect(() => {
		async function fetchCourses() {
			try {
				// Fetch courses from the API
				const response = await fetch('http://localhost:5000/api/courses')

				// Check if response is OK
				if (response.ok) {
					const data = await response.json()
					setCourses(data) // Update courses state with fetched data
				} else {
					throw new Error('Error fetching courses') // Throw error if fetch fails
				}
			} catch (error) {
				console.error(error)
				navigate('/error') // Navigate to error page on error
			}
		}
		fetchCourses()
	}, [navigate]) // Depend on navigate to ensure useEffect runs on route change

	// Render component JSX
	return (
		<div className="wrap main--grid">
			{/* Map through courses array to render each course as a link */}
			{
				courses.map((course, index) => (
					<Link key={index} className='course--module course--link' to={`/courses/${course.id}`}>
						<h2 className='course--label'>Course</h2>
						<h3 className='course--title'>{course.title}</h3>
					</Link>
				))
			}
			{/* Link to create new course */}
			<Link className='course--module course--add--module' to='/courses/create'>
				<span className='course--add--title'>
					<svg version='1.1' xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 13 13' className='add'>
						<polygon points='7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 '></polygon>
					</svg>
					New Course
				</span>
			</Link>
		</div>
	)
}

export default Courses
