import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  CalendarCheck,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Dog,
  Download,
  Footprints,
  Heart,
  HeartHandshake,
  Home,
  LifeBuoy,
  ListChecks,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  PawPrint,
  Phone,
  Quote,
  Route,
  Search,
  Share,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

export const icons = {
  "arrow-right": ArrowRight,
  "arrow-up-right": ArrowUpRight,
  "badge-check": BadgeCheck,
  bell: Bell,
  "calendar-check": CalendarCheck,
  "calendar-days": CalendarDays,
  camera: Camera,
  check: Check,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  clock: Clock,
  dog: Dog,
  download: Download,
  footprints: Footprints,
  heart: Heart,
  "heart-handshake": HeartHandshake,
  home: Home,
  "life-buoy": LifeBuoy,
  "list-checks": ListChecks,
  "map-pin": MapPin,
  menu: Menu,
  "message-circle": MessageCircle,
  moon: Moon,
  "paw-print": PawPrint,
  phone: Phone,
  quote: Quote,
  route: Route,
  search: Search,
  share: Share,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  users: Users,
  x: X,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  className?: string;
  strokeWidth?: number;
  "aria-hidden"?: boolean;
}

export function Icon({
  name,
  className,
  strokeWidth = 1.75,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  const Component = icons[name];
  return (
    <Component
      className={className}
      strokeWidth={strokeWidth}
      aria-hidden={ariaHidden}
    />
  );
}
