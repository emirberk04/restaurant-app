'use client';

import { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { nanoid } from 'nanoid';

interface Table {
  id: string;
  number: number;
  qrCode: string;
}

export default function QRCodeManager() {
  const [tables, setTables] = useState<Table[]>([]);
  const [newTableNumber, setNewTableNumber] = useState('');

  const generateQRCode = () => {
    if (!newTableNumber || isNaN(Number(newTableNumber))) {
      alert('Lütfen geçerli bir masa numarası girin');
      return;
    }

    const tableNumber = Number(newTableNumber);
    const tableId = nanoid();
    const qrCodeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/menu/${tableId}`;

    const newTable: Table = {
      id: tableId,
      number: tableNumber,
      qrCode: qrCodeUrl,
    };

    setTables([...tables, newTable]);
    setNewTableNumber('');
  };

  const downloadQRCode = (table: Table) => {
    const canvas = document.getElementById(`qr-code-${table.id}`) as HTMLCanvasElement;
    if (!canvas) return;

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `masa-${table.number}-qr.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">QR Kod Yönetimi</h1>

      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Yeni QR Kod Oluştur</h2>
        <div className="flex gap-4">
          <input
            type="number"
            value={newTableNumber}
            onChange={(e) => setNewTableNumber(e.target.value)}
            placeholder="Masa Numarası"
            className="flex-1 p-2 border rounded-md"
          />
          <button
            onClick={generateQRCode}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            QR Kod Oluştur
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div
            key={table.id}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
          >
            <h3 className="text-lg font-semibold mb-4">Masa {table.number}</h3>
            <div className="mb-4">
              <QRCodeCanvas
                id={`qr-code-${table.id}`}
                value={table.qrCode}
                size={200}
                level="H"
                includeMargin
              />
            </div>
            <button
              onClick={() => downloadQRCode(table)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              QR Kodu İndir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 