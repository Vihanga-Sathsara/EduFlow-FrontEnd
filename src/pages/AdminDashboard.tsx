import Swal from "sweetalert2"
import DashboardDateTime from "../components/DateTime"
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext"
import { FaBook, FaCloudUploadAlt, FaFileAlt, FaFilePdf, FaUsers } from "react-icons/fa"
import { useEffect, useState } from "react"
import { getAllUsers } from "../services/auth"
import { getAllLearningPaths } from "../services/learningpath"
import { getAllEbooks, uploadEbookFile } from "../services/econtent"
import { saveAs } from "file-saver"


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

    

    useEffect(() => {
        fetchAllUsers()
        fetchAllLearningPaths()
        fetchAllEbooks()
    }, [])

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



    return(
        <div className="w-full flex flex-col bg-blue-50 min-h-screen">
            <Header />
            <main className="relative flex flex-col items-center w-full mt-[100px] mb-10 gap-7">
                <section className="w-[90%]">
                    <p className="text-black lg:text-4xl sm:text-3xl text-sm font-bold">Welcome back,<span className="pl-2">{user?.email}</span> </p>
                    <div className="bg-white lg:w-[45%] sm:[70%] w-full flex items-center justify-center p-4 mt-6 rounded-lg shadow-lg">
                        <DashboardDateTime />
                    </div>
                </section>

                <section className="grid lg:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-6 w-[90%]">
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
                <section className="w-[90%]  bg-white p-5 rounded-lg shadow-md">
                    <div className="flex justify-between">
                            <p className="lg:text-2xl sm:text-xl text-base font-bold">E-Library Management</p>
                    </div>
                    <div className={`w-full flex lg:flex-row sm:flex-col flex-col gap-6 mt-6 mb-6 justify-center items-center`}>
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
                        <div className="mt-4 lg:w-[40%] sm:w-full w-full flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm h-full">
                            <p className="lg:text-xl sm:text-lg text-base font-bold text-blue-700">Recently Uploaded</p>
                            <div className="h-full overflow-y-auto max-h-[40vh]">
                                {ebooks.slice(0,5).map((ebook, index) => (
                                    
                                    <div key={index} className="shadow-sm rounded-lg p-4 bg-gray-100">
                                       <div className="flex items-center gap-2 mb-2">
                                            <FaFilePdf className="text-red-600 text-2xl" />
                                            <span className="font-semibold">{ebook.title}</span>
                                        </div>
                                        <div className="mb-2">
                                            <p className="text-sm text-gray-600">{ebook.description}</p>
                                        </div>
                                        <p className="text-sm text-gray-600">by {ebook.author} <span className="text-gray-600 ml-4">category: {ebook.category}</span></p>
                                        <div className="flex gap-4 mt-2">
                                            <button className="bg-red-600 px-4 py-1 rounded-lg text-white font-bold">Delete</button>
                                            <PdfDownloadWithSaver secureUrl={ebook.fileUrl} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-[90%]  bg-white p-5 rounded-lg shadow-md">
                 <p className="lg:text-2xl sm:text-xl text-base font-bold">Manage Users</p>
                    <div className="h-full overflow-y-auto max-h-[50vh] mt-4">
                        <p className="text-lg font-bold text-red-600 mb-2">Admins</p>
                            {admins.length === 0 && (
                            <p className="text-sm text-gray-500">No admins found</p>
                        )}
                        {admins.map((userItem, index) => (
                            <div key={index} className="shadow-sm rounded-lg p-4 bg-gray-100 mb-2">
                                <p className="font-bold">User Email: {userItem.email}</p>
                                <p className="text-sm text-gray-600">User ID: {userItem._id}</p>
                                <p className="text-sm text-gray-600">Role: {userItem.role}</p>
                                <p className="text-sm text-gray-600">Registered At:{formatDateTime(userItem.registeredDate)} </p>
                            </div>
                        ))}
                    </div>
                    <div className="h-full overflow-y-auto max-h-[50vh] mt-4">
                        <p className="text-lg font-bold text-blue-600 mb-2">Users</p>
                        {normalUsers.length === 0 && (
                            <p className="text-sm text-gray-500">No users found</p>
                        )}
                        {normalUsers.map((userItem, index) => (
                            <div key={index} className="shadow-sm rounded-lg p-4 bg-gray-100 mb-2">
                                <p className="font-bold">User Email: {userItem.email}</p>
                                <p className="text-sm text-gray-600">User ID: {userItem._id}</p>
                                <p className="text-sm text-gray-600">Role: {userItem.role}</p>
                                <p className="text-sm text-gray-600">Registered At:{formatDateTime(userItem.registeredDate)} </p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}