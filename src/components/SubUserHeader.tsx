import { Link } from "react-router-dom";

export default function SubUserHeader() {
    return(  
 <div className="w-full flex flex-col items-center relative">
    <header className="inline-flex justify-between w-[75%] h-[70px] items-center lg:pl-17 lg:pr-17 sm:pl-17 sm:pr-17 pl-7 pr-7 bg-gray-100 fixed z-10 top-20">
            <div className="space-x-4 text-lg sm:hidden lg:flex hidden">
                <Link to="/user-dashboard">Dashboard</Link>
                <Link to="/learning-path">Learning Path</Link>
                <Link to="#">E-Library</Link>
                <Link to="#">FAQ</Link>
            </div>
    </header>
 </div>
    )
}