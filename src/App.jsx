import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Farms from '@/components/pages/Farms'
import Crops from '@/components/pages/Crops'
import Tasks from '@/components/pages/Tasks'
import Finances from '@/components/pages/Finances'
import Weather from '@/components/pages/Weather'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="farms" element={<Farms />} />
            <Route path="crops" element={<Crops />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="finances" element={<Finances />} />
            <Route path="weather" element={<Weather />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App