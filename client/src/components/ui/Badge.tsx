interface BadgeProps {
  label: string;
  variant?: "category" | "active" | "upcoming" | "draft" | "tag";
}

const variantStyles: Record<string, string> = {
  category: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  active:   "bg-emerald-50 text-emerald-700 border border-emerald-100",
  upcoming: "bg-blue-50 text-blue-700 border border-blue-100",
  draft:    "bg-amber-50 text-amber-700 border border-amber-100",
  tag:      "bg-yellow-400 text-yellow-900",
};

export default function Badge({ label, variant = "category" }: BadgeProps) {
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${variantStyles[variant]}`}>
      {label}
    </span>
  );
}
