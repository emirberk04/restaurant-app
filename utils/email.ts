import { Resend } from 'resend';

// Initialize Resend only if API key is available
let resend: Resend | null = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

interface ReservationData {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  date: Date;
  time: string;
  numberOfGuests: number;
  specialRequests?: string;
}

// Customer confirmation email template
const getCustomerEmailTemplate = (reservation: ReservationData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rezervasyon Onayı - Elegance Restaurant</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .details { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🍽️ Elegance Restaurant</h1>
            <h2>Rezervasyon Onayı</h2>
        </div>
        
        <div class="content">
            <p>Sayın <strong>${reservation.name}</strong>,</p>
            
            <p>Rezervasyonunuz başarıyla alınmıştır. Detaylar aşağıdadır:</p>
            
            <div class="details">
                <h3>📋 Rezervasyon Detayları</h3>
                <p><strong>Rezervasyon ID:</strong> #${reservation.id}</p>
                <p><strong>İsim:</strong> ${reservation.name}</p>
                <p><strong>Tarih:</strong> ${new Date(reservation.date).toLocaleDateString('tr-TR')}</p>
                <p><strong>Saat:</strong> ${reservation.time}</p>
                <p><strong>Kişi Sayısı:</strong> ${reservation.numberOfGuests} kişi</p>
                <p><strong>Telefon:</strong> ${reservation.phoneNumber}</p>
                ${reservation.specialRequests ? `<p><strong>Özel İstekler:</strong> ${reservation.specialRequests}</p>` : ''}
            </div>
            
            <p>Rezervasyonunuz onay beklemektedir. Size en kısa sürede geri dönüş yapacağız.</p>
            
            <p>Herhangi bir sorunuz olduğunda bizimle iletişime geçmekten çekinmeyin.</p>
        </div>
        
        <div class="footer">
            <p>📍 123 Restaurant Street, İstanbul, Turkey</p>
            <p>📞 (555) 123-4567 | 📧 info@restaurant.com</p>
            <p>Teşekkürler,<br><strong>Elegance Restaurant Ekibi</strong></p>
        </div>
    </div>
</body>
</html>
`;

// Restaurant notification email template
const getRestaurantEmailTemplate = (reservation: ReservationData) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Yeni Rezervasyon - Elegance Restaurant</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .details { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .urgent { background-color: #fef3c7; padding: 10px; border-left: 4px solid #f59e0b; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 Yeni Rezervasyon Bildirimi</h1>
        </div>
        
        <div class="content">
            <div class="urgent">
                <p><strong>⚠️ Acil:</strong> Yeni bir rezervasyon alındı ve onay bekliyor!</p>
            </div>
            
            <div class="details">
                <h3>👤 Müşteri Bilgileri</h3>
                <p><strong>Rezervasyon ID:</strong> #${reservation.id}</p>
                <p><strong>İsim:</strong> ${reservation.name}</p>
                <p><strong>Email:</strong> ${reservation.email}</p>
                <p><strong>Telefon:</strong> ${reservation.phoneNumber}</p>
            </div>
            
            <div class="details">
                <h3>📅 Rezervasyon Detayları</h3>
                <p><strong>Tarih:</strong> ${new Date(reservation.date).toLocaleDateString('tr-TR')}</p>
                <p><strong>Saat:</strong> ${reservation.time}</p>
                <p><strong>Kişi Sayısı:</strong> ${reservation.numberOfGuests} kişi</p>
                ${reservation.specialRequests ? `<p><strong>Özel İstekler:</strong> ${reservation.specialRequests}</p>` : ''}
            </div>
            
            <p><strong>Bu rezervasyonu onaylamak veya reddetmek için admin paneline gidin.</strong></p>
        </div>
    </div>
</body>
</html>
`;

// Send customer confirmation email
export async function sendCustomerConfirmationEmail(reservation: ReservationData) {
  try {
    if (!resend) {
      console.log('Resend API not configured, skipping customer email');
      return { success: false, error: 'Email service not configured' };
    }

    const result = await resend.emails.send({
      from: 'Elegance Restaurant <noreply@elegancerestaurant.com>',
      to: [reservation.email],
      subject: `Rezervasyon Onayı - #${reservation.id}`,
      html: getCustomerEmailTemplate(reservation),
    });

    console.log('Customer email sent:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending customer email:', error);
    return { success: false, error };
  }
}

// Send restaurant notification email
export async function sendRestaurantNotificationEmail(reservation: ReservationData) {
  try {
    if (!resend) {
      console.log('Resend API not configured, skipping restaurant email');
      return { success: false, error: 'Email service not configured' };
    }

    const result = await resend.emails.send({
      from: 'Reservation System <system@elegancerestaurant.com>',
      to: ['admin@elegancerestaurant.com'], // Restaurant email
      subject: `🔔 Yeni Rezervasyon - ${reservation.name}`,
      html: getRestaurantEmailTemplate(reservation),
    });

    console.log('Restaurant notification sent:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending restaurant notification:', error);
    return { success: false, error };
  }
}

// Send both emails
export async function sendReservationEmails(reservation: ReservationData) {
  const results = await Promise.allSettled([
    sendCustomerConfirmationEmail(reservation),
    sendRestaurantNotificationEmail(reservation)
  ]);

  const customerResult = results[0];
  const restaurantResult = results[1];

  return {
    customer: customerResult.status === 'fulfilled' ? customerResult.value : { success: false, error: customerResult.reason },
    restaurant: restaurantResult.status === 'fulfilled' ? restaurantResult.value : { success: false, error: restaurantResult.reason }
  };
}

// Email template örnekleri
export const emailTemplates = {
  reservationConfirmation: (name: string, date: string, time: string, guests: number) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Rezervasyon Onayı</h2>
      <p>Sayın ${name},</p>
      <p>Rezervasyonunuz başarıyla oluşturulmuştur.</p>
      <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Tarih:</strong> ${date}</p>
        <p><strong>Saat:</strong> ${time}</p>
        <p><strong>Kişi Sayısı:</strong> ${guests}</p>
      </div>
      <p>Rezervasyonunuzla ilgili bir değişiklik yapmak isterseniz bize ulaşabilirsiniz.</p>
      <p>Sizi ağırlamaktan mutluluk duyacağız.</p>
      <p>Saygılarımızla,<br>Elegance Restaurant</p>
    </div>
  `,

  orderConfirmation: (orderNumber: string, items: string[], total: number) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Sipariş Onayı</h2>
      <p>Siparişiniz başarıyla alınmıştır.</p>
      <p><strong>Sipariş Numarası:</strong> ${orderNumber}</p>
      <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3>Sipariş Detayları:</h3>
        <ul>
          ${items.map(item => `<li>${item}</li>`).join('')}
        </ul>
        <p><strong>Toplam Tutar:</strong> ₺${total.toFixed(2)}</p>
      </div>
      <p>Siparişiniz hazırlandığında size bilgi vereceğiz.</p>
      <p>Bizi tercih ettiğiniz için teşekkür ederiz.</p>
      <p>Saygılarımızla,<br>Elegance Restaurant</p>
    </div>
  `,
}; 