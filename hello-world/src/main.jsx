import React, { StrictMode } from 'react'
import ReactDom from "@vitejs/plugin-react"
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import APP from './App'
import { AuthProvider } from './contexts/Authcontext'
import 'index.css'

ReactDom.createRoot(
  document.getElementById('root')).render(
<React.StrictMode>
 <BrowserRouter>
  <AuthProvider>
     <App/>
      <Toaster position = "Top Right"/>
   </AuthProvider>
  </BrowserRouter>
</React.StrictMode>





  )

