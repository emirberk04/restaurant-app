import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
const getCustomerEmailTemplate = (reservation) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rezervasyon Onayı - Elegance Restaurant</title>
    <style>
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0 0 10px 0; 
            font-size: 28px; 
            font-weight: bold; 
        }
        .header h2 { 
            margin: 0; 
            font-size: 18px; 
            font-weight: normal; 
            opacity: 0.9; 
        }
        .content { 
            padding: 30px; 
            background-color: #f8fafc; 
        }
        .details { 
            background-color: white; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 8px; 
            border-left: 4px solid #2563eb; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .details h3 { 
            margin: 0 0 15px 0; 
            color: #2563eb; 
            font-size: 18px; 
        }
        .detail-row { 
            display: flex; 
            margin-bottom: 10px; 
            align-items: center; 
        }
        .detail-label { 
            font-weight: bold; 
            color: #4b5563; 
            min-width: 120px; 
        }
        .detail-value { 
            color: #1f2937; 
        }
        .restaurant-info {
            background-color: #e0f2fe;
            border-left: 4px solid #0284c7;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .restaurant-info h3 {
            color: #0284c7;
            margin: 0 0 15px 0;
            font-size: 18px;
        }
        .cancel-section {
            background-color: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            text-align: center;
        }
        .cancel-button {
            display: inline-block;
            background-color: #ef4444;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin-top: 10px;
        }
        .cancel-button:hover {
            background-color: #dc2626;
        }
        .footer { 
            background-color: #1f2937; 
            color: #d1d5db; 
            text-align: center; 
            padding: 25px; 
        }
        .footer p { 
            margin: 5px 0; 
        }
        .status-badge {
            display: inline-block;
            background-color: #fbbf24;
            color: #92400e;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 10px;
        }
        .info-item {
            display: flex;
            align-items: center;
            color: #1f2937;
        }
        .info-item strong {
            margin-left: 5px;
        }
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
            
            <p>Rezervasyonunuz başarıyla alınmıştır! Aşağıda rezervasyon detaylarınızı bulabilirsiniz:</p>
            
            <div class="details">
                <h3>📋 Rezervasyon Detayları</h3>
                <div class="detail-row">
                    <span class="detail-label">Rezervasyon ID:</span>
                    <span class="detail-value">#${reservation.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">İsim:</span>
                    <span class="detail-value">${reservation.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Tarih:</span>
                    <span class="detail-value">${new Date(reservation.date).toLocaleDateString('tr-TR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Saat:</span>
                    <span class="detail-value">${reservation.time}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Kişi Sayısı:</span>
                    <span class="detail-value">${reservation.numberOfGuests} kişi</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Telefon:</span>
                    <span class="detail-value">${reservation.phoneNumber}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Durum:</span>
                    <span class="detail-value"><span class="status-badge">Onay Bekliyor</span></span>
                </div>
                ${reservation.specialRequests ? `
                <div class="detail-row">
                    <span class="detail-label">Özel İstekler:</span>
                    <span class="detail-value">${reservation.specialRequests}</span>
                </div>
                ` : ''}
            </div>

            <div class="restaurant-info">
                <h3>🏪 Restaurant Bilgileri</h3>
                <div class="info-grid">
                    <div class="info-item">📍 <strong>Adres:</strong></div>
                    <div>Elegance Restaurant<br>Bağdat Caddesi No: 123<br>Kadıköy, İstanbul 34710</div>
                    <div class="info-item">📞 <strong>Telefon:</strong></div>
                    <div>(0216) 555-0123</div>
                    <div class="info-item">📧 <strong>Email:</strong></div>
                    <div>info@elegancerestaurant.com</div>
                    <div class="info-item">🕒 <strong>Çalışma Saatleri:</strong></div>
                    <div>Pazartesi - Pazar<br>11:00 - 23:00</div>
                </div>
                <p style="margin-top: 15px;"><strong>🚗 Valet Park Hizmeti:</strong> Ücretsiz valet park hizmetimiz mevcuttur.</p>
                <p><strong>🎉 Özel Günler:</strong> Doğum günü ve özel günleriniz için özel masa düzenlemelerimiz bulunmaktadır.</p>
            </div>
            
            <p><strong>📞 Rezervasyonunuz 24 saat içinde onaylanacaktır.</strong></p>
            <p>Herhangi bir değişiklik için bizimle iletişime geçebilirsiniz.</p>

            <div class="cancel-section">
                <h3 style="color: #ef4444; margin: 0 0 10px 0;">❌ Rezervasyon İptali</h3>
                <p>Rezervasyonunuzu iptal etmek istiyorsanız aşağıdaki butona tıklayın veya bizimle iletişime geçin.</p>
                <a href="mailto:info@elegancerestaurant.com?subject=Rezervasyon İptali - #${reservation.id}&body=Merhaba,%0A%0A#${reservation.id} numaralı rezervasyonumu iptal etmek istiyorum.%0A%0AAdım: ${reservation.name}%0ATarih: ${new Date(reservation.date).toLocaleDateString('tr-TR')}%0ASaat: ${reservation.time}%0A%0ATeşekkürler." class="cancel-button">
                    Rezervasyonu İptal Et
                </a>
                <p style="margin-top: 10px; font-size: 14px; color: #6b7280;">
                    * Rezervasyon iptal işlemleri için en az 2 saat önceden bilgi vermeniz gerekmektedir.
                </p>
            </div>
            
            <p>Sizi restoranumuza beklemekten mutluluk duyuyoruz!</p>
        </div>
        
        <div class="footer">
            <p><strong>📍 Elegance Restaurant</strong></p>
            <p>Bağdat Caddesi No: 123, Kadıköy, İstanbul 34710</p>
            <p>📞 (0216) 555-0123 | 📧 info@elegancerestaurant.com</p>
            <p>🌐 www.elegancerestaurant.com | 📱 @elegancerestaurant</p>
            <p style="margin-top: 15px;">Teşekkürler,<br><strong>Elegance Restaurant Ekibi</strong></p>
        </div>
    </div>
</body>
</html>
`;

const getRestaurantEmailTemplate = (reservation) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>🔔 Yeni Rezervasyon - Elegance Restaurant</title>
    <style>
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
            color: white; 
            padding: 30px 20px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0 0 10px 0; 
            font-size: 24px; 
            font-weight: bold; 
        }
        .header p { 
            margin: 0; 
            font-size: 16px; 
            opacity: 0.9; 
        }
        .urgent { 
            background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
            color: #92400e; 
            padding: 20px; 
            margin: 0;
            text-align: center;
            font-weight: bold;
        }
        .content { 
            padding: 30px; 
            background-color: #f8fafc; 
        }
        .details { 
            background-color: white; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 8px; 
            border-left: 4px solid #dc2626; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .details h3 { 
            margin: 0 0 15px 0; 
            color: #dc2626; 
            font-size: 18px; 
        }
        .detail-row { 
            display: flex; 
            margin-bottom: 10px; 
            align-items: center; 
        }
        .detail-label { 
            font-weight: bold; 
            color: #4b5563; 
            min-width: 120px; 
        }
        .detail-value { 
            color: #1f2937; 
        }
        .action-needed {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
            border-radius: 8px;
            padding: 25px;
            margin: 20px 0;
            text-align: center;
        }
        .action-needed h3 {
            margin: 0 0 15px 0;
            font-size: 20px;
        }
        .action-list {
            background-color: rgba(255,255,255,0.1);
            border-radius: 6px;
            padding: 15px;
            margin: 15px 0;
            text-align: left;
        }
        .action-list ol {
            margin: 0;
            padding-left: 20px;
        }
        .action-list li {
            margin-bottom: 8px;
            font-weight: 500;
        }
        .quick-actions {
            background-color: #e0f2fe;
            border-left: 4px solid #0284c7;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .quick-actions h3 {
            color: #0284c7;
            margin: 0 0 15px 0;
            font-size: 18px;
        }
        .action-button {
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 5px 10px 5px 0;
        }
        .confirm-button {
            background-color: #16a34a;
        }
        .reject-button {
            background-color: #dc2626;
        }
        .footer { 
            background-color: #1f2937; 
            color: #d1d5db; 
            text-align: center; 
            padding: 25px; 
        }
        .footer p { 
            margin: 5px 0; 
        }
        .priority-high {
            background-color: #fee2e2;
            border: 2px solid #ef4444;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        .priority-high h4 {
            color: #dc2626;
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        .time-info {
            background-color: #f0f9ff;
            border-left: 4px solid #0ea5e9;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 YENİ REZERVASYON ALERTİ</h1>
            <p>Acil Onay Gerektiren Rezervasyon</p>
        </div>
        
        <div class="urgent">
            ⚠️ YÜKSEKİ ÖNCELİKLİ: Yeni rezervasyon 24 saat içinde onaylanmalıdır!
        </div>
        
        <div class="content">
            <div class="priority-high">
                <h4>🚨 ACİL EYLEM GEREKTİRİR</h4>
                <p>Bu rezervasyon <strong>${new Date().toLocaleString('tr-TR')}</strong> tarihinde alınmıştır.</p>
                <p><strong>Son onay tarihi:</strong> ${new Date(Date.now() + 24*60*60*1000).toLocaleString('tr-TR')}</p>
            </div>
            
            <div class="details">
                <h3>👤 Müşteri Bilgileri</h3>
                <div class="detail-row">
                    <span class="detail-label">Rezervasyon ID:</span>
                    <span class="detail-value"><strong>#${reservation.id}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Ad Soyad:</span>
                    <span class="detail-value">${reservation.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">E-posta:</span>
                    <span class="detail-value">${reservation.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Telefon:</span>
                    <span class="detail-value">${reservation.phoneNumber}</span>
                </div>
            </div>
            
            <div class="details">
                <h3>📅 Rezervasyon Detayları</h3>
                <div class="detail-row">
                    <span class="detail-label">Tarih:</span>
                    <span class="detail-value"><strong>${new Date(reservation.date).toLocaleDateString('tr-TR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Saat:</span>
                    <span class="detail-value"><strong>${reservation.time}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Kişi Sayısı:</span>
                    <span class="detail-value"><strong>${reservation.numberOfGuests} kişi</strong></span>
                </div>
                ${reservation.specialRequests ? `
                <div class="detail-row">
                    <span class="detail-label">Özel İstekler:</span>
                    <span class="detail-value">${reservation.specialRequests}</span>
                </div>
                ` : ''}
            </div>

            <div class="quick-actions">
                <h3>⚡ Hızlı Eylemler</h3>
                <a href="tel:${reservation.phoneNumber}" class="action-button">
                    📞 Müşteriyi Ara
                </a>
                <a href="mailto:${reservation.email}?subject=Rezervasyon Onayı - #${reservation.id}&body=Sayın ${reservation.name},%0A%0A#${reservation.id} numaralı rezervasyonunuz onaylanmıştır.%0A%0ATarih: ${new Date(reservation.date).toLocaleDateString('tr-TR')}%0ASaat: ${reservation.time}%0AKişi Sayısı: ${reservation.numberOfGuests}%0A%0ASizi restoranımızda ağırlamaktan mutluluk duyacağız.%0A%0AElegance Restaurant" class="action-button confirm-button">
                    ✅ Onay E-postası Gönder
                </a>
                <a href="mailto:${reservation.email}?subject=Rezervasyon İptali - #${reservation.id}&body=Sayın ${reservation.name},%0A%0AMaalesef #${reservation.id} numaralı rezervasyonunuzu kabul edemiyoruz.%0A%0ATarih: ${new Date(reservation.date).toLocaleDateString('tr-TR')}%0ASaat: ${reservation.time}%0A%0ABaşka bir tarih için rezervasyon yapmak isterseniz bizimle iletişime geçebilirsiniz.%0A%0AElegance Restaurant" class="action-button reject-button">
                    ❌ Red E-postası Gönder
                </a>
            </div>
            
            <div class="action-needed">
                <h3>🎯 YAPILMASI GEREKEN İŞLEMLER</h3>
                <div class="action-list">
                    <ol>
                        <li>Müşterinin telefon numarasını arayarak rezervasyonu onaylayın</li>
                        <li>Restaurant rezervasyon takvimini kontrol edin</li>
                        <li>Masa düzenlemesini yapın (${reservation.numberOfGuests} kişi için)</li>
                        <li>Özel istekleri not alın ve hazırlık yapın</li>
                        <li>Müşteriye onay e-postası gönderin</li>
                        <li>Rezervasyon defterine kaydedin</li>
                    </ol>
                </div>
            </div>

            <div class="time-info">
                <p><strong>⏰ Önemli Zaman Bilgileri:</strong></p>
                <p>• Rezervasyon oluşturma: ${new Date().toLocaleString('tr-TR')}</p>
                <p>• Rezervasyon tarihi: ${new Date(reservation.date).toLocaleDateString('tr-TR')} - ${reservation.time}</p>
                <p>• Onay deadline'ı: ${new Date(Date.now() + 24*60*60*1000).toLocaleString('tr-TR')}</p>
            </div>
            
            <p style="text-align: center; font-weight: bold; color: #dc2626;">
                ⚠️ Bu rezervasyonu 24 saat içinde onaylamayı unutmayın!
            </p>
        </div>
        
        <div class="footer">
            <p><strong>📍 Elegance Restaurant Management System</strong></p>
            <p>Bağdat Caddesi No: 123, Kadıköy, İstanbul 34710</p>
            <p>📞 (0216) 555-0123 | 📧 info@elegancerestaurant.com</p>
            <p style="margin-top: 15px;"><strong>Restaurant Yönetim Ekibi</strong></p>
        </div>
    </div>
</body>
</html>
`;

export default async function handler(req, res) {
  console.log('📧 EMAIL API DEBUG - BAŞLANGIC');
  console.log('📋 Request Method:', req.method);
  console.log('📋 Request Body:', req.body);
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    console.error('❌ Invalid request method:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Bu endpoint sadece POST isteklerini kabul eder' 
    });
  }

  try {
    // Check if Resend API key is configured
    console.log('🔑 Checking Resend API key...');
    console.log('🔑 RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY environment variable is not set');
      return res.status(500).json({ 
        error: 'Email service not configured',
        message: 'Email servisi yapılandırılmamış' 
      });
    }

    // Get reservation data from request body
    const { reservation } = req.body;
    console.log('📝 Extracted reservation data:', reservation);

    // Validate required fields
    if (!reservation) {
      console.error('❌ No reservation data provided');
      return res.status(400).json({ 
        error: 'Missing reservation data',
        message: 'Rezervasyon bilgileri eksik' 
      });
    }

    const requiredFields = ['id', 'name', 'email', 'phoneNumber', 'date', 'time', 'numberOfGuests'];
    console.log('🔍 Checking required fields:', requiredFields);
    
    const missingFields = requiredFields.filter(field => !reservation[field]);
    console.log('🔍 Missing fields check result:', missingFields);

    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: `Eksik alanlar: ${missingFields.join(', ')}`,
        missingFields 
      });
    }

    // Email addresses
    const customerEmail = reservation.email;
    const restaurantEmail = 'emirberkalan2@gmail.com'; // Restaurant owner email
    const fromEmail = process.env.EMAIL_FROM || 'Elegance Restaurant <onboarding@resend.dev>';

    console.log('📧 Email Configuration:');
    console.log('  - Customer Email:', customerEmail);
    console.log('  - Restaurant Email:', restaurantEmail);
    console.log('  - From Email:', fromEmail);
    console.log('  - RESTAURANT_EMAIL env:', process.env.RESTAURANT_EMAIL);
    console.log('  - EMAIL_FROM env:', process.env.EMAIL_FROM);

    // Prepare email data
    const customerEmailData = {
      from: fromEmail,
      to: [customerEmail],
      subject: `✅ Rezervasyon Onayı - #${reservation.id} | Elegance Restaurant`,
      html: getCustomerEmailTemplate(reservation),
    };

    const restaurantEmailData = {
      from: fromEmail,
      to: [restaurantEmail],
      subject: `🔔 YENİ REZERVASYON - ${reservation.name} | ${new Date(reservation.date).toLocaleDateString('tr-TR')}`,
      html: getRestaurantEmailTemplate(reservation),
    };

    console.log('📧 Email Data Prepared:');
    console.log('  - Customer email subject:', customerEmailData.subject);
    console.log('  - Restaurant email subject:', restaurantEmailData.subject);
    console.log('  - Customer email to:', customerEmailData.to);
    console.log('  - Restaurant email to:', restaurantEmailData.to);

    // Send emails in parallel
    console.log('🚀 Starting email sending process...');
    const emailPromises = [
      // Customer confirmation email
      resend.emails.send(customerEmailData),
      
      // Restaurant notification email
      resend.emails.send(restaurantEmailData)
    ];

    console.log('⏳ Waiting for emails to be sent...');
    // Wait for both emails to be sent
    const [customerResult, restaurantResult] = await Promise.allSettled(emailPromises);
    
    console.log('📧 Email sending completed');
    console.log('  - Customer result status:', customerResult.status);
    console.log('  - Restaurant result status:', restaurantResult.status);

    // Process results
    const results = {
      customer: {
        success: customerResult.status === 'fulfilled',
        data: customerResult.status === 'fulfilled' ? customerResult.value : null,
        error: customerResult.status === 'rejected' ? customerResult.reason : null
      },
      restaurant: {
        success: restaurantResult.status === 'fulfilled',
        data: restaurantResult.status === 'fulfilled' ? restaurantResult.value : null,
        error: restaurantResult.status === 'rejected' ? restaurantResult.reason : null
      }
    };

    // Log detailed results
    console.log('📧 Detailed Email Results:');
    console.log('  - Customer Email:');
    console.log('    * Success:', results.customer.success);
    console.log('    * Data:', results.customer.data);
    console.log('    * Error:', results.customer.error);
    console.log('  - Restaurant Email:');
    console.log('    * Success:', results.restaurant.success);
    console.log('    * Data:', results.restaurant.data);
    console.log('    * Error:', results.restaurant.error);

    // Determine overall success
    const allSuccess = results.customer.success && results.restaurant.success;
    const partialSuccess = results.customer.success || results.restaurant.success;

    console.log('📊 Email Success Summary:');
    console.log('  - All Success:', allSuccess);
    console.log('  - Partial Success:', partialSuccess);

    if (allSuccess) {
      console.log('✅ All emails sent successfully');
      return res.status(200).json({
        success: true,
        message: 'Tüm emailler başarıyla gönderildi',
        results
      });
    } else if (partialSuccess) {
      console.log('⚠️ Some emails failed to send');
      return res.status(207).json({
        success: false,
        message: 'Bazı emailler gönderilemedi',
        results
      });
    } else {
      console.log('❌ All emails failed to send');
      return res.status(500).json({
        success: false,
        message: 'Hiçbir email gönderilemedi',
        results
      });
    }

  } catch (error) {
    console.error('❌ EMAIL API HATASI:');
    console.error('  - Error message:', error.message);
    console.error('  - Error object:', error);
    console.error('  - Error stack:', error.stack);
    console.log('🏁 EMAIL API DEBUG - HATA İLE BİTİŞ');
    
          return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Email gönderilirken beklenmeyen bir hata oluştu',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
  }
  
  console.log('🏁 EMAIL API DEBUG - NORMAL BİTİŞ');
} 