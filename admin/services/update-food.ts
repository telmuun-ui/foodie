import { apiFetch } from "@/lib/api";

type UpdateFoodPayload = {
  foodId: string;
  foodName: string;
  price: number;
  image?: string;
  ingredients?: string;
  category: string;
};

export const updateFood = ({
  foodId,
  foodName,
  price,
  image,
  ingredients,
  category,
}: UpdateFoodPayload) =>
  apiFetch(`/api/foods/${foodId}`, {
    method: "PUT",
    body: JSON.stringify({
      name: foodName,
      price,
      imageUrl: image,
      description: ingredients,
      category,
    }),
  });
