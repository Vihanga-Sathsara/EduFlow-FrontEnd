import Spline  from "@splinetool/react-spline" 
import React, { useState } from "react"
import { MdEmail } from "react-icons/md"
import { RiLockPasswordLine } from "react-icons/ri"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import Swal from "sweetalert2"
import { getMyDetails, gmailLogin, login, resetPassword, updateNewPassword, verifyOtp } from "../services/auth"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"

export default function Login(){

    const [password, setPassword] = useState("")
    const [updatePassword, setUpdatePassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [recoveryEmail, setRecoveryEmail] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [enteredOtp, setEnteredOtp] = useState("")
    const [verified, setVerified] = useState(false)
    const [resetPW , setResetPW] = useState(false)
    const [otpToken, setOtpToken] = useState("")
    const navigate = useNavigate()
    const { setUser } = useAuth()

   
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      const validateEmail = (email: string) => {
        return emailRegex.test(email)
      }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/

    const validatePassword = (updatePassword: string) => {
        return passwordRegex.test(updatePassword)
    }

      const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) =>{
        e.preventDefault()

        if(!email || !password){
            Swal.fire({
                icon: "error",
                text: "Please fill in all fields",
                draggable: true
            })        
            return
        }

        if ( !validateEmail(email) ) {
            Swal.fire({
                icon: "error",
                text: "Please enter a valid email address.",
                draggable: true
            })
            return
        }

        try{
            const res = await login(email, password)
            if(res?.data?.accessToken){
                await localStorage.setItem("accessToken", res.data.accessToken)
                await localStorage.setItem("refreshToken", res.data.refreshToken)
                const resData = await getMyDetails()
                setUser(resData.data)
                console.log("User details after login:", resData.data)
                if(resData.data.role.toString() === "USER"){
                     navigate("/user-dashboard")
                }else if(resData.data.role.toString() === "ADMIN"){
                        navigate("/admin-dashboard")
                }
                Swal.fire({
                    icon: "success",
                    text: "Login successful!",
                    draggable: true
                })
            }
            

        }catch(error: any){
            console.error("Login error:", error)
             if(error.response){
                Swal.fire({
                    icon: "error",
                    text: error.response.data,
                    draggable: true
                })
                return
            }else{
                Swal.fire({
                    icon: "error",
                    text: "Login failed. Please try again.",
                    draggable: true
                })
                return
            }
        }
      }

      const handleGoogleLogin = async (credentialResponse: any) => {
        const decoded : any= jwtDecode(credentialResponse.credential)
        try{
            if(!decoded.email){
                Swal.fire({
                        icon: "error",
                        text: "Login failed. Please try again.",
                        draggable: true
                })
                return
            }

            const res = await gmailLogin (decoded.email)
            if(res?.data?.accessToken){
                await localStorage.setItem("accessToken", res.data.accessToken)
                await localStorage.setItem("refreshToken", res.data.refreshToken)
                const resData = await getMyDetails()
                setUser(resData.data)
                if(resData.data.role === "ADMIN"){
                    navigate("/admin-dashboard")
                }else{
                     navigate("/user-dashboard")
                }
                Swal.fire({
                    icon: "success",
                    text: "Login successful!",
                    draggable: true
                })
            }

        }catch(error : any){
             console.error("Login error:", error)
             if(error.response){
                Swal.fire({
                    icon: "error",
                    text: error.response.data,
                    draggable: true
                })
                return
            }else{
                Swal.fire({
                    icon: "error",
                    text: "Login failed. Please try again.",
                    draggable: true
                })
                return
            }
        }
     
    }

    const handleResetPassword = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(!recoveryEmail){
            Swal.fire({
                icon: "error",
                text: "Please input your email address",
                draggable: true
            })        
            return
        }

        if ( !validateEmail(recoveryEmail) ) {
            Swal.fire({
                icon: "error",
                text: "Please enter a valid email address.",
                draggable: true
            })
            return
        }

        Swal.fire({
            title: "Sending OTP...",
            text: "Please wait",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        })
                
        try{
            const res : any = await resetPassword(recoveryEmail)
                Swal.close();
            
                Swal.fire({
                    icon: "success",
                    title: "OTP Sent!",
                    text: "Check your inbox for the otp."
                });
            console.log("Reset password response:", res) 
            setResetPW(true)
            setOtpToken(res.passwordResetToken)

        }catch(error:any){
            setRecoveryEmail("")
            console.error("Reset Password error:", error) 
            if(error.response){
                Swal.fire({
                    icon: "error",
                    text: error.response.data,
                    draggable: true
                })
                return
            }else{
                Swal.fire({
                    icon: "error",
                    text: "Reset password failed. Please try again.",
                    draggable: true
                })
                return
            }
        }

    }

    const handleVerifyOtp = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()

        try{
            const res : any= await verifyOtp(enteredOtp, otpToken)
             Swal.fire({
                icon: "success",
                text: res.message || "OTP verified successfully!",
                draggable: true
            })
            setVerified(true)
        }catch(error: any) {
            console.error("OTP verification error:", error)

            Swal.fire({
                icon: "error",
                text: error.response?.data?.message || "OTP verification failed. Please try again.",
                draggable: true
            })
        }
}


    const handleUpdatePassword = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault()
            if(!validatePassword(updatePassword)){
                 Swal.fire({
                    icon: "error",
                    text: "Password must be at least 8 characters long and contain both letters and numbers",
                    draggable: true
                })
                return
            }
            if(updatePassword !== confirmPassword){
                Swal.fire({
                    icon: "error",
                    text: "Passwords do not match. Please try again.",
                    draggable: true
                })
                return
            }

            Swal.fire({
                title: "Updating password...",
                text: "Please wait",
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            })

        try{
            const res : any = await updateNewPassword(recoveryEmail, updatePassword)
            Swal.fire({
                icon: "success",
                text: res.message || "Password updated successfully!",
                draggable: true
            })
            handleCloseModal()

        }catch(error : any){
            console.error("Update password error:", error)
             Swal.fire({
                icon: "error",
                text: error.response?.data?.message || "Password update failed. Please try again.",
                draggable: true
            })
        }
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setOtpToken("")
        setVerified(false)
        setResetPW(false)
        setRecoveryEmail("")
        setEnteredOtp("")
        setUpdatePassword("")
        setConfirmPassword("")
    }

    return( 
        <section className="h-screen w-full sm:flex sm:flex-col lg:flex lg:flex-row flex flex-col items-center justify-center">
            <div className="h-[80%] w-[45%] bg-gray-100 lg:flex lg:items-center lg:justify-center lg:gap-4 lg:border rounded-l-lg lg:border-r-0 sm:hidden hidden">
                <div className="h-full flex flex-col items-center gap-4">
                    <div className="h-[50%] w-full">
                        <Spline scene="https://prod.spline.design/EWw6hIqN0oFvDjPP/scene.splinecode" />
                    </div>
                    <div className="h-[50%] flex flex-col gap-4 p-4">
                        <p className="font-bold text-3xl text-blue-500 text-center">Welcome Back to EduFlow LearnHub</p>
                        <p className="text-base font-bold text-center">Continue your personalized learning journey. Access your learning paths, smart e-library, and progress tracking.</p>
                        <p className="text-base font-bold text-center">Don't have an account? <a href="/register" className="text-blue-500 font-bold hover:underline">Register</a></p>
                    </div>
                </div>
            </div>
            <div className="h-[80%] lg:w-[45%] sm:w-[80%] w-[90%] flex flex-col items-center justify-center gap-7 border sm:rounded-lg rounded-lg lg:rounded-l-none lg:border-l-0">
                <div className="lg:text-start sm:text-center text-center">
                    <p className="lg:text-2xl font-bold sm:text-xl text-xl text-blue-500">Sign In to your account</p>
                    <p className="text-base">Enter your credentials to continue learning</p>
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-7">
                    <div className="relative w-[75%] flex flex-col justify-center">
                        <input type="email" name="email" id="email" placeholder=" " className="peer border-b w-full px-8 py-2 focus:outline-none" onChange={ (e) => setEmail(e.target.value) } />
                        <MdEmail className="absolute text-gray-500 text-xl pointer-events-none" />
                        <label htmlFor="email" className= {`absolute w-full px-8 py-2 peer-focus:-top-5 ${email ? "-top-5 text-sm text-blue-500" : ""} peer-placeholder-shown:text-base peer-focus:text-sm peer-focus:text-blue-500`}>email</label>
                    </div>
                     <div className="relative w-[75%] flex flex-col justify-center">
                        <input type={ showPassword ? "text" : "password"} name="password" id="password" placeholder=" " className="peer border-b w-full px-8 py-2 focus:outline-none" onChange={ (e) => setPassword(e.target.value) } />
                        <RiLockPasswordLine className="absolute text-gray-500 text-xl pointer-events-none" />
                        <label htmlFor="password" className= {`absolute w-full px-8 py-2 peer-focus:-top-5 ${password ? "-top-5 text-sm text-blue-500" : ""} peer-placeholder-shown:text-base peer-focus:text-blue-500 peer-focus:text-sm`}>password</label>
                        <button type="button" className="absolute right-2 text-gray-500 cursor-pointer" onClick={ () => setShowPassword(!showPassword)}>{showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                    </div>
                    <div className="w-[75%]">
                         <p>Forget password? <button className="text-blue-500 font-bold cursor-pointer hover:underline" onClick={() => setModalOpen(true)}>Click here</button></p>
                         {
                            modalOpen &&(  
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                                    <button className="absolute top-4 right-4 text-white text-4xl font-bold cursor-pointer"  onClick={handleCloseModal}>×</button>
                                    <div className={`bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg ${resetPW ? "hidden" : "block"}`}>
                                        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
                                        <input type="email" placeholder="Enter your email address" className="w-full border rounded-md p-2 mb-4" onChange={(e) => setRecoveryEmail(e.target.value)}/>
                                            <div className="w-full flex justify-center align-center">
                                                <button className="border w-[45%] p-1.5 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600" onClick={handleResetPassword}>Send OTP</button>
                                            </div>
                                    </div>
                                    <div className={`bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg ${resetPW && !verified ? "block" : "hidden"}`}>
                                        <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
                                        <input type="text" placeholder="Enter your OTP" className="w-full border rounded-md p-2 mb-4" onChange={(e) => setEnteredOtp(e.target.value)}/>
                                            <div className="w-full flex justify-center align-center">
                                                <button className="border w-[45%] p-1.5 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600" onClick={handleVerifyOtp}>Verify</button>
                                            </div>
                                    </div>
                                     <div className={`bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg ${resetPW && verified ? "block" : "hidden"}`}>
                                        <h2 className="text-xl font-bold mb-4">Update Your Password</h2>

                                        <div className="relative w-full flex flex-col justify-center mt-5">
                                            <input type={ showPassword ? "text" : "password"} name="updatePassword" id="updatePassword" placeholder=" " className="peer border-b w-full px-8 py-2 focus:outline-none" onChange={ (e) => setUpdatePassword(e.target.value) } />
                                            <RiLockPasswordLine className="absolute text-gray-500 text-xl pointer-events-none" />
                                            <label htmlFor="updatePassword" className= {`absolute w-full px-8 py-2 peer-focus:-top-5 ${updatePassword ? "-top-5 text-sm text-blue-500" : ""} peer-placeholder-shown:text-base peer-focus:text-blue-500 peer-focus:text-sm`}>New Password</label>
                                            <button type="button" className="absolute right-2 text-gray-500 cursor-pointer" onClick={ () => setShowPassword(!showPassword)}>{showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                                        </div>
                                        <div className="relative w-full flex flex-col justify-center mt-5">
                                            <input type={ showPassword ? "text" : "password"} name="confirmPassword" id="confirmPassword" placeholder=" " className="peer border-b w-full px-8 py-2 focus:outline-none" onChange={ (e) => setConfirmPassword(e.target.value) } />
                                            <RiLockPasswordLine className="absolute text-gray-500 text-xl pointer-events-none" />
                                            <label htmlFor="confirmPassword" className= {`absolute w-full px-8 py-2 peer-focus:-top-5 ${confirmPassword ? "-top-5 text-sm text-blue-500" : ""} peer-placeholder-shown:text-base peer-focus:text-blue-500 peer-focus:text-sm`}>Confirm New Password</label>
                                            <button type="button" className="absolute right-2 text-gray-500 cursor-pointer" onClick={ () => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                                        </div>
                                            <div className="relative w-full flex justify-center align-center mt-3">
                                                <button className="border w-[45%] p-1.5 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600" onClick={handleUpdatePassword}>Update</button>
                                            </div>
                                    </div>
                                </div>
                            )   
                         }
                    </div>
                    <button className="bg-blue-500 font-bold hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-[75%] cursor-pointer" onClick={handleLogin}>Sign In</button>
                    <p>or continue with</p>
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        containerProps={{ className: "w-[75%]" }}
                    />
                </div>
            </div>
        </section>

    )
}