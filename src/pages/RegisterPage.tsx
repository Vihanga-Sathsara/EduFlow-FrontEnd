import Spline from "@splinetool/react-spline"
import { googleRegister, register } from "../services/auth"
import { useState } from "react"
import { MdEmail } from "react-icons/md"
import { RiLockPasswordLine } from "react-icons/ri"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import Swal from "sweetalert2"
import { GoogleLogin } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"


export default function Register(){

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isChecked, setIsChecked] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/

    const validatePassword = (password: string) => {
        return passwordRegex.test(password)
    }

    const validateEmail = (email: string) => {
        return emailRegex.test(email)
    }


    const handleRegister = async (e: React.FormEvent<HTMLButtonElement>) => {

        e.preventDefault()

         if ( !email || !password || !confirmPassword ) {
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

        if ( !validatePassword(password) ) {
            Swal.fire({
                icon: "error",
                text: "Password must contain uppercase, lowercase, number and special character",
                draggable: true
            })
            return
        }

          if (password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                text: "Passwords do not match!",
                draggable: true
            })
            return
        }
    
        if (!isChecked) {
            Swal.fire({
                icon: "error",
                text: "You must agree to the Terms and Conditions",
                draggable: true
            })
            return
        }

        try {
                const res: any = await register (email,password)
                console.log("Registration successful:", res)
                Swal.fire({
                    icon: "success",
                    text: "Registration successful!",
                    draggable: true
                })
                navigate("/login")
                
        } catch (error: any) {
                console.error("Registration error:", error);
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
                        text: "Registration failed. Please try again.",
                        draggable: true
                    })
                    return
                }
        }            
    }

    const handleGoogleRegister = async (credentialResponse: any) => {
        const decoded: any = jwtDecode(credentialResponse.credential)
        try{
            if(!decoded.email){
                Swal.fire({
                        icon: "error",
                        text: "Registration failed. Please try again.",
                        draggable: true
                })
                return
            }

           const res = await googleRegister(decoded.email)
            console.log("Google Registration successful:", res)
            Swal.fire({
                    icon: "success",
                    text: "Registration successful!",
                    draggable: true
            });

        }catch(error: any){
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
                    text: "Registration failed. Please try again.",
                    draggable: true
                    })
                return
            }
        }
    }
 
    return( 
        <section className="h-screen sm:flex sm:flex-col lg:flex lg:flex-row flex flex-col items-center justify-center">
            <div className="flex-col gap-4 w-[45%] items-center justify-center h-[80%] border rounded-l-lg border-r-0 bg-gray-100 lg:block sm:hidden hidden">
                <div className="h-[50%] w-full">
                    <Spline scene="https://prod.spline.design/EWw6hIqN0oFvDjPP/scene.splinecode" />
                </div>
                <div className="h-[50%] flex flex-col gap-4 p-4">
                    <p className="text-4xl font-bold text-blue-500 text-center">Start Your Learning Journey</p>
                    <div className="w-full flex flex-col items-center">
                         <p className="text-base font-bold text-center">Join thousands of learners who are achieving their goals faster with personalized learning paths and smart e-library access.</p>
                    </div>
                    <p className="text-base font-bold p-4">Already have an account? <a href="/login" className="text-blue-500 font-bold">Login</a></p>
                </div>
            </div>
            <div className="flex flex-col gap-7 lg:w-[45%] sm:w-[80%] w-[90%] items-center justify-center h-[80%] border sm:rounded-lg rounded-lg lg:rounded-l-none lg:border-l-0">
                <div className="lg:text-start sm:text-center text-center">
                    <p className="lg:text-2xl sm:text-xl text-xl font-bold text-blue-500">Create your account</p>
                    <p className="text-base">Join the future of personalized learning</p>
                </div>
                <div className="relative w-[75%] flex flex-col justify-center">
                    <input type="email" name="email" id="email" value={email} placeholder=" " onChange={(e) => setEmail(e.target.value)} className="peer border-b px-8 py-2 focus:outline-none"/>
                    <MdEmail className="absolute text-gray-500 text-xl pointer-events-none" />
                    <label htmlFor="email" className={`absolute px-8 py-2 peer-focus:-top-5 ${email ? "-top-5 text-sm text-blue-500" : ""} peer-placeholder-shown:text-base peer-focus:text-blue-500 peer-focus:text-sm`}>email</label>
                </div>

                <div className="relative w-[75%] flex flex-col justify-center">
                    <input type= {showPassword ? "text" : "password"} name="password" id="password" value={password} placeholder=" " onChange={(e) => setPassword(e.target.value)} className="peer border-b px-8 py-2 focus:outline-none" />
                    <RiLockPasswordLine className="absolute text-gray-500 text-xl pointer-events-none" />
                    <label htmlFor="password" className={`absolute px-8 py-2 peer-focus:-top-5 ${password ? "-top-5 text-sm text-blue-500" : ""} peer-placeholder-shown:text-base peer-focus:text-blue-500 peer-focus:text-sm`}>password</label>
                    <button type="button" className="absolute right-2 text-gray-500" onClick={() => setShowPassword(!showPassword)}>{ showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                </div>
                <div className="relative w-[75%] flex flex-col justify-center ">
                    <input type= {showConfirmPassword ? "text" : "password"} name="confirmPassword" id="confirmPassword" placeholder=" " onChange={(e) => setConfirmPassword(e.target.value)} className="peer border-b px-8 py-2 focus:outline-none" />
                    <RiLockPasswordLine className="absolute text-gray-500 text-xl pointer-events-none" />
                    <label htmlFor="confirmPassword" className={`absolute px-8 py-2 peer-focus:-top-5 ${confirmPassword ? "-top-5 text-sm text-blue-500" : ""} peer-placeholder-shown:text-base peer-focus:text-blue-500 peer-focus:text-sm`} >confirm password</label>
                    <button type="button" className="absolute right-2 text-gray-500" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{ showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                </div>
                <div className="relative flex flex-row items-center w-[75%]">
                    <input type="checkbox" className="lg:w-4 lg:h-4 sm:w-3 sm:h-3 w-3 h-3" onChange={(e) => setIsChecked(e.target.checked)} />
                    <label className="ml-2 lg:text-base sm:text-sm text-sm">I agree to the Terms and Conditions</label>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-[75%]" onClick={ handleRegister }>Register</button>
                <p>or continue with</p>
                <GoogleLogin
                    onSuccess={handleGoogleRegister}
                    containerProps={{ className: "w-[75%]" }}
                />    
            </div>
            
        </section>
    )
}