'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from 'date-fns/locale';

// Form validation schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Please enter a valid email address').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  guests: yup.number().min(1, 'Please select at least 1 guest').max(10, 'Maximum 10 guests allowed').required('Number of guests is required'),
  specialRequests: yup.string().default(''),
});

interface FormData {
  name: string;
  email: string;
  phone: string;
  guests: number;
  specialRequests: string;
}

export default function ReservationForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      specialRequests: '',
    }
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!selectedDate) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Extract date and time separately
      const reservationDate = new Date(selectedDate);
      const dateOnly = reservationDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeOnly = reservationDate.toTimeString().substring(0, 5); // HH:MM

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phoneNumber: data.phone,
          date: dateOnly,
          time: timeOnly,
          numberOfGuests: data.guests,
          specialRequests: data.specialRequests,
        }),
      });

      if (!response.ok) throw new Error('Could not create reservation');

      setSubmitStatus('success');
      reset();
      setSelectedDate(null);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Reservation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Minimum date should be today
  const minDate = new Date();
  // Maximum date should be 3 months from now
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-8">Reservation</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && <p className="text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Date and Time</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="MM/dd/yyyy HH:mm"
            minDate={minDate}
            maxDate={maxDate}
            locale={enUS}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Select date and time"
          />
          {!selectedDate && <p className="text-red-500 mt-1">Date and time selection is required</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Number of Guests</label>
          <select
            {...register('guests')}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select number of guests</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
          {errors.guests && <p className="text-red-500 mt-1">{errors.guests.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Special Requests</label>
          <textarea
            {...register('specialRequests')}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Please specify any special requests"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !selectedDate}
          className={`w-full py-3 px-6 text-white rounded-md transition-colors
            ${isSubmitting || !selectedDate 
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? 'Submitting...' : 'Make Reservation'}
        </button>
      </form>

      {submitStatus === 'success' && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          Your reservation has been successfully created. A confirmation email has been sent.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          An error occurred while creating your reservation. Please try again.
        </div>
      )}
    </div>
  );
} 