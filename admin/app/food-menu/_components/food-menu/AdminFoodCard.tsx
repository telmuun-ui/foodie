import { Pencil } from "lucide-react";
import { AddFoodModal } from "./AddFoodModal";

type AdminFoodCardProps = {
  id: string;
  image: string;
  price: number;
  foodName: string;
  ingredients: string;
  categoryId: string;
  categoryName: string;
};

export const AdminFoodCard = ({
  id,
  image,
  foodName,
  ingredients,
  price,
  categoryId,
  categoryName,
}: AdminFoodCardProps) => {
  return (
    <div className="border rounded-[20px] p-4 border-border bg-background flex flex-col gap-5 min-w-full">
      <div
        className="bg-cover bg-center w-full h-32.25 rounded-xl flex justify-end items-end p-5"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        <AddFoodModal
          categoryName={categoryName}
          categoryId={categoryId}
          food={{
            _id: id,
            image,
            price,
            foodName,
            ingredients,
          }}
          trigger={
            <button
              type="button"
              className="flex justify-center items-center rounded-full bg-background h-11 w-11"
            >
              <Pencil color="#EF4444" />
            </button>
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-[#EF4444] text-sm font-medium">{foodName}</p>
          <p className="text-xs">₮{price}</p>
        </div>
        <p className="text-xs">{ingredients}</p>
      </div>
    </div>
  );
};
