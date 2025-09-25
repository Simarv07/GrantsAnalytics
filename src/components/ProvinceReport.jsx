import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchGrantsByProvince } from '../api/db';

const ProvinceReport = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchGrantsByProvince();
        setData(result);
      } catch (error) {
        console.error('Error loading province data:', error);
      }
    };
    loadData();
  }, []);

  const formatYAxis = (value) => `$${(value / 1000000).toFixed(1)}M`;
  const formatTooltip = (value) => `$${Number(value).toLocaleString()}`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-slate-50 p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />

      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">📍</span>
        <h2 className="text-xl font-bold text-slate-900">Grants Distribution by Province</h2>
      </div>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="Province" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 13, fill: '#334155' }} />
            <YAxis tickFormatter={formatYAxis} width={80} tick={{ fontSize: 14, fill: '#334155' }} />
            <Tooltip 
              formatter={formatTooltip} 
              labelFormatter={(label) => `Province: ${label}`} 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 8 }}
              labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              itemStyle={{ color: '#0f172a' }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Legend />
            <Bar dataKey="totalAmount" name="Total Grant Amount" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-emerald-50 text-emerald-600">📈</span>
          <h3 className="text-lg font-semibold text-slate-900">Geographic Insights</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.slice(0, 3).map((province, index) => (
            <div key={province.Province} className="rounded-xl border border-emerald-200 bg-white p-3">
              <div className="text-sm font-semibold text-emerald-800">#{index + 1} {province.Province}</div>
              <div className="mt-1 text-xl font-bold text-slate-900">${(province.totalAmount / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-slate-700">
                {((province.totalAmount / data.reduce((sum, d) => sum + d.totalAmount, 0)) * 100).toFixed(1)}% of total funding
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProvinceReport;


