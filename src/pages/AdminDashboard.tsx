import Swal from "sweetalert2"
import DashboardDateTime from "../components/DateTime"
import { useAuth } from "../context/AuthContext"
import { FaBook, FaCloudUploadAlt, FaFileAlt, FaFilePdf, FaUsers } from "react-icons/fa"
import { useEffect, useRef, useState } from "react"
import { getAllUsers,registerAdminUser } from "../services/auth"
import { getAllLearningPaths } from "../services/learningpath"
import { getAllEbooks, uploadEbookFile, deleteEcontent } from "../services/econtent"
import { saveAs } from "file-saver"
import AdminHeader from "../components/AdminHeader"
import { MdEmail } from "react-icons/md"
import { RiLockPasswordLine } from "react-icons/ri"
import { AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai"


export default function AdminDashboard(){
    const { user } = useAuth()
    const [users , setUsers] = useState<any[]>([])
    const [learningPaths , setLearningPaths] = useState<number>(0)
    const [ebookTitle , setEbookTitle] = useState<string>("")
    const [author , setAuthor] = useState<string>("")
    const [category , setCategory] = useState<string>("")
    const [description , setDescription] = useState<string>("")
    const [ebookFile , setEbookFile] = useState<File | null>(null)
    const [ebooks , setEbooks] = useState<any[]>([])
    const categories = ["Programming", "Design", "Business", "Science", "Art", "History", "Mathematics", "Literature"]
    const elibraryRef =  useRef<HTMLDivElement | null>(null)
    const [height, setHeight] = useState<number | null>(null)
    const [userSearch,setUserSearch] = useState("")
    const [isTrueUser,setIsTrueUser] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const dashboardRef = useRef<HTMLDivElement>(null)
    const libraryRef = useRef<HTMLDivElement>(null)
    const usersRef = useRef<HTMLDivElement>(null)


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/

    const validatePassword = (password: string) => {
        return passwordRegex.test(password)
    }

    const validateEmail = (email: string) => {
        return emailRegex.test(email)
    }

    const scrollTo = (ref: React.RefObject<HTMLDivElement  | null>) => {
        ref.current?.scrollIntoView({ behavior: "smooth" })
    }


    interface User {
        _id: string
        email: string
        role: string[]
        registeredDate: string
    }
    const [userDetails, setUserDetails] = useState<User | null>(null)
    

    useEffect(() => {
        fetchAllUsers()
        fetchAllLearningPaths()
        fetchAllEbooks()
    }, [])

    useEffect(() => {
        if (elibraryRef.current) {
            setHeight(elibraryRef.current.clientHeight)
        }
    }, [elibraryRef])

    const fetchAllUsers = async () => {
        try {
            const res = await getAllUsers()
            setUsers(res.data)
            console.log("All Users:", res.data)
        } catch (error) {
            console.error("Failed to fetch users:", error)
        }
    }

    const fetchAllLearningPaths = async () => {
        try {
            const res = await getAllLearningPaths()
            setLearningPaths(res.learningPaths)
            console.log("All Genarated Learning Paths:", res.learningPaths)
        } catch (error) {
            console.error("Failed to fetch generated learning paths:", error)
        }
    }

    const handleEbookUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        console.log("Uploading ebook:", { ebookTitle, author, category, description, ebookFile })

        try{
            if (!ebookFile) {
                Swal.fire({
                    icon: "warning",
                    text: "Please select a file before uploading",
                    draggable: true
                })
                return
            }

        
            const formData = new FormData()
            formData.append('title', ebookTitle)
            formData.append('author', author)
            formData.append('category', category)
            formData.append('description', description)
            formData.append('file', ebookFile)
            formData.append('uploadedBy', user?.id || "")

           console.log("Form Data prepared for upload:", formData)
            
            const res = await uploadEbookFile(formData)
            console.log("Ebook uploaded successfully:", res)
            Swal.fire({
                icon: "success",
                text: "Ebook uploaded successfully",
                draggable: true
            })
            setEbooks(prev => [...prev,res.ebook])
        }catch (error: any) {
            Swal.fire({
                icon: "error",
                text: "Failed to upload ebook. Please try again" + error,
                draggable: true
            })
        }
        
    }

    const fetchAllEbooks = async () => {
        try {
            const res = await getAllEbooks()
            setEbooks(res.ebooks)
            console.log("All Ebooks:", res.ebooks)
        } catch (error) {
            console.error("Failed to fetch ebooks:", error)
        }
    }

    const PdfDownloadWithSaver = ({ secureUrl }: { secureUrl: string }) => {
        const handleDownload = () => {
            saveAs(secureUrl, 'ebook.pdf')
        }
        return (
            <button onClick={handleDownload} className="bg-green-600 px-4 py-1 rounded-lg text-white font-bold">
                Download PDF
            </button>
        )
    }

    const formatDateTime = (isoString: string) => {
        const date = new Date(isoString)

        return date.toLocaleString("en-LK", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
            timeZone: "Asia/Colombo",
        })
    }

    const normalUsers = users.filter(user => user.role.includes("USER") && !user.role.includes("ADMIN"))

    const admins = users.filter(user =>user.role.includes("ADMIN"))

    function setFindSearch (userSearch:string){
        if(userSearch === "" || !userSearch){
            Swal.fire({
                icon: "error",
                text: "Please enter valid email to find user.",
                draggable: true
            })
            return
        }
        const searchUser = users.find((user:User )=> user.email.includes(userSearch))
        if(!searchUser){
           Swal.fire({
                icon: "error",
                text: "Can't find user.",
                draggable: true
            })
            return 
        }
        setIsTrueUser(true)
        setUserDetails(searchUser)
        console.log(searchUser)
        
    }
    
    const deleteBook = async (ebookId:string) =>{
        try{
            const res = await deleteEcontent(ebookId)
             Swal.fire({
                icon: "success",
                text: res.message || "OTP verified successfully!",
                draggable: true
            })
            setEbooks(prev => prev.filter(book => book._id !== ebookId))
        }catch(error:any){
            console.error("Failed Ebook Delete:", error)

            Swal.fire({
                icon: "error",
                text: error.response?.data?.message || "Failed Ebook Delete!",
                draggable: true
            })
        }
    }

    const ebooksByCategory = ebooks.reduce((acc: any, ebook: any) => {
        if (!acc[ebook.category]) {
            acc[ebook.category] = []
        }
            acc[ebook.category].push(ebook)
            return acc
    }, {})

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
    

        try {
                const res: any = await registerAdminUser (email,password)
                console.log("Member Added Successfully:", res)
                Swal.fire({
                    icon: "success",
                    text: "Member added successfully!",
                    draggable: true
                })
                setUsers(prev=>[...prev,res.data])
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

    return(
        <div className="w-full flex flex-col bg-blue-50 min-h-screen">
            <AdminHeader onDashboard={() => scrollTo(dashboardRef)} onLibrary={() => scrollTo(libraryRef)} onUsers={() => scrollTo(usersRef)} />
            <main className="relative flex flex-col items-center w-full mt-[100px] mb-10 gap-7">
                <section className="w-[90%]" ref={dashboardRef}>
                    <p className="bg-linear-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent mt-4 lg:text-4xl sm:text-3xl text-sm font-bold">Welcome back,<span className="pl-2">{user?.email}</span> </p>
                    <div className="bg-white lg:w-[45%] sm:[70%] w-full flex items-center justify-center py-4 mt-6 rounded-lg shadow-lg">
                        <DashboardDateTime />
                    </div>
                </section>

                <section className="grid lg:grid-cols-3 sm:grid-cols-1 grid-cols-1 gap-6 w-[90%]">
                    <div className="bg-white pl-5 pr-5 pt-10 pb-10 rounded-lg shadow-md border-t-5 border-blue-500 hover:shadow-lg hover:transform-3d hover:scale-105 transition-all duration-300">
                        <div className="flex gap-7 pl-12">
                            <div className="flex items-center bg-blue-100 p-3 rounded-lg">
                                <FaUsers className="text-5xl text-blue-500"/>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-purple-800">{users.length || 0}</p>
                                <p className="lg:text-xl sm:text-xl text-base text-gray-600">Total Users</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white pl-5 pr-5 pt-10 pb-10 rounded-lg shadow-md border-t-5 border-blue-500 hover:shadow-lg hover:transform-3d hover:scale-105 transition-all duration-300">
                        <div className="flex gap-7 pl-12">
                            <div className="flex items-center bg-blue-100 p-3 rounded-lg">
                               <FaFileAlt className="text-5xl text-blue-500"/>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-purple-800">{learningPaths}</p>
                                <p className="lg:text-xl sm:text-xl text-base text-gray-600">Total Genarated</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white pl-5 pr-5 pt-10 pb-10 rounded-lg shadow-md border-t-5 border-blue-500 hover:shadow-lg hover:transform-3d hover:scale-105 transition-all duration-300">
                        <div className="flex gap-7 pl-12">
                            <div className="flex items-center bg-blue-100 p-3 rounded-lg">
                               <FaBook className="text-5xl text-blue-500" />
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-purple-800">{ebooks.length}</p>
                                <p className="lg:text-xl sm:text-xl text-base text-gray-600">Ebook Count</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-[90%] bg-white p-5 rounded-lg shadow-md" ref={libraryRef}>
                    <div className="flex justify-between">
                        <p className="lg:text-2xl sm:text-xl text-base font-bold">E-Library Management</p>
                    </div>
                    <div ref={elibraryRef} className={`w-full flex lg:flex-row sm:flex-col flex-col gap-6 mt-6 mb-6 justify-center items-center`}>
                        <div className="mt-4 lg:w-[60%] sm:w-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm items-center">
                            <div className="flex w-full gap-4">
                                <FaCloudUploadAlt className="text-3xl text-blue-600"/>
                                <p className="lg:text-xl sm:text-lg text-base font-bold text-blue-700"> Upload Ebook</p>
                            </div>
                            <div className="w-[90%] border-2 border-dashed border-blue-600 lg:h-[20vh] sm:[20vh] h-[7vh] rounded-lg text-center flex justify-center items-center relative bg-blue-50" 
                            onDrop={(e) => {
                                e.preventDefault()
                                if(e.dataTransfer.files && e.dataTransfer.files.length > 0){
                                    setEbookFile(e.dataTransfer.files[0])
                                    console.log("file fetched:",e.dataTransfer.files[0])
                                    
                                }
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            >
                                <div className="absolute w-full h-full lg:flex lg:gap-4 gap-1 lg:text-base sm:text-base text-sm text-center items-center justify-center lg:flex-row flex flex-col">
                                    <FaBook />
                                    <p className="text-center text-gray-500 ">{ebookFile ? ebookFile.name : "Click or Drag & Drop to upload ebook"}</p>
                                </div>
                                
                                <input type="file" className="w-full h-full opacity-0 cursor-pointer text-black" onChange={(e) => {
                                    if(e.target.files && e.target.files.length > 0){
                                        setEbookFile(e.target.files[0])
                                        console.log("file fetched:",e.target.files[0])
                                    }
                                }} />
                            </div>
                            <div className="w-full flex flex-col gap-2 items-center">
                                <input type="text" placeholder="Ebook title" className="w-[90%] border rounded-lg p-2" onChange={(e) => setEbookTitle(e.target.value)} />
                                <input type="text" placeholder="Author" className="w-[90%] border rounded-lg p-2" onChange={(e) => setAuthor(e.target.value)} />
                                <select className="w-[90%] border rounded-lg p-2 overflow-scroll" onChange={(e) => setCategory(e.target.value)} >
                                    <option value="" className="text-gray-400">-Select Category-</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <textarea placeholder="Description" className="w-[90%] border rounded-lg p-2 resize-none" rows={3} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <button className="w-[40%] bg-blue-700 pt-2 pb-2 rounded-lg text-white font-bold" onClick={handleEbookUpload}>Upload</button>
                        </div>
                        <div className="mt-4 lg:w-[40%] sm:w-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm"  style={{ height: height ? `${height}px` : 'auto' }}>
                            <p className="lg:text-xl sm:text-lg text-base font-bold text-blue-700">Recently Uploaded</p>
                            <div className="h-full overflow-y-auto flex flex-col gap-4">
                                {ebooks.slice(-5).reverse().map((ebook, index) => (
                                    <div key={index} className="shadow-sm rounded-lg p-4 bg-gray-100">
                                       <div className="flex items-center gap-2 mb-2 bg-white py-4 px-5 rounded-lg">
                                            <FaFilePdf className="text-red-600 text-2xl" />
                                            <span className="font-semibold">{ebook.title}</span>
                                        </div>
                                        <div className="mb-2">
                                            <p className="text-sm text-gray-600">Description: {ebook.description}</p>
                                        </div>
                                        <p className="text-sm text-gray-600">Author: {ebook.author} <span className="text-gray-600 ml-4">Category: {ebook.category}</span></p>
                                        <div className="flex gap-4 mt-2">
                                            <button className="bg-red-600 px-4 py-1 rounded-lg text-white font-bold" onClick={()=>deleteBook(ebook._id)}>Delete</button>
                                            <PdfDownloadWithSaver secureUrl={ebook.fileUrl} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-[90%] bg-white p-5 rounded-lg shadow-md">
                    <div>
                        <p className="lg:text-xl sm:text-lg text-base font-bold text-blue-700 mb-10">E-Books</p>
                    </div>
                   {
                        ebooks.length > 0 ? (
                            <div className="w-full flex flex-col gap-7">
                                {
                                    Object.entries(ebooksByCategory).map(([category, books]) => {
                                    return(    
                                        
                                        <div key={category} className="w-full gap-7 bg-gray-50 p-7 rounded-lg shadow-md">
                                             <p className="mb-10 lg:text-xl sm:text-lg text-base font-bold text-blue-700">{category}</p>
                                            <div className="grid lg:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-7">    
                                            {
                                                (books as any[]).slice().reverse().map((ebook)=>(
                                                    
                                                    <div key={ebook._id} className="shadow-sm rounded-lg p-4 bg-gray-200 mb-10">
                                                        <div className="flex items-center gap-2 mb-2 bg-white py-4 px-5 rounded-lg">
                                                            <FaFilePdf className="text-red-600 text-2xl" />
                                                            <span className="font-semibold">{ebook.title}</span>
                                                        </div>
                                                        <div className="mb-2">
                                                        <p className="text-sm text-gray-600">Description: {ebook.description}</p>
                                                        </div>
                                                        <p className="text-sm text-gray-600">Author: {ebook.author} <span className="text-gray-600 ml-4">Category: {ebook.category}</span></p>
                                                        <div className="flex gap-4 mt-2">
                                                            <button className="bg-red-600 px-4 py-1 rounded-lg text-white font-bold" onClick={()=>deleteBook(ebook._id)}>Delete</button>
                                                            <PdfDownloadWithSaver secureUrl={ebook.fileUrl} />
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            </div>
                                           
                                        </div>
                                    )
                                    
                                    })
                                }
                            
                            </div>
                        ):(
                            <p>No ebooks to show</p>
                        )
                    
                   }
                </section>
                <section className="w-[90%]  bg-white p-5 rounded-lg shadow-md" ref={usersRef}>
                    <div className="w-full flex lg:flex-row lg:justify-between sm:flex-col flex-col sm:gap-4 gap-3">
                        <p className="lg:text-xl sm:text-lg text-base font-bold text-blue-700">Manage Users</p>
                        <div className="flex justify-between gap-3">
                            <input type="text" placeholder="🔍 Enter email for search user..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="lg:w-full px-12 py-3 rounded-xl border border-gray-300  focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-700 relative" />
                            <button className="bg-gray-100 px-2 rounded-xl" onClick={()=> setFindSearch(userSearch)}>🔍</button>
                        </div>
                        
                    </div>  

                    <div className={`mt-4 ${isTrueUser ? "hidden" : "block"}`}>
                        <p className="text-lg font-bold text-red-600 mb-2">Admins</p>
                        <div className="overflow-y-auto max-h-[50vh]">
                            {admins.length === 0 && (
                                <p className="text-sm text-gray-500">No admins found</p>
                            )}
                            {admins.map((userItem, index) => (

                                <div key={index} className="shadow-sm rounded-lg p-4 bg-gray-100 mb-2">
                                    <p className="font-bold">User Email: {userItem.email}</p>
                                    <p className="text-sm text-gray-600">User ID: {userItem._id}</p>
                                    <p className="text-sm text-gray-600">Role: {userItem.role}</p>
                                    <p className="text-sm text-gray-600">Registered At:{formatDateTime(userItem.registeredDate)} </p>
                                    <button className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={`mt-4 ${isTrueUser ? "hidden" : "block"}`}>
                        <p className="text-lg font-bold text-blue-600 mb-2">Users</p>
                        <div className="overflow-y-auto max-h-[50vh]">
                            {normalUsers.length === 0 && (
                                <p className="text-sm text-gray-500">No users found</p>
                            )}
                            {normalUsers.map((userItem, index) => (
                                <div key={index} className="shadow-sm rounded-lg p-4 bg-gray-100 mb-2">
                                    <p className="font-bold">User Email: {userItem.email}</p>
                                    <p className="text-sm text-gray-600">User ID: {userItem._id}</p>
                                    <p className="text-sm text-gray-600">Role: {userItem.role}</p>
                                    <p className="text-sm text-gray-600">Registered At:{formatDateTime(userItem.registeredDate)} </p>
                                    <button className="mt-3 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">Remove</button>
                                </div>
                            
                            ))}
                        </div>
                    </div>
                    {
                        isTrueUser && userDetails && (
                            <div className="shadow-sm rounded-lg p-4 bg-gray-100 mb-2 mt-5">
                                <p className="font-bold">User Email: {userDetails.email}</p>
                                <p className="text-sm text-gray-600">User ID: {userDetails._id}</p>
                                <p className="text-sm text-gray-600">Role: {userDetails.role.join(", ")}</p>
                                <p className="text-sm text-gray-600">Registered At: {formatDateTime(userDetails.registeredDate)}</p>

                                <button onClick={() => setIsTrueUser(false)} className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
                                    Close
                                </button>
                            </div>
                        )
                    }
                </section>
                <section className="w-[90%]  bg-white p-5 rounded-lg shadow-md">
                    <p className="lg:text-xl sm:text-lg text-base font-bold text-blue-700">Add Member</p>
                    <div className="bg-gray-50 w-full flex flex-col items-center justify-center gap-7 mt-10 p-7">
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
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-[75%]" onClick={ handleRegister }>Add Member</button>
                    </div>
                </section>
            </main>
        </div>

    )
}