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
            
            <p><strong>📞 Rezervasyonunuz 24 saat içinde onaylanacaktır.</strong></p>
            <p>Herhangi bir değişiklik veya iptal için bizimle iletişime geçebilirsiniz.</p>
            
            <p>Sizi restoranumuza beklemekten mutluluk duyuyoruz!</p>
        </div>
        
        <div class="footer">
            <p><strong>📍 Elegance Restaurant</strong></p>
            <p>123 Restaurant Street, İstanbul, Turkey</p>
            <p>📞 (555) 123-4567 | 📧 info@elegancerestaurant.com</p>
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
        }
        .header { 
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
            color: white; 
            padding: 25px; 
            text-align: center; 
        }
        .urgent { 
            background-color: #fef3c7; 
            border-left: 4px solid #f59e0b; 
            padding: 15px; 
            margin: 20px 0; 
            border-radius: 4px;
        }
        .urgent strong { 
            color: #92400e; 
        }
        .content { 
            padding: 25px; 
        }
        .details { 
            background-color: #f8fafc; 
            padding: 20px; 
            margin: 15px 0; 
            border-radius: 8px; 
            border: 1px solid #e5e7eb;
        }
        .details h3 { 
            margin: 0 0 15px 0; 
            color: #1f2937; 
            font-size: 18px; 
        }
        .detail-row { 
            margin-bottom: 8px; 
        }
        .detail-label { 
            font-weight: bold; 
            color: #4b5563; 
        }
        .detail-value { 
            color: #1f2937; 
        }
        .action-needed {
            background-color: #fee2e2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .action-needed h3 {
            color: #dc2626;
            margin: 0 0 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 YENİ REZERVASYON BİLDİRİMİ</h1>
            <p>Acil onay gerektiren rezervasyon</p>
        </div>
        
        <div class="content">
            <div class="urgent">
                <p><strong>⚠️ ACİL:</strong> Yeni bir rezervasyon alındı ve 24 saat içinde onaylanması gerekiyor!</p>
            </div>
            
            <div class="details">
                <h3>👤 Müşteri Bilgileri</h3>
                <div class="detail-row">
                    <span class="detail-label">Rezervasyon ID:</span>
                    <span class="detail-value">#${reservation.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">İsim:</span>
                    <span class="detail-value">${reservation.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
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
                ${reservation.specialRequests ? `
                <div class="detail-row">
                    <span class="detail-label">Özel İstekler:</span>
                    <span class="detail-value">${reservation.specialRequests}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="action-needed">
                <h3>🎯 YAPILMASI GEREKENLER</h3>
                <p>1. Rezervasyonu onaylayın veya reddedin</p>
                <p>2. Müşteriyi arayarak onay verin</p>
                <p>3. Restaurant takvimini güncelleyin</p>
            </div>
            
            <p><strong>Bu rezervasyon ${new Date().toLocaleString('tr-TR')} tarihinde oluşturulmuştur.</strong></p>
        </div>
    </div>
</body>
</html>
`;

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Bu endpoint sadece POST isteklerini kabul eder' 
    });
  }

  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set');
      return res.status(500).json({ 
        error: 'Email service not configured',
        message: 'Email servisi yapılandırılmamış' 
      });
    }

    // Get reservation data from request body
    const { reservation } = req.body;

    // Validate required fields
    if (!reservation) {
      return res.status(400).json({ 
        error: 'Missing reservation data',
        message: 'Rezervasyon bilgileri eksik' 
      });
    }

    const requiredFields = ['id', 'name', 'email', 'phoneNumber', 'date', 'time', 'numberOfGuests'];
    const missingFields = requiredFields.filter(field => !reservation[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: `Eksik alanlar: ${missingFields.join(', ')}`,
        missingFields 
      });
    }

    // Email addresses
    const customerEmail = reservation.email;
    const restaurantEmail = process.env.RESTAURANT_EMAIL || 'emirberkalan2@gmail.com';
    const fromEmail = process.env.EMAIL_FROM || 'Elegance Restaurant <noreply@elegancerestaurant.com>';

    console.log('Sending emails to:', { customerEmail, restaurantEmail });

    // Send emails in parallel
    const emailPromises = [
      // Customer confirmation email
      resend.emails.send({
        from: fromEmail,
        to: [customerEmail],
        subject: `✅ Rezervasyon Onayı - #${reservation.id} | Elegance Restaurant`,
        html: getCustomerEmailTemplate(reservation),
      }),
      
      // Restaurant notification email
      resend.emails.send({
        from: fromEmail,
        to: [restaurantEmail],
        subject: `🔔 YENİ REZERVASYON - ${reservation.name} | ${new Date(reservation.date).toLocaleDateString('tr-TR')}`,
        html: getRestaurantEmailTemplate(reservation),
      })
    ];

    // Wait for both emails to be sent
    const [customerResult, restaurantResult] = await Promise.allSettled(emailPromises);

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

    // Log results
    console.log('Email results:', {
      customerSuccess: results.customer.success,
      restaurantSuccess: results.restaurant.success
    });

    // Determine overall success
    const allSuccess = results.customer.success && results.restaurant.success;
    const partialSuccess = results.customer.success || results.restaurant.success;

    if (allSuccess) {
      return res.status(200).json({
        success: true,
        message: 'Tüm emailler başarıyla gönderildi',
        results
      });
    } else if (partialSuccess) {
      return res.status(207).json({
        success: false,
        message: 'Bazı emailler gönderilemedi',
        results
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Hiçbir email gönderilemedi',
        results
      });
    }

  } catch (error) {
    console.error('Send reservation email error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Email gönderilirken beklenmeyen bir hata oluştu',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 