import { lazy, Suspense, type ReactNode } from "react"
import {BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Index = lazy(() => import("../pages/index"))
const Login = lazy(() => import("../pages/LoginPage"))
const Register = lazy(() => import("../pages/RegisterPage"))
const UserDashboard = lazy(() => import("../pages/UserDashboard"))
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"))
const LearningPath = lazy(() => import("../pages/LerningPath"))

type RequireAuthType = { children : ReactNode; roles?: string[] }

const RequireAuth = ({ children, roles }: RequireAuthType) => {
    const {user, loading} = useAuth()

    if(loading){
        return <div>Loading...</div>
    }

    if(!user){
        alert("You must be logged in to access this page.")
        return <Navigate to="/login" replace />
    }

    if(roles && !roles.some(role => user.role.includes(role))){
        return (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold mb-2">Access Denied</h2>
                <p>You do not have permission to view this page.</p>
            </div>
        )
    }
    return <>{children}</>
}

export default function Router(){
    return (
       <BrowserRouter>
           <Suspense fallback={<div>Loading...</div>}>
               <Routes>
                   <Route path="/" element={<Index />} />
                   <Route path="/login" element={<Login />} />
                   <Route path="/register" element={<Register />} />
                   <Route path="/user-dashboard" element={<RequireAuth roles={["USER"]}><UserDashboard /></RequireAuth>} />
                   <Route path="/admin-dashboard" element={<RequireAuth roles={["ADMIN"]}><AdminDashboard /></RequireAuth>} />
                   <Route path="/learning-path" element={<RequireAuth roles={["USER"]}><LearningPath /></RequireAuth>} />
               </Routes>
           </Suspense>
       </BrowserRouter>
        
    )
}