import { connectDB } from "@/lib/db";
import { FoodModel } from "@/models";
import { requireAdmin, handleApiError } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;

    await connectDB();

    const food = await FoodModel.findById(id).populate("category", "name");

    if (!food)
      return NextResponse.json({ error: "Food not found" }, { status: 404 });

    return NextResponse.json({ food });
  } catch (error) {
    return handleApiError(error);
  }
};

export const PUT = async (request: NextRequest, { params }: Params) => {
  try {
    const { id } = await params;

    await connectDB();

    requireAdmin(request);

    const food = await FoodModel.findById(id);

    if (!food)
      return NextResponse.json({ error: "Food not found" }, { status: 404 });

    const body = await request.json();

    if (body.name !== undefined) food.name = body.name;
    if (body.price !== undefined) food.price = body.price;
    if (body.category !== undefined) food.category = body.category;
    if (body.description !== undefined) food.description = body.description;
    if (body.imageUrl !== undefined) food.image = body.imageUrl;
    if (body.image !== undefined) food.image = body.image;
    if (body.isAvailable !== undefined) food.isAvailable = body.isAvailable;

    await food.save();

    const populated = await food.populate("category", "name");

    return NextResponse.json({ message: "Food updated", food: populated });
  } catch (error: unknown) {
    return handleApiError(error);
  }
};

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    await connectDB();

    requireAdmin(request);

    const food = await FoodModel.findById(id);

    if (!food)
      return NextResponse.json({ error: "Food not found" }, { status: 404 });

    await food.deleteOne();

    return NextResponse.json({ message: "Food deleted" });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
