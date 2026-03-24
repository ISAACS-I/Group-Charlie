interface StatCardProps {
  value: string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="hero-card stats-card">
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}