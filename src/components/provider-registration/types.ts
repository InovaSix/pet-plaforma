import type {
  RegistrationData,
  TextFieldName,
} from "@/data/provider-registration";

/** Propriedades comuns às etapas com campos de formulário. */
export interface StepFieldsProps {
  data: RegistrationData;
  onFieldChange: (field: TextFieldName, value: string) => void;
  invalidFields: ReadonlySet<string>;
  /** Gera o id do elemento de um campo, usado também para levar o foco. */
  fieldId: (field: string) => string;
  errorId: string;
}
