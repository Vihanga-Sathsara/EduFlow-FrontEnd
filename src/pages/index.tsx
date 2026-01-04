import { Link } from "react-router-dom"

export default function Index(){
     return (
        <div className="w-full flex flex-col items-center">
            <header className="inline-flex justify-between w-full h-[70px] items-center pl-17 pr-17 bg-gray-100 fixed z-10 top-0">
                <div>
                    <p className="text-2xl font-bold text-[#4E6BFF]">EduFlow LearnHub</p>
                </div>
                <div className="space-x-4 text-lg">
                    <Link to="#">Features</Link>
                    <Link to="#">How It Works</Link>
                    <Link to="#">Benefits</Link>
                    <Link to="#">Contact</Link>
                </div>
                <div className="space-x-4 text-lg">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            </header>
            <main className="relative flex flex-col items-center">
                <section className="relative flex bg-blue-100 h-screen w-full flex-col justify-center items-center">
                    <div className="w-[95%] h-[95%] flex flex-col justify-center gap-7 p-17 items-center">
                        {/* <p className="text-6xl font-bold text-[#4E6BFF]">EduFlow LearnHub</p> */}
                        <div className="w-[70%] p-4 ">
                            <p className="text-[37px] font-bold text-center">Personalized Learning Paths and Smart e-Library in One Powerful Platform.</p>
                            <p className="text-xl text-gray-600 text-center">
                                EduFlow LearnHub combines personalized learning paths with a smart e-library to 
                                create a comprehensive learning ecosystem. Organize your resources, track your 
                                progress, and achieve your learning goals faster.
                            </p>
                        </div>
                
                        <div>
                            <button className="px-4 py-2 mr-4 text-white bg-blue-500 rounded-lg">Get Started</button>
                            <button className="px-4 py-2 mr-4 text-white bg-blue-500 rounded-lg">Learn More</button>
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