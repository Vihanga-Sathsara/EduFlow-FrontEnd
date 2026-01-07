import { useRef, useState } from "react"
import Header from "../components/Header"
import { genarateLearningPath, generateAnswers, generateNote } from "../services/ai"
import Swal from "sweetalert2"
import { saveLearningPath } from "../services/learningpath"
import { FaBook } from "react-icons/fa"
import { FaRegQuestionCircle } from "react-icons/fa"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import { FaBars, FaTimes } from "react-icons/fa"
import AnswersCard from "../components/AnswersCard"
import { useAuth } from "../context/AuthContext"

export default function LearningPath(){

    const [prompt , setPrompt] = useState("")
    const [result, setResult] = useState<any>(null)
    const [showContent, setShowContent] = useState<number | null>(null)
    const [showStage , setShowStage] = useState<number | null>(null)
    const [showBurgerButton, setShowBurgerButton] = useState(false)
    const [subject, setSubject] = useState("")
    const [answers , setAnswers] = useState<{ question: any, answer: any }[]>([])
    const [showAnswerModal, setShowAnswerModal] = useState(false)
    const [answerLoading, setAnswerLoading] = useState(false)
    

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

    const handleResult = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if(!prompt){
            Swal.fire({
                icon: "error",
                text: "Please enter a subject to generate learning path",
                draggable: true
            }) 
            return   
        }
        try{
            const res = await genarateLearningPath(prompt)
            console.log("Generated Learning Path:",res)
            setResult(res.learningPath)
            setSubject(res.aiContent)
        }catch(error : any){
            console.error("Error generating learning path:", error)
            Swal.fire({
                icon: "error",
                text: error.response?.data?.message || "Something Went Wrong.Try Again",
                draggable: true
            })
        }
        
    }

     const { user } = useAuth()

    const saveResult = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        
        if (!prompt || !result) {
                Swal.fire({
                icon: "warning",
                text: "Please generate a learning path before saving",
                draggable: true
            })
        return
        }
    
        if(!user || !user.id){
             console.log("Saving Learning Path for user:", user.id)
            Swal.fire({
                icon: "warning",
                text: "You must be logged in to save learning path",
                draggable: true
            })
            return
        }
        try {

            console.log("Saving Learning Path for user:", user.id)
            const res = await saveLearningPath({ title: prompt, data: result, userId: user.id, status: false }) 
            console.log("Learning Path saved:", res)
            Swal.fire({
                icon: "success",
                text: "Learning Path saved successfully",
                draggable: true
            })

        }catch(error : any){
            console.error("Error saving learning path:", error)
            Swal.fire({
                icon: "error",
                text: error.response?.data?.message || "Something Went Wrong.Try Again",
                draggable: true
            })
        }
    }

    const generateAiNote = async (subject: string, topics: string[]) => {
        try{
            const res = await generateNote(subject, topics)
            const url = URL.createObjectURL(res)
           
            window.open(url, "_blank");
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
    

    return (
        <div className="w-full flex flex-col items-center bg-blue-50 min-h-screen">
            <Header />
            <main className="relative flex flex-col items-center w-full mt-[100px] mb-10 gap-6">
                <section className="relative flex w-full flex-col justify-center items-center gap-6">
                    <div className="w-[90%] p-2 lg:p-6 sm:p-2 space-y-3 text-center">
                        <p className="bg-linear-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent p-4 lg:text-6xl sm:text-3xl text-xl font-bold">Learning Path Generator</p>
                        <p className="text-black lg:text-center sm:text-center lg:text-2xl sm:text-xl text-[12px] font-bold lg:pt-10 sm:pt-7 pt-2">Enter any subject and get a complete, personalized learning path generated instantly with AI-powered recommendations.</p>
                    </div>
                    <div className="flex flex-col w-[90%] gap-6 h-[20%] bg-gray-100 rounded-lg p-4">
                        <p className="font-bold text-xl">Generate Learning Path</p>
                        <div className="flex lg:flex-row sm:flex-row flex-col w-full gap-4">
                            <input type="text" className="border border-gray-400 lg:w-[75%] sm:w-[75%] w-full rounded-md p-2 h-[45px]" value={prompt} onChange={(e) => setPrompt(e.target.value)}/>
                            <button  className="bg-linear-to-r from-blue-900 to-blue-500 lg:w-[25%] sm:w-[25%]  w-full text-white font-bold rounded-md text-base h-[45px]" onClick={handleResult}>Generate</button>
                        </div>
                        <div className="p-2 border-l-4 border-l-blue-700">
                            <p className="lg:text-sm sm:text-sm text-[12px]"><span className="text-blue-900 font-bold">Example:</span> Python Programming, UX Design, Blockchain Technology, Digital Photography, Machine Learning Fundamentals</p>
                        </div>
                    </div>
                    {result &&(
                        <div className="flex lg:flex-row flex-col sm:flex-col w-[90%] gap-6 bg-blue-100">
                            <div className="lg:flex-col lg:w-[30%] sm:w-full w-full h-[90vh] gap-6 p-4 lg:sticky top-20 sm:hidden lg:block hidden">
                                <p className="font-bold text-xl">Your Learning Path</p>
                                    <div className="w-full h-full relative">
                                        <p className="text-2xl font-bold p-2">Navigation</p>
                                        <ol className="truncate p-2 space-y-2">
                                            <li><button className="rounded bg-blue-50 w-[80%] p-3 text-start truncate" onClick={() => scrollToSection(overviewRef)}>Overview</button></li>
                                            <li><button className="rounded bg-blue-50 w-[80%] p-3 text-start truncate" onClick={() => scrollToSection(roadMapref)}>Weekly Roadmap</button></li>
                                            <li><button className="rounded bg-blue-50 w-[80%] p-3 text-start truncate" onClick={() => scrollToSection(milestonesRef)}>Milestoones</button></li>
                                            <li><button className="rounded bg-blue-50 w-[80%] p-3 text-start truncate" onClick={() => scrollToSection(projectsRef)}>Projects</button></li>
                                            <li><button className="rounded bg-blue-50 w-[80%] p-3 text-start truncate" onClick={() => scrollToSection(resourcesRef)}>Resources</button></li>
                                            <li><button className="rounded bg-blue-50 w-[80%] p-3 text-start truncate" onClick={() => scrollToSection(careerRef)}>Career Roadmap</button></li>
                                            <li><button className="rounded bg-blue-50 w-[80%] p-3 text-start truncate" onClick={() => scrollToSection(finalRef)}>Final Assesment</button></li>
                                        </ol>
                                    </div>
                            </div>
                            <div className="w-full lg:w-[80%] sm:w-full h-auto bg-white overflow-y-auto lg:sticky top-20 rounded-l-2xl">
                                <div className="w-full">
                                    <div className="flex items-center justify-between p-5">
                                        <p className="text-xl font-bold">Learning Path Overview</p>
                                        <button onClick={() => setShowBurgerButton(!showBurgerButton)} className="lg:hidden sm:show show"> {showBurgerButton ? <FaTimes /> : <FaBars />}</button>
                                    </div>

                                    <div className={`bg-green-300 h-[100px] w-full  ${showBurgerButton ? 'block' : 'hidden'}`}>
                                        <p></p>
                                    </div>
                                    
                                     <div ref={overviewRef} className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
                                        <div className="bg-gray-100 p-5 rounded-lg border-l-4 border-l-blue-700">
                                            <p className="text-base">Total Duration</p>
                                            <p className="text-xl font-bold mt-3">{result.totalDuration}</p>
                                        </div>
                                        <div className="bg-gray-100 p-5 rounded-lg lg border-l-4 border-l-blue-700">
                                            <p className="text-base">Daily Study</p>
                                            <p className="text-xl font-bold mt-3">{result.recommendedDailyTime}</p>
                                        </div>
                                        <div className="bg-gray-100 p-5 rounded-lg lg border-l-4 border-l-blue-700">
                                            <p className="text-base">Milestones</p>
                                            <p className="text-xl font-bold mt-3">{result.milestones.length}</p>
                                        </div>
                                        <div className="bg-gray-100 p-5 rounded-lg lg border-l-4 border-l-blue-700">
                                            <p className="text-base">Projects</p>
                                            <p className="text-xl font-bold mt-3">{Object.values(result.projects || {}).flat().length}</p>
                                        </div>
                                    </div>
                                </div>
                               
                               {
                                 result.prerequisites && result.prerequisites.length > 0 && (
                                    <div className="w-full">
                                         <p className="text-xl font-bold p-5">Prerequisites</p>
                                         <ul>
                                            {
                                                result.prerequisites.map((item: string, index: number) => (
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
                                            result.milestones.map((milestone: string, index: number) => (
                                                <li key={index} className="pl-10"><span className="text-green-500 mt-1 mr-1">✔</span>{milestone}</li>
                                            ))
                                        }
                                     </ul>
                               </div>

                               <div className="w-full" ref={roadMapref}>
                                      <p className="text-xl font-bold p-5">Weekly Roadmap</p>
                                      {
                                        result.weeklyRoadmap.map((week: any, index: number) => (
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
                                                    
                                                    {
                                                        showContent === index && (

                                                            <div className="w-full grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 bg-white rounded-lg mt-3">
                                                                <div className="bg-gray-50 p-3 rounded-lg mr-1 ml-2 mt-2 mb-2">
                                                                    <div className="flex justify-between">
                                                                        <p className="font-bold mt-3 mb-3">Topics to Cover</p>
                                                                        <button className="bg-linear-to-br from-[#2c3e5c] to-[#4a6fa5] w-[30%] text-white font-bold text-[12px] rounded-md h-[25px] mt-3" onClick={() => generateAiNote(subject, week.topics)}>Notes</button>
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
                                                                        <button className="bg-linear-to-br from-[#2c3e5c] to-[#4a6fa5] w-[30%] text-white font-bold text-[12px] rounded-md h-[25px] mt-3" onClick={() => { genarateAiAnswers(subject,week.quizQuestions);  setShowAnswerModal(true) }}>Answers</button>
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
                                                    )}
                                                 </div>
                                        ))
                                    }
                               </div>

                               <div className="w-full" ref={projectsRef}>
                                    <p className="text-xl font-bold p-5">Projects</p>
                                    {
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                                            {
                                                result.projects.beginner.length > 0 && (
                                                    <div className="bg-gray-100 p-5 rounded-lg border-t-4 border-t-green-700">
                                                        <p className="font-bold text-lg text-green-700">Beginner Projects</p>
                                                        <ul className="pl-5 list-disc">     
                                                            {
                                                                result.projects.beginner.map((project: string, index: number) => (
                                                                    <li key={index}>{project}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                )
                                            }
                                            {
                                                result.projects.intermediate.length > 0 && (
                                                    <div className="bg-gray-100 p-5 rounded-lg border-t-4 border-t-yellow-500">
                                                        <p className="font-bold text-lg text-yellow-500">Intermediate Projects</p>
                                                        <ul className="pl-5 list-disc">     
                                                            {
                                                                result.projects.intermediate.map((project: string, index: number) => (
                                                                    <li key={index}>{project}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                )
                                            }
                                            {
                                                result.projects.advanced.length > 0 && (
                                                    <div className="bg-gray-100 p-5 rounded-lg border-t-4 border-t-red-500">
                                                        <p className="font-bold text-lg text-red-500">Advanced Projects</p>
                                                        <ul className="pl-5 list-disc">     
                                                            {
                                                                result.projects.advanced.map((project: string, index: number) => (
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
                                                result.resources.books.length > 0 && (
                                                    <div className="bg-gray-100 p-5 rounded-lg border-l-4 border-l-blue-700">
                                                        <p className="font-bold text-lg text-blue-700">Books</p>
                                                        <ul className="pl-5 list-disc">     
                                                            {
                                                                result.resources.books.map((book: string, index: number) => (
                                                                    <li key={index}>{book}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                )
                                            }
                                            {
                                                result.resources.websites.length > 0 && (
                                                    <div className="bg-gray-100 p-5 rounded-lg border-l-4 border-l-blue-700">
                                                        <p className="font-bold text-lg text-blue-700">Websites</p>
                                                        <ul className="pl-5 list-disc">     
                                                            {
                                                                result.resources.websites.map((website: string, index: number) => (
                                                                    <li key={index}>{website}</li>
                                                                ))
                                                            }
                                                        </ul>
                                                    </div>
                                                )
                                            }
                                            {
                                                result.resources.youtube.length > 0 && (
                                                    <div className="bg-gray-100 p-5 rounded-lg border-l-4 border-l-blue-700">
                                                        <p className="font-bold text-lg text-blue-700">YouTube</p>
                                                        <ul className="pl-5 list-disc">     
                                                            {
                                                                result.resources.youtube.map((youtube: string, index: number) => (
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
                                        result.careerRoadmap.length > 0 &&(
                                            result.careerRoadmap.map((stage : any, index: number) => (
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
                                    {result.finalAssessment.length > 0 &&(
                                        <div className="bg-gray-100 m-5 p-5 rounded-lg border-l-4 border-l-blue-700">
                                            <p className="p-5">{result.finalAssessment}</p> 
                                        </div>
                                    )}
                               </div>
                               <div>
                                    <p className="text-center p-5">🎉 Congratulations on completing your learning path! Keep pushing your limits and never stop learning. 🚀</p>
                               </div>
                                 <div className="flex justify-center mb-10">
                                    <button className="bg-linear-to-br from-[#2c3e5c] to-[#4a6fa5] text-white font-bold rounded-md p-4" onClick={saveResult}>Save Learning Path</button>
                                 </div>

                               
                            </div>
                        </div>
                    )}
                </section>
            </main>
            <footer className="w-full mt-auto">
                <div className="mt-10 pt-4 text-center text-gray-500 mb-10">
                    © 2026 EduFlow LearnHub. All rights reserved.
                </div>
            </footer>
        </div>
    )
}