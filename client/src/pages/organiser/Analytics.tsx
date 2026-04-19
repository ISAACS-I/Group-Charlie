import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, CartesianGrid, Legend } from "recharts";
import { TrendingUp, Users, Wallet, Star, Download } from "lucide-react";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useAuth } from "../../context/AuthContext";

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
}

interface InsightItemProps {
  label: string;
  value: string;
}

interface MetricRowProps {
  label: string;
  value: string;
}

interface PerformanceRowProps {
  name: string;
  sub: string;
  progress: number;
}

interface AnalyticsData {
  totalAttendees: number;
  attendanceRate: number;
  attendanceData: { month: string; value: number }[];
  performance: { name: string; sub: string; progress: number; total: number }[];
  top: { name: string; sub: string; progress: number } | null;
  ageData: { group: string; count: number }[];
}

export default function Analytics() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/analytics", {
          headers: {
            Authorization: `Bearer ${user?.token ?? ""}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const json = await res.json();
<<<<<<< Updated upstream
        setData(json);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
=======
        // If all zeros and no events, still set data so we show zeros not error
        setData({
          totalAttendees: json.totalAttendees ?? 0,
          attendanceRate: json.attendanceRate ?? 0,
          attendanceData: json.attendanceData ?? [],
          performance: json.performance ?? [],
          top: json.top ?? null,
          ageData: json.ageData ?? [],
        });
      } catch (err: any) {
        setError(err.message);
>>>>>>> Stashed changes
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [user?.token]);

  if (isLoading) {
    return (
      <DashboardLayout title="Analytics" subtitle="Track event performance, attendee growth, and engagement across your events." showSponsor>
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  // TO THIS:
  if (error || !data) {
    return (
      <DashboardLayout
        title="Analytics"
        subtitle="Track event performance, attendee growth, and engagement across your events."
        showSponsor
      >
        <div className="flex h-96 flex-col items-center justify-center gap-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
            <p className="text-base font-bold text-gray-900">No analytics yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Create and publish events to start seeing attendance data, performance breakdowns, and audience insights here.
            </p>
            <button
              type="button"
              onClick={() => window.location.href = "/create-event"}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Create Your First Event
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const exportAsExcel = async () => {
    if (!data) return;

    const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const wb = new ExcelJS.Workbook();
    wb.creator = 'EventsHub';
    wb.created = new Date();

    const headerFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
    const subHeaderFill: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEF2FF' } };
    const headerFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    const titleFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: 'FF4F46E5' }, size: 14 };
    const border: Partial<ExcelJS.Borders> = {
      top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
    };

    const summary = wb.addWorksheet('Summary');
    summary.columns = [{ width: 28 }, { width: 30 }];
    summary.mergeCells('A1:B1');
    const titleCell = summary.getCell('A1');
    titleCell.value = 'EVENTHUB ANALYTICS REPORT';
    titleCell.font = titleFont;
    titleCell.alignment = { horizontal: 'center' };
    summary.mergeCells('A2:B2');
    const dateCell = summary.getCell('A2');
    dateCell.value = `Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    dateCell.font = { italic: true, color: { argb: 'FF6B7280' }, size: 10 };
    dateCell.alignment = { horizontal: 'center' };
    summary.addRow([]);
    summary.mergeCells('A4:B4');
    const statsHeader = summary.getCell('A4');
    statsHeader.value = 'SUMMARY STATISTICS';
    statsHeader.fill = headerFill;
    statsHeader.font = headerFont;
    statsHeader.alignment = { horizontal: 'center' };
    const colHeader = summary.addRow(['Metric', 'Value']);
    colHeader.eachCell(cell => { cell.font = { bold: true, size: 10, color: { argb: 'FF374151' } }; cell.fill = subHeaderFill; cell.border = border; });
    [['Total Attendees', data.totalAttendees], ['Attendance Rate', `${data.attendanceRate}%`], ['Active Events', data.performance.length]].forEach(([label, value]) => {
      const row = summary.addRow([label, value]);
      row.eachCell(cell => { cell.border = border; });
      row.getCell(1).font = { color: { argb: 'FF6B7280' }, size: 10 };
      row.getCell(2).font = { bold: true, size: 10 };
    });

    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `EventsHub_Analytics_${today}.xlsx`);
  };

  return (
    <DashboardLayout title="Analytics" subtitle="Track event performance, attendee growth, and engagement across your events." showSponsor>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <select className="rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm text-gray-500 shadow-sm outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100">
              <option>All Events</option>
            </select>
            <select className="rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm text-gray-500 shadow-sm outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100">
              <option>Last 6 Months</option>
            </select>
          </div>
          <button onClick={exportAsExcel} className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
            <Download size={16} />
            Export Report
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Attendees" value={data.totalAttendees.toLocaleString()} trend="" icon={<Users size={18} />} />
          <StatCard label="Attendance Rate" value={`${data.attendanceRate}%`} trend="" icon={<TrendingUp size={18} />} />
          <StatCard label="Revenue" value="—" trend="" icon={<Wallet size={18} />} />
          <StatCard label="Average Rating" value="—" trend="Stable" icon={<Star size={18} />} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900">Attendance Overview</h3>
            <p className="mb-6 text-xs text-gray-400">Attendance trend across recent events.</p>
            <div className="h-64 w-full">
              {data.attendanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.attendanceData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }} dy={8} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} width={45} domain={[0, 'auto']} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '8px 12px' }} />
                    <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '12px', paddingBottom: '16px', fontWeight: 500 }} iconType="circle" />
                    <Bar dataKey="value" name="Attendance" radius={[6, 6, 0, 0]} maxBarSize={45}>
                      {data.attendanceData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === data.attendanceData.length - 1 ? '#6366f1' : '#818cf8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">No attendance data yet</div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-bold text-gray-900">Quick Insights</h3>
              <div className="space-y-4">
                <InsightItem label="Top Event" value={data.top ? `${data.top.name} had the highest attendance.` : "No events yet."} />
                <InsightItem label="Attendance Rate" value={`${data.attendanceRate}% of registered attendees checked in.`} />
                <InsightItem label="Total Reach" value={`${data.totalAttendees.toLocaleString()} attendees across all events.`} />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-bold text-gray-900">Recent Metrics</h3>
              <div className="space-y-3">
                <MetricRow label="Total Attendees" value={data.totalAttendees.toLocaleString()} />
                <MetricRow label="Attendance Rate" value={`${data.attendanceRate}%`} />
                <MetricRow label="Active Events" value={String(data.performance.length)} />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-1 text-base font-bold text-gray-900">Audience Age Groups</h3>
              <p className="mb-4 text-xs text-gray-400">Breakdown of attendees by age.</p>
              <div className="space-y-3">
                {data.ageData.map((group) => {
                  const percentage = data.totalAttendees > 0
                    ? Math.round((group.count / data.totalAttendees) * 100)
                    : 0;
                  return (
                    <div key={group.group} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{group.group}</span>
                        <span className="font-bold text-gray-900">{group.count} ({percentage}%)</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900">Event Performance Breakdown</h3>
            <p className="mb-6 text-xs text-gray-400">Quick comparison across your most recent events.</p>
            <div className="space-y-6">
              {data.performance.length > 0 ? (
                data.performance.map((event) => (
                  <PerformanceRow key={event.name} name={event.name} sub={event.sub} progress={event.progress} />
                ))
              ) : (
                <p className="text-sm text-gray-400">No events to display yet.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900">Top Performing Event</h3>
            <p className="mb-4 text-xs text-gray-400">Most engagement this month.</p>
            {data.top ? (
              <div className="rounded-xl bg-gray-50 p-4">
                <h4 className="font-bold text-gray-900">{data.top.name}</h4>
                <p className="mt-1 text-xs text-gray-500">{data.top.sub} • {data.top.progress}% attendance rate</p>
                <span className="mt-3 inline-block rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold text-white uppercase">Best Performer</span>
              </div>
            ) : (
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm text-gray-400">No events yet.</p>
              </div>
            )}
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

function StatCard({ label, value, trend, icon }: StatCardProps) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between text-gray-400">
        <span className="text-xs font-medium">{label}</span>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
        {trend && <span className={`text-[10px] font-bold ${isPositive ? 'text-green-500' : 'text-gray-400'}`}>{trend}</span>}
      </div>
    </div>
  );
}

function InsightItem({ label, value }: InsightItemProps) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-[10px] font-bold text-gray-900 uppercase tracking-tight">{label}</p>
      <p className="mt-1 text-xs text-gray-500 leading-relaxed">{value}</p>
    </div>
  );
}

function MetricRow({ label, value }: MetricRowProps) {
  return (
    <div className="flex justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-xs font-bold text-gray-900">{value}</span>
    </div>
  );
}

function PerformanceRow({ name, sub, progress }: PerformanceRowProps) {
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