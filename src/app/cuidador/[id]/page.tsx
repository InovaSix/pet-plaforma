import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AvailabilityGrid } from "@/components/caregiver/AvailabilityGrid";
import { BookingBar, BookingPanel } from "@/components/caregiver/BookingCard";
import { PhotoGallery } from "@/components/caregiver/PhotoGallery";
import { ProfileHero } from "@/components/caregiver/ProfileHero";
import { ProfileSection } from "@/components/caregiver/ProfileSection";
import { ReviewCard } from "@/components/caregiver/ReviewCard";
import { ServiceArea } from "@/components/caregiver/ServiceArea";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Rating } from "@/components/ui/Rating";
import { caregivers, getCaregiverById } from "@/data/caregivers";
import { serviceMap } from "@/data/services";
import { formatBRL, formatRating, pluralize } from "@/lib/format";

export function generateStaticParams() {
  return caregivers.map((caregiver) => ({ id: caregiver.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const caregiver = getCaregiverById(id);

  if (!caregiver) {
    return { title: "Cuidador não encontrado" };
  }

  return {
    title: `${caregiver.name}, cuidador em ${caregiver.neighborhood}`,
    description: `${caregiver.headline}. Nota ${formatRating(caregiver.rating)} em ${pluralize(
      caregiver.reviewsCount,
      "avaliação",
      "avaliações",
    )}. Veja valores, fotos e disponibilidade na MundoPetCare.`,
  };
}

function ratingDistribution(ratings: number[]) {
  const buckets = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((value) => Math.round(value) === star).length,
  }));
  const total = ratings.length || 1;
  return buckets.map((bucket) => ({
    ...bucket,
    pct: Math.round((bucket.count / total) * 100),
  }));
}

export default async function CaregiverProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caregiver = getCaregiverById(id);

  if (!caregiver) {
    notFound();
  }

  const distribution = ratingDistribution(
    caregiver.reviews.map((review) => review.rating),
  );

  return (
    <div className="bg-cream pb-24 lg:pb-0">
      <div className="border-b border-line bg-paper">
        <Container className="py-4">
          <nav className="flex items-center gap-1.5 text-xs text-ink-faint">
            <Link href="/" className="transition-colors hover:text-ink-soft">
              Início
            </Link>
            <Icon name="chevron-right" className="h-3.5 w-3.5" />
            <Link
              href="/cuidadores"
              className="transition-colors hover:text-ink-soft"
            >
              Cuidadores
            </Link>
            <Icon name="chevron-right" className="h-3.5 w-3.5" />
            <span className="text-ink-soft">{caregiver.name}</span>
          </nav>
        </Container>
      </div>

      <Container className="py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[1fr_20rem] lg:gap-10">
          <div className="space-y-10">
            <ProfileHero caregiver={caregiver} />

            <ProfileSection title="Sobre" id="sobre">
              <div className="space-y-4 text-sm leading-relaxed text-ink-soft">
                {caregiver.about.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {caregiver.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2 text-sm text-ink"
                  >
                    <Icon
                      name="check"
                      className="mt-0.5 h-4 w-4 shrink-0 text-forest-600"
                      strokeWidth={2.5}
                    />
                    {highlight}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-5">
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-faint">
                  Atende
                </span>
                {caregiver.acceptedPets.map((pet) => (
                  <span
                    key={pet}
                    className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-medium text-forest-800 ring-1 ring-inset ring-forest-100"
                  >
                    <Icon name="dog" className="h-3.5 w-3.5" />
                    {pet}
                  </span>
                ))}
              </div>
            </ProfileSection>

            <ProfileSection
              title="Serviços e valores"
              id="valores"
              description="Valores iniciais. O preço final é combinado conforme a rotina e a necessidade do seu pet."
            >
              <ul className="grid gap-3 sm:grid-cols-2">
                {caregiver.rates.map((rate) => {
                  const service = serviceMap[rate.service];
                  return (
                    <li
                      key={rate.service}
                      className="flex flex-col gap-1 rounded-2xl border border-line bg-white p-5"
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                        <Icon
                          name={service.icon}
                          className="h-4 w-4 text-forest-600"
                          strokeWidth={2}
                        />
                        {service.name}
                      </span>
                      <span className="text-xs text-ink-soft">
                        {service.tagline}
                      </span>
                      <span className="mt-2 font-display text-lg font-semibold text-ink">
                        {formatBRL(rate.price)}
                        <span className="ml-1 text-xs font-normal text-ink-faint">
                          /{rate.unit}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </ProfileSection>

            <ProfileSection title="Fotos" id="fotos">
              <PhotoGallery photos={caregiver.photos} />
            </ProfileSection>

            <ProfileSection title="Área de atendimento" id="area">
              <ServiceArea
                neighborhoods={caregiver.serviceArea}
                centerLabel={caregiver.neighborhood}
              />
            </ProfileSection>

            <ProfileSection title="Disponibilidade" id="agenda">
              <AvailabilityGrid
                availability={caregiver.availability}
                note={caregiver.availabilityNote}
              />
            </ProfileSection>

            <ProfileSection
              title="Avaliações"
              id="avaliacoes"
              description={`${pluralize(
                caregiver.reviewsCount,
                "avaliação de quem já contratou",
                "avaliações de quem já contratou",
              )}.`}
            >
              <div className="rounded-2xl border border-line bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="text-center sm:w-40 sm:shrink-0">
                    <p className="font-display text-4xl font-semibold text-ink">
                      {formatRating(caregiver.rating)}
                    </p>
                    <Rating
                      value={caregiver.rating}
                      size="sm"
                      showValue={false}
                      showCount={false}
                      className="mt-1 justify-center"
                    />
                    <p className="mt-1 text-xs text-ink-soft">
                      {pluralize(
                        caregiver.reviewsCount,
                        "avaliação",
                        "avaliações",
                      )}
                    </p>
                  </div>
                  <ul className="flex-1 space-y-1.5">
                    {distribution.map((bucket) => (
                      <li
                        key={bucket.star}
                        className="flex items-center gap-3 text-xs text-ink-soft"
                      >
                        <span className="w-3 text-right">{bucket.star}</span>
                        <Icon
                          name="star"
                          className="h-3 w-3 text-forest-500"
                          strokeWidth={2}
                        />
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-forest-50">
                          <span
                            className="block h-full rounded-full bg-forest-500"
                            style={{ width: `${bucket.pct}%` }}
                          />
                        </span>
                        <span className="w-6 text-right tabular-nums">
                          {bucket.count}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {caregiver.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </ProfileSection>
          </div>

          <aside className="mt-10 hidden lg:mt-0 lg:block">
            <BookingPanel caregiver={caregiver} />
          </aside>
        </div>
      </Container>

      <BookingBar caregiver={caregiver} />
    </div>
  );
}
