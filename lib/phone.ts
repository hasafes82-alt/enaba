/**
 * تطبيع أرقام الهواتف المصرية إلى صيغة E.164 وبناء روابط واتساب.
 * راجع SPEC.md §5 (lawyer_profiles.phone) و §8/F2 (رسالة واتساب الجاهزة).
 */

/**
 * يحوّل رقمًا مصريًا بأي صيغة شائعة (01xxxxxxxxx، +201xxxxxxxxx، 00201xxxxxxxxx،
 * أو بمسافات/شرطات) إلى E.164: +201XXXXXXXXX.
 * يُرجع null إذا كان الرقم غير صالح.
 */
export function toE164(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");

  let national: string | null = null;
  if (digits.startsWith("0020")) national = digits.slice(4);
  else if (digits.startsWith("20") && digits.length === 12) national = digits.slice(2);
  else if (digits.startsWith("01")) national = digits.slice(1);
  else if (digits.length === 10 && digits.startsWith("1")) national = digits;

  if (!national || national.length !== 10 || !national.startsWith("1")) {
    return null;
  }

  return `+20${national}`;
}

/** يبني رابط wa.me من رقم E.164 ورسالة عربية، مع ترميز صحيح للنص. */
export function buildWhatsAppLink(e164Phone: string, message: string): string {
  const waNumber = e164Phone.replace(/\D/g, ""); // wa.me يتطلب أرقامًا بلا "+"
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}

/** رسالة التواصل الجاهزة من الدليل — النص مثبت في SPEC.md §8/F2. */
export function buildDirectoryContactMessage(lawyerName: string, courtName: string): string {
  return `السلام عليكم أستاذ ${lawyerName}، بخصوص إنابة في ${courtName}.\nوصلت إليك عبر منصة إنابة.`;
}

/** رابط الاتصال الهاتفي المباشر. */
export function buildTelLink(e164Phone: string): string {
  return `tel:${e164Phone}`;
}
