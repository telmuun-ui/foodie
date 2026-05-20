declare module "*.css";

type AuthPayload = {
  email: string;
  password: string;
};

type SignupPayload = {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
};

type AuthResponse = {
  accessToken?: string;
  refreshToken?: string;
  message?: string;
  userId?: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
};

type SignupResponse = {
  message: string;
  userId: string;
};

type FoodOrderItem = {
  food: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  price: number;
};

type AllFoodOrders = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  items: FoodOrderItem[];
  deliveryAddress: string;
  status: FoodOrderStatusEnum;
  paymentStatus: "pending" | "paid" | "failed";
};

type CategoryWithCount = {
  _id: string;
  count: number;
  categoryName: string;
};

type FoodCategory = {
  _id: string;
  count: number;
  categoryName: string;
  foods: {
    _id: string;
    price: number;
    image: string;
    foodName: string;
    createdAt?: string;
    updatedAt?: string;
    ingredients: string;
  }[];
};

type ServerCategory = { _id: string; name: string };

type ServerFood = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  category: { _id: string; name: string };
};
