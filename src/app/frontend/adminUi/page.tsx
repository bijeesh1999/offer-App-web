"use client";
import React, { useState } from "react";
import { Tag, Package, Plus, MoreVertical } from "lucide-react"; // Removed unused 'Search'
import OfferFormDrawer from "./components/offerForm";
import ProductFormDrawer from "./components/productform";
import { useDispatch, useSelector } from "react-redux";
import { listOffer } from "../redux/slices/offer.slice";
import { listProduct } from "../redux/slices/product.slice";
import { Offer } from "../redux/slices/offer.slice"; // Import Offer type
import { Product } from "../redux/slices/product.slice"; // Import Product type

// Define RootState and AppDispatch types (adjust if your store is typed elsewhere)
interface RootState {
  offer: {
    offers: Offer[];
  };
  products: {
    products: Product[];
    isActive: boolean;
  };
}

type AppDispatch = any; // Cast to any for now; replace with proper type if available

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [isOpenOffer, setIsOpenOffer] = useState(false);
  const [isOpenProduct, setIsOpenProduct] = useState(false);

  const dispatch = useDispatch<AppDispatch>(); // Type dispatch

  const offer = useSelector((state: RootState) => state.offer?.offers); // Type state
  const { products } = useSelector((state: RootState) => state.products); // Type state

  console.log({ products });

  React.useEffect(() => {
    dispatch(listOffer()); // Now typed correctly
    dispatch(listProduct()); // Now typed correctly
  }, []);

  // Removed unused 'offers' array

  console.log({ offer });

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-8 font-sans">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Store Management
            </h1>
            <p className="text-gray-500">
              Manage your inventory and promotional campaigns.
            </p>
          </div>
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            onClick={() => {
              activeTab === "products"
                ? setIsOpenProduct(true)
                : setIsOpenOffer(true);
            }}
          >
            <Plus size={18} /> Add{" "}
            {activeTab === "products" ? "Product" : "Offer"}
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="max-w-6xl mx-auto">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-all ${
                activeTab === "products"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Package size={18} /> Products
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-all ${
                activeTab === "offers"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
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
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Product Name
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Price
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Offers
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                ) : (
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Offer Title
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Discount Type
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeTab === "products"
                  ? products.map(
                      (
                        p: Product // Explicitly type p as Product
                      ) => (
                        <tr
                          key={p._id} // Use _id instead of id
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-gray-800">
                            {p.name}
                          </td>
                          <td className="px-6 py-4 text-gray-600">{p.price}</td>
                          <td className="px-6 py-4 text-gray-600">
                            {p.quantity} units
                          </td>
                          <td className="px-6 py-4 relative group overflow-visible">
                            <div className="flex items-center gap-2">
                              {p.offers && p.offers.length > 0 ? (
                                <>
                                  <span className="text-gray-700 font-medium">
                                    {p.offers[0]} // Assuming offers is
                                    string[]; adjust if Offer[]
                                  </span>

                                  {p.offers.length > 1 && (
                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-100 cursor-help">
                                      +{p.offers.length - 1}
                                    </span>
                                  )}

                                  {p.offers.length > 1 && (
                                    <div className="absolute bottom-full left-0 mb-2 z-[100] hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
                                      <div className="bg-gray-900 text-white text-xs rounded-lg shadow-2xl p-3 min-w-[180px] border border-gray-700">
                                        <p className="text-gray-400 mb-2 border-b border-gray-700 pb-1 font-bold uppercase text-[9px]">
                                          Linked Offers
                                        </p>
                                        <ul className="space-y-1.5">
                                          {p.offers.map(
                                            (
                                              offer: string,
                                              idx: number // Type offer and idx
                                            ) => (
                                              <li
                                                key={idx}
                                                className="flex items-center gap-2 whitespace-nowrap"
                                              >
                                                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                                                {offer}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </div>
                                      <div className="w-2 h-2 bg-gray-900 rotate-45 absolute -bottom-1 left-4 border-r border-b border-gray-700" />
                                    </div>
                                  )}
                                </>
                              ) : (
                                <span className="text-gray-400 italic text-sm">
                                  No offers
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                p.isActive === true // Assuming isActive exists; add to Product interface if not
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {p.isActive === true ? "active" : "draft"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-400 cursor-pointer">
                            <MoreVertical size={18} />
                          </td>
                        </tr>
                      )
                    )
                  : offer?.map(
                      (
                        o: Offer // Type o as Offer
                      ) => (
                        <tr
                          key={o._id} // Use _id
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-gray-800">
                            {o.name}
                          </td>
                          <td className="px-6 py-4 text-blue-600 font-semibold">
                            {o.type}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                o.isActive === true // Assuming isActive exists
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {o.isActive === true ? "Active" : "Draft"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-400 cursor-pointer">
                            <MoreVertical size={18} />
                          </td>
                        </tr>
                      )
                    )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <OfferFormDrawer
        isOpen={isOpenOffer}
        onClose={() => setIsOpenOffer(false)}
      />
      <ProductFormDrawer
        isOpen={isOpenProduct}
        onClose={() => setIsOpenProduct(false)}
        availableOffers={offer}
      />
    </>
  );
};

export default AdminPanel;
