interface StatCardProps {
  value: string;
  label: string;
  note?: string;
}

export default function StatCard({ value, label, note }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 px-6 py-4 flex flex-col justify-between shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</p>
      <div>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
      </div>
    </div>
  );
}