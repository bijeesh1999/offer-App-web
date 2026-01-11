"use client";
import React, { useState } from "react";
import { Tag, Package, Plus, MoreVertical } from "lucide-react";
import OfferFormDrawer from "./components/offerForm";
import ProductFormDrawer from "./components/productform";
import { useDispatch, useSelector } from "react-redux";
import { listOffer } from "../redux/slices/offer.slice";
import { listProduct } from "../redux/slices/product.slice";

// 1. Unified Interfaces
// Remove this entire block:
// 1. Unified Interfaces
export interface Offer {
  _id: string;
  name: string;
  type: string;
  // isActive?: boolean;
  priority?: number;
  config?: any;
  startDate?: string | Date;
  endDate?: string | Date;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  offers: Offer[]; // This now uses the correct Redux Offer type
  isActive: boolean;
}

interface RootState {
  offer: {
    offers: Offer[];
  };
  products: {
    products: Product[];
  };
}

type AppDispatch = any;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [isOpenOffer, setIsOpenOffer] = useState(false);
  const [isOpenProduct, setIsOpenProduct] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const offersData = useSelector((state: RootState) => state.offer?.offers) || [];
  const { products } = useSelector((state: RootState) => state.products) || { products: [] };

  React.useEffect(() => {
    dispatch(listOffer());
    dispatch(listProduct());
  }, [dispatch]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8 font-sans">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Store Management</h1>
            <p className="text-gray-500">Manage your inventory and promotional campaigns.</p>
          </div>
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            onClick={() => {
              activeTab === "products" ? setIsOpenProduct(true) : setIsOpenOffer(true);
            }}
          >
            <Plus size={18} /> Add {activeTab === "products" ? "Product" : "Offer"}
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="max-w-6xl mx-auto">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-all ${
                activeTab === "products" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Package size={18} /> Products
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-all ${
                activeTab === "offers" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Tag size={18} /> Offers
            </button>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                {activeTab === "products" ? (
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Product Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Offers</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Offer Title</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Discount Type</th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeTab === "products"
                  ? products?.map((p: Product) => (
                      <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{p.name}</td>
                        <td className="px-6 py-4 text-gray-600">${p.price}</td>
                        <td className="px-6 py-4 text-gray-600">{p.quantity} units</td>
                        <td className="px-6 py-4 relative group overflow-visible">
                          <div className="flex items-center gap-2">
                            {/* FIX: Ensure we cast or verify offers is an array of Offer objects */}
                            {p.offers && p.offers.length > 0 ? (
                              <>
                                <span className="text-gray-700 font-medium">
                                  {p.offers[0]?.name || "Unnamed Offer"}
                                </span>

                                {p.offers.length > 1 && (
                                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-100">
                                    +{p.offers.length - 1}
                                  </span>
                                )}

                                {/* Hover Tooltip for multi-offers */}
                                {p.offers.length > 1 && (
                                  <div className="absolute bottom-full left-0 mb-2 z-[100] hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
                                    <div className="bg-gray-900 text-white text-xs rounded-lg shadow-2xl p-3 min-w-[180px]">
                                      <p className="text-gray-400 mb-2 border-b border-gray-700 pb-1 font-bold uppercase text-[9px]">Linked Offers</p>
                                      <ul className="space-y-1.5">
                                        {p.offers.map((off: Offer) => (
                                          <li key={off._id} className="flex items-center gap-2">
                                            <div className="w-1 h-1 bg-blue-400 rounded-full" />
                                            {off.name}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-400 italic text-sm">No offers</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.isActive ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                            {p.isActive ? "active" : "draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-400 cursor-pointer">
                          <MoreVertical size={18} />
                        </td>
                      </tr>
                    ))
                  : offersData?.map((o: Offer) => (
                      <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{o.name}</td>
                        <td className="px-6 py-4 text-blue-600 font-semibold">{o.type}</td>
                        <td className="px-6 py-4">
                          {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${o.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                            {o.isActive ? "Active" : "Draft"}
                          </span> */}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-400 cursor-pointer">
                          <MoreVertical size={18} />
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <OfferFormDrawer isOpen={isOpenOffer} onClose={() => setIsOpenOffer(false)} />
      <ProductFormDrawer 
        isOpen={isOpenProduct} 
        onClose={() => setIsOpenProduct(false)} 
        availableOffers={offersData } 
      />
    </>
  );
};

export default AdminPanel;