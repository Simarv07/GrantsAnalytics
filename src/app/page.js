"use client";
import React, { useEffect, useState } from 'react';
import ProvinceReport from '../components/ProvinceReport';
import ProgramReport from '../components/ProgramReport';
import TopRecipientsReport from '../components/TopRecipientsReport';
import RecipientTypeReport from '../components/RecipientTypeReport';
import { fetchGrantsByRecipientType, fetchGrantsByProvince, fetchGrantsByProgram, fetchTopRecipients } from '../api/db';

export default function Home() {
  const [summaryStats, setSummaryStats] = useState(null);

  useEffect(() => {
    const loadSummaryStats = async () => {
      try {
        const [recipientData, provinceData, programData, topRecipients] = await Promise.all([
          fetchGrantsByRecipientType(),
          fetchGrantsByProvince(),
          fetchGrantsByProgram(),
          fetchTopRecipients()
        ]);

        const totalGrants = recipientData.reduce((sum, item) => sum + Number(item.grantCount), 0);
        const totalAmount = recipientData.reduce((sum, item) => sum + Number(item.totalAmount), 0);
        const avgGrantSize = totalGrants ? totalAmount / totalGrants : 0;
        const topProvince = (provinceData.reduce((max, item) => (item.totalAmount > max.totalAmount ? item : max), provinceData[0]) || {}).Province || 'N/A';

        setSummaryStats({ totalGrants, totalAmount, avgGrantSize, topProvince });
      } catch (error) {
        console.error('Error loading summary stats:', error);
      }
    };
    loadSummaryStats();
  }, []);

  const StatCard = ({ title, value, icon, color = '#6366f1' }) => (
    <div className="group h-full transform rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-2 flex justify-center" style={{ color }}>{icon}</div>
      <div className="mb-1 text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-sm font-medium text-slate-600">{title}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="shadow-sm">
        <div className="bg-gradient-to-r from-indigo-500 to-violet-600">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📊</span>
              <h1 className="text-lg font-bold text-white">Grants Reporting Dashboard</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <section className="mb-10">
          <h2 className="mb-5 bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl py-2">
            Government Grants Analytics
          </h2>
          <p className="mx-auto mb-6 max-w-3xl text-center text-slate-600">
            Comprehensive insights into government grant distribution, recipient analysis, and funding patterns across Canada from 2024 to 2025.
          </p>

          {summaryStats && (
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
              <StatCard
                title="Total Grants Awarded"
                value={summaryStats.totalGrants.toLocaleString()}
                icon={<span className="text-3xl">🧮</span>}
                color="#6366f1"
              />
              <StatCard
                title="Total Funding"
                value={`$${(summaryStats.totalAmount / 1000000).toFixed(1)}M`}
                icon={<span className="text-3xl">📈</span>}
                color="#10b981"
              />
              <StatCard
                title="Average Grant Size"
                value={`$${(summaryStats.avgGrantSize / 1000).toFixed(0)}K`}
                icon={<span className="text-3xl">🏢</span>}
                color="#ef4444"
              />
              <StatCard
                title="Top Province"
                value={summaryStats.topProvince}
                icon={<span className="text-3xl">📍</span>}
                color="#14b8a6"
              />
            </div>
          )}

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">Detailed Analysis</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RecipientTypeReport />
            <ProvinceReport />
          </div>
          <ProgramReport />
          <TopRecipientsReport />
        </section>


      </main>

      <footer>
        <div className="mx-auto max-w-7xl px-4 py-8">
          <p className="text-center text-slate-600">Data retrieved from the Federal Grants and Contributions dataset.</p>
        </div>
      </footer>
    </div>
  );
}
