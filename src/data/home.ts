import type { IconName } from "@/components/ui/Icon";
import type { ExperienceStage, HowItWorksStep, SafetyItem } from "@/types";

export const heroTrustPoints: { label: string; icon: IconName }[] = [
  { label: "Cuidadores verificados", icon: "shield-check" },
  { label: "Avaliações reais", icon: "star" },
  { label: "Acompanhamento", icon: "map-pin" },
  { label: "Fotos durante o serviço", icon: "camera" },
];

export const howItWorksSteps: HowItWorksStep[] = [
  {
    number: 1,
    title: "Encontrar",
    description: "Busque por cuidadores na sua região.",
    icon: "search",
  },
  {
    number: 2,
    title: "Agendar",
    description: "Escolha o melhor horário e confirme o serviço.",
    icon: "calendar-days",
  },
  {
    number: 3,
    title: "Acompanhar",
    description: "Receba atualizações, fotos e status em tempo real.",
    icon: "map-pin",
  },
  {
    number: 4,
    title: "Receber",
    description: "Veja o relatório final e a avaliação do serviço.",
    icon: "shield-check",
  },
];

export const experienceStages: ExperienceStage[] = [
  {
    id: "antes",
    label: "Antes",
    title: "Serviço agendado.",
    description:
      "Cuidador confirmado, horário definido e as instruções do seu pet já com quem vai cuidar.",
    image: "/images/mockups/mockup-agendado.jpg",
    imageAlt:
      "Tela inicial do app PetCare com o próximo passeio de Marshmallow confirmado.",
    points: [
      "Cuidador confirmado para a data",
      "Horário e duração combinados",
      "Rotina e cuidados do pet registrados",
    ],
  },
  {
    id: "durante",
    label: "Durante",
    title: "Acompanhamento do atendimento.",
    description:
      "Você vê o serviço começar, acompanha a localização e recebe fotos ao longo do caminho.",
    image: "/images/mockups/mockup-durante.jpg",
    imageAlt:
      "Tela do app mostrando o passeio de Marshmallow em andamento com mapa e tempo decorrido.",
    points: [
      "Aviso quando o serviço começa",
      "Localização em tempo real",
      "Fotos enviadas durante o passeio",
    ],
  },
  {
    id: "depois",
    label: "Depois",
    title: "Fotos, informações e relatório.",
    description:
      "Ao final, um resumo completo: quanto durou, quanto andou, como foi e todas as fotos do dia.",
    image: "/images/mockups/mockup-relatorio.jpg",
    imageAlt:
      "Tela de relatório do serviço no app PetCare, com duração, distância e observações do cuidador.",
    points: [
      "Duração e distância do serviço",
      "Observações escritas pelo cuidador",
      "Álbum completo para guardar",
    ],
  },
];

export const safetyItems: SafetyItem[] = [
  {
    title: "Cuidadores verificados",
    description: "Documento, referências e entrevista antes de atender.",
    icon: "badge-check",
  },
  {
    title: "Avaliações reais de outros tutores",
    description: "Só quem contratou pode avaliar o serviço.",
    icon: "star",
  },
  {
    title: "Acompanhamento durante o serviço",
    description: "Status e localização enquanto o atendimento acontece.",
    icon: "route",
  },
  {
    title: "Fotos e atualizações em tempo real",
    description: "O cuidador envia fotos no caminho.",
    icon: "camera",
  },
  {
    title: "Suporte em caso de imprevistos",
    description: "Um time pronto para ajudar quando precisar.",
    icon: "life-buoy",
  },
];

export const becomeCaregiverPoints: string[] = [
  "Você define os seus valores",
  "Você escolhe os dias e horários",
  "Pagamento organizado pela PetCare",
];

export const homeServiceCards: {
  id: "passeio" | "visita" | "hospedagem" | "pet-sitter";
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}[] = [
  {
    id: "passeio",
    title: "Passeios",
    description: "Seu pet se exercita enquanto você acompanha tudo.",
    image: "/images/gallery/g1.jpg",
    imageAlt: "Marshmallow correndo no parque durante um passeio.",
  },
  {
    id: "visita",
    title: "Visitas",
    description: "Cuidados no conforto da própria casa.",
    image: "/images/mascot-marshmallow.jpg",
    imageAlt: "Marshmallow com bandana verde, pronto para uma visita em casa.",
  },
  {
    id: "hospedagem",
    title: "Hospedagem",
    description: "Uma segunda casa enquanto você estiver fora.",
    image: "/images/gallery/g2.jpg",
    imageAlt: "Retrato de Marshmallow, representando hospedagem aconchegante.",
  },
  {
    id: "pet-sitter",
    title: "Cuidados especiais",
    description: "Atenção personalizada para cada necessidade.",
    image: "/images/gallery/g4.jpg",
    imageAlt: "Close de Marshmallow, representando cuidados especiais.",
  },
];

export const homeTestimonials: {
  name: string;
  rating: number;
  quote: string;
}[] = [
  {
    name: "Juliana Costa",
    rating: 5,
    quote:
      "O app é incrível! Minha gatinha a Luna super bem cuidada e relatou tudo o tempo todo.",
  },
  {
    name: "Rafael Lima",
    rating: 5,
    quote:
      "Profissionais atenciosos e responsáveis. Recomendo demais!",
  },
  {
    name: "Fernanda Alves",
    rating: 5,
    quote:
      "Meu cãozinho adorou. Já usei várias vezes e sempre foi ótimo!",
  },
];
