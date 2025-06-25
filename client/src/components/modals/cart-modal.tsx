import { useState } from "react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart/cart-provider";
import { useAuth } from "@/hooks/useAuth";
import { Trash2, ShoppingCart } from "lucide-react";

interface CartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartModal({ open, onOpenChange }: CartModalProps) {
  const [, setLocation] = useLocation();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      onOpenChange(false);
      // This would trigger the auth modal in the parent component
      return;
    }
    
    onOpenChange(false);
    setLocation("/checkout");
  };

  const handleClearCart = () => {
    clearCart();
  };

  const totalPrice = getTotalPrice();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="text-3xl font-bold">
              Shopping <span className="gradient-text">Cart</span>
            </span>
            <p className="text-gray-400 text-sm mt-2">
              Review your order and proceed to checkout
            </p>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-400">Your cart is empty</p>
              <p className="text-sm text-gray-500 mt-2">
                Add some services to get started!
              </p>
            </div>
          ) : (
            <>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{item.name}</h4>
                      <p className="text-sm text-gray-400">
                        ${item.price.toFixed(2)}
                        {item.isRecurring && (
                          <span className="ml-1">/{item.recurringPeriod}</span>
                        )}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="h-8 w-8 p-0"
                        >
                          -
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          +
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold gradient-text">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleClearCart}
                    className="flex-1"
                  >
                    Clear Cart
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    className="flex-1 btn-primary"
                  >
                    {isAuthenticated ? "Checkout" : "Login to Checkout"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
