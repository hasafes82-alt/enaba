/** يحسب عدد الأيام المتبقية حتى تاريخ معيّن (بداية اليوم كمرجع). */
export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

/** تسمية عربية طبيعية للفارق الزمني — SPEC.md §8/F3 (عدّاد تنازلي). */
export function relativeDayLabel(daysLeft: number): string {
  if (daysLeft <= 0) return "اليوم";
  if (daysLeft === 1) return "غدًا";
  if (daysLeft === 2) return "بعد يومين";
  if (daysLeft <= 10) return `خلال ${daysLeft} أيام`;
  return `خلال ${daysLeft} يومًا`;
}

/** أقل من 48 ساعة تقريبًا — SPEC.md §8/F3 (شارة "عاجل"). */
export function isUrgent(daysLeft: number): boolean {
  return daysLeft <= 2;
}

export function formatArabicDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
