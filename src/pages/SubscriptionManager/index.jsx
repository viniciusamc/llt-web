import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { CheckCircle, XCircle, Info } from 'lucide-react'
import { Header } from '../../components/Header'
import { CancelSubscriptionModal } from '../../components/Modal/CancelSubscription'

export default function SubscriptionManagement() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscriptionEndingTime, setSubscriptionEndingTime] = useState()
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function checkSubscription() {
      try {
        const response = await api.get("/user")
        const { subscriptionActive, subscriptionEndingDate } = response.data.userConfigs
        setIsSubscribed(subscriptionActive)
        setSubscriptionEndingTime(subscriptionEndingDate)
      } catch (error) {
        console.error(error)
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
      console.error(error)
    }
  }

  const handleCancelSubscription = async () => {
    try {
      const response = await api.post('/subscription/cancel')
      setIsSubscribed(false)
      setSubscriptionEndingTime(response.data.subscriptionEndingTime)
      setShowModal(false)
    } catch (error) {
      console.error(error)
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)  // Convert seconds to milliseconds
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', month: 'long', day: 'numeric' 
    })
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

        {subscriptionEndingTime && (
          <div className="bg-warning p-4 rounded-lg mb-6 flex items-center">
            <Info className="w-6 h-6 text-yellow-500 mr-3" />
            <p>
              You have canceled your subscription. It will remain active until{' '}
              <strong>{subscriptionEndingTime}</strong>.
            </p>
          </div>
        )}

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
              onClick={() => setShowModal(true)}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-80 transition-colors"
            >
              Cancel Subscription
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-main rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Upgrade to Premium</h2>
              <p className="text-white mb-6">Unlock all features and supercharge your language learning</p>
              <ul className="space-y-2 mb-6">
                {[
                  "Unlimited video processing",
                  "Advanced word statistics",
                  "Personalized learning paths",
                  "Priority customer support",
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
                  "Basic word statistics only",
                  "No personalized learning paths",
                  "Standard customer support",
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

      <CancelSubscriptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleCancelSubscription}
      />
    </div>
  )
}

