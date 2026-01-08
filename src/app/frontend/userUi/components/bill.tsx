import React from "react";
import {
  CheckCircle2,
  Receipt,
  Tag,
  Package,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useSelector } from "react-redux";

interface Product {
  _id: string;
  name: string;
  // Add other fields as needed
}

interface BillItem {
  _id: string;
  productId: string;
  quantity: number;
  finalPrice: number;
  discountAmount: number;
}

interface BillData {
  _id: string;
  createdAt: string;
  items: BillItem[];
  finalAmount: number;
  totalDiscount: number;
}

interface Props {
  isOpen: boolean;
  billData: BillData | null;
  onClose: () => void;
}

const BillSummaryDialog: React.FC<Props> = ({ isOpen, billData, onClose }) => {
  const { products } = useSelector((state: any) => state.products) as {
    products: Product[];
  };

  if (!isOpen || !billData) return null;

  console.log({ billData });

  // Helper to get product name from Redux store based on bill productId
  const getProductDetails = (id: any) => {
    return products?.find((p) => p._id === id) || { name: "Unknown Product" };
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        {/* Success Header */}
        <div className="bg-emerald-500 p-6 text-white text-center relative">
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white p-2 rounded-full shadow-lg">
            <CheckCircle2 className="text-emerald-500" size={32} />
          </div>
          <h2 className="text-xl font-bold mb-1">Payment Successful</h2>
          <p className="text-emerald-100 text-xs font-medium uppercase tracking-widest">
            Transaction:{" "}
          </p>
        </div>

        <div className="p-8 pt-10">
          {/* Date & Time */}
          <div className="flex items-center justify-between mb-6 text-gray-400 text-xs font-medium border-b border-dashed border-gray-100 pb-4">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(billData.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Receipt size={12} />
              {new Date(billData.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4 mb-8">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Order Items
            </p>
            {billData.items.map((item) => {
              const details = getProductDetails(item.productId);
              return (
                <div key={item._id} className="flex items-center gap-3">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <Package size={16} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-800">
                      {details.name}
                    </h4>
                    <p className="text-[10px] text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      ${item.finalPrice}
                    </p>
                    {item.discountAmount > 0 && (
                      <p className="text-[10px] font-bold text-emerald-500 flex items-center justify-end gap-1">
                        <Tag size={8} /> -${item.discountAmount}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Summary */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-gray-700">
                ${billData.finalAmount + billData.totalDiscount}
              </span>
            </div>

            {/* Highlighted Discount Row */}
            {billData.totalDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Tag size={14} /> Total Discount
                </span>
                <span className="font-bold text-emerald-600">
                  -${billData.totalDiscount}
                </span>
              </div>
            )}

            <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
              <span className="text-gray-900 font-bold">Amount Paid</span>
              <span className="text-2xl font-black text-blue-600">
                ${billData.finalAmount}
              </span>
            </div>
          </div>

          {/* OK Button */}
          <button
            onClick={onClose}
            className="w-full mt-8 bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
          >
            Done <ArrowRight size={18} />
          </button>
        </div>

        {/* Decorative Scalloped Bottom Edge */}
        <div className="flex justify-center gap-1 mb-[-4px]">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-50 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillSummaryDialog;

// {billData?._id?.slice(-8)}
