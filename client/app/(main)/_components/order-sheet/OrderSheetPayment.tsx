"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarDashLine } from "@/components/icons";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { CartContext, UserContext } from "../../context";
import { createOrder, formatMoney } from "@/lib";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export const OrderSheetPayment = ({ openModal }: { openModal: () => void }) => {
  const { totalPrice, cartData, clearCart } = useContext(CartContext);
  const { user, loading } = useContext(UserContext);
  const { push } = useRouter();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const totalPriceWithFee = Number(totalPrice) + 5000;

  const handleCreateOrder = async () => {
    if (loading) {
      toast.info("Checking your account...");
      return;
    }

    if (!user) {
      push("/login");
      return;
    }

    if (cartData.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!deliveryAddress.trim()) {
      toast.error("Please enter your delivery address.");
      return;
    }

    const items = cartData.map((item) => ({
      foodId: item.food._id,
      quantity: item.quantity,
    }));

    const result = await createOrder({
      items,
      deliveryAddress: deliveryAddress.trim(),
    });

    if (result) {
      clearCart();
      setDeliveryAddress("");
      openModal();
    }
  };

  const formattedTotalPrice = formatMoney(Number(totalPrice));
  const formattedPriceWithFee = formatMoney(totalPriceWithFee);
  const formattedDeliveryFee = formatMoney(5000);

  return (
    <Card className="mt-6">
      <CardHeader className="p-4">
        <CardTitle>Payment info</CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <Textarea
          placeholder="Enter delivery address…"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          rows={2}
          className="resize-none"
        />

        <div className="flex justify-between">
          <p className="text-[#71717A] font-light">Items</p>
          <p className="font-bold">{formattedTotalPrice}₮</p>
        </div>

        <div className="flex justify-between">
          <p className="text-[#71717A] font-light">Shipping</p>
          <p className="font-bold">{formattedDeliveryFee}₮</p>
        </div>

        <SidebarDashLine />

        <div className="flex justify-between">
          <p className="text-[#71717A] font-light">Total</p>
          <p className="font-bold">{formattedPriceWithFee}₮</p>
        </div>
      </CardContent>

      <CardFooter className="p-4">
        <Button size="lg" className="w-full bg-red-500 rounded-full" onClick={handleCreateOrder} disabled={loading}>
          Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};
