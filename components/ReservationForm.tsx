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
  name: yup.string().required('Ad Soyad zorunludur'),
  email: yup.string().email('Geçerli bir e-posta adresi girin').required('E-posta zorunludur'),
  phone: yup.string().required('Telefon numarası zorunludur'),
  guests: yup.number().min(1, 'En az 1 kişi seçmelisiniz').max(10, 'Maksimum 10 kişi kabul edilir').required('Kişi sayısı zorunludur'),
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

      // Create reservation
      const reservationResponse = await fetch('/api/reservations', {
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

      if (!reservationResponse.ok) {
        throw new Error('Rezervasyon oluşturulamadı');
      }

      const reservationResult = await reservationResponse.json();
      console.log('Reservation created:', reservationResult);

      // Send emails using the new endpoint
      const emailResponse = await fetch('/api/send-reservation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservation: {
            id: reservationResult.reservation.id,
            name: reservationResult.reservation.name,
            email: reservationResult.reservation.email,
            phoneNumber: reservationResult.reservation.phoneNumber,
            date: reservationResult.reservation.date,
            time: reservationResult.reservation.time,
            numberOfGuests: reservationResult.reservation.numberOfGuests,
            specialRequests: reservationResult.reservation.specialRequests,
          }
        }),
      });

      const emailResult = await emailResponse.json();
      console.log('Email result:', emailResult);

      // Show success message regardless of email status
      setSubmitStatus('success');
      reset();
      setSelectedDate(null);

      // Optional: Show warning if emails failed
      if (!emailResult.success) {
        console.warn('Email sending failed:', emailResult.message);
      }

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
      <h2 className="text-3xl font-bold text-center mb-8">Rezervasyon</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">Ad Soyad</label>
          <input
            type="text"
            {...register('name')}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Adınızı ve soyadınızı girin"
          />
          {errors.name && <p className="text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">E-posta</label>
          <input
            type="email"
            {...register('email')}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="E-posta adresinizi girin"
          />
          {errors.email && <p className="text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Telefon</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Telefon numaranızı girin"
          />
          {errors.phone && <p className="text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Tarih ve Saat</label>
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
            placeholderText="Tarih ve saat seçin"
          />
          {!selectedDate && <p className="text-red-500 mt-1">Tarih ve saat seçimi zorunludur</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Kişi Sayısı</label>
          <select
            {...register('guests')}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Kişi sayısını seçin</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i + 1 === 1 ? 'Kişi' : 'Kişi'}
              </option>
            ))}
          </select>
          {errors.guests && <p className="text-red-500 mt-1">{errors.guests.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Özel İstekler</label>
          <textarea
            {...register('specialRequests')}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Özel isteklerinizi belirtin (isteğe bağlı)"
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
          {isSubmitting ? 'Rezervasyon Oluşturuluyor...' : 'Rezervasyon Yap'}
        </button>
      </form>

      {submitStatus === 'success' && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <div>
              <h3 className="font-semibold">Rezervasyon Başarılı!</h3>
              <p className="text-sm mt-1">Rezervasyonunuz başarıyla oluşturuldu. Onay e-postası gönderildi.</p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <div>
              <h3 className="font-semibold">Rezervasyon Hatası</h3>
              <p className="text-sm mt-1">Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 