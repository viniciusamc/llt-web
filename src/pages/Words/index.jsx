import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Header } from "../../components/Header"
import { api } from "../../services/api"
import { useNavigate } from "react-router"

export function Words() {
  const [listWords, setListWords] = useState([])
  const [subscription, setSubscription] = useState(false)
  const [order, setOrder] = useState("DESC")
  const [limit, setLimit] = useState(50)
  const [page, setPage] = useState(1)
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(10000)
  const [showPremiumAlert, setShowPremiumAlert] = useState(false)
  const navigate = useNavigate()

  async function handleSubscription() {
    const response = await api.post('/subscription')
    window.location.href = response.data.url
  }

  useEffect(() => {
    async function getWords() {
      try {
        const response = await api.get("/user")
        setSubscription(response.data.userConfigs.subscriptionActive)
        if (!response.data.userConfigs.subscriptionActive) {
          setShowPremiumAlert(false)
        } else {
          handleFilter()
        }
      } catch (error) {
        console.error(error)
      }
    }

    getWords()
  }, [page])

  async function handleFilter() {
    try {
      const response = await api.get("/youtube/words", {
        params: { page, perPage: limit, order, min, max }
      })
      setListWords(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  if (!subscription) {
    return (
      <>
        <Header />
        {showPremiumAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Premium Feature</h2>
              <p className="mb-4">This feature is only available for premium subscribers. Upgrade your account to access detailed word statistics.</p>
              <button
                onClick={() => {
                  setShowPremiumAlert(false)
                  handleSubscription()
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="bg-white shadow-md rounded-lg p-6 w-[350px]">
            <h2 className="text-xl font-bold mb-2">Premium Feature</h2>
            <p className="text-gray-600 mb-4">Upgrade to access word statistics</p>
            <button
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              onClick={() => { handleSubscription() }}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-2">Word Statistics</h2>
          <p className="text-gray-600 mb-4">Filter and view your word usage statistics</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <select
                id="order"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="border rounded-md p-2 w-full"
              >
                <option value="DESC">Descending ↓</option>
                <option value="ASC">Ascending ↑</option>
              </select>
            </div>
            <div>
              <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">Amount per Page</label>
              <input
                id="limit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                placeholder="Amount per Page"
                className="border rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="min" className="block text-sm font-medium text-gray-700 mb-1">Minimum Viewed</label>
              <input
                id="min"
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                placeholder="Minimum Viewed"
                className="border rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="max" className="block text-sm font-medium text-gray-700 mb-1">Maximum Viewed</label>
              <input
                id="max"
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                placeholder="Maximum Viewed"
                className="border rounded-md p-2 w-full"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-80 transition-colors w-full"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={listWords}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="word.word" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#C94B4B" name="Seen" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </>
  )
}

