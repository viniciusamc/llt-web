import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { CheckCircle, XCircle } from 'lucide-react'
import { Header } from '../../components/Header'

export default function SubscriptionManagement() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSubscription() {
      try {
        const response = await api.get("/user")
        setIsSubscribed(resonse.data.userConfigs.subscriptionActive)
      } catch (error) {
        console.error("Error checking subscription:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSubscription()
  }, [])

  const handleSubscribe = async () => {
    try {
      const response = await api.post('/subscription')
      window.location.href = response.data.url
    } catch (error) {
      console.error("Error initiating subscription:", error)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      await api.delete('/subscription')
      setIsSubscribed(false)
    } catch (error) {
      console.error("Error cancelling subscription:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-white">
    <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Subscription Management</h1>
        
        {isSubscribed ? (
          <div className="bg-main rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Premium Subscription Active</h2>
            <p className="mb-6">Enjoy all the benefits of LinguaLog Premium</p>
            <ul className="space-y-2 mb-6">
              {[
                "Unlimited video processing",
                "Advanced word statistics",
                "Personalized learning paths",
                "Priority customer support",
                "Ad-free experience"
              ].map((feature, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-primary mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleCancelSubscription}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-80 transition-colors"
            >
              Cancel Subscription
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-main rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Upgrade to Premium</h2>
              <p className="text-secondary mb-6">Unlock all features and supercharge your language learning</p>
              <ul className="space-y-2 mb-6">
                {[
                  "Unlimited video processing",
                  "Advanced word statistics",
                  "Personalized learning paths",
                  "Priority customer support",
                  "Ad-free experience"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleSubscribe}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-80 transition-colors"
              >
                Subscribe Now
              </button>
            </div>

            <div className="bg-secondary rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">What You're Missing</h2>
              <p className="text-gray-400 mb-6">Features not available on the free plan</p>
              <ul className="space-y-2">
                {[
                  "Limited to 5 video processes per month",
                  "Basic word statistics only",
                  "No personalized learning paths",
                  "Standard customer support",
                  "Ads present in the application"
                ].map((limitation, index) => (
                  <li key={index} className="flex items-center">
                    <XCircle className="w-5 h-5 text-primary mr-2" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

