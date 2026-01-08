"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingCart,
  Star,
  Clock,
  Tag,
  X,
  Plus,
  Minus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { listProduct } from "../redux/slices/product.slice";
import { createNewBill } from "../redux/slices/bill.slice";
import BillSummaryDialog from "./components/bill";
// Import your RootState and AppDispatch types from your store file
// import { RootState, AppDispatch } from "../redux/store"; 

// --- Interfaces ---
interface CartItem {
  _id: string;
  qty: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  deliveryTime?: string;
}

interface DetailedCartItem extends Product {
  qty: number;
}

const ProductListingPage: React.FC = () => {
  // 1. Store ONLY id and quantity
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isBillOpen, setIsbillOpen] = useState<boolean>(false);

  // Using 'any' for dispatch/selector if you haven't exported RootState yet, 
  // but ideally use typed hooks
  const dispatch = useDispatch<any>(); 
  const { products } = useSelector((state: any) => state.products);
  const { status, bill } = useSelector((state: any) => state.bill);

  useEffect(() => {
    dispatch(listProduct());
  }, [dispatch]);

  useEffect(() => {
    if (status === "created") {
      setIsbillOpen(true);
    }
  }, [status]);

  // 2. Computed Cart Data: Merge IDs with full Product details
  const detailedCart = useMemo<DetailedCartItem[]>(() => {
    return cartItems
      .map((item) => {
        const productDetails = products?.find((p: Product) => p._id === item._id);
        if (!productDetails) return null;
        return {
          ...productDetails,
          qty: item.qty,
        };
      })
      .filter((item): item is DetailedCartItem => item !== null); 
  }, [cartItems, products]);

  // 3. Totals
  const cartTotal = detailedCart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // --- Actions ---
  const addToCart = (productId: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === productId);
      if (existing) {
        return prev.map((item) =>
          item._id === productId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { _id: productId, qty: 1 }];
    });
    setIsDrawerOpen(true);
  };

  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, qty: Math.max(0, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50/50 pb-24">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">
              Express Delivery
            </h1>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 bg-gray-100 rounded-full"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <main className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products?.map((item: Product) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl p-3 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <button
                    onClick={() => addToCart(item._id)}
                    className="absolute bottom-3 right-3 bg-white p-3 rounded-2xl shadow-xl hover:bg-black hover:text-white transition-all active:scale-90"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
                <div className="px-2 pb-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <span className="font-bold text-blue-600">
                      ${item.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* --- BOTTOM DRAWER --- */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
        )}
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[32px] shadow-2xl transform transition-transform duration-500 ${
            isDrawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Cart ({cartCount})</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[40vh] overflow-y-auto space-y-4 mb-6">
              {detailedCart.length === 0 ? (
                <p className="text-center text-gray-400 py-10">Cart is empty</p>
              ) : (
                detailedCart.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl"
                  >
                    <img
                      src={item.image}
                      className="w-16 h-16 rounded-xl object-cover"
                      alt=""
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{item.name}</h4>
                      <p className="text-blue-600 font-bold text-sm">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-white border border-gray-100 p-1 rounded-xl">
                      <button
                        onClick={() => updateQty(item._id, -1)}
                        className="p-1"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item._id, 1)}
                        className="p-1"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              disabled={detailedCart.length === 0}
              onClick={() => {
                setIsDrawerOpen(false);
                setIsDialogOpen(true);
              }}
              className="w-full bg-black text-white py-4 rounded-2xl font-bold flex justify-between px-8"
            >
              <span>Checkout</span>
              <span>${cartTotal.toFixed(2)}</span>
            </button>
          </div>
        </div>

        {/* --- CHECKOUT DIALOG --- */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-md rounded-[32px] p-8 animate-in zoom-in duration-300">
              <h2 className="text-2xl font-bold text-center mb-6">
                Order Summary
              </h2>
              <div className="space-y-3 mb-8">
                {detailedCart.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.qty}x {item.name}
                    </span>
                    <span className="font-bold">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1 py-4 font-bold text-gray-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    dispatch(createNewBill(cartItems));
                    setCartItems([]);
                    setIsDialogOpen(false);
                  }}
                  className="flex-1 bg-black text-white py-4 font-bold rounded-2xl"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <BillSummaryDialog
        isOpen={isBillOpen}
        billData={bill}
        onClose={() => setIsbillOpen(false)}
      />
    </>
  );
};

export default ProductListingPage;