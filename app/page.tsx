import { getLawyers } from "@/lib/data/lawyers";
import { getCourts, getGovernorates } from "@/lib/data/reference";
import { Filters } from "@/components/lawyer/Filters";
import { LawyerGrid } from "@/components/lawyer/LawyerGrid";
import type { RegistrationDegree } from "@/types/database";

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const governorateSlug = firstValue(params.governorate);
  const courtSlug = firstValue(params.court);
  const degree = firstValue(params.degree) as RegistrationDegree | undefined;

  const [governorates, courts] = await Promise.all([getGovernorates(), getCourts()]);

  const selectedGovernorate = governorateSlug
    ? governorates.find((g) => g.slug === governorateSlug)
    : undefined;
  const selectedCourt = courtSlug
    ? courts.find((c) => c.slug === courtSlug && c.governorate_id === selectedGovernorate?.id)
    : undefined;

  const lawyers = await getLawyers({
    governorateId: selectedGovernorate?.id,
    courtId: selectedCourt?.id,
    degree,
  });

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2 text-center sm:text-right">
        <h1 className="text-2xl font-bold text-navy-900 sm:text-3xl">
          دليل المحامين للإنابات القضائية
        </h1>
        <p className="text-navy-700">
          ابحث عن زميل موثَّق في أي محافظة أو محكمة، وتواصل معه مباشرة خلال دقائق.
        </p>
      </div>

      <Filters governorates={governorates} courts={courts} />

      <LawyerGrid lawyers={lawyers} governorates={governorates} />
    </main>
  );
}
