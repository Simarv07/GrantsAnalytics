import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchGrantsByProgram } from '../api/db';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1'];

const ProgramReport = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchGrantsByProgram();
        const processedData = result.map((item) => ({
          ...item,
          ProgramName: String(item.ProgramName).replace('Industrial Research Assistance Program ? ', '')
        }));
        setData(processedData);
      } catch (error) {
        console.error('Error loading program data:', error);
      }
    };
    loadData();
  }, []);

  const formatTooltip = (value) => `$${Number(value).toLocaleString()}`;

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#fff" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-slate-50 p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-400 to-amber-400" />

      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-amber-50 text-amber-600">📊</span>
        <h2 className="text-xl font-bold text-slate-900">Grants Distribution by Program</h2>
      </div>

      <div className="mb-6 h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 30, left: 30, bottom: 80 }}>
            <Pie data={data} dataKey="totalAmount" nameKey="ProgramName" cx="50%" cy="50%" outerRadius={180} label={renderCustomizedLabel} labelLine={false}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={formatTooltip} 
              labelFormatter={(label) => `Program: ${label}`} 
              contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: 8 }}
              labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              itemStyle={{ color: '#0f172a' }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-amber-50 text-amber-600">📈</span>
          <h3 className="text-lg font-semibold text-slate-900">Program Analysis</h3>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {data.slice(0, 4).map((program, index) => (
            <div key={program.ProgramName} className="rounded-xl border border-slate-300 bg-white p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="truncate text-sm font-medium text-slate-800">{program.ProgramName}</span>
              </div>
              <div className="text-xl font-bold text-slate-900">${(program.totalAmount / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-slate-700">
                {((program.totalAmount / data.reduce((sum, d) => sum + d.totalAmount, 0)) * 100).toFixed(1)}% of total funding
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramReport;


