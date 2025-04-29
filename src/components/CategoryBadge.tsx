
import { getCategoryColor, getCategoryName } from '@/utils/habitUtils';
import { Category } from '@/types';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

const CategoryBadge = ({ category, className = '' }: CategoryBadgeProps) => {
  const categoryColor = getCategoryColor(category).replace('bg-', '');
  const categoryName = getCategoryName(category);
  
  return (
    <div 
      className={`inline-flex items-center text-xs font-medium rounded-full px-2.5 py-1 ${className}`}
      style={{ backgroundColor: `rgba(var(--${categoryColor}-rgb), 0.15)`, color: `rgb(var(--${categoryColor}-rgb))` }}
    >
      {categoryName}
    </div>
  );
};

export default CategoryBadge;
