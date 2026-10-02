"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Link from "next/link";
import { CaregiverCard } from "@/components/caregiver/CaregiverCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  CaregiverFilters,
  defaultFilters,
  sortOptions,
  type FilterState,
} from "@/components/search/CaregiverFilters";
import { SearchSummary, type SearchQuery } from "@/components/search/SearchSummary";
import { caregiverSummaries } from "@/data/caregivers";
import { bookableServices } from "@/data/services";
import { pluralize } from "@/lib/format";
import type { CaregiverSummary, ServiceId } from "@/types";

function sortCaregivers(list: CaregiverSummary[], sort: FilterState["sort"]) {
  const copy = [...list];
  switch (sort) {
    case "melhor-avaliados":
      return copy.sort(
        (a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount,
      );
    case "mais-proximos":
      return copy.sort((a, b) => a.distanceKm - b.distanceKm);
    case "menor-preco":
      return copy.sort((a, b) => a.fromPrice - b.fromPrice);
    default:
      return copy.sort(
        (a, b) =>
          b.rating * Math.log10(b.reviewsCount + 10) -
          a.rating * Math.log10(a.reviewsCount + 10),
      );
  }
}

export function ResultsView() {
  const searchParams = useSearchParams();

  const query: SearchQuery = {
    local: searchParams.get("local"),
    servico: searchParams.get("servico"),
    data: searchParams.get("data"),
    horario: searchParams.get("horario"),
    cuidador: searchParams.get("cuidador"),
  };

  const seededService = bookableServices.find(
    (service) => service.id === query.servico,
  )?.id;

  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    services: seededService ? [seededService] : [],
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const isDirty = useMemo(() => {
    return (
      filters.services.length > 0 ||
      filters.verifiedOnly ||
      filters.lastMinuteOnly ||
      filters.maxPrice !== null ||
      filters.sort !== "relevancia"
    );
  }, [filters]);

  const results = useMemo(() => {
    const filtered = caregiverSummaries.filter((caregiver) => {
      if (
        filters.services.length > 0 &&
        !filters.services.every((service: ServiceId) =>
          caregiver.services.includes(service),
        )
      ) {
        return false;
      }
      if (filters.verifiedOnly && !caregiver.verified) return false;
      if (filters.lastMinuteOnly && !caregiver.acceptsLastMinute) return false;
      if (filters.maxPrice !== null && caregiver.fromPrice > filters.maxPrice) {
        return false;
      }
      return true;
    });
    return sortCaregivers(filtered, filters.sort);
  }, [filters]);

  const resetFilters = () =>
    setFilters({ ...defaultFilters, services: [], sort: "relevancia" });

  const activeSortLabel = sortOptions.find(
    (option) => option.value === filters.sort,
  )?.label;

  return (
    <div className="bg-cream">
      <div className="border-b border-line bg-paper">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-ink-faint">
            <Link href="/" className="transition-colors hover:text-ink-soft">
              Início
            </Link>
            <Icon name="chevron-right" className="h-3.5 w-3.5" />
            <span className="text-ink-soft">Cuidadores</span>
          </nav>
          <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
            {query.local
              ? `Cuidadores perto de ${query.local}`
              : "Cuidadores disponíveis"}
          </h1>
          <p className="mt-1.5 text-sm text-ink-soft">
            {pluralize(results.length, "cuidador encontrado", "cuidadores encontrados")}
            {activeSortLabel ? ` · ${activeSortLabel}` : ""}
          </p>
          <div className="mt-5">
            <SearchSummary query={query} />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10">
          <div className="mb-4 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((open) => !open)}
              aria-expanded={mobileFiltersOpen}
              className="flex w-full items-center justify-between rounded-xl border border-line-strong bg-white px-4 py-3 text-sm font-medium text-ink"
            >
              <span className="flex items-center gap-2">
                <Icon name="list-checks" className="h-4 w-4 text-forest-600" />
                Filtros e ordenação
              </span>
              <Icon
                name="chevron-down"
                className={`h-4 w-4 transition-transform ${mobileFiltersOpen ? "rotate-180" : ""}`}
              />
            </button>
            {mobileFiltersOpen && (
              <div className="mt-2 rounded-xl border border-line bg-white p-5">
                <CaregiverFilters
                  value={filters}
                  onChange={setFilters}
                  onReset={resetFilters}
                  isDirty={isDirty}
                />
              </div>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-line bg-white p-5">
              <p className="mb-4 font-display text-sm font-semibold text-ink">
                Filtrar
              </p>
              <CaregiverFilters
                value={filters}
                onChange={setFilters}
                onReset={resetFilters}
                isDirty={isDirty}
              />
            </div>
          </aside>

          <div>
            {results.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {results.map((caregiver) => (
                  <li key={caregiver.id}>
                    <CaregiverCard caregiver={caregiver} />
                  </li>
                ))}
              </ul>
            ) : caregiverSummaries.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line-strong bg-white p-10 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-forest-50 text-forest-600">
                  <Icon name="search" className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-lg font-semibold text-ink">
                  Ainda não há cuidadores por aqui
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
                  A MundoPetCare está começando e os primeiros cuidadores estão
                  sendo aprovados. Volte em breve, ou cadastre-se se você cuida de
                  pets.
                </p>
                <Button
                  href="/cadastro-prestador"
                  variant="secondary"
                  size="sm"
                  className="mt-5"
                >
                  Quero ser cuidador
                </Button>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-line-strong bg-white p-10 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-forest-50 text-forest-600">
                  <Icon name="search" className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-lg font-semibold text-ink">
                  Nenhum cuidador com esses filtros
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
                  Tente remover algum filtro ou ampliar a faixa de preço para ver
                  mais opções por perto.
                </p>
                <Button
                  onClick={resetFilters}
                  variant="secondary"
                  size="sm"
                  className="mt-5"
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
