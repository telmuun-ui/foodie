"use client";

import { useState } from "react";
import { FoodCategory } from "@/components/admin/food-menu/AdminFoodsSection";
import { FoodsWithCategories } from "./FoodsWithCategories";

export const FoodCategories = () => {
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const nonEmptyCategories = categories.filter(
    (category) => category.foods?.length > 0
  );

  const totalFoods = nonEmptyCategories.reduce(
    (sum, category) => sum + category.foods.length,
    0
  );

  return (
    <div>
      <div className="flex flex-col my-8 gap-9">
        <div className="text-3xl font-semibold text-white">Categories</div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full transition-colors ${
              selectedCategoryId === null
                ? "bg-red-500 text-white"
                : "bg-background text-foreground"
            }`}
          >
            <span>All</span>
            <span className="text-xs">{totalFoods}</span>
          </button>
          {nonEmptyCategories.map((category) => (
            <button
              key={category._id}
              type="button"
              onClick={() => setSelectedCategoryId(category._id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full transition-colors ${
                selectedCategoryId === category._id
                  ? "bg-red-500 text-white"
                  : "bg-background text-foreground"
              }`}
            >
              <span>{category.categoryName}</span>
              <span className="text-xs">{category.foods.length}</span>
            </button>
          ))}
        </div>
      </div>
      <FoodsWithCategories
        selectedCategoryId={selectedCategoryId}
        onCategoriesLoaded={setCategories}
      />
    </div>
  );
};
