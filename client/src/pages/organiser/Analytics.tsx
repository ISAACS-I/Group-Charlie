import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, 
  Cell, LineChart, Line 
} from "recharts";
import { TrendingUp, Users, Wallet, Star, Download } from "lucide-react";

// Mock data for the Attendance Overview
const attendanceData = [
  { month: "Jan", value: 400 },
  { month: "Feb", value: 600 },
  { month: "Mar", value: 550 },
  { month: "Apr", value: 750 },
  { month: "May", value: 850 },
  { month: "Jun", value: 700 },
];

export default function Analytics() {
  return (
    <DashboardLayout 
      title="Analytics" 
      subtitle="Track event performance, attendee growth, and engagement across your events."
      showSponsor
    >
      <div className="space-y-6">
        {/* Top Filters & Export */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <select className="rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm text-gray-500 shadow-sm outline-none">
              <option>All Events</option>
            </select>
            <select className="rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm text-gray-500 shadow-sm outline-none">
              <option>Last 30 Days</option>
            </select>
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
            <Download size={16} />
            Export Report
          </button>
        </div>

        {/* 1. Stat Cards Row */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Attendees" value="1,248" trend="+12.4%" icon={<Users size={18} />} />
          <StatCard label="Attendance Rate" value="87%" trend="+4.2%" icon={<TrendingUp size={18} />} />
          <StatCard label="Revenue" value="P 32,500" trend="+18.7%" icon={<Wallet size={18} />} />
          <StatCard label="Average Rating" value="4.8" trend="Stable" icon={<Star size={18} />} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 2. Attendance Overview (Bar Chart) */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900">Attendance Overview</h3>
            <p className="mb-6 text-xs text-gray-400">Attendance trend across recent events.</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {attendanceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#6366f1' : '#818cf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. Quick Insights Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-bold text-gray-900">Quick Insights</h3>
              <div className="space-y-4">
                <InsightItem label="Peak Day" value="Saturday had the highest attendance this month." />
                <InsightItem label="Top Category" value="Technology events brought the most registrations." />
                <InsightItem label="Conversion" value="Most bookings came from repeat attendees." />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-bold text-gray-900">Recent Metrics</h3>
              <div className="space-y-3">
                <MetricRow label="New Registrations" value="+124" />
                <MetricRow label="Check-ins Today" value="85" />
                <MetricRow label="Refund Requests" value="4" />
                <MetricRow label="Avg. Ticket Price" value="P 125" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Row: Performance Breakdown & Top Event */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900">Event Performance Breakdown</h3>
            <p className="mb-6 text-xs text-gray-400">Quick comparison across your most recent events.</p>
            <div className="space-y-6">
              <PerformanceRow name="Tech Summit 2024" sub="312 attendees" progress={92} />
              <PerformanceRow name="UX Design Masterclass" sub="148 attendees" progress={78} />
              <PerformanceRow name="Startup Networking Night" sub="204 attendees" progress={84} />
              <PerformanceRow name="Digital Marketing Trends" sub="167 attendees" progress={69} />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
             <h3 className="text-base font-bold text-gray-900">Top Performing Event</h3>
             <p className="mb-4 text-xs text-gray-400">Most engagement this month.</p>
             <div className="rounded-xl bg-gray-50 p-4">
                <h4 className="font-bold text-gray-900">Tech Summit 2024</h4>
                <p className="mt-1 text-xs text-gray-500">312 attendees • 92% attendance rate • P 12,800 revenue</p>
                <span className="mt-3 inline-block rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold text-white uppercase">Best Performer</span>
             </div>

             
             <div className="mt-6 rounded-2xl bg-indigo-50/50 p-5">
                <h3 className="text-sm font-bold text-gray-900">Tips</h3>
                <ul className="mt-3 space-y-2 text-[11px] text-gray-500 list-disc pl-4">
                  <li>Track attendance rate after every event.</li>
                  <li>Compare event types to see what performs best.</li>
                  <li>Export reports before presentations or reviews.</li>
                </ul>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* Helper Components */

function StatCard({ label, value, trend, icon }: any) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between text-gray-400">
        <span className="text-xs font-medium">{label}</span>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
        <span className={`text-[10px] font-bold ${isPositive ? 'text-green-500' : 'text-gray-400'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function InsightItem({ label, value }: any) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-[10px] font-bold text-gray-900 uppercase tracking-tight">{label}</p>
      <p className="mt-1 text-xs text-gray-500 leading-relaxed">{value}</p>
    </div>
  );
}

function MetricRow({ label, value }: any) {
  return (
    <div className="flex justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs font-bold text-gray-900">{value}</span>
    </div>
  );
}

function PerformanceRow({ name, sub, progress }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm font-bold text-gray-900">{name}</p>
          <p className="text-[10px] text-gray-400">{sub}</p>
        </div>
        <span className="text-xs font-bold text-indigo-600">{progress}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}