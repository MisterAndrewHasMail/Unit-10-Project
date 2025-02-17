import React, { useState, useEffect, useContext } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { api } from '../link/api'
import AuthContext from "../context/AuthContext"
import Markdown from "react-markdown"

const CourseDetail = () => {
  // Context hook to access authentication information
  const { authUser } = useContext(AuthContext)

  // Hook to access route parameters
  const Id = useParams()

  // State hook to manage the course data
  const [course, setCourse] = useState(null)

  // Hook to navigate programmatically
  const navigate = useNavigate()

  // Effect hook to fetch course data when component mounts or Id changes
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch course data from API using Id from route parameters
        const response = await fetch(`http://localhost:5000/api/courses/${Id.id}`)

        // Check if response is OK
        if (response.ok) {
          const data = await response.json()

          // Enhance course data with additional information
          data.myNameIs = `${data.owner.firstName} ${data.owner.lastName}`
          setCourse(data)
        } else {
          // Handle network response errors
          const error = new Error('Network response error')
          error.status = response.status
          throw error
        }
      } catch (error) {
        // Log and navigate to error page in case of errors
        console.error(error)
        navigate('/notfound')
      }
    }
    fetchData()
  }, [Id, navigate])

  // Function to handle course deletion
  const handleDelete = async () => {
    if (!authUser) {
      console.error('authUser is null or undefined')
      return
    }

    // Extract password from authUser
    const { password } = authUser

    // Send DELETE request to API with authentication credentials
    const data = await api(`/courses/${Id.id}`, 'DELETE', null, { ...authUser, password: password })

    // Handle different status responses from the API
    if (data.status === 204) {
      navigate('/') // Redirect to home page after successful deletion
    } else if (data.status === 403) {
      navigate('/forbidden') // Navigate to forbidden page if deletion is not allowed
    } else if (data.status === 500) {
      navigate('/error') // Navigate to error page for server errors
    } else {
      throw new Error() // Throw generic error for unexpected responses
    }
  }

  // Render component JSX
  return (
    <>
      {course &&
        <>
          <div className='actions--bar'>
            <div className='wrap'>
              {/* Render update and delete buttons if authenticated user owns the course */}
              {(authUser && (authUser.id === course.owner.id)) ?
                (
                  <>
                    <Link className="button" to={`/courses/${course.id}/update`}>Update Course</Link>
                    <Link className="button" onClick={handleDelete}>Delete Course</Link>
                  </>
                ) : null
              }
              {/* Always render return to list button */}
              <Link className='button button-secondary' to='/'>
                Return to List
              </Link>
            </div>
          </div>
          <div className='wrap'>
            <h2>Course Detail</h2>
            <div className='main--flex'>
              <div>
                <h3 className='course--detail--title'>Course</h3>
                <h4 className='course--name'>{course.title}</h4>
                <p>By {course.myNameIs}</p>
                {/* Render course description using Markdown component */}
                <Markdown>{course.description}</Markdown>
              </div>
              <div className='course'>
                <h3 className='course--detail--title'>Estimated Time</h3>
                <p>{course.estimatedTime}</p>
                <h3 className='course--detail--title'>Materials Needed</h3>
                {/* Render materials needed using Markdown component */}
                <Markdown className='course--detail--list' children={course.materialsNeeded} />
              </div>
            </div>
          </div>
        </>
      }
    </>
  )
}

export default CourseDetail
