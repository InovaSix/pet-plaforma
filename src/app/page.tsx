import { Section } from "@/components/ui/Section";
import {
  BecomeCaregiver,
  FinalCta,
  Hero,
  HowItWorks,
  Safety,
  Services,
  Testimonials,
} from "@/sections/home";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Services />
      <Section tone="cream" spacing="compact" containerSize="wide">
        <div className="grid gap-5 lg:grid-cols-2 lg:items-stretch">
          <Safety />
          <BecomeCaregiver />
        </div>
      </Section>
      <Testimonials />
      <FinalCta />
    </>
  );
}
