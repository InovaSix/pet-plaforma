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
  type ValidatedField,
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

/** Etapa em que cada campo validado aparece, para voltar a ela em caso de erro. */
const FIELD_STEP: Record<ValidatedField, number> = {
  category: 0,
  name: 1,
  business: 1,
  email: 1,
  phone: 1,
  crmv: 1,
  cep: 2,
  city: 2,
  region: 2,
  services: 3,
};

interface ApiError {
  fields?: string[];
  messages?: string[];
}

/** Envia o cadastro e a foto para a API (`POST /api/prestadores`). */
async function sendRegistration(
  data: RegistrationData,
  photoFile: File | null,
): Promise<{ ok: true } | { ok: false; error: ApiError }> {
  const body = new FormData();
  body.append("dados", JSON.stringify(data));
  if (photoFile) body.append("foto", photoFile);

  try {
    const response = await fetch("/api/prestadores", { method: "POST", body });
    if (response.ok) return { ok: true };
    const error = (await response.json().catch(() => ({}))) as ApiError;
    return { ok: false, error };
  } catch {
    return {
      ok: false,
      error: {
        messages: [
          "Sem conexão com o servidor. Verifique sua internet e tente de novo.",
        ],
      },
    };
  }
}

/**
 * Cadastro de prestadores. Os dados ficam na memória deste componente até o
 * envio, quando vão para a API junto com a foto; nada é salvo no navegador
 * ou colocado na URL.
 */
export function ProviderRegistration() {
  const uid = useId();
  const fieldId = (field: string) => `${uid}-${field}`;
  const titleId = fieldId("title");
  const errorId = fieldId("error");

  const [step, setStep] = useState(0);
  const [data, setData] = useState<RegistrationData>(emptyRegistration);
  const [issues, setIssues] = useState<StepIssues | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

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

    setSending(true);
    setIssues(null);
    const result = await sendRegistration(data, photoFile);
    setSending(false);

    if (!result.ok) {
      // Erro num campo volta para a etapa dele; os demais ficam na revisão
      // (a mensagem é anunciada pelo role="alert" do FormError).
      const fields = (result.error.fields ?? []).filter(
        (field): field is ValidatedField => field in FIELD_STEP,
      );
      const messages = result.error.messages?.length
        ? result.error.messages
        : ["Não conseguimos enviar seu cadastro. Tente novamente."];
      if (fields.length > 0) block(FIELD_STEP[fields[0]], { fields, messages });
      else setIssues({ fields: [], messages });
      return;
    }

    setSubmitted(true);
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

  function setPhoto(photo: SelectedPhoto | null, file: File | null) {
    setData((current) => ({ ...current, photo }));
    setPhotoFile(file);
  }

  function restart() {
    setData(emptyRegistration);
    setPhotoFile(null);
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
        {submitted ? "Cadastro recebido" : `Etapa ${step + 1} de ${LAST_STEP + 1}`}
      </div>
      <h1 id={titleId} ref={headingRef} tabIndex={-1} className={styles.title}>
        {submitted ? "Cadastro enviado para análise" : current.title}
      </h1>
      <p className={styles.subtitle}>
        {submitted
          ? "Recebemos seus dados. Nossa equipe vai analisar e entrar em contato."
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
            <button
              type="submit"
              disabled={sending}
              aria-busy={sending || undefined}
              className={cn(styles.action, styles.primary)}
            >
              {step === LAST_STEP ? (
                sending ? "Enviando…" : "Enviar para análise"
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
