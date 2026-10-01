import { registrationSteps } from "@/data/provider-registration";
import styles from "./registration.module.css";

interface StepIndicatorProps {
  current: number;
  disabled: boolean;
  onSelect: (step: number) => void;
}

export function StepIndicator({ current, disabled, onSelect }: StepIndicatorProps) {
  return (
    <nav className={styles.steps} aria-label="Etapas do cadastro">
      <ol className={styles.stepList}>
        {registrationSteps.map((step, index) => (
          <li key={step.title}>
            <button
              type="button"
              className={styles.step}
              aria-current={index === current ? "step" : undefined}
              disabled={disabled}
              onClick={() => onSelect(index)}
            >
              <span className={styles.stepMark} aria-hidden="true">
                {index < current ? "✓" : index + 1}
              </span>
              <span className="sr-only">Etapa {index + 1}: </span>
              {step.title}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
