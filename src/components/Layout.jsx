import Header from "./Header"
import BottomNavbar from "./BottomNavbar"

export default function Layout({children}) {
    return (
        <div className="bg-primary min-h-screen flex flex-col">
            <Header />
            <div className='rounded-t-3xl pt-6 bg-card mt-4 px-4 flex-grow container shadow-t-2xl'>
                {children}
            </div>
            <BottomNavbar />
        </div>
    )
}