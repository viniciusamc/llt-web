import { useAuth } from '../../hooks/auth'
import { useNavigate } from 'react-router-dom'
import { LogOut, Settings } from 'lucide-react'
import { useState } from 'react'
import { Subscript } from 'lucide-react'
import { SubscriptIcon } from 'lucide-react'
import { DiamondIcon } from 'lucide-react'
import { Diamond } from 'lucide-react'

export function Header() {
    const { signOut, user } = useAuth()
    const navigate = useNavigate()
    const [dropdownOpen, setDropdownOpen] = useState(false)

    const toggleDropdown = () => setDropdownOpen((prev) => !prev)

    return (
        <header className="bg-primary text-white py-4 mb-6">
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo and Navigation */}
                <div className="flex items-center space-x-4">
                    <h1
                        className="text-2xl font-bold cursor-pointer hover:text-purple-300 transition-colors"
                        onClick={() => navigate('/')}
                    >
                        LogLingua
                    </h1>
                    <button
                        className="text-white bg-transparent hover:bg-main px-3 py-1 rounded-md transition-colors"
                        onClick={() => navigate('/words')}
                    >
                        Words You Know
                    </button>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                    <button
                        onClick={toggleDropdown}
                        className="flex items-center space-x-2 focus:outline-none"
                        aria-haspopup="true"
                        aria-expanded={dropdownOpen}
                    >
                        <div className="h-10 w-10 bg-gray-500 rounded-full flex items-center justify-center overflow-hidden">
                            <span className="text-lg font-bold text-white">
                                {<img src={`https://eu.ui-avatars.com/api/?name=${localStorage.getItem("@username")}&size=250`} />}
                            </span>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                            <div className="px-4 py-2 text-gray-700 font-semibold">
                                Hello, {localStorage.getItem("@username")}
                            </div>
                            <div className="border-t border-gray-200 my-1"></div>
                            <button
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => navigate('/subscription')}
                            >
                                <Diamond className="mr-2 h-4 w-4" />
                                Subscription
                            </button>
                            <button
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => navigate('/settings')}
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </button>
                            <button
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={signOut}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
