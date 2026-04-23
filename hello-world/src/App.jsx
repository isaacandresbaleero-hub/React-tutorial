import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/Layout/Navbar'
import PrivateRoute from './components/Layout/PrivateRoute'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import StudentDashboard from './components/dashboard/StudentDashboard'
import AcademicSupervisorDashboard from './components/dashboard/AcademicSupervisorDashboard'
import WorkplaceSupervisorDashboard from './components/dashboard/WorkplaceSupervisorDashboard'
import AdminDashboard from './components/dashboard/AdminDashboard'
import PlacementList from './components/placements/PlacementList'
import PlacementForm from './components/placements/PlacementForm'
import PlacementDetail from './components/placements/PlacementDetail'
import WeeklyLogForm from './components/logs/WeeklyLogForm'
import WeeklyLogList from './components/logs/WeeklyLogList'
import WeeklyLogReview from './components/logs/WeeklyLogReview'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" />
      {user && <Navbar />}
      <div className={user ? "pt-16" : ""}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={
              user?.role === 'student' ? <StudentDashboard /> :
              user?.role === 'acad_supervisor' ? <AcademicSupervisorDashboard /> :
              user?.role === 'work_supervisor' ? <WorkplaceSupervisorDashboard /> :
              <AdminDashboard />
            } />
            
            <Route path="/placements" element={<PlacementList />} />
            <Route path="/placements/new" element={<PlacementForm />} />
            <Route path="/placements/:id" element={<PlacementDetail />} />
            <Route path="/placements/:id/edit" element={<PlacementForm />} />
            
            <Route path="/placements/:placementId/logs" element={<WeeklyLogList />} />
            <Route path="/placements/:placementId/logs/new" element={<WeeklyLogForm />} />
            <Route path="/placements/:placementId/logs/:weekNumber/edit" element={<WeeklyLogForm />} />
            
            <Route path="/logs/review" element={<WeeklyLogReview />} />
          </Route>
        </Routes>
      </div>
    </>
  )
}

export default App