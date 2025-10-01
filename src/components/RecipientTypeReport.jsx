import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchGrantsByRecipientType } from '../api/db';

const RecipientTypeReport = () => {
  const [data, setData] = useState([]);

  const formatRecipientType = (type) => {
    switch (type) {
      case 'F':
        return 'For-Profit';
      case 'N':
        return 'Non-Profit';
      default:
        return type;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchGrantsByRecipientType();
        const processed = result.map((item) => ({ ...item, recipientType: formatRecipientType(item.recipientType) }));
        setData(processed);
      } catch (error) {
        console.error('Error loading recipient type data:', error);
      }
    };
    loadData();
  }, []);

  const formatTooltip = (value) => `$${Number(value).toLocaleString()}`;

  return (
    <div className="relative overflow-hidden rounded-xl border border-indigo-100 bg-gradient-to-br from-white to-slate-50 p-3 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-400 to-violet-500" />

      <div className="mb-3 flex items-center gap-2 sm:mb-4">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-50 text-indigo-600 sm:h-7 sm:w-7">🏢</span>
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Funding Distribution by Recipient Type</h2>
      </div>

      <div className="mb-4 h-[250px] sm:mb-6 sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="recipientType" tick={{ fontSize: 11, fill: '#334155' }} />
            <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} tick={{ fontSize: 11, fill: '#334155' }} />
            <Tooltip 
              formatter={formatTooltip} 
              labelFormatter={(label) => `Recipient Type: ${label}`} 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '12px' }}
              labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              itemStyle={{ color: '#0f172a' }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Legend />
            <Bar dataKey="totalAmount" name="Total Funding" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 sm:mt-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-indigo-50 text-indigo-600 sm:h-6 sm:w-6">📈</span>
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Key Insights</h3>
        </div>
        <div className="flex flex-col gap-2 sm:gap-3">
          {data.map((item) => (
            <div key={item.recipientType} className="rounded-lg border border-slate-300 bg-white p-2 sm:rounded-xl sm:p-3">
              <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                <span className="inline-flex rounded bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 sm:text-sm">{item.recipientType}</span>
                <span className="text-xs text-slate-700 sm:text-sm">
                  {((item.totalAmount / data.reduce((sum, d) => sum + d.totalAmount, 0)) * 100).toFixed(1)}% of total funding
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
                <div className="text-xs text-slate-800 sm:text-sm"><span className="font-semibold">Total Funding:</span> ${Number(item.totalAmount).toLocaleString()}</div>
                <div className="text-xs text-slate-800 sm:text-sm"><span className="font-semibold">Grants:</span> {Number(item.grantCount).toLocaleString()}</div>
                <div className="text-xs text-slate-800 sm:text-sm"><span className="font-semibold">Avg Size:</span> ${Number(item.averageGrantSize).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipientTypeReport;


