import { useState, useEffect } from 'react'
import { Header } from '../../components/Header'
import { useAuth } from '../../hooks/auth'
import { api } from '../../services/api'
import iso6391 from 'iso-639-1'
import { Tooltip } from '../../components/Tooltip'

export function Settings() {
    const { refresh } = useAuth()

    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const [language, setLanguage] = useState('az')
    const [daily, setDaily] = useState(0)
    const [wpm, setWpm] = useState(0)
    const [awp, setAwp] = useState(0)

    async function getUser() {
        try {
            const response = await api.get('/user')
            setLanguage(response.data.userConfigs.targetLanguage)
            setWpm(response.data.userConfigs.wordsReadPerMinute)
            setAwp(response.data.userConfigs.averageWordsPerPage)
            setDaily(response.data.userConfigs.dailyGoal)
        } catch (error) {
            setErrorMessage('Failed to load user settings. Please try again.')
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setIsLoading(true)

        const data = {
            wordsReadPerMinute: Number(wpm),
            averageWordsPerPage: Number(awp),
            targetLanguage: language,
            dailyGoal: Number(daily)
        }

        try {
            await api.patch('/user/settings', data)
            setSuccessMessage('Settings saved successfully')
        } catch (error) {
            setErrorMessage('Unable to save your new settings. Please try again later.')
        } finally {
            setIsLoading(false)
            clearMessage()
        }
    }

    useEffect(() => {
        getUser()
    }, [])

    function clearMessage(time = 2500) {
        setTimeout(() => {
            setSuccessMessage('')
            setErrorMessage('')
        }, time)
    }

    return (
        <div className="min-h-screen bg-background text-white">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-primary mb-6">Settings</h1>
                    <div className="bg-main shadow-md rounded-lg overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {successMessage && (
                                <div className="bg-primary bg-opacity-20 border-l-4 border-primary text-white p-4 mb-4 animate-fade-in" role="alert">
                                    <p>{successMessage}</p>
                                </div>
                            )}
                            {errorMessage && (
                                <div className="bg-red-500 bg-opacity-20 border-l-4 border-red-500 text-white p-4 mb-4 animate-fade-in" role="alert">
                                    <p>{errorMessage}</p>
                                </div>
                            )}
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-white mb-1">
                                    Target Language
                                </label>
                                <select
                                    id="language"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-white bg-secondary border-gray-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                                >
                                    {iso6391.getAllCodes().map((item) => (
                                        <option key={item} value={item}>
                                            {iso6391.getName(item)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="daily" className="block text-sm font-medium text-white mb-1">
                                    Daily Goal (In Minutes)
                                </label>
                                <input
                                    type="number"
                                    id="daily"
                                    value={daily}
                                    onChange={(e) => setDaily(Number(e.target.value))}
                                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-secondary text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Enter your daily goal in minutes"
                                />
                            </div>
                            <div>
                                <label htmlFor="wpm" className="block text-sm font-medium text-white mb-1 flex items-center">
                                    Books - Words Per Minute
                                    <span className="ml-2">
                                        <Tooltip text="The average adult reads between 200 to 300 words per minute for non-technical material." />
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    id="wpm"
                                    value={wpm}
                                    onChange={(e) => setWpm(Number(e.target.value))}
                                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-secondary text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Enter words per minute"
                                />
                            </div>
                            <div>
                                <label htmlFor="awp" className="block text-sm font-medium text-white mb-1 flex items-center">
                                    Books - Average Words per Page
                                    <span className="ml-2">
                                        <Tooltip text="The average number of words per page can vary, but it's typically between 250 to 300 words for a standard novel." />
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    id="awp"
                                    value={awp}
                                    onChange={(e) => setAwp(Number(e.target.value))}
                                    className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 bg-secondary text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                    placeholder="Enter average words per page"
                                />
                            </div>
                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Settings'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

