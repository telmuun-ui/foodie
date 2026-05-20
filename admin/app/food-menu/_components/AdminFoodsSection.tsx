"use client";

import useSWR from "swr";
import { AddFoodModal } from "./food-menu/AddFoodModal";
import { AdminFoodCard } from "./food-menu/AdminFoodCard";
import { AdminFoodSkeleton } from "./food-menu/AdminFoodSkeleton";
import { fetchFoodsWithCategories } from "@/services/get-foods-with-categories";

export const AdminFoodsSection = () => {
  const {
    data: foodsWithCategories,
    isLoading,
    error,
  } = useSWR<FoodCategory[]>("foods-with-categories", fetchFoodsWithCategories);

  if (isLoading || !foodsWithCategories) return <AdminFoodSkeleton />;
  if (error) {
    return <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Failed to load foods: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      {foodsWithCategories.map((category, index) => (
        <div key={index} className="flex flex-col gap-4 p-6 bg-background rounded-xl">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <p>{category.categoryName}</p>
            <p className="flex items-center">{category.count}</p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <AddFoodModal categoryName={category.categoryName} categoryId={category._id} />

            {category.foods.map((food) => (
              <div key={food._id} className="flex gap-2">
                <AdminFoodCard
                  id={food._id}
                  image={food.image}
                  price={food.price}
                  ingredients={food.ingredients}
                  foodName={food.foodName}
                  categoryId={category._id}
                  categoryName={category.categoryName}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
