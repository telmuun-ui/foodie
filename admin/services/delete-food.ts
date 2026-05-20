import { apiFetch } from "@/lib/api";

export const deleteFood = (foodId: string) =>
  apiFetch(`/api/foods/${foodId}`, {
    method: "DELETE",
  });
