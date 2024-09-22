import Header from "./Header"
import BottomNavbar from "./BottomNavbar"

export default function Layout({children}) {
    return (
        <div className="bg-primary min-h-screen flex flex-col">
            <Header />
            <div className='rounded-t-3xl pt-2 bg-card mt-4 px-4 flex-grow container shadow-t-2xl pb-10'>
                <div className=" mx-20 h-1 mb-4 rounded-full bg-gray-300 shadow-lg"></div>
                {children}
            </div>
            <BottomNavbar />
        </div>
    )
}