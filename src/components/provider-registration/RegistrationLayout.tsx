import type { ReactNode } from "react";
import { PawPrint } from "lucide-react";
import { PawWatermark } from "@/components/ui/PawWatermark";
import styles from "./registration.module.css";

interface RegistrationLayoutProps {
  steps: ReactNode;
  titleId: string;
  children: ReactNode;
}

/**
 * Moldura do cadastro. A decoração segue a home: a mesma pata com coração
 * (PawWatermark, tom padrão), decorativa e sem receber cliques. No desktop
 * há uma pata em cada margem externa e uma centralizada atrás do
 * formulário; abaixo de 1024 px, apenas a central.
 */
export function RegistrationLayout({
  steps,
  titleId,
  children,
}: RegistrationLayoutProps) {
  return (
    <div className={styles.page}>
      <PawWatermark className={`${styles.pawSide} ${styles.pawLeft}`} />
      <PawWatermark className={`${styles.pawSide} ${styles.pawRight}`} />
      <div className={styles.root}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <PawPrint className={styles.brandIcon} aria-hidden="true" />
            PetCare
          </div>
          <span className={styles.hint}>Prévia do cadastro de prestadores</span>
        </header>
        <div className={styles.shell}>
          <aside className={styles.aside}>
            <h2 className={styles.asideTitle}>Faça parte da PetCare</h2>
            <p className={styles.asideText}>
              Apresente seus serviços e ajude tutores a encontrar o cuidado
              certo.
            </p>
            {steps}
            <div className={styles.note}>
              Seu perfil será apresentado aos tutores após a análise do
              cadastro.
            </div>
          </aside>
          <section className={styles.panel} aria-labelledby={titleId}>
            <PawWatermark className={styles.pawCenter} />
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}
