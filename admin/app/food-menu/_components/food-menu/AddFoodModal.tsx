"use client";

import { z } from "zod";
import { useSWRConfig } from "swr";
import { Plus, Trash2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "./ImageUploader";
import { uploadImage } from "@/lib/uploadImage";
import { createFood } from "@/services/create-food";
import { updateFood } from "@/services/update-food";
import { deleteFood } from "@/services/delete-food";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const foodSchema = z.object({
  foodName: z.string().min(1, "Food name is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Price must be a positive number"),
  ingredients: z.string().min(1, "Ingredients are required"),
});

type FoodFormValues = z.infer<typeof foodSchema>;

type AddFoodModalProps = {
  categoryName: string;
  categoryId: string;
  food?: FoodCategory["foods"][number];
  trigger?: ReactNode;
};

export const AddFoodModal = ({
  categoryName,
  categoryId,
  food,
  trigger,
}: AddFoodModalProps) => {
  const isEditMode = Boolean(food);
  const [uploadedImage, setUploadedImage] = useState<File>();
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(food?.image ?? null);
  const { mutate } = useSWRConfig();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FoodFormValues>({
    resolver: zodResolver(foodSchema),
    defaultValues: {
      foodName: food?.foodName ?? "",
      price: food ? String(food.price) : "",
      ingredients: food?.ingredients ?? "",
    },
  });

  const syncFormState = () => {
    reset({
      foodName: food?.foodName ?? "",
      price: food ? String(food.price) : "",
      ingredients: food?.ingredients ?? "",
    });
    setUploadedImage(undefined);
    setImagePreview(food?.image ?? null);
  };

  useEffect(() => {
    if (!open) return;
    reset({
      foodName: food?.foodName ?? "",
      price: food ? String(food.price) : "",
      ingredients: food?.ingredients ?? "",
    });
  }, [food, open, reset]);

  const onSubmit = async (data: FoodFormValues) => {
    let imageUrl = imagePreview ?? "";

    if (uploadedImage) {
      imageUrl = await uploadImage(uploadedImage);
    }

    const foodData = {
      foodName: data.foodName,
      price: parseFloat(data.price),
      ingredients: data.ingredients,
      image: imageUrl,
      category: categoryId,
    };

    if (isEditMode && food) {
      await updateFood({
        foodId: food._id,
        ...foodData,
      });
    } else {
      await createFood(foodData);
    }

    reset();
    setUploadedImage(undefined);
    setImagePreview(food?.image ?? null);
    await Promise.all([
      mutate("foods-with-categories"),
      mutate("categories-with-count"),
    ]);
    setOpen(false);
  };

  const onFileSelect = (file: File) => {
    setUploadedImage(file);
  };

  const onRemoveImage = () => {
    setUploadedImage(undefined);
    setImagePreview(null);
  };

  const handleDelete = async () => {
    if (!food) return;

    const isConfirmed = window.confirm(`Delete "${food.foodName}"?`);
    if (!isConfirmed) return;

    await deleteFood(food._id);
    await Promise.all([
      mutate("foods-with-categories"),
      mutate("categories-with-count"),
    ]);
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen || open) {
      syncFormState();
    }
    setOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <div className="custom-dashed-border rounded-3xl h-56.75 flex flex-col gap-6 justify-center items-center m-1 cursor-pointer hover:bg-accent/50 transition-colors bg-gray-100">
            <Button className="bg-red-500 hover:bg-red-600 rounded-full w-9 h-9">
              <Plus width={16} height={16} strokeWidth={1.5} />
            </Button>
            <p className="text-sm text-center w-36 text-muted-foreground">Add new Dish to {categoryName}</p>
          </div>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25 flex flex-col gap-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <DialogTitle>
            {isEditMode ? `Edit dish in ${categoryName}` : `Add new Dish to ${categoryName}`}
          </DialogTitle>
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="rounded-full w-9 h-9">
              <X strokeWidth={1.5} />
            </Button>
          </DialogClose>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex w-full gap-6">
            <div className="flex flex-col w-1/2 gap-2">
              <Label htmlFor="foodName" className="ml-1 font-semibold">
                Food name
              </Label>
              <Input id="foodName" placeholder="Type food name..." {...register("foodName")} />
              {errors.foodName && <p className="text-xs text-red-500">{errors.foodName.message}</p>}
            </div>
            <div className="flex flex-col w-1/2 gap-2">
              <Label htmlFor="price" className="font-semibold">
                Food price
              </Label>
              <Input id="price" type="number" placeholder="Enter price..." {...register("price")} />
              {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ingredients" className="font-semibold">
              Ingredients
            </Label>
            <Input id="ingredients" placeholder="List ingredients..." {...register("ingredients")} />
            {errors.ingredients && <p className="text-xs text-red-500">{errors.ingredients.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="image" className="font-semibold">
              Food image
            </Label>
            <ImageUploader
              key={`${food?._id ?? "new"}-${imagePreview ?? "no-image"}`}
              onFileSelect={onFileSelect}
              imgFile={uploadedImage}
              previewUrl={imagePreview}
              onRemoveImage={onRemoveImage}
            />
          </div>
          <DialogFooter>
            <div className="mt-4 flex w-full gap-3">
              {isEditMode && food && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-12 shrink-0 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  <Trash2 size={16} />
                </Button>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditMode
                    ? "Saving..."
                    : "Adding..."
                  : isEditMode
                    ? "Save changes"
                    : "Add Dish"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
