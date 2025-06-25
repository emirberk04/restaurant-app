'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";
import { tr } from 'date-fns/locale';

// Form validation schema
const schema = yup.object().shape({
  name: yup.string().required('İsim alanı zorunludur'),
  email: yup.string().email('Geçerli bir email adresi giriniz').required('Email alanı zorunludur'),
  phone: yup.string().required('Telefon alanı zorunludur'),
  guests: yup.number().min(1, 'En az 1 kişi seçmelisiniz').max(10, 'En fazla 10 kişi seçebilirsiniz').required('Kişi sayısı zorunludur'),
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
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          date: selectedDate.toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Rezervasyon oluşturulamadı');

      setSubmitStatus('success');
      reset();
      setSelectedDate(null);
    } catch (error) {
      setSubmitStatus('error');
      console.error('Rezervasyon hatası:', error);
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
          <label className="block text-gray-700 mb-2">İsim Soyisim</label>
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
          <label className="block text-gray-700 mb-2">Telefon</label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            dateFormat="dd/MM/yyyy HH:mm"
            minDate={minDate}
            maxDate={maxDate}
            locale={tr}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Tarih ve saat seçiniz"
          />
          {!selectedDate && <p className="text-red-500 mt-1">Tarih ve saat seçimi zorunludur</p>}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Kişi Sayısı</label>
          <select
            {...register('guests')}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Kişi sayısı seçiniz</option>
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} Kişi
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
            placeholder="Varsa özel isteklerinizi belirtiniz"
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
          {isSubmitting ? 'Gönderiliyor...' : 'Rezervasyon Yap'}
        </button>
      </form>

      {submitStatus === 'success' && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          Rezervasyonunuz başarıyla oluşturuldu. Onay emaili gönderildi.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          Rezervasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.
        </div>
      )}
    </div>
  );
} 