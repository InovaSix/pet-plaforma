import { serviceMap } from "@/data/services";
import type { Caregiver, CaregiverSummary } from "@/types";

// Cuidadores exibidos na busca e nos perfis. A lista começa vazia: os
// cuidadores de exemplo foram removidos e os reais virão do banco, a partir dos
// cadastros aprovados.
export const caregivers: Caregiver[] = [];

export function getCaregiverById(id: string): Caregiver | undefined {
  return caregivers.find((caregiver) => caregiver.id === id);
}

export function toCaregiverSummary(caregiver: Caregiver): CaregiverSummary {
  const cheapest = [...caregiver.rates].sort((a, b) => a.price - b.price)[0];
  const shortUnit = serviceMap[cheapest.service]?.priceUnit ?? cheapest.unit;
  return {
    id: caregiver.id,
    name: caregiver.name,
    headline: caregiver.headline,
    neighborhood: caregiver.neighborhood,
    city: caregiver.city,
    distanceKm: caregiver.distanceKm,
    rating: caregiver.rating,
    reviewsCount: caregiver.reviewsCount,
    yearsExperience: caregiver.yearsExperience,
    verified: caregiver.verified,
    respondsIn: caregiver.respondsIn,
    acceptsLastMinute: caregiver.acceptsLastMinute,
    services: caregiver.rates.map((rate) => rate.service),
    fromPrice: cheapest.price,
    fromPriceUnit: shortUnit,
  };
}

export const caregiverSummaries: CaregiverSummary[] =
  caregivers.map(toCaregiverSummary);
