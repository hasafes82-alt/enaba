import type { DelegationType, RegistrationDegree } from "@/types/database";

/** تسميات درجات القيد بالعربية — SPEC.md §11 */
export const REGISTRATION_DEGREE_LABELS: Record<RegistrationDegree, string> = {
  general: "جدول عام",
  primary: "ابتدائي",
  appeal: "استئناف عالي ومجلس الدولة",
  cassation: "نقض",
};

/** تسميات أنواع الإنابة بالعربية — SPEC.md §11 */
export const DELEGATION_TYPE_LABELS: Record<DelegationType, string> = {
  session_attendance: "حضور جلسة وتأجيل",
  document_copying: "تصوير أوراق ومذكرات",
  certificate_issuing: "استخراج شهادة أو إعلام وراثة",
  filing_claim: "تقديم طلب أو إيداع صحيفة دعوى",
  bailiff_notice: "إنذار على يد محضر",
  case_inquiry: "استعلام ومتابعة حالة قضية",
  prosecution_hearing: "حضور تحقيق نيابة",
};

export const REGISTRATION_DEGREE_OPTIONS = Object.entries(REGISTRATION_DEGREE_LABELS) as [
  RegistrationDegree,
  string,
][];

export const DELEGATION_TYPE_OPTIONS = Object.entries(DELEGATION_TYPE_LABELS) as [
  DelegationType,
  string,
][];

/** نص شريط التنويه القانوني — SPEC.md §8/F1، لا يُعاد صياغته (CLAUDE.md) */
export const LEGAL_DISCLAIMER =
  "تنويه قانوني: المنصة دليل مهني مجاني لربط الزملاء ولا تتدخل في الاتفاق المالي أو جودة التنفيذ بين الطرفين.";

export const SITE_NAME = "إنابة";
export const SITE_TAGLINE = "دليل الإنابات القضائية للمحامين بمصر";

/** رقم واتساب المنصة لاستقبال طلبات مكتبة النماذج (F7) — SPEC.md §8/F7. */
export const FORMS_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_FORMS_WHATSAPP_NUMBER || null;
