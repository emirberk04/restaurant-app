'use client';

import { useState } from 'react';

interface TestResult {
  email: string;
  success: boolean;
  result?: any;
  error?: string;
}

interface TestResponse {
  success: boolean;
  message?: string;
  error?: string;
  results?: TestResult[];
  config?: {
    resendConfigured: boolean;
    restaurantEmail?: string;
    fromEmail: string;
    testEmails?: string[];
  };
}

export default function TestEmailPage() {
  const [testEmail, setTestEmail] = useState('emirberkalan2@gmail.com');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResponse | null>(null);

  const handleTestEmail = async () => {
    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testEmail: testEmail,
        }),
      });

      const data = await response.json();
      setResults(data);
      
      console.log('Test email results:', data);
      
    } catch (error) {
      console.error('Test email error:', error);
      setResults({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📧 Email Test Sayfası</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Email Sistemi Testi</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Test Email Adresi:</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Test email adresini girin"
            />
          </div>
          
          <button
            onClick={handleTestEmail}
            disabled={isLoading}
            className={`w-full py-3 px-6 text-white rounded-md transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Test Ediliyor...' : '🧪 Email Testi Yap'}
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Test Sonuçları:</h3>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${results.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
              <p className={`font-semibold ${results.success ? 'text-green-800' : 'text-red-800'}`}>
                {results.success ? '✅ Test Tamamlandı' : '❌ Test Başarısız'}
              </p>
              <p className="text-sm mt-1">
                {results.message}
              </p>
            </div>

            {results.config && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📋 Konfigürasyon:</h4>
                <ul className="space-y-1 text-sm">
                  <li><strong>Resend API:</strong> {results.config.resendConfigured ? '✅ Configured' : '❌ Not Configured'}</li>
                  <li><strong>Restaurant Email:</strong> {results.config.restaurantEmail || '❌ Not Set'}</li>
                  <li><strong>From Email:</strong> {results.config.fromEmail}</li>
                  <li><strong>Test Emails:</strong> {results.config.testEmails?.join(', ')}</li>
                </ul>
              </div>
            )}

            {results.results && (
              <div className="space-y-3">
                <h4 className="font-semibold">📊 Detaylı Sonuçlar:</h4>
                {results.results.map((result, index) => (
                  <div key={index} className={`p-3 rounded border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{result.email}</span>
                      <span className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                        {result.success ? '✅ Başarılı' : '❌ Başarısız'}
                      </span>
                    </div>
                    {result.error && (
                      <p className="text-red-600 text-sm mt-1">{result.error}</p>
                    )}
                    {result.result && (
                      <p className="text-green-600 text-sm mt-1">ID: {result.result.id}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Bu sayfa email sisteminin çalışıp çalışmadığını test etmek içindir.<br/>
          Console'da detaylı logları görebilirsiniz.
        </p>
      </div>
    </div>
  );
} 