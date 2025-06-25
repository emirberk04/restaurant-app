import { Resend } from 'resend';

// Resend client'ı runtime'da başlat
let resend: Resend | null = null;

// Initialize Resend only if API key is available
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

interface EmailProps {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailProps) {
  try {
    // Email servisi yapılandırılmamışsa uyarı dön
    if (!resend) {
      console.warn('Email service is not configured');
      return { 
        success: false, 
        error: 'Email service is not configured' 
      };
    }

    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Elegance Restaurant <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
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