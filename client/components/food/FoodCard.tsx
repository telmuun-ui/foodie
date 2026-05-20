"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { FoodDetailModal } from "./FoodDetailModal";
import { MouseEventHandler, useContext, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { CartContext } from "@/app/(main)/context";
import { AddToCartAlert } from "./AddToCartAlert";
import { formatMoney } from "@/lib";

type FoodCardProps = {
  foodName: string;
  price: number;
  ingredients: string;
  image: string;
  _id: string;
};

export const FoodCard = ({
  foodName,
  price,
  ingredients,
  image,
  _id,
}: FoodCardProps) => {
  const { addItem } = useContext(CartContext);
  const imageSrc = image?.trim() || null;

  const food = { _id, foodName, price, ingredients, image };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const formattedPrice = formatMoney(price);

  const onToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    addItem({
      food: { _id, foodName, price, ingredients, image },
      quantity: 1,
    });
    setShowAlert(true);
  };

  const handleAlertRemove = () => {
    setShowAlert(false);
  };

  return (
    <div className="w-full">
      <div onClick={onToggleModal}>
        <Card className="flex flex-col gap-5 p-4 bg-white border-none shadow-none cursor-pointer w-99 h-86 rounded-3xl">
          <div className="relative flex items-end justify-end overflow-hidden h-52 rounded-3xl">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={foodName}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-muted" />
            )}
            <Button
              className="absolute bg-white rounded-full w-11 h-11 bottom-5 right-5"
              onClick={handleAddToCart}
            >
              <Plus color="red" />
            </Button>
          </div>

          <div className="w-full">
            <div className="flex justify-between">
              <p className="text-2xl font-semibold text-red-500">{foodName}</p>
              <p className="text-lg font-semibold text-[#09090B]">
                {formattedPrice} ₮
              </p>
            </div>

            <div className="mt-2 text-sm text-[#09090B] font-normal">
              {ingredients}
            </div>
          </div>
        </Card>
      </div>
      <FoodDetailModal
        food={food}
        isModalOpen={isModalOpen}
        onToggleModal={onToggleModal}
      />
      <AddToCartAlert isVisible={showAlert} onHide={handleAlertRemove} />
    </div>
  );
};
