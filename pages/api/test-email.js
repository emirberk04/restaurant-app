import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  console.log('🧪 EMAIL TEST API - BAŞLANGIC');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Environment variable'ları kontrol et
    console.log('🔑 Environment Variables:');
    console.log('  - RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    console.log('  - RESEND_API_KEY preview:', process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 10)}...` : 'NOT SET');
    console.log('  - RESTAURANT_EMAIL:', process.env.RESTAURANT_EMAIL);
    console.log('  - EMAIL_FROM:', process.env.EMAIL_FROM);

    const testEmails = [
      'emirberkalan2@gmail.com', // Fallback email
      process.env.RESTAURANT_EMAIL, // Environment'tan gelen
      req.body.testEmail // Frontend'den gönderilen test email
    ].filter(Boolean);

    console.log('📧 Test email addresses:', testEmails);

    if (!process.env.RESEND_API_KEY) {
      return res.status(500).json({ error: 'RESEND_API_KEY not configured' });
    }

    const fromEmail = process.env.EMAIL_FROM || 'Elegance Restaurant <noreply@elegancerestaurant.com>';
    
    // Her email adresine test email gönder
    const testResults = [];
    
    for (const email of testEmails) {
      console.log(`📤 Sending test email to: ${email}`);
      
      try {
        const result = await resend.emails.send({
          from: fromEmail,
          to: [email],
          subject: '🧪 Email Test - Elegance Restaurant System',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2>🧪 Email Test Başarılı!</h2>
              <p>Bu bir test email'idir. Eğer bu email'i alıyorsanız, email sistemi çalışıyor demektir.</p>
              <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3>Test Bilgileri:</h3>
                <p><strong>Test Zamanı:</strong> ${new Date().toLocaleString('tr-TR')}</p>
                <p><strong>Alıcı Email:</strong> ${email}</p>
                <p><strong>Gönderen:</strong> ${fromEmail}</p>
                <p><strong>API Key Status:</strong> ${process.env.RESEND_API_KEY ? 'CONFIGURED' : 'NOT SET'}</p>
              </div>
              <p>Bu test email'i restaurant rezervasyon sisteminin email servisini test etmek için gönderilmiştir.</p>
            </div>
          `
        });

        console.log(`✅ Test email sent successfully to ${email}:`, result);
        testResults.push({
          email,
          success: true,
          result,
          error: null
        });
        
      } catch (error) {
        console.error(`❌ Failed to send test email to ${email}:`, error);
        testResults.push({
          email,
          success: false,
          result: null,
          error: error.message
        });
      }
    }

    console.log('📊 Test Results Summary:', testResults);

    return res.status(200).json({
      success: true,
      message: 'Email test completed',
      results: testResults,
      config: {
        resendConfigured: !!process.env.RESEND_API_KEY,
        restaurantEmail: process.env.RESTAURANT_EMAIL,
        fromEmail,
        testEmails
      }
    });

  } catch (error) {
    console.error('❌ EMAIL TEST ERROR:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 