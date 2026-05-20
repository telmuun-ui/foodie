import { connectDB } from "@/lib/db";
import { handleApiError, getAuthUser } from "@/lib/auth";
import { OrderModel, FoodModel } from "@/models";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const authUser = getAuthUser(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "10"));

    const query: Record<string, unknown> = {};

    if (status) query.status = status;
    if (authUser.role !== "admin") query.user = authUser.userId;

    const [orders, total] = await Promise.all([
      OrderModel.find(query)
        .populate("user", "name email")
        .populate("items.food", "name price image")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      OrderModel.countDocuments(query),
    ]);

    return NextResponse.json({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export const POST = async (request: NextRequest) => {
  try {
    await connectDB();

    const authUser = getAuthUser(request);

    const { items, deliveryAddress, notes } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "items must be a non-empty array" }, { status: 400 });
    }

    if (!deliveryAddress) {
      return NextResponse.json({ error: "deliveryAddress is required" }, { status: 400 });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      if (!item.foodId || !item.quantity || item.quantity < 1) {
        return NextResponse.json({ error: "Each item requires foodId and quantity >= 1" }, { status: 400 });
      }

      const food = await FoodModel.findById(item.foodId);

      if (!food) {
        return NextResponse.json({ error: `Food ${item.foodId} not found` }, { status: 404 });
      }

      if (!food.isAvailable) {
        return NextResponse.json({ error: `"${food.name}" is currently unavailable` }, { status: 400 });
      }

      orderItems.push({ food: food._id, quantity: item.quantity, price: food.price });
      totalAmount += food.price * item.quantity;
    }

    const order = await OrderModel.create({
      notes,
      totalAmount,
      deliveryAddress,
      items: orderItems,
      user: authUser.userId,
    });

    const populated = await order.populate([
      { path: "user", select: "name email" },
      { path: "items.food", select: "name price image" },
    ]);

    return NextResponse.json({ message: "Order placed successfully", order: populated }, { status: 201 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
};
