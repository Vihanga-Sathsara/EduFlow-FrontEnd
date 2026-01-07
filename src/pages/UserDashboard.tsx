import Swal from "sweetalert2"
import DashboardDateTime from "../components/DateTime"
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext"
import { getLearningPathProgress, getLearningPaths } from "../services/learningpath"
import { useEffect, useState } from "react"
import LearningPathCard from "../components/LearningPathCard"
import LearningPathViewer from "../components/LearningPathViewer"
import { FaBook, FaCheckCircle, FaSpinner, FaFilePdf } from "react-icons/fa"
import {getAllEbooks} from "../services/econtent"
import { saveAs } from "file-saver"


export default function UserDashboard(){
    const { user } = useAuth()
    const [learnDetail , setLearnDetail] = useState<any>(null)
    const [cardSeeAll , setCardSeeAll] = useState(false)
    const [selectedPath, setSelectedPath] = useState<any>(null)
    const [showOverview, setShowOverview] = useState(false)
    const [completeWeek, setCompleteWeek] = useState<number[]>([])
    const [ebooks , setEbooks] = useState<any[]>([])
    const userId = user ? user.id : null
    const [bookSeeAll , setBookSeeAll] = useState(false)

    useEffect( () => {
        if (!user?.id) return
        learningPathsDetails(userId)
        allEbooks()
    }, [userId] )

    useEffect(() => {
        if (!selectedPath) return
        completedWeek()
    }, [selectedPath])
    
    

    const learningPathsDetails = async(userId : string) => {

        try{
             const res = await getLearningPaths(userId)
             setLearnDetail(res)
             console.log("Learning Paths:", res)
             return res
        }catch(error : any){
            console.error("Error fetching learning paths:", error)
            Swal.fire({
                icon: "error",
                text: "Failed to fetch learning paths. Please try again.",
                draggable: true
            })
        }  
    }

    const completedWeek = async() => {
        try{
            const res = await getLearningPathProgress(selectedPath.userId, selectedPath._id)
            setCompleteWeek(res.progress)
            console.log("Learning Path Progress:", res)
    
        }catch(error : any){
            console.error("Error fetching completed weeks:", error)
        }
    }

    const allEbooks = async() =>{
       try{
            const res = await getAllEbooks()
            setEbooks(res.ebooks)
            console.log(res.ebooks)
       }catch(error){
            console.log(error)
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

    const groupedEbooks = Array.isArray(ebooks) ? ebooks.reduce((acc: any, ebook: any) => {
        const category = ebook.category || "Others"
        if (!acc[category]) {
            acc[category] = []
        }
        acc[category].push(ebook)
        return acc
    }, {}): {}

    const completedCount = learnDetail ? learnDetail.learningPaths.filter((path: any) => path.status === true).length : 0
    const inProgressCount = learnDetail ? learnDetail.learningPaths.filter((path: any) => path.status === false).length : 0
    return(
        <div className="w-full flex flex-col bg-blue-50 min-h-screen">
            <Header />
            <main className="relative flex flex-col items-center w-full mt-[100px] mb-10 gap-7">
                <section className="w-[90%]">
                    <p className="text-black lg:text-4xl sm:text-3xl text-sm font-bold">Welcome back,<span className="pl-2">{user?.email}</span> </p>
                    <p className="text-gray-600 lg:text-2xl sm:text-xl text-[12px] lg:pt-2 sm:pt-2 pt-1 mb-2">Continue your learning journey with personalized recommendations</p>
                    <div className="bg-white lg:w-[45%] sm:[70%] w-full flex items-center justify-center p-4 mt-6 rounded-lg shadow-lg">
                         <DashboardDateTime />
                    </div>
                </section>
                <section className="grid lg:grid-cols-3 sm:grid-cols-1 grid-cols-1 gap-6 w-[90%]">
                    <div className="bg-white pl-5 pr-5 pt-10 pb-10 rounded-lg shadow-md border-t-5 border-blue-500 hover:shadow-lg hover:transform-3d hover:scale-105 transition-all duration-300">
                        <div className="flex gap-7 pl-12">
                            <div className="flex items-center bg-blue-100 p-3 rounded-lg">
                                <FaBook className="text-5xl text-blue-500"/>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-purple-800">{learnDetail ? learnDetail.learningPaths.length : 0}</p>
                                <p className="lg:text-xl sm:text-xl text-base text-gray-600">Learning Paths</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white pl-5 pr-5 pt-10 pb-10 rounded-lg shadow-md border-t-5 border-blue-500 hover:shadow-lg hover:transform-3d hover:scale-105 transition-all duration-300">
                        <div className="flex gap-7 pl-12">
                            <div className="flex items-center bg-blue-100 p-3 rounded-lg">
                                <FaCheckCircle className="text-5xl text-blue-500"/>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-purple-800">{completedCount}</p>
                                <p className="lg:text-xl sm:text-xl text-base text-gray-600">Completed</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white pl-5 pr-5 pt-10 pb-10 rounded-lg shadow-md border-t-5 border-blue-500 hover:shadow-lg hover:transform-3d hover:scale-105 transition-all duration-300">
                        <div className="flex gap-7 pl-12">
                            <div className="flex items-center bg-blue-100 p-3 rounded-lg">
                                <FaSpinner className="text-5xl text-blue-500 animate-spin"  style={{ animationDuration: "2s" }}/>
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-purple-800">{inProgressCount}</p>
                                <p className="lg:text-xl sm:text-xl text-base text-gray-600">In Progress</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-[90%] flex lg:flex-row sm:flex-col flex-col gap-6 mt-6 mb-6 justify-center items-center">
                    <div className={`${cardSeeAll ? "lg:w-full" : "lg:w-[55%]"} ${bookSeeAll ? "lg:hidden" : "lg:w-[55%]"} sm:w-full w-full bg-white p-5 rounded-lg shadow-md`}>
                        <div className="flex justify-between mb-5">
                            <p className="lg:text-2xl font-bold">Personalized Learning Path</p>
                            <p className="text-blue-500" onClick={() => setCardSeeAll(!cardSeeAll)}>{cardSeeAll ? "View Less" : "View All"}</p>
                        </div>
                        <div>
                            {
                                Array.isArray(learnDetail?.learningPaths) ? <LearningPathCard learnDetail={learnDetail} cardSeeAll={cardSeeAll} setSelectedPath={setSelectedPath} setShowOverview={setShowOverview} /> : <p>Loading learning paths...</p>
                            }
                            {
                                selectedPath && showOverview && ( 
                                <LearningPathViewer selectPath={selectedPath} showOverview={setShowOverview} completeWeek={completeWeek} />)
                            }
                        </div>
                    </div>
                    <div className={`${cardSeeAll ? "lg:hidden" : "lg:w-[45%]"} ${bookSeeAll ? "lg:w-full" : "lg:w-[45%]"} sm:w-full w-full bg-white p-5 rounded-lg shadow-md`}>
                        <div className="flex justify-between">
                            <p>Smart E-Library</p>
                            <p className="text-blue-500" onClick={() => setBookSeeAll(!bookSeeAll)}>{bookSeeAll ? "View Less" : "browse All"}</p>  
                        </div>
                        <div>
                            {
                                Array.isArray(ebooks) ? (
                                <div className={`${bookSeeAll ? "grid lg:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-4" : "flex flex-col gap-4"}`}>
                                    {
                                        Object.keys(groupedEbooks).map((category) => {
                                            const visibleEbooks = bookSeeAll ? groupedEbooks[category] : groupedEbooks[category].slice(0, 2)

                                            return (
                                                <div key={category} className="flex flex-col gap-4">

                                                  
                                                    <p className="text-xl font-bold text-blue-700">
                                                    {category}
                                                    </p>

                                                    
                                                    {visibleEbooks.map((ebook:any, index:number) => (
                                                    <div
                                                        key={index}
                                                        className="shadow-sm rounded-lg p-4 bg-gray-100"
                                                    >
                                                        <div className="flex items-center gap-2 mb-2 bg-white py-4 px-5 rounded-lg">
                                                        <FaFilePdf className="text-red-600 text-2xl" />
                                                        <span className="font-semibold">{ebook.title}</span>
                                                        </div>

                                                        <p className="text-sm text-gray-600 mb-2">
                                                        {ebook.description}
                                                        </p>

                                                        <p className="text-sm text-gray-600">
                                                        by {ebook.author}
                                                        <span className="ml-4 text-gray-500">
                                                            category: {ebook.category}
                                                        </span>
                                                        </p>

                                                        <div className="flex gap-4 mt-2">
                                                        <PdfDownloadWithSaver secureUrl={ebook.fileUrl} />
                                                        </div>
                                                    </div>
                                                    ))}

                                                    {!bookSeeAll && groupedEbooks[category].length > 2 && (
                                                    <p className="text-sm text-blue-600 cursor-pointer hover:underline">
                                                        + {groupedEbooks[category].length - 2} more ebooks
                                                    </p>
                                                    )}

                                                </div>
                                            )}
                                        )}
                                    
                                </div>) : (
                                    <FaSpinner className="text-5xl text-blue-500 animate-spin" style={{ animationDuration: "2s" }}/>
                                )
                            }
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}