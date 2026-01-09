import { useEffect, useState,useRef } from "react"
import { FaBars, FaRegCheckCircle, FaRegEdit, FaRegLightbulb, FaRocket, FaShieldAlt, FaLaptopCode, FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa"
import { Link } from "react-router-dom"
import { HiOutlineMap,HiOutlineCalendar, HiOutlineAcademicCap, HiOutlineChartBar,HiOutlineBookOpen, HiOutlineDocumentText } from "react-icons/hi"
import { useNavigate } from "react-router-dom"

export default function Index(){
    const featureRef = useRef<HTMLDivElement>(null)
    const worksRef = useRef<HTMLDivElement>(null)
    const benifitsRef = useRef<HTMLDivElement>(null)
    const contactRef = useRef<HTMLDivElement>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [hideOnScroll, setHideOnScroll] = useState(false)
    const isTooSmall = window.innerWidth <= 344
    const navigate = useNavigate()

    const navigateRegisterPage = () => {
        navigate("/register")
    }

  useEffect(() => {
    const handleScroll = () => {
        const isLargeScreen = window.innerWidth >= 1024
        const isMediumScreen = window.innerWidth >= 768
        if (isLargeScreen || isMediumScreen) { 
            setHideOnScroll(window.scrollY > 50)
        }else {
            setHideOnScroll(false)
        }
    };

    window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: "smooth" })
    }

     return (
        <div className="w-full flex flex-col">
            <header className={`inline-flex justify-between w-full h-[70px] items-center lg:pl-17 lg:pr-17 sm:pl-17 sm:pr-17 pl-7 pr-7 fixed z-10 top-0 ${hideOnScroll ? "flex items-center justify-center" : ""}`}>
                <div className={`${hideOnScroll ? "hidden" : "flex"}`}>
                    <p className="lg:text-2xl sm:text-xl text-base font-bold text-[#2563EB] flex items-center">EduFlow LearnHub</p>
                </div>
                <div className={`space-x-4 text-lg py-2 px-4 rounded-lg shadow-lg sm:hidden lg:flex hidden  bg-gray-400/10 backdrop-blur-md lg:${hideOnScroll ? "flex items-center justify-center" : ""}`}>
                    <button onClick={() => scrollTo(featureRef)}>Features</button>
                    <button onClick={() => scrollTo(worksRef)}>How It Works</button>
                    <button onClick={() => scrollTo(benifitsRef)}>Benefits</button>
                    <button onClick={() => scrollTo(contactRef)}>Contact</button>
                </div>
                <div className={`space-x-4 text-lg lg:block sm:hidden hidden lg:${hideOnScroll ? "hidden" : "flex"}`}>
                    <Link to="/login" className="text-blue-600 px-6 py-2 font-base rounded-xl border bg-white">Login</Link>
                    <Link to="/register" className="text-white px-6 py-2 font-base rounded-xl border bg-blue-600 animate">Register</Link>
                </div>
                <div className="lg:hidden sm:block block right-8 absolute">
                    <button className="text-xl" onClick={()=>setIsMenuOpen(true)}>
                        <FaBars />
                    </button>
                    {
                        isMenuOpen && (
                            
                            <div className="fixed sm:top-[50px] top-[50px] sm:right-20 right-10 bg-white border border-gray-300 rounded-md shadow-md sm:w-50 w-40 z-30 p-5" onClick={() => setIsMenuOpen(false)}>
                                <ul>
                                    <li onClick={() => scrollTo(featureRef)}>Features</li>
                                    <li onClick={() => scrollTo(worksRef)}>How It Works</li>
                                    <li onClick={() => scrollTo(benifitsRef)}>Benefits</li>
                                    <li onClick={() => scrollTo(contactRef)}>Contact</li>
                                    <li><a href="/login">Login</a></li>
                                    <li><a href="/register">Register</a></li>
                                </ul>
                                                         
                            </div>
                        )
                    }
                </div>
            </header>
            <main className="flex flex-col items-center">
                <section className="flex bg-white mt-[100px] w-full flex-col items-center">
                    <div className="w-[95%] h-[95%] flex flex-col justify-center items-center">
                        <div className="lg:w-[70%] sm:w-[90%] lg:p-4 sm:p-4 p-5  w-full flex flex-col gap-7">
                            <p className="lg:text-8xl sm:text-7xl text-4xl font-bold text-center bg-linear-to-r from-blue-900 to-blue-500 bg-clip-text text-transparent">Transform Your Learning Experience with EduFlow</p>
                            <p className={`lg:text-xl sm:text-lg text-lg text-center text-gray-500 font-medium ${isTooSmall ? "text-sm" : ""}`}>
                                EduFlow LearnHub combines personalized learning paths with a smart e-library to 
                                create a comprehensive learning ecosystem. Organize your resources, track your 
                                progress, and achieve your learning goals faster.
                            </p>
                            <div className="w-full flex flex-row justify-center gap-7">
                                <button className={ `text-blue-700 px-6 py-3 font-medium rounded-xl border border-blue-500/30 hover:shadow-md shadow-blue-100 hover:scale-105 transition-all ${isTooSmall ? "text-sm px-3 py-2" : ""}` } onClick= {navigateRegisterPage}>Join For Free</button>
                                <button className={` text-blue-700 px-6 py-3 font-medium rounded-xl border border-blue-500/30 hover:shadow-md shadow-blue-100 hover:scale-105 transition-all ${isTooSmall ? "text-sm px-3 py-2" : ""}`}>Learn More</button>
                            </div>
                           
                        </div>
                        
                    </div>
                </section>
                <section className="w-full relative mt-10" ref={featureRef}>
                    <p className="text-4xl font-bold text-gray-800 text-center mb-4">Our Core Features</p>
                    <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 p-7 gap-5 lg:w-[80%] sm:w-[90%] w-full mx-auto">
                        <div className="p-7 rounded-2xl bg-gray-50 shadow-md hover:shadow-xl transition">
                            <HiOutlineMap className="text-4xl text-blue-700 mb-4"/>
                            <p className="text-xl font-semibold mb-2">AI-Generated Learning Roadmaps</p>
                            <p className="text-gray-600">Generate a personalized learning roadmap based on your goals, skill level, and timeline fully AI powered.</p>
                        </div>
                        <div className="p-7 rounded-2xl bg-gray-50 shadow-md hover:shadow-xl transition">
                            <HiOutlineCalendar className="text-4xl text-blue-700 mb-4"/>
                            <p className="text-xl font-semibold mb-2">Weekly Learning Plans</p>
                            <p className="text-gray-600">Your roadmap is automatically broken into weekly learning tasks with clear objectives and milestones.</p>
                        </div>
                        <div className="p-7 rounded-2xl bg-gray-50 shadow-md hover:shadow-xl transition">
                            <HiOutlineDocumentText className="text-4xl text-blue-700 mb-4"/>
                            <p className="text-xl font-semibold mb-2">Auto-Generated Weekly Notes</p>
                            <p className="text-gray-600">Get AI-generated notes for every week, tailored to your learning path — no manual searching required.</p>
                        </div>
                        <div className="p-7 rounded-2xl bg-gray-50 shadow-md hover:shadow-xl transition">
                            <HiOutlineAcademicCap className="text-4xl text-blue-700 mb-4"/>
                            <p className="text-xl font-semibold mb-2">AI Quiz & Answer Generation</p>
                            <p className="text-gray-600">Practice smarter with AI-generated quizzes and answers aligned with your weekly topics to reinforce understanding.</p>
                        </div>
                        <div className="p-7 rounded-2xl bg-gray-50 shadow-md hover:shadow-xl transition">
                            <HiOutlineChartBar className="text-4xl text-blue-700 mb-4"/>
                            <p className="text-xl font-semibold mb-2">Progress Tracking & Insights</p>
                            <p className="text-gray-600">Track completed weeks and overall learning progress through a clear and intuitive dashboard.</p>
                        </div>
                        <div className="p-7 rounded-2xl bg-gray-50 shadow-md hover:shadow-xl transition">
                            <HiOutlineBookOpen className="text-4xl text-blue-700 mb-4"/>
                            <p className="text-xl font-semibold mb-2">Smart E-Library Integration</p>
                            <p className="text-gray-600">Access a curated collection of resources and materials that complement your learning path, all in one place.</p>
                        </div>
                    </div>
                </section>
                <section className="w-full relative mt-10" ref={worksRef}>
                    <p className="text-4xl font-bold text-gray-800 text-center mb-4">How It Works</p>
                    <div className="grid lg:grid-cols-3 sm:grid-cols-1 grid-cols-1 p-7 gap-5 lg:w-[80%] sm:w-[90%] w-full mx-auto">
                        <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2 hover:scale-105 duration-300">
                            <div className="p-4 rounded-full bg-blue-100 w-fit mb-4">
                                <FaRegLightbulb className="text-2xl text-blue-700"/>
                            </div>
                            <p className="text-xl font-semibold mb-2">1. Create Your Learning Path</p>
                            <p className="text-gray-600">Select your subjects, goals, and pace. Our system generates a personalized roadmap for you.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2 hover:scale-105 duration-300">
                            <div className="p-4 rounded-full bg-purple-100 w-fit mb-4">
                                <FaRegEdit className="text-2xl text-purple-700"/>
                            </div>
                            <p className="text-xl font-semibold mb-2">2. Access Weekly Notes & Quizzes</p>
                            <p className="text-gray-600">AI-generated notes and quizzes are linked to each week, helping you revise and test your knowledge.</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2 hover:scale-105 duration-300">
                            <div className="p-4 rounded-full bg-green-100 w-fit mb-4">
                                <FaRegCheckCircle className="text-2xl text-green-700"/>
                            </div>
                            <p className="text-xl font-semibold mb-2">3. Track Your Progress</p>
                            <p className="text-gray-600">Visualize your weekly progress and milestones with our smart analytics dashboard.</p>
                        </div>
                    </div>
                </section>
                <section className="w-full relative mt-10" ref={benifitsRef}>
                    <p className="text-4xl font-bold text-gray-800 text-center mb-4">Benefits</p>
                    <div className="grid lg:grid-cols-3 sm:grid-cols-1 grid-cols-1 p-7 gap-5 lg:w-[80%] sm:w-[90%] w-full mx-auto">
                        <div className="p-7 rounded-2xl bg-gray-50 shadow-md hover:shadow-xl transition hover:-translate-y-2 duration-500">
                            <div className="p-4 rounded-full bg-blue-100 w-fit mb-4">
                                <FaRocket className="text-2xl text-blue-700"/>
                            </div>
                            <p className="text-xl font-semibold mb-2">Personalized Learning</p>
                            <p className="text-gray-600">AI-powered learning paths tailored to your pace and goals.</p>
                        </div>
                        <div className="p-7 rounded-2xl bg-gray-50 shadow-md hover:shadow-xl transition hover:-translate-y-2 duration-500">
                            <div className="p-4 rounded-full bg-purple-100 w-fit mb-4">
                                <FaShieldAlt className="text-2xl text-purple-700"/>
                            </div>
                            <p className="text-xl font-semibold mb-2">Secure & Reliable</p>
                            <p className="text-gray-600">Your data and progress are safely stored in the cloud.</p>
                        </div>
                        <div className="p-7 rounded-2xl bg-gray-50 shadow-md hover:shadow-xl transition hover:-translate-y-2 duration-500">
                            <div className="p-4 rounded-full bg-green-100 w-fit mb-4">
                                <FaLaptopCode className="text-2xl text-green-700"/>
                            </div>
                            <p className="text-xl font-semibold mb-2">Accessible Anywhere</p>
                            <p className="text-gray-600">Use on desktop, tablet, or mobile for uninterrupted learning.</p>
                        </div>
                    </div>
                </section> 
                <section className="w-full relative mt-10 items-center flex flex-col" ref={contactRef}>
                    <div className="px-6 lg:w-[80%] sm:w-[90%] w-full lg:py-10 sm:py-6 py-6">
                        <p className="text-4xl font-bold text-gray-800 text-center mb-4">Get in Touch</p>
                        <div className="w-full bg-gray-50 p-6 rounded-lg shadow-md">
                            <p className="text-gray-600 mb-8 text-base font-semibold">Have questions or feedback? We’d love to hear from you!</p>
                            <form className="flex flex-col gap-4">
                                <input type="text" placeholder="Your Name" className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                <input type="email" placeholder="Your Email" className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                <textarea placeholder="Your Message" className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                                <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">Send Message</button>
                            </form>
                        </div>   
                    </div>
                </section>     
            </main>
            <footer className="bg-gray-900 text-white py-10">
                    <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row justify-between items-start gap-10">
                    
                        <div className="flex flex-col gap-4">
                            <h1 className="text-2xl font-bold text-blue-500">EduFlow LearnHub</h1>
                            <p className="text-gray-400 max-w-xs">
                                Transform your learning experience with personalized paths, e-library, and progress tracking.
                            </p>
                            <div className="flex gap-4 mt-2">
                                <a href="#"><FaFacebookF className="hover:text-blue-500 transition"/></a>
                                <a href="#"><FaTwitter className="hover:text-blue-400 transition"/></a>
                                <a href="#"><FaLinkedinIn className="hover:text-blue-600 transition"/></a>
                                <a href="#"><FaGithub className="hover:text-gray-400 transition"/></a>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="font-bold text-lg mb-2">Quick Links</h3>
                            <a href="#features" className="hover:text-blue-500 transition">Features</a>
                            <a href="#how-it-works" className="hover:text-blue-500 transition">How It Works</a>
                            <a href="#benefits" className="hover:text-blue-500 transition">Benefits</a>
                            <a href="#contact" className="hover:text-blue-500 transition">Contact</a>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="font-bold text-lg mb-2">Contact</h3>
                            <p className="text-gray-400">support@eduflow.com</p>
                            <p className="text-gray-400">+94 77 123 4567</p>
                            <p className="text-gray-400">Colombo, Sri Lanka</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 mt-10 pt-4 text-center text-gray-500">
                        © 2026 EduFlow LearnHub. All rights reserved.
                    </div>
             </footer>
        </div>
     )
}