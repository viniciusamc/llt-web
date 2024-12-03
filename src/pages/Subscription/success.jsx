import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Loader } from 'lucide-react'
import { api } from '../../services/api'

export default function SubscriptionSuccess() {
  const [progress, setProgress] = useState(0)
  const [subcription, setSubscription] = useState()

  useEffect(() => {
    let timer;

      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer);
            return 100;
          }
          const newProgress = oldProgress + 10;
          return Math.min(newProgress, 100);
        });
      }, 1000);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <CheckCircle className="w-20 h-20 text-primary mx-auto mb-8" />
        <h1 className="text-4xl font-bold mb-6 text-complementary">Subscription Successful!</h1>
        <p className="text-xl mb-8 text-terciary">
          Thank you for subscribing to LinguaLog Premium. We're excited to help you on your language learning journey!
        </p>
        <div className="mb-8">
          <p className="text-lg mb-4">We're currently processing your account:</p>
          <div className="w-full bg-main rounded-full h-4 mb-4">
            <div
              className="bg-primary h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            {progress < 100 ? (
              <>
                <Loader className="inline-block animate-spin mr-2" />
                Analyzing your uploaded videos and extracting vocabulary...
              </>
            ) : (
              <>
                <CheckCircle className="inline-block mr-2" />
                Processing complete! Your personalized learning experience is ready.
              </>
            )}
          </p>
        </div>
        <p className="text-lg mb-8 text-terciary">
          We're analyzing all the videos you've uploaded to create a personalized vocabulary list and learning plan just for you.
        </p>
        <a
          href="/"
          className="bg-primary text-white px-8 py-3 rounded-md hover:bg-opacity-80 transition duration-300 inline-block"
        >
          Go to Your Dashboard
        </a>
      </motion.div>
    </div>
  )
}
