import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
};

export function StatCard({ icon: Icon, label, value, detail }: StatCardProps) {
  return (
    <section className="stat-card" aria-label={`${label}: ${value}. ${detail}`}>
      <span aria-hidden="true"><Icon size={18} /></span>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{detail}</small>
    </section>
  );
}
