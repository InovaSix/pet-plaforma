import type { FooterColumn, NavLink } from "@/types";

export const primaryNav: NavLink[] = [
  { label: "Como funciona", href: "/#como-funciona" },
  { label: "Serviços", href: "/#servicos" },
  { label: "Segurança", href: "/#seguranca" },
  { label: "Seja cuidador", href: "/#cuidadores" },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Serviços",
    links: [
      { label: "Passeio", href: "/#servicos" },
      { label: "Visita em casa", href: "/#servicos" },
      { label: "Pet Sitter", href: "/#servicos" },
      { label: "Hospedagem", href: "/#servicos" },
    ],
  },
  {
    title: "MundoPetCare",
    links: [
      { label: "Como funciona", href: "/#como-funciona" },
      { label: "Segurança", href: "/#seguranca" },
      { label: "Seja cuidador", href: "/#cuidadores" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Central de ajuda", href: "/#seguranca" },
      { label: "Falar com a gente", href: "/#seguranca" },
      { label: "Termos de uso", href: "/#seguranca" },
      { label: "Privacidade", href: "/#seguranca" },
    ],
  },
];

export const socialLinks: NavLink[] = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "YouTube", href: "#" },
];
