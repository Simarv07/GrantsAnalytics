import React, { useEffect, useState } from 'react';
import { fetchTopRecipients } from '../api/db';

const TopRecipientsReport = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchTopRecipients();
        setData(result);
      } catch (error) {
        console.error('Error loading recipient data:', error);
      }
    };
    loadData();
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl border border-sky-100 bg-gradient-to-br from-white to-slate-50 p-3 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-600" />

      <div className="mb-3 flex items-center gap-2 sm:mb-4">
        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Top Grant Recipients</h2>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="block sm:hidden">
        <div className="space-y-3">
          {data.map((recipient, index) => (
            <div key={index} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className={`inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold text-white ${index < 3 ? 'bg-amber-600' : 'bg-slate-500'}`}>#{index + 1}</span>
                <span className={`text-sm text-slate-900 ${index < 3 ? 'font-semibold' : ''}`}>{recipient.LegalName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-semibold text-slate-600">Total Amount:</span>
                  <div className="font-semibold text-emerald-700">${Number(recipient.totalAmount).toLocaleString()}</div>
                </div>
                <div>
                  <span className="font-semibold text-slate-600">Grants:</span>
                  <div className="text-slate-900">{Number(recipient.grantCount).toLocaleString()}</div>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-slate-600">Average Grant:</span>
                  <div className="text-slate-700">${Math.round(Number(recipient.totalAmount) / Number(recipient.grantCount)).toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View - Table Layout */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 sm:block">
        <div className="grid grid-cols-12 bg-slate-50/60 text-left text-sm font-semibold text-slate-700">
          <div className="col-span-6 px-4 py-2">Recipient Name</div>
          <div className="col-span-2 px-4 py-2 text-right">Total Amount</div>
          <div className="col-span-2 px-4 py-2 text-right">Number of Grants</div>
          <div className="col-span-2 px-4 py-2 text-center">Average Grant</div>
        </div>
        <div className="divide-y divide-slate-200">
          {data.map((recipient, index) => (
            <div key={index} className="grid grid-cols-12 items-center bg-white/70 hover:bg-slate-50">
              <div className="col-span-6 px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex min-w-8 items-center justify-center rounded-full px-2 py-0.5 text-sm font-bold text-white ${index < 3 ? 'bg-amber-600' : 'bg-slate-500'}`}>#{index + 1}</span>
                  <span className={`text-base text-slate-900 ${index < 3 ? 'font-semibold' : ''}`}>{recipient.LegalName}</span>
                </div>
              </div>
              <div className="col-span-2 px-4 py-2 text-right">
                <span className="text-base font-semibold text-emerald-700">${Number(recipient.totalAmount).toLocaleString()}</span>
              </div>
              <div className="col-span-2 px-4 py-2 text-right">
                <span className="text-base text-slate-900">{Number(recipient.grantCount).toLocaleString()}</span>
              </div>
              <div className="col-span-2 px-4 py-2 text-center">
                <span className="text-base text-slate-700">${Math.round(Number(recipient.totalAmount) / Number(recipient.grantCount)).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Key Insights</h3>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 sm:gap-3">
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-2 sm:rounded-xl sm:p-3">
            <div className="text-xs font-semibold text-amber-800 sm:text-sm">Top Recipient</div>
            <div className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">{data[0]?.LegalName}</div>
            <div className="text-xs text-slate-700 sm:text-sm">${data[0]?.totalAmount?.toLocaleString()} across {data[0]?.grantCount} grants</div>
          </div>
          <div className="rounded-lg border border-sky-300 bg-sky-50 p-2 sm:rounded-xl sm:p-3">
            <div className="text-xs font-semibold text-sky-800 sm:text-sm">Total Recipients</div>
            <div className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">{data.length}</div>
            <div className="text-xs text-slate-700 sm:text-sm">Organizations receiving grants</div>
          </div>
          <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-2 sm:rounded-xl sm:p-3">
            <div className="text-xs font-semibold text-emerald-800 sm:text-sm">Average Grant Size</div>
            <div className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">${Math.round((data.reduce((sum, r) => sum + (Number(r.totalAmount) / Number(r.grantCount)), 0) / (data.length || 1)) || 0).toLocaleString()}</div>
            <div className="text-xs text-slate-700 sm:text-sm">Per grant across all recipients</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopRecipientsReport;


