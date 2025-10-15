import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchGrantsByProgram } from '../api/db';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1'];

const ProgramReport = () => {
  const [data, setData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatTooltip = (value) => `$${Number(value).toLocaleString()}`;

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central" 
        fontSize={isMobile ? 10 : 12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-orange-100 bg-gradient-to-br from-white to-slate-50 p-3 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-400 to-amber-400" />

      <div className="mb-3 flex items-center gap-2 sm:mb-4">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Grants Distribution by Program</h2>
      </div>

      <div className="mb-4 h-[280px] sm:mb-6 sm:h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 5, right: 5, left: 5, bottom: isMobile ? 40 : 50 }}>
            <Pie 
              data={data} 
              dataKey="totalAmount" 
              nameKey="ProgramName" 
              cx="50%" 
              cy="50%" 
              outerRadius={isMobile ? 80 : 140} 
              label={renderCustomizedLabel} 
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={formatTooltip} 
              labelFormatter={(label) => `Program: ${label}`} 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb', 
                borderRadius: 8, 
                fontSize: isMobile ? '11px' : '12px',
                padding: '8px'
              }}
              labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              itemStyle={{ color: '#0f172a' }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center" 
              wrapperStyle={{ 
                paddingTop: isMobile ? 5 : 8, 
                fontSize: isMobile ? '10px' : '12px' 
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 sm:mt-6">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Program Analysis</h3>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4 sm:gap-3">
          {data.slice(0, 4).map((program, index) => (
            <div key={program.ProgramName} className="rounded-lg border border-slate-300 bg-white p-2 sm:rounded-xl sm:p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full sm:h-3 sm:w-3" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="truncate text-xs font-medium text-slate-800 sm:text-sm">{program.ProgramName}</span>
              </div>
              <div className="text-lg font-bold text-slate-900 sm:text-xl">${(program.totalAmount / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-slate-700 sm:text-sm">
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