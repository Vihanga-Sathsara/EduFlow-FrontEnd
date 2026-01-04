import { useEffect, useRef, useState } from "react"
import { FaBars, FaBook, FaChevronDown, FaChevronUp, FaRegQuestionCircle, FaTimes } from "react-icons/fa"
import AnswersCard from "./AnswersCard";
import { generateAnswers, generateNote } from "../services/ai";
import Swal from "sweetalert2";
import { updateLearningDocument, updateLearningPathStatus } from "../services/learningpath";




interface LearningPathViewerProps {
  selectPath: any
  completeWeek: number[]
  showOverview: (show: boolean) => void
}


const LearningPathViewer = ({selectPath, completeWeek, showOverview}: LearningPathViewerProps)  => {
    const [showContent, setShowContent] = useState<number | null>(null)
    const [showStage , setShowStage] = useState<number | null>(null)
    const [showBurgerButton, setShowBurgerButton] = useState(false)
    const [answers , setAnswers] = useState<{ question: any, answer: any }[]>([])
    const [showAnswerModal, setShowAnswerModal] = useState(false)
    const [answerLoading, setAnswerLoading] = useState(false)
    const [completedWeeksArray, setCompletedWeeksArray] = useState<number[]>(completeWeek.map((w: any) => w.week))

    
    const overviewRef = useRef<HTMLDivElement>(null)
    const roadMapref = useRef<HTMLDivElement>(null)
    const milestonesRef = useRef<HTMLDivElement>(null)
    const projectsRef = useRef<HTMLDivElement>(null)
    const resourcesRef = useRef<HTMLDivElement>(null)
    const careerRef = useRef<HTMLDivElement>(null)
    const finalRef = useRef<HTMLDivElement>(null)

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    useEffect(() => {
        console.log("completeWeek received in viewer:", completeWeek)
        setCompletedWeeksArray(completeWeek.map((w: any) => w.week))
    }, [completeWeek])

     if (!selectPath) return null;
     console.log("Selected Learning Path:", selectPath,showOverview)

   
    const generateAiNote = async (subject: string, topics: string[]) => {
            try{
                const res = await generateNote(subject, topics)
                const url = URL.createObjectURL(res)
               
                window.open(url, "_blank")
                const a = document.createElement("a")
                a.href = url;
                a.download = `${subject}.pdf`
                document.body.appendChild(a)
                a.click();
                a.remove();
    
                URL.revokeObjectURL(url)
            }catch(error : any){
                console.error("Error generating notes:", error)
                 Swal.fire({
                    icon: "error",
                    text: error.response?.data?.message || "Something Went Wrong.Try Again",
                    draggable: true
                })
            }
        }
    
        const genarateAiAnswers = async (subject: string, questions: string[]) => {
            try{
                setAnswerLoading(true)
                const res = await generateAnswers(subject, questions)
                console.log("Generated Answers:", res)
                setAnswers(res.answersContent.answers)
                console.log("AI Answers set in state:", res.answersContent)
                setShowAnswerModal(true)
                Swal.fire({
                    icon: "success",
                    position: "top-end",
                    text: "Answers generated successfully.",
                    showConfirmButton: false,
                    timer: 1500,
                })
            }catch(error : any){
                console.error("Error generating answers:", error)
                 Swal.fire({
                    icon: "error",
                    text: error.response?.data?.message || "Something Went Wrong.Try Again",
                    draggable: true
                })
            }finally{
                setAnswerLoading(false)
            }
        }

        const updateStatus = async(week: number, status: boolean) => {
            try{

                const userId = selectPath.userId
                const res = await updateLearningPathStatus({ userId: userId, learningPathId: selectPath._id, week, status })

                

                if(completedWeeksArray.length === selectPath.data.weeklyRoadmap.length){
                    const res = await updateLearningDocument({ userId: userId, learningPathId: selectPath._id, status:true })
                    console.log("Learning Document Marked as Complete:", res)

                }

                console.log("Learning Path Status Updated:", res)
                if (status && !completedWeeksArray.includes(week)) {
                    setCompletedWeeksArray(prev => [...prev, week])
                }

                 Swal.fire({
                    icon: "success",
                    position: "top-end",
                    text: "Status updated successfully.",
                    showConfirmButton: false,
                    timer: 1500,
                })

            }catch(error : any){
                console.error("Error updating learning path status:", error)
                 Swal.fire({
                    icon: "error",
                    text: "Failed to update learning path status. Please try again.",
                    draggable: true
                })
            }
        }    

    return (
        
            <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center h-auto z-50 overflow-y-scroll">

                <div className="w-full flex lg:justify-end justify-center lg:pr-8 mb-3 text-white mt-4">
                     <button onClick={() => { showOverview(false); window.location.reload(); }} className="text-red-500 text-lg font-semibold"><FaTimes /></button>
                </div>
                
                <div className="w-full lg:w-[90%] sm:w-full flex flex-row h-[90vh] bg-blue-100 mb-7 lg:sticky top-20 rounded-l-2xl">

                    <div className="w-[20%] flex rounded-l-2xl pt-7 lg:block">
                        <p className="p-5 text-xl font-bold">Navigation</p>
                        <ol className="truncate p-2 space-y-2 text-center">
                            <li><button className="rounded bg-blue-50 w-[80%] p-3 text-start truncate" onClick={() => scrollToSection(overviewRef)}>Overview</button></li>
                            <li><button className="rounded bg-blue-50 w-[80%] p-3 text-start truncate" onClick={() => scrollToSection(milestonesRef)}>Milestoones</button></li>
                            <li><button className="rounded bg-blue-50 w-[80%] p-3 text-start truncate" onClick={() => scrollToSection(roadMapref)}>Weekly Roadmap</button></li>
                            <li><button className="rounded bg-blue-50 w-[80%] p-3 text-start truncate" onClick={() => scrollToSection(projectsRef)}>Projects</button></li>
                            <li><button className="rounded bg-blue-50 w-[80%] p-3 text-start truncate" onClick={() => scrollToSection(resourcesRef)}>Resources</button></li>
                            <li><button className="rounded bg-blue-50 w-[80%] p-3 text-start truncate" onClick={() => scrollToSection(careerRef)}>Career Roadmap</button></li>
                            <li><button className="rounded bg-blue-50 w-[80%] p-3 text-start truncate" onClick={() => scrollToSection(finalRef)}>Final Assesment</button></li>
                        </ol>
                        <p className="p-5 text-xl font-bold">Your Progress</p>
                        <div className="w-[80%] h-5 bg-gray-300 rounded-full mx-auto mt-2 text-center relative flex items-center">
                            <p className="text-xs flex text-center justify-center absolute p-5 font-bold">{Math.round((completedWeeksArray.length / selectPath.data.weeklyRoadmap.length) * 100)}%</p>
                            <div className={`bg-linear-to-r from-green-500 via-blue-600 to-purple-600 transition-all duration-500 h-5 rounded-full`} style={{ width: `${(completedWeeksArray.length / selectPath.data.weeklyRoadmap.length) * 100}%` }}>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-[80%] bg-white rounded-l-2xl p-5 overflow-y-scroll">
                        <div className="w-full">
                            <div className="flex items-center justify-between p-5">
                                <p className="text-xl font-bold">Learning Path Overview</p>
                                
                            </div>

                            <div className={`bg-green-300 h-[100px] w-full  ${showBurgerButton ? 'block' : 'hidden'}`}>
                                <p></p>
                            </div>
                                                        
                            <div ref={overviewRef} className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
                                <div className="bg-gray-100 p-5 rounded-lg border-l-4 border-l-blue-700">
                                    <p className="text-base">Total Duration</p>
                                    <p className="text-xl font-bold mt-3">{selectPath.data.totalDuration}</p>
                                </div>
                                <div className="bg-gray-100 p-5 rounded-lg lg border-l-4 border-l-blue-700">
                                    <p className="text-base">Daily Study</p>
                                    <p className="text-xl font-bold mt-3">{selectPath.data.recommendedDailyTime}</p>
                                </div>
                                <div className="bg-gray-100 p-5 rounded-lg lg border-l-4 border-l-blue-700">
                                    <p className="text-base">Milestones</p>
                                    <p className="text-xl font-bold mt-3">{selectPath.data.milestones.length}</p>
                                </div>
                                <div className="bg-gray-100 p-5 rounded-lg lg border-l-4 border-l-blue-700">
                                    <p className="text-base">Projects</p>
                                    <p className="text-xl font-bold mt-3">{Object.values(selectPath.data.projects || {}).flat().length}</p>
                                </div>
                            </div>
                        </div> 
                        {
                            selectPath.data.prerequisites && selectPath.data.prerequisites.length > 0 && (
                                <div className="w-full">
                                    <p className="text-xl font-bold p-5">Prerequisites</p>
                                    <ul>
                                        {
                                            selectPath.data.prerequisites.map((item: string, index: number) => (
                                                <li key={index} className="pl-10"><span className="text-green-500 mt-1 mr-1">✔</span>{item}</li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            )
                        } 
                        <div className="w-full" ref={milestonesRef}> 
                            <p className="text-xl font-bold p-5">Milestones</p>
                            <ul>
                                {
                                    selectPath.data.milestones.map((milestone: string, index: number) => (
                                        <li key={index} className="pl-10"><span className="text-green-500 mt-1 mr-1">✔</span>{milestone}</li>
                                    ))
                                }
                            </ul>
                        </div>  
                        <div className="w-full" ref={roadMapref}>
                            <p className="text-xl font-bold p-5">Weekly Roadmap</p>
                                {
                                    selectPath.data.weeklyRoadmap.map((week: any, index: number) => (
                                        
                                        <div key={index} className="bg-gray-100 m-5 p-5 rounded-lg border-l-4 border-l-blue-700">
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="text-lg font-bold">Week {week.week}: {week.focus}</p>
                                                    <p className="text-gray-600"><span>{week.topics.length} topics</span> <span className="ml-7">{week.quizQuestions.length} quiz questions</span></p>
                                                </div>
                                                <div className="flex align-center ">
                                                    <button className="font-extrabold" onClick={() => setShowContent(showContent === index ? null : index)}>{showContent === index ? <FaChevronUp /> : <FaChevronDown />}</button>
                                                </div>
                                            </div>
                                            <div className="flex justify-start gap-4 mt-3">
                                                <button className={`text-white font-bold text-xs rounded-md px-3 py-1 bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed`} disabled={completedWeeksArray.includes(week.week)} onClick={() => updateStatus(week.week, true)}>{completedWeeksArray.includes(week.week) ? "Completed" : "Complete"}</button>
                                            </div>
                                                        
                                            {
                                                showContent === index && (
                                                    <div className="w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 bg-white rounded-lg mt-3">
                                                        <div className="bg-gray-50 p-3 rounded-lg mr-1 ml-2 mt-2 mb-2">
                                                            <div className="flex justify-between">
                                                                <p className="font-bold mt-3 mb-3">Topics to Cover</p>
                                                                <button className="bg-linear-to-br from-[#2c3e5c] to-[#4a6fa5] w-[30%] text-white font-bold text-[12px] rounded-md h-[25px] mt-3" onClick={() => generateAiNote(selectPath.data.title, week.topics)}>Notes</button>
                                                            </div>
                                                            <ul>
                                                                {
                                                                    week.topics.map((topic: string, idx: number) => (
                                                                        <li className="mt-2 flex items-center  border-b pb-2 border-b-gray-200" key={idx}><FaBook className="text-blue-600 shrink-0" /><span className="ml-2">{topic}</span></li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                            <div className="bg-gray-50 p-3 rounded-lg ml-1 mr-2 mt-2 mb-2">
                                                                <div className="flex justify-between">
                                                                    <p className="font-bold mt-3 mb-3">Quiz Questions</p>
                                                                    <button className="bg-linear-to-br from-[#2c3e5c] to-[#4a6fa5] w-[30%] text-white font-bold text-[12px] rounded-md h-[25px] mt-3" onClick={() => { genarateAiAnswers(selectPath.data.title,week.quizQuestions);  setShowAnswerModal(true) }}>Answers</button>
                                                                </div>
                                                                            
                                                                <ul>
                                                                    {
                                                                        week.quizQuestions.map((ques: string, qidx: number) => (
                                                                            <li key={qidx} className="mt-2 flex items-center border-b pb-2 border-b-gray-200"><FaRegQuestionCircle className="text-blue-600 shrink-0"/><span className="ml-2">{ques}</span></li>
                                                                        ))
                                                                    }
                                                                </ul>
                                                            </div>  
                                                            {
                                                                showAnswerModal && (
                                                                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                                                        <AnswersCard answers={answers} onClose={() => { setShowAnswerModal(false); setAnswers([]); }} answerLoading={answerLoading}></AnswersCard>
                                                                    </div>  
                                                                )
                                                            }
                                                        </div>   
                                                )
                                            }
                                        </div>
                                    ))
                                }
                        </div>
                        <div className="w-full" ref={projectsRef}>
                            <p className="text-xl font-bold p-5">Projects</p>
                            {
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                                    {
                                        selectPath.data.projects.beginner.length > 0 && (
                                        <div className="bg-gray-100 p-5 rounded-lg border-t-4 border-t-green-700">
                                            <p className="font-bold text-lg text-green-700">Beginner Projects</p>
                                            <ul className="pl-5 list-disc">     
                                                {
                                                    selectPath.data.projects.beginner.map((project: string, index: number) => (
                                                        <li key={index}>{project}</li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                        )
                                    }
                                    {
                                        selectPath.data.projects.intermediate.length > 0 && (
                                            <div className="bg-gray-100 p-5 rounded-lg border-t-4 border-t-yellow-500">
                                                <p className="font-bold text-lg text-yellow-500">Intermediate Projects</p>
                                                <ul className="pl-5 list-disc">     
                                                    {
                                                        selectPath.data.projects.intermediate.map((project: string, index: number) => (
                                                            <li key={index}>{project}</li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        )
                                    }
                                    {
                                        selectPath.data.projects.advanced.length > 0 && (
                                            <div className="bg-gray-100 p-5 rounded-lg border-t-4 border-t-red-500">
                                                <p className="font-bold text-lg text-red-500">Advanced Projects</p>
                                                <ul className="pl-5 list-disc">     
                                                    {
                                                        selectPath.data.projects.advanced.map((project: string, index: number) => (
                                                            <li key={index}>{project}</li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        )
                                    }
                                </div>
                            }
                        </div>
                        <div className="w-full" ref={resourcesRef}>
                                <p className="text-xl font-bold p-5">Resources</p>
                                {
                                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4 p-5">
                                        {
                                            selectPath.data.resources.books.length > 0 && (
                                                <div className="bg-gray-100 p-5 rounded-lg border-l-4 border-l-blue-700">
                                                    <p className="font-bold text-lg text-blue-700">Books</p>
                                                    <ul className="pl-5 list-disc">     
                                                        {
                                                            selectPath.data.resources.books.map((book: string, index: number) => (
                                                                <li key={index}>{book}</li>
                                                            ))
                                                        }
                                                    </ul>
                                                </div>
                                            )
                                        }
                                        {
                                            selectPath.data.resources.websites.length > 0 && (
                                                <div className="bg-gray-100 p-5 rounded-lg border-l-4 border-l-blue-700">
                                                    <p className="font-bold text-lg text-blue-700">Websites</p>
                                                    <ul className="pl-5 list-disc">     
                                                        {
                                                            selectPath.data.resources.websites.map((website: string, index: number) => (
                                                                <li key={index}>{website}</li>
                                                            ))
                                                        }
                                                    </ul>
                                                </div>
                                            )
                                        }
                                        {
                                            selectPath.data.resources.youtube.length > 0 && (
                                                <div className="bg-gray-100 p-5 rounded-lg border-l-4 border-l-blue-700">
                                                    <p className="font-bold text-lg text-blue-700">YouTube</p>
                                                    <ul className="pl-5 list-disc">     
                                                        {
                                                            selectPath.data.resources.youtube.map((youtube: string, index: number) => (
                                                                <li key={index}>{youtube}</li>
                                                            ))
                                                        }
                                                    </ul>
                                                </div>
                                            )
                                        }
                                    </div>
                                }
                        </div>
                        <div className="w-full" ref={careerRef}>
                            <p className="text-xl font-bold p-5">Career Roadmap</p>
                            {
                                selectPath.data.careerRoadmap.length > 0 &&(
                                    selectPath.data.careerRoadmap.map((stage : any, index: number) => (
                                        <div key={index} className="bg-gray-100 m-5 p-5 rounded-lg border-l-4 border-l-blue-700">
                                            <div className="flex justify-between">
                                                <p className="font-bold">{stage.stage}</p>
                                                <button onClick={() => setShowStage(showStage === index ? null : index)}>{showStage === index ? <FaChevronUp /> : <FaChevronDown />}</button>
                                            </div>           
                                            <p className="text-gray-600">{stage.expectedTime}</p>

                                            {
                                                showStage === index && (
                                                    <div className="bg-white rounded-lg lg:w-[70%] sm:w-[70%] p-5 mt-5">
                                                        <p className="font-bold mt-3">Skills to Learn</p>
                                                            {  
                                                                stage.skillsToLearn.length > 0 && (
                                                                    <ul>
                                                                        {
                                                                            stage.skillsToLearn.map((skill: string, id: number) => (
                                                                                <li key={id} className="mt-2 flex items-center  border-b pb-2 border-b-gray-200"><span className="mr-2">✓</span>{skill}</li>
                                                                            ))
                                                                        }
                                                                    </ul>  
                                                                ) 
                                                            }
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ))
                                ) 
                            }
                        </div>
                        <div className="w-full" ref={finalRef}>
                            <p className="text-xl font-bold p-5">Final Assessment</p>
                            {
                                selectPath.data.finalAssessment.length > 0 &&(
                                    <div className="bg-gray-100 m-5 p-5 rounded-lg border-l-4 border-l-blue-700">
                                        <p className="p-5">{selectPath.data.finalAssessment}</p> 
                                    </div>
                                )}
                        </div>
                        <div>
                            <p className="text-center p-5">🎉 Congratulations on completing your learning path! Keep pushing your limits and never stop learning. 🚀</p>
                        </div>

                    </div>
                </div>   
            </div>
        )
}

export default LearningPathViewer

                   
                               
                              