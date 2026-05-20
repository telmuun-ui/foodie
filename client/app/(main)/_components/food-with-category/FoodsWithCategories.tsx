"use client";

import { FoodCategory } from "@/components/admin/food-menu/AdminFoodsSection";
import { FoodCard } from "@/components/food";
import { fetchFoodsWithCategories } from "@/lib/services/get-foods-with-categories";
import { useEffect, useState } from "react";

type FoodsWithCategoriesProps = {
  selectedCategoryId?: string | null;
  onCategoriesLoaded?: (categories: FoodCategory[]) => void;
};

export const FoodsWithCategories = ({
  selectedCategoryId,
  onCategoriesLoaded,
}: FoodsWithCategoriesProps) => {
  const [foodsWithCategories, setFoodsWithCategories] = useState<
    FoodCategory[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await fetchFoodsWithCategories();
      if (error) {
        setHasError(true);
        setLoading(false);
        return;
      }

      setFoodsWithCategories(data);
      onCategoriesLoaded?.(data);
      setLoading(false);
    };
    fetchData();
  }, [onCategoriesLoaded]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (hasError) return <p className="text-white">Failed to load foods</p>;

  if (!foodsWithCategories?.length) return null;

  const nonEmptyCategories = foodsWithCategories.filter(
    (category) => category?.foods?.length > 0
  );

  const visibleCategories = selectedCategoryId
    ? nonEmptyCategories.filter((category) => category._id === selectedCategoryId)
    : nonEmptyCategories;

  return (
    <div className="flex flex-col gap-6">
      {visibleCategories?.map((category) => (
        <div key={category._id} className="flex flex-col gap-[54px] rounded-xl">
          <p className="text-3xl font-semibold text-white">
            {category?.categoryName}
          </p>
          <div className="grid grid-cols-1 mb-5 gap-9 sm:grid-cols-2 lg:grid-cols-3">
            {category?.foods.map((food) => {
              return (
                <div key={food?._id}>
                  <FoodCard
                    foodName={food?.foodName}
                    price={food?.price}
                    image={food?.image}
                    ingredients={food?.ingredients}
                    _id={food?._id}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
