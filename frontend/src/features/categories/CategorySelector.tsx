import type { CategoryDTO } from '@shared/index';

interface CategorySelectorProps {
  categories: CategoryDTO[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string) => void;
}

export function CategorySelector({ categories, selectedCategoryId, onSelect }: CategorySelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 py-4">
      {categories.map((category) => {
        const selected = category.id === selectedCategoryId;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              selected
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
            }`}>
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
