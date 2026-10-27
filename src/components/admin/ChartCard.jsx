import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const ChartCard = ({ title, data, dataKey = "total", xAxisKey = "name" }) => {
  return (
    <div className="chart-card data-card">
      <div className="chart-header">
        <h3>{title}</h3>
      </div>
      <div className="chart-body" style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5D6C3" />
            <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fill: '#9B7A48' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9B7A48' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(50, 27, 22, 0.08)' }} 
              itemStyle={{ color: '#321B16', fontWeight: 'bold' }}
            />
            {/* Menggunakan warna Dark Cocoa Pawtner */}
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke="#321B16" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#321B16', strokeWidth: 0 }} 
              activeDot={{ r: 6, fill: '#9B7A48' }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartCard;