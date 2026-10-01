import {
  ABOUT_MAX_LENGTH,
  servicesByCategory,
  type SelectedPhoto,
} from "@/data/provider-registration";
import { cn } from "@/lib/utils";
import { PhotoField } from "./PhotoField";
import type { StepFieldsProps } from "./types";
import styles from "./registration.module.css";

interface ServicesStepProps extends StepFieldsProps {
  onServicesChange: (services: string[]) => void;
  onPhotoChange: (photo: SelectedPhoto | null) => void;
}

export function ServicesStep({
  data,
  onFieldChange,
  onServicesChange,
  onPhotoChange,
  invalidFields,
  fieldId,
  errorId,
}: ServicesStepProps) {
  const options = servicesByCategory[data.category];
  const titleId = fieldId("services-title");
  const invalid = invalidFields.has("services");

  function toggle(service: string, checked: boolean) {
    // Mantém a ordem do protótipo, independentemente da ordem dos cliques.
    const next = options.filter((option) =>
      option === service ? checked : data.services.includes(option),
    );
    onServicesChange(next);
  }

  return (
    <>
      <div
        role="group"
        aria-labelledby={titleId}
        aria-describedby={invalid ? errorId : undefined}
      >
        <h2 id={titleId} className={styles.sectionTitle}>
          Serviços oferecidos *
        </h2>
        <div className={cn(styles.checks, invalid && styles.checksInvalid)}>
          {options.map((service, index) => (
            <label key={service} className={styles.check}>
              <input
                id={index === 0 ? fieldId("services") : undefined}
                type="checkbox"
                name="service"
                value={service}
                checked={data.services.includes(service)}
                aria-invalid={invalid || undefined}
                onChange={(event) => toggle(service, event.target.checked)}
              />
              {service}
            </label>
          ))}
        </div>
      </div>
      <label htmlFor={fieldId("about")} className={styles.label}>
        Sobre seu atendimento
        <textarea
          id={fieldId("about")}
          value={data.about}
          maxLength={ABOUT_MAX_LENGTH}
          placeholder="Conte sua experiência e como funciona o atendimento."
          onChange={(event) => onFieldChange("about", event.target.value)}
          className={styles.control}
        />
      </label>
      <PhotoField
        id={fieldId("photo")}
        photo={data.photo}
        onChange={onPhotoChange}
      />
    </>
  );
}
