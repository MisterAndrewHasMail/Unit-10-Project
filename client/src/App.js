
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import NotFound from './components/NotFound'
import UnhandledError from './components/UnhandledError'
import Forbidden from './components/Forbidden'
import SignIn from './components/UserSignIn'
import SignOut from './components/UserSignOut'
import SignUp from './components/UserSignUp'
import Courses from './components/Courses'
import CourseDetail from './components/CourseDetail'
import CreateCourse from './components/CreateCourse'
import UpdateCourse from './components/UpdateCourse'
import PrivateRoute from './components/PrivateRoute'
import { AuthProvider } from './context/AuthContext'


const App = () => {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Courses />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signout" element={<SignOut />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route element={<PrivateRoute />}>
          <Route path="/courses/create" element={<CreateCourse />} />
          <Route path="/courses/:id/update" element={<UpdateCourse />} />
        </Route>
        <Route path='/forbidden' element={<Forbidden />} />
        <Route path='/error' element={<UnhandledError />} />   
        <Route path='/notfound' element={<NotFound />} />   
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App