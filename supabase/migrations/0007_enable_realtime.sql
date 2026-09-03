-- إنابة (Enaba) — تفعيل Supabase Realtime على طلبات الإنابة، حتى تظهر
-- الطلبات الجديدة في لوحة الطلبات فورًا دون إعادة تحميل — SPEC.md §8/F3.

alter publication supabase_realtime add table delegation_requests;
