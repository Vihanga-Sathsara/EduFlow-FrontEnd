import { useEffect, useState } from "react"
import { FaBars } from "react-icons/fa"
import { Link } from "react-router-dom"

export default function Index(){
    // const [showBurgerButton, setShowBurgerButton] = useState(false)

    const [hideOnScroll, setHideOnScroll] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
        const isLargeScreen = window.innerWidth >= 1024;
        const isMediumScreen = window.innerWidth >= 768;

        if (isLargeScreen || isMediumScreen) { 
            setHideOnScroll(window.scrollY > 50);  
        }else {
            setHideOnScroll(false);
        }
    };

    window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [])
     return (
        <div className="w-full flex flex-col items-center relative">
            <header className={`inline-flex justify-between w-full h-[70px] items-center lg:pl-17 lg:pr-17 sm:pl-17 sm:pr-17 pl-7 pr-7 fixed z-10 top-0 ${hideOnScroll ? "flex items-center justify-center" : ""}`}>
                <div className={`${hideOnScroll ? "hidden" : "flex"}`}>
                    <p className="lg:text-2xl sm:text-xl text-base font-bold text-[#4E6BFF]">EduFlow LearnHub</p>
                </div>
                <div className={`space-x-4 text-lg  py-2 px-4 rounded-lg shadow-lg sm:hidden lg:flex hidden  bg-gray-400/10 backdrop-blur-md lg:${hideOnScroll ? "flex items-center justify-center" : ""}`}>
                    <Link to="#">Features</Link>
                    <Link to="#">How It Works</Link>
                    <Link to="#">Benefits</Link>
                    <Link to="#">Contact</Link>
                </div>
                <div className={`space-x-4 text-lg lg:block sm:hidden hidden lg:${hideOnScroll ? "hidden" : "flex"}`}>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
                <div className="lg:hidden sm:block block">
                    <button className="text-xl">
                        <FaBars />
                    </button>
                </div>
            </header>
            <main className="relative flex flex-col items-center">
                <section className="relative flex bg-blue-100 h-screen w-full flex-col justify-center items-center ">
                   
                    <div className="w-[95%] h-[95%] flex flex-col justify-center gap-7 p-17 items-center">
                        <div className="w-[70%] p-4 ">
                            <p className="text-[37px] font-bold text-center">Personalized Learning Paths and Smart e-Library in One Powerful Platform.</p>
                            <p className="text-xl text-gray-600 text-center">
                                EduFlow LearnHub combines personalized learning paths with a smart e-library to 
                                create a comprehensive learning ecosystem. Organize your resources, track your 
                                progress, and achieve your learning goals faster.
                            </p>
                            <button className="px-4 py-2 mr-4 text-white bg-blue-500 rounded-lg">Get Started</button>
                            <button className="px-4 py-2 mr-4 text-white bg-blue-500 rounded-lg">Learn More</button>
                        </div>
                        <div>

                        </div>
                        
                    </div>
                    {/* <div className="w-1/2 h-full flex justify-center items-center z-1"> */}
                            {/* <Spline scene="https://prod.spline.design/SPZmHL1kIYZNGIyS/scene.splinecode" /> */}
                            {/* <Spline scene="https://prod.spline.design/4FNrQRKtRHpj6DPu/scene.splinecode" /> */}
                            {/* <Spline scene=" https://prod.spline.design/iecCXR3ZcjIdcXfY/scene.splinecode" /> */}
                            {/* <Spline scene=" https://prod.spline.design/EWw6hIqN0oFvDjPP/scene.splinecode" /> */}
                     
                            {/* <img src="/landingpage_vector.png" alt="" className="w-full h-[75%]"/> */}

                    {/* </div> */}
                </section>
                <section className="h-screen w-full relative flex">
                   
                </section>
            </main>
        </div>
     )
}