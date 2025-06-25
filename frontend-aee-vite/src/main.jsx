// frontend-aee-vite/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
)




// frontend-aee-vite/src/main.jsx

// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import { AuthProvider } from './context/AuthContext.jsx'
// import { GoogleOAuthProvider } from '@react-oauth/google'
// import { BrowserRouter } from 'react-router-dom'
// import './index.css'

// // ===================================
// // ID do cliente Google para OAuth
// const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

// // ===================================
// // Base URL usada no roteamento (GitHub = /aee/, dev = /)
// const basename = import.meta.env.VITE_BASE_URL || '/'

// // ===================================
// // Renderização com contexto e roteamento
// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <GoogleOAuthProvider clientId={clientId}>
//       <AuthProvider>
//         <BrowserRouter basename={basename}>
//           <App />
//         </BrowserRouter>
//       </AuthProvider>
//     </GoogleOAuthProvider>
//   </React.StrictMode>
// )
