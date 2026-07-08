import type { CategoryDTO } from '@shared/index';

interface CategorySelectorProps {
  categories: CategoryDTO[];
  selectedCategoryId: string | null;
  onSelect: (categoryId: string) => void;
}

export function CategorySelector({ categories, selectedCategoryId, onSelect }: CategorySelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const selected = category.id === selectedCategoryId;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`px-5 py-3 rounded-lg font-semibold text-sm transition-all duration-200 border ${
              selected
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-transparent shadow-md hover:shadow-lg scale-105'
                : 'bg-white text-slate-700 border-slate-200 hover:border-green-400 hover:bg-slate-50 hover:text-slate-900'
            }`}>
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
