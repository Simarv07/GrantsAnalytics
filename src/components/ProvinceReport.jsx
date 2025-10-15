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
    <div className="relative overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-br from-white to-slate-50 p-3 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />

      <div className="mb-3 flex items-center gap-2 sm:mb-4">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Grants Distribution by Province</h2>
      </div>

      <div className="h-[250px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="Province" angle={-45} textAnchor="end" height={60} interval={0} tick={{ fontSize: 10, fill: '#334155' }} />
            <YAxis tickFormatter={formatYAxis} width={60} tick={{ fontSize: 11, fill: '#334155' }} />
            <Tooltip 
              formatter={formatTooltip} 
              labelFormatter={(label) => `Province: ${label}`} 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: '12px' }}
              labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              itemStyle={{ color: '#0f172a' }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Legend />
            <Bar dataKey="totalAmount" name="Total Grant Amount" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 sm:mt-6">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Geographic Insights</h3>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 sm:gap-3">
          {data.slice(0, 3).map((province, index) => (
            <div key={province.Province} className="rounded-lg border border-emerald-200 bg-white p-2 sm:rounded-xl sm:p-3">
              <div className="text-xs font-semibold text-emerald-800 sm:text-sm">#{index + 1} {province.Province}</div>
              <div className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">${(province.totalAmount / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-slate-700 sm:text-sm">
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


