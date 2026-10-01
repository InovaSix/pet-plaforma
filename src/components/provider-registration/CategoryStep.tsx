import {
  HeartHandshake,
  Scissors,
  ShoppingBag,
  Stethoscope,
  Store,
  type LucideIcon,
} from "lucide-react";
import {
  categoryDescriptions,
  providerCategories,
  type ProviderCategory,
} from "@/data/provider-registration";
import styles from "./registration.module.css";

// Ícones indicados no protótipo (atributos data-lucide).
const categoryIcons: Record<ProviderCategory, LucideIcon> = {
  Cuidador: HeartHandshake,
  "Pet shop": Store,
  Veterinário: Stethoscope,
  "Banho e tosa": Scissors,
  "Loja de ração": ShoppingBag,
};

interface CategoryStepProps {
  value: ProviderCategory;
  onChange: (category: ProviderCategory) => void;
}

export function CategoryStep({ value, onChange }: CategoryStepProps) {
  return (
    <div className={styles.choices} role="group" aria-label="Categoria">
      {providerCategories.map((category) => {
        const CategoryIcon = categoryIcons[category];
        return (
          <button
            key={category}
            type="button"
            className={styles.choice}
            aria-pressed={value === category}
            onClick={() => onChange(category)}
          >
            <CategoryIcon className={styles.choiceIcon} aria-hidden="true" />
            <span>
              <strong className={styles.choiceName}>{category}</strong>
              <small className={styles.choiceText}>
                {categoryDescriptions[category]}
              </small>
            </span>
          </button>
        );
      })}
    </div>
  );
}
