import { createHash } from "node:crypto";

/**
 * بصمة زائر مجزّأة بلا تخزين IP خام — SPEC.md §10/§13.1.
 * يتغيّر الملح يوميًا فقط (DAILY_HASH_SALT ثابت في env، لكن التاريخ يدخل في
 * المدخل) بحيث لا يمكن ربط بصمتين من يومين مختلفين لنفس الزائر.
 */
export function hashViewer(ip: string, userAgent: string): string {
  const salt = process.env.DAILY_HASH_SALT ?? "";
  const day = new Date().toISOString().slice(0, 10);
  return createHash("sha256").update(`${ip}|${userAgent}|${salt}|${day}`).digest("hex");
}

/** يستخرج عنوان IP الحقيقي من رؤوس الطلب خلف بروكسي (Vercel). */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

/** حدود المعدل — SPEC.md §6 (تحديد المعدل). */
export const RATE_LIMITS = {
  contactRevealVerified: { max: 20, windowHours: 1 },
  contactRevealAnonymous: { max: 5, windowHours: 1 },
} as const;
