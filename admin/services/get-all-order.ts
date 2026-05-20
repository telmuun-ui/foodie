import { apiFetch } from "@/lib/api";

export type OrdersResponse = {
  page: number;
  total: number;
  pages: number;
  orders: AllFoodOrders[];
};

type MeResponse = {
  user: {
    role: string;
  };
};

export const fetchAllOrders = async (): Promise<OrdersResponse> => {
  const me = await apiFetch<MeResponse>("/api/auth/me");

  if (me.user.role !== "admin") {
    throw new Error("Current account is not an admin account");
  }

  return apiFetch<OrdersResponse>("/api/orders?limit=50");
};
