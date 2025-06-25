'use client'

import type { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const HomePage: FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center bg-gray-900">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4')] bg-cover bg-center brightness-50" />
        </div>
        <div className="container relative z-10 text-center text-white">
          <motion.h1 
            className="text-4xl md:text-6xl font-serif mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to Elegance
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience fine dining at its best with our carefully crafted menu and exceptional service
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/reservations" className="btn-primary text-lg">
              Book Your Table
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Our Menu */}
            <div className="text-center">
              <div className="h-64 relative mb-6 overflow-hidden rounded-lg">
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0')] bg-cover bg-center hover:scale-110 transition-transform duration-500" />
              </div>
              <h2 className="text-2xl font-serif mb-4">Exquisite Menu</h2>
              <p className="text-gray-600 mb-6">
                Discover our carefully curated selection of dishes, crafted with the finest ingredients
              </p>
              <Link href="/menu" className="text-accent hover:text-secondary transition-colors">
                View Menu →
              </Link>
            </div>

            {/* Special Events */}
            <div className="text-center">
              <div className="h-64 relative mb-6 overflow-hidden rounded-lg">
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3')] bg-cover bg-center hover:scale-110 transition-transform duration-500" />
              </div>
              <h2 className="text-2xl font-serif mb-4">Special Events</h2>
              <p className="text-gray-600 mb-6">
                From intimate gatherings to grand celebrations, we create memorable experiences
              </p>
              <Link href="/contact" className="text-accent hover:text-secondary transition-colors">
                Inquire Now →
              </Link>
            </div>

            {/* Chef's Table */}
            <div className="text-center">
              <div className="h-64 relative mb-6 overflow-hidden rounded-lg">
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de')] bg-cover bg-center hover:scale-110 transition-transform duration-500" />
              </div>
              <h2 className="text-2xl font-serif mb-4">Chef's Table</h2>
              <p className="text-gray-600 mb-6">
                Experience an exclusive dining journey with our chef's specially curated tasting menu
              </p>
              <Link href="/reservations" className="text-accent hover:text-secondary transition-colors">
                Reserve Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-serif text-center mb-12">What Our Guests Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-600 italic mb-4">{testimonial.text}</p>
                <p className="font-semibold">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const testimonials = [
  {
    text: "An unforgettable dining experience. The attention to detail and service was impeccable.",
    author: "Sarah Johnson"
  },
  {
    text: "The tasting menu was a culinary journey that exceeded all expectations.",
    author: "Michael Chen"
  },
  {
    text: "Elegant ambiance combined with extraordinary flavors. A true fine dining gem.",
    author: "Emma Thompson"
  }
]

export default HomePage 