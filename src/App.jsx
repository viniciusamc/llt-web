import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, PlayCircle, BarChart2, Book, Youtube, Globe, CheckCircle, ArrowRight, Users } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Rocket } from 'lucide-react'
import { Star } from 'lucide-react'
import { Zap } from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      navigate(`/signup?email=${encodeURIComponent(email)}`);
    }
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-complementary">LogLingua</h1>
        <div>
          <a href="/login" className="text-white hover:text-complementary transition-colors mr-4">
            Login
          </a>
          <a href="/signup" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors">
            Sign Up
          </a>
        </div>
      </nav>

      {/* Hero Section with Improved CTA */}
      <header className="container mx-auto px-4 py-16 text-center">
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-6 text-complementary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Master Any Language While Enjoying Your Favorite Content
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 text-terciary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Transform YouTube videos and movies into powerful, personalized language lessons
        </motion.p>
        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row justify-center items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 w-full sm:w-64 rounded-md focus:outline-none focus:ring-2 focus:ring-complementary text-main"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-80 transition duration-300 flex items-center justify-center w-full sm:w-auto"
          >
            Start Your Log
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </motion.form>
        <motion.p
          className="text-sm text-terciary mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          No credit card required. Start learning in minutes!
        </motion.p>

        {/* New section replacing the video/image */}
        <motion.div
          className="bg-main rounded-lg p-8 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Be Among the First to Experience LogLingua</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div className="flex flex-col items-center text-center">
              <Rocket className="w-12 h-12 text-primary mb-2" />
              <h3 className="text-xl font-semibold mb-2 text-white">Early Access</h3>
              <p className="text-white">Get exclusive first access to our revolutionary language learning platform.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Star className="w-12 h-12 text-primary mb-2" />
              <h3 className="text-xl font-semibold mb-2 text-white">Shape the Future</h3>
              <p className="text-white">Provide valuable feedback and help us tailor LogLingua to your needs.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Zap className="w-12 h-12 text-primary mb-2" />
              <h3 className="text-xl font-semibold mb-2 text-white">Accelerate Learning</h3>
              <p className="text-white">Experience a new way of language learning through personalized video content.</p>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Features Section */}
      <section className="bg-main py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-complementary">Why Choose LogLingua?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Youtube className="w-12 h-12 text-primary mb-4" />, title: "YouTube Integration", description: "Learn from any YouTube content in your target language" },
              { icon: <Book className="w-12 h-12 text-primary mb-4" />, title: "Personalized Tracking", description: "Build a vocabulary list tailored to your viewing habits" },
              { icon: <BarChart2 className="w-12 h-12 text-primary mb-4" />, title: "Progress Visualization", description: "See your improvement over time with beautiful charts" },
              { icon: <Globe className="w-12 h-12 text-primary mb-4" />, title: "Multi-language Support", description: "Learn Spanish, French, Japanese, and many more" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-background rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mb-2 text-complementary">{feature.title}</h3>
                <p className="text-terciary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-complementary">How LogLingua Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
            {[
              { step: 1, title: "Choose Your Content", description: "Select any YouTube video or movie in your target language" },
              { step: 2, title: "Watch and Learn", description: "Enjoy your content while LogLingua tracks your vocabulary" },
              { step: 3, title: "Review and Practice", description: "Use personalized exercises to reinforce your learning" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center max-w-xs"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-complementary">{item.title}</h3>
                <p className="text-terciary">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-main py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-complementary">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Sarah L.", quote: "LogLingua has transformed the way I learn Spanish. It's like having a personal tutor in every video I watch!" },
              { name: "Michael T.", quote: "As a busy professional, LogLingua allows me to improve my French skills during my daily commute. It's efficient and fun!" },
              { name: "Yuki K.", quote: "I've tried many language learning apps, but LogLingua is by far the most engaging. My English vocabulary has expanded rapidly!" },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-background p-6 rounded-lg shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <p className="mb-4 italic text-terciary">"{testimonial.quote}"</p>
                <p className="font-semibold text-complementary">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section with CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-complementary">Start Learning Today</h2>
          <div className="max-w-md mx-auto bg-main rounded-lg shadow-lg overflow-hidden">
            <div className="bg-primary text-white p-6 text-center">
              <h3 className="text-2xl font-semibold">Premium Plan</h3>
              <p className="text-4xl font-bold mt-2">$4.99<span className="text-lg">/month</span></p>
            </div>
            <div className="p-6">
              <ul className="space-y-2 mb-6">
                {[
                  "Unlimited video processing",
                  "Personalized vocabulary tracking",
                  "Progress analytics",
                  "Multi-language support",
                  "Priority customer support",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-2" />
                    <span className="text-terciary">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="signup"
                className="block w-full bg-primary text-white text-center py-3 rounded-md hover:bg-opacity-80 transition duration-300 font-semibold"
              >
                Get your subcription
              </a>
              <p className="text-center text-terciary mt-4 text-sm">No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with CTA */}
      <footer className="bg-main text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-complementary">Ready to Transform Your Language Learning?</h2>
            <a
              href="/signup"
              className="inline-block bg-primary text-white px-8 py-3 rounded-md hover:bg-opacity-80 transition duration-300 font-semibold"
            >
              Get Started Now
            </a>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-complementary">LogLingua</h2>
              <p className="text-terciary">Learn Smarter, Watch Freely, Speak Confidently</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-terciary hover:text-white transition duration-300">About</a>
              <a href="#" className="text-terciary hover:text-white transition duration-300">Blog</a>
              <a href="#" className="text-terciary hover:text-white transition duration-300">Contact</a>
              <a href="#" className="text-terciary hover:text-white transition duration-300">Privacy Policy</a>
            </div>
          </div>
          <div className="mt-8 text-center text-terciary">
            <p>&copy; 2024 LogLingua. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

