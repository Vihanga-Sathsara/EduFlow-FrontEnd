import { Link } from "react-router-dom"
import { useState } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { RiLockPasswordLine } from "react-icons/ri"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import Swal from "sweetalert2"
import { updateProfile } from "../services/auth"


export default function IndexHeader(){
    const {user} = useAuth()
    const [clickProfile , setClickProfile] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)



    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"]
    const profileLetter = user?.email ? user.email.charAt(0).toUpperCase() : ""
    const profileColor  = user?.email ? colors[user.email.charCodeAt(0) % colors.length] : "bg-gray-500"

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/

    const validatePassword = (password: string) => {
        return passwordRegex.test(password)
    }


    const logout = () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
    }

    const updateProfileDetails = async (e:  React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if(!currentPassword || !newPassword || !confirmNewPassword){
             Swal.fire({
                icon: "error",
                text: "Please fill in all fields",
                draggable: true
            })
            return
        }

        if(!validatePassword(newPassword)){
             Swal.fire({
                icon: "error",
                text: "Password must contain uppercase, lowercase, number and special character",
                draggable: true
            })
            return
        }

        if(newPassword !== confirmNewPassword){
             Swal.fire({
                icon: "error",
                text: "Passwords do not match!",
                draggable: true
            })
            return
        }

        try{
            setUpdateLoading(true)
            const res = await updateProfile(user.email, currentPassword, newPassword)
            console.log("Password Update SuccessFully:", res);
            Swal.fire({
                icon: "success",
                text: "Password Updated SuccessFully.",
                draggable: true
            })
            setCurrentPassword("")
            setNewPassword("")
            setConfirmNewPassword("")
            setClickProfile(false)
            logout()
        }catch(error : any){
            console.error("Password Update Not SuccessFully:", error);
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
                        text: "Password Update Not SuccessFully. Please try again.",
                        draggable: true
                    })
                    return
                }
        }finally{
            setUpdateLoading(false)
        }
    }
   
   
   
    return (
        <div className="w-full flex flex-col items-center relative">
            <header className="inline-flex justify-between w-full h-[70px] items-center lg:pl-17 lg:pr-17 sm:pl-17 sm:pr-17 pl-7 pr-7 bg-gray-100 fixed z-10 top-0">
                <div>
                    <p className="lg:text-2xl sm:text-xl text-base font-bold text-[#4E6BFF]">EduFlow LearnHub</p>
                </div>
                <div className="space-x-4 text-lg sm:hidden lg:flex hidden">
                    <Link to="/user-dashboard">Dashboard</Link>
                    <Link to="/learning-path">Learning Path</Link>
                    <Link to="#">E-Library</Link>
                    <Link to="#">FAQ</Link>
                </div>
                <div className="space-x-4 text-lg flex items-center">
                     <div className={`rounded-full w-[50px] h-[50px] cursor-pointer ${profileColor} items-center justify-center lg:flex sm:flex hidden`}>
                        <p>{profileLetter}</p>
                     </div>
                     <button onClick={() => setShowDropdown(!showDropdown)}>{showDropdown ? <FaChevronUp /> : <FaChevronDown />}</button>
                </div>
            </header>

            {showDropdown && (
                <div className="fixed top-[70px] right-10 bg-white border border-gray-300 rounded-md shadow-md w-48 z-20">
                    <ul>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"><Link to="/user-dashboard">Dashboard</Link></li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"> <Link to="/learning-path">Learning Path</Link></li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"><Link to="#">E-Library</Link></li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"> <Link to="#">FAQ</Link></li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setClickProfile(!clickProfile)}>Profile</li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={logout}>Logout</li>
                    </ul>
                </div> 
            )}   
            {
                clickProfile && (
                    <div className="fixed lg:top-[100px] sm:top-[100px] top-[170px] lg:right-60 sm:right-60 right-10 bg-white border border-gray-300 rounded-md shadow-md lg:w-100 sm:w-100 w-70 z-30 p-5">
                        <h2 className="text-xl font-bold mb-4">Update Your Password</h2>

                        <div className="relative w-full flex flex-col justify-center mt-5">
                                <input type={ showCurrentPassword ? "text" : "password"} name="currentPassword" id="currentPassword" placeholder=" " className="peer border-b w-full px-8 py-2 focus:outline-none" onChange={ (e) => setCurrentPassword(e.target.value) } />
                                <RiLockPasswordLine className="absolute text-gray-500 text-xl pointer-events-none" />
                                <label htmlFor="currentPassword" className= {`absolute w-full px-8 py-2 peer-focus:-top-5 ${currentPassword ? "-top-5 text-sm text-blue-500" : ""} peer-placeholder-shown:text-base peer-focus:text-blue-500 peer-focus:text-sm`}>Current Password</label>
                                <button type="button" className="absolute right-2 text-gray-500 cursor-pointer" onClick={ () => setShowCurrentPassword(!showCurrentPassword)}>{showCurrentPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                            </div>
                        
                            <div className="relative w-full flex flex-col justify-center mt-5">
                                <input type={ showPassword ? "text" : "password"} name="newPassword" id="newPassword" placeholder=" " className="peer border-b w-full px-8 py-2 focus:outline-none" onChange={ (e) => setNewPassword(e.target.value) } />
                                <RiLockPasswordLine className="absolute text-gray-500 text-xl pointer-events-none" />
                                <label htmlFor="newPassword" className= {`absolute w-full px-8 py-2 peer-focus:-top-5 ${newPassword ? "-top-5 text-sm text-blue-500" : ""} peer-placeholder-shown:text-base peer-focus:text-blue-500 peer-focus:text-sm`}>New Password</label>
                                <button type="button" className="absolute right-2 text-gray-500 cursor-pointer" onClick={ () => setShowPassword(!showPassword)}>{showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                            </div>
                            <div className="relative w-full flex flex-col justify-center mt-5">
                                <input type={ showConfirmPassword ? "text" : "password"} name="confirmNewPassword" id="confirmNewPassword" placeholder=" " className="peer border-b w-full px-8 py-2 focus:outline-none" onChange={ (e) => setConfirmNewPassword(e.target.value) } />
                                <RiLockPasswordLine className="absolute text-gray-500 text-xl pointer-events-none" />
                                <label htmlFor="confirmNewPassword" className= {`absolute w-full px-8 py-2 peer-focus:-top-5 ${confirmNewPassword ? "-top-5 text-sm text-blue-500" : ""} peer-placeholder-shown:text-base peer-focus:text-blue-500 peer-focus:text-sm`}>Confirm New Password</label>
                                <button type="button" className="absolute right-2 text-gray-500 cursor-pointer" onClick={ () => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}</button>
                            </div>
                            <div className="relative w-full flex justify-center align-center mt-3">
                                <button className="border w-[45%] p-1.5 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 disabled:opacity-50" disabled={updateLoading}  onClick={updateProfileDetails}>{updateLoading ? "Updating..." : "Update"}</button>
                            </div>
                    </div>
                )
            }
        </div>

    )
}