import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'

export default function SubscriptionCancelled() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <XCircle className="w-20 h-20 text-primary mx-auto mb-8" />
        <h1 className="text-4xl font-bold mb-6 text-complementary">Subscription Cancelled</h1>
        <p className="text-xl mb-8 text-terciary">
          We're sorry to see you go. Your subscription process has been cancelled.
        </p>
        <p className="text-lg mb-8 text-terciary">
          If you have any questions or concerns, please don't hesitate to contact our support team. We're here to help!
        </p>
        <div className="space-y-4">
          <a
            href="/pricing"
            className="bg-primary text-white px-8 py-3 rounded-md hover:bg-opacity-80 transition duration-300 inline-block"
          >
            Return to home
          </a>
        </div>
      </motion.div>
    </div>
  )
}

