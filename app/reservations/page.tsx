'use client'

import type { FC } from 'react'
import { motion } from 'framer-motion'
import ReservationForm from '@/components/ReservationForm'

const ReservationsPage: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">
              Make a Reservation
            </h1>
            <p className="text-gray-600 text-lg">
              Reserve your table for a memorable dining experience at Elegance
            </p>
          </div>

          {/* Use the actual working ReservationForm component */}
          <ReservationForm />

          <div className="mt-12 text-center text-gray-600">
            <p className="mb-4">
              For parties larger than 8 or special events, please contact us directly:
            </p>
            <p className="font-semibold">
              Phone: +1 234 567 890
              <br />
              Email: reservations@elegance.com
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ReservationsPage 