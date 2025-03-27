import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Menu, Search, User } from 'lucide-react'
import { useAuthStore } from '../store/authUser'
import { useContentStore } from '../store/content'

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
    const {user, logout} = useAuthStore()

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
    const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen)

    const { setContentType} = useContentStore()
    
  return (
  <header className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20">
    <div className="flex items-center gap-10 z-50">
        <Link to="/">
        <img src="/ms.svg" alt="Logo" className='w-32 sm:w-40'/>
        </Link>

        {/* desktop navbar items */}
        <div className="hidden sm:flex gap-4 items-center">
            <Link to="/" className='hover:underline' onClick={() =>setContentType("movie")}>Movies</Link>
            <Link to="/" className='hover:underline' onClick={() =>setContentType("tv")}>Tv Shows</Link>
            <Link to="/history" className='hover:underline'>Search History</Link>
            <Link to="/browse" className='hover:underline'>Rentals</Link>
        </div>
    </div>

        <div className="flex gap-2 items-center z-50">
            <Link to={"/search"}>
            <Search className='size-6 cursor-pointer'/>
            </Link>
            
            {/* Profile dropdown container */}
            <div className="relative">
                <img 
                    src={user.image} 
                    alt="Avatar" 
                    className='h-8 rounded cursor-pointer' 
                    onClick={toggleProfileDropdown}
                />
                
                {/* Profile dropdown menu */}
                {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-black rounded border border-gray-700 shadow-lg z-50">
                        <Link 
                            to="/profile" 
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 transition-colors"
                            onClick={() => setIsProfileDropdownOpen(false)}
                        >
                            <User size={16} />
                            <span>Profile</span>
                        </Link>
                        <div 
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-800 cursor-pointer transition-colors"
                            onClick={() => {
                                logout();
                                setIsProfileDropdownOpen(false);
                            }}
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </div>
                    </div>
                )}
            </div>

            <div className='sm:hidden'>
                <Menu className='size-6 cursor-pointer' onClick={toggleMobileMenu}/>
            </div>
        </div>

    {/* mobile navbar items */}

    {isMobileMenuOpen && (
        <div className='w-full sm:hidden mt-4 z-50 bg-black rounded border-gray-500'>
            <Link to={"/"} className='block p-2 hover:underline' onClick={toggleMobileMenu}>Movies</Link>
            <Link to={"/"} className='block p-2 hover:underline' onClick={toggleMobileMenu}>Tv Shows</Link>
            <Link to={"/history"} className='block p-2 hover:underline' onClick={toggleMobileMenu}>Search History</Link>
            <Link to={"/browse"} className='block p-2 hover:underline' onClick={toggleMobileMenu}>Rental</Link>
        </div>
    )}
  </header>
  )
}

export default Navbar