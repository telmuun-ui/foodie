"use client";

import useSWR from "swr";
import { AddCategoryModal } from "./food-menu/AddCategoryModal";
import { DishesCategorySkeleton } from "./food-menu/DishesCategorySkeleton";
import { fetchCategoriesWithCount } from "@/services/get-foods-with-categories";

export const DishesCategory = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = useSWR<CategoryWithCount[]>("categories-with-count", fetchCategoriesWithCount);

  if (isLoading) return <DishesCategorySkeleton />;
  if (error) {
    return <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Failed to load categories: {error.message}</div>;
  }
  if (!categories?.length) return null;

  const allDishesCount = categories.reduce((acc, category) => acc + category.count, 0);

  return (
    <div className="flex flex-col gap-4 p-6 bg-background rounded-xl">
      <p className="text-xl font-semibold">Dishes category</p>
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2 px-4 py-2 border rounded-full">
          <p className="text-sm font-medium">All dishes</p>
          <p className="text-xs bg-black text-white rounded-full px-2 py-0.5 flex items-center font-semibold leading-4x">{allDishesCount}</p>
        </div>

        {categories.map((category, index) => (
          <div key={index} className="flex gap-2 px-4 py-2 border rounded-full">
            <p className="text-sm font-medium">{category.categoryName}</p>
            <p className="text-xs bg-black text-white rounded-full px-2.5 py-0.5 flex items-center font-semibold leading-4x">{category.count}</p>
          </div>
        ))}

        <AddCategoryModal />
      </div>
    </div>
  );
};
