import Swal from "sweetalert2"
import DashboardDateTime from "../components/DateTime"
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext"
import { getLearningPathProgress, getLearningPaths } from "../services/learningpath"
import { useEffect, useState } from "react"
import LearningPathCard from "../components/LearningPathCard"
import LearningPathViewer from "../components/LearningPathViewer"
import { FaBook, FaCheckCircle, FaSpinner } from "react-icons/fa"


export default function UserDashboard(){
    const { user } = useAuth()
    const [learnDetail , setLearnDetail] = useState<any>(null)
    const [cardSeeAll , setCardSeeAll] = useState(false)
    const [selectedPath, setSelectedPath] = useState<any>(null)
    const [showOverview, setShowOverview] = useState(false)
    const [completeWeek, setCompleteWeek] = useState<number[]>([])
    const userId = user ? user.id : null

    useEffect( () => {
        if (!user?.id) return
        learningPathsDetails(userId)
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
                    <div className={`${cardSeeAll ? "lg:w-full" : "lg:w-[55%]"} sm:w-full w-full bg-white p-5 rounded-lg shadow-md`}>
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
                     <div className={`sm:w-full ${cardSeeAll ? "hidden" : "block lg:w-[45%]"} w-full bg-white p-5 rounded-lg shadow-md`}>
                        <div className="flex justify-between">
                            <p>Smart E-Library</p>
                            <p className="text-blue-500"><a href="">Browse All</a></p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}