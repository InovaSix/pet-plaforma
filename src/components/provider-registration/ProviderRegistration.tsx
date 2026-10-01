"use client";

import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from "react";
import {
  emptyRegistration,
  LAST_STEP,
  registrationSteps,
  type ProviderCategory,
  type RegistrationData,
  type SelectedPhoto,
  type TextFieldName,
} from "@/data/provider-registration";
import {
  changeCategory,
  firstInvalidStep,
  validateStep,
  type StepIssues,
} from "@/lib/provider-registration";
import { cn } from "@/lib/utils";
import { CategoryStep } from "./CategoryStep";
import { Confirmation } from "./Confirmation";
import { FormError } from "./FormError";
import { LocationStep } from "./LocationStep";
import { ProviderDataStep } from "./ProviderDataStep";
import { RegistrationLayout } from "./RegistrationLayout";
import { ReviewStep } from "./ReviewStep";
import { ServicesStep } from "./ServicesStep";
import { StepIndicator } from "./StepIndicator";
import styles from "./registration.module.css";

type FocusTarget = { kind: "heading" } | { kind: "field"; id: string };

/**
 * Cadastro de prestadores (demonstração). Os dados ficam apenas na memória
 * deste componente: nada é enviado, salvo no navegador ou colocado na URL.
 */
export function ProviderRegistration() {
  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;
  const titleId = fieldId("title");
  const errorId = fieldId("error");

  const [step, setStep] = useState(0);
  const [data, setData] = useState<RegistrationData>(emptyRegistration);
  const [issues, setIssues] = useState<StepIssues | null>(null);
  const [submitted, setSubmitted] = useState(false);
  // Um objeto novo a cada pedido, para refazer o foco mesmo no mesmo alvo.
  const [focusRequest, setFocusRequest] = useState<FocusTarget | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const invalidFields = useMemo(
    () => new Set<string>(issues?.fields ?? []),
    [issues],
  );

  useEffect(() => {
    if (!focusRequest) return;
    const target =
      focusRequest.kind === "heading"
        ? headingRef.current
        : document.getElementById(focusRequest.id);
    target?.focus();
  }, [focusRequest]);

  function goTo(next: number) {
    setStep(next);
    setIssues(null);
    setFocusRequest({ kind: "heading" });
  }

  function block(at: number, found: StepIssues) {
    setStep(at);
    setIssues(found);
    setFocusRequest({ kind: "field", id: fieldId(found.fields[0]) });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step < LAST_STEP) {
      const found = validateStep(step, data);
      if (found.fields.length > 0) block(step, found);
      else goTo(step + 1);
      return;
    }

    // Na revisão, confere todas as etapas: o usuário pode ter chegado aqui
    // diretamente pelo indicador de etapas.
    const pending = firstInvalidStep(data);
    if (pending !== null) {
      const found = validateStep(pending, data);
      block(pending, {
        fields: found.fields,
        messages: [
          "Complete as etapas anteriores antes de enviar.",
          ...found.messages,
        ],
      });
      return;
    }

    setSubmitted(true);
    setIssues(null);
    setFocusRequest({ kind: "heading" });
  }

  function updateField(field: TextFieldName, value: string) {
    setData((current) => ({ ...current, [field]: value }));
  }

  function selectCategory(category: ProviderCategory) {
    setData((current) => changeCategory(current, category));
  }

  function setServices(services: string[]) {
    setData((current) => ({ ...current, services }));
  }

  function setPhoto(photo: SelectedPhoto | null) {
    setData((current) => ({ ...current, photo }));
  }

  function restart() {
    setData(emptyRegistration);
    setSubmitted(false);
    goTo(0);
  }

  const stepProps = {
    data,
    onFieldChange: updateField,
    invalidFields,
    fieldId,
    errorId,
  };

  const current = registrationSteps[step];

  return (
    <RegistrationLayout
      titleId={titleId}
      steps={
        <StepIndicator current={step} disabled={submitted} onSelect={goTo} />
      }
    >
      <div className={styles.eyebrow}>
        {submitted ? "Prévia concluída" : `Etapa ${step + 1} de ${LAST_STEP + 1}`}
      </div>
      <h1 id={titleId} ref={headingRef} tabIndex={-1} className={styles.title}>
        {submitted ? "Cadastro enviado para análise" : current.title}
      </h1>
      <p className={styles.subtitle}>
        {submitted
          ? "Este é o estado de confirmação proposto para o prestador."
          : current.description}
      </p>

      {submitted ? (
        <Confirmation onRestart={restart} />
      ) : (
        <form onSubmit={handleSubmit} noValidate aria-labelledby={titleId}>
          {step === 0 && (
            <CategoryStep value={data.category} onChange={selectCategory} />
          )}
          {step === 1 && <ProviderDataStep {...stepProps} />}
          {step === 2 && <LocationStep {...stepProps} />}
          {step === 3 && (
            <ServicesStep
              {...stepProps}
              onServicesChange={setServices}
              onPhotoChange={setPhoto}
            />
          )}
          {step === 4 && <ReviewStep data={data} />}

          <FormError id={errorId} messages={issues?.messages ?? []} />

          <div className={styles.actions}>
            {step > 0 && (
              <button
                type="button"
                className={styles.action}
                onClick={() => goTo(step - 1)}
              >
                Voltar
              </button>
            )}
            <button type="submit" className={cn(styles.action, styles.primary)}>
              {step === LAST_STEP ? (
                "Enviar para análise"
              ) : (
                <>
                  Continuar <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </RegistrationLayout>
  );
}
