"use client"
import { useState } from 'react';
import { CheckCircle2, Tag, ShoppingCart, Star } from 'lucide-react';

// Define Offer interface
interface Offer {
  id: number;
  title: string;
  description: string;
  type: string;
  value: number;
}

const ProductOfferUI = () => {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const product = {
    name: "Ultra-Quiet Mechanical Keyboard",
    originalPrice: 150,
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=600"
  };

  const offers = [
    { id: 1, title: "Summer Sale", description: "Get a flat 20% discount", type: "percent", value: 20 },
    { id: 2, title: "First Purchase", description: "Fixed $30 off on your first order", type: "fixed", value: 30 },
    { id: 3, title: "Bundle Deal", description: "Buy now and save $15 instantly", type: "fixed", value: 15 },
  ];

  // Calculate Discounted Price
  const calculateFinalPrice = () => {
    if (!selectedOffer) return product.originalPrice;
    if (selectedOffer.type === 'percent') {
      return product.originalPrice - (product.originalPrice * (selectedOffer.value / 100));
    }
    return product.originalPrice - selectedOffer.value;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left: Product Image */}
        <div className="md:w-1/2 relative bg-gray-200">
          <img 
            src={product.image} 
            alt={product.name}
            className="h-full w-full object-cover"
          />
          {selectedOffer && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
              <Tag size={14} /> Applied: {selectedOffer.title}
            </div>
          )}
        </div>

        {/* Right: Details & Offers */}
        <div className="md:w-1/2 p-8 flex flex-col">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2 text-yellow-500">
              <div className="flex"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
              <span className="text-gray-400 text-sm">({product.reviews} reviews)</span>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold text-gray-900">${calculateFinalPrice()}</span>
            {selectedOffer && (
              <span className="ml-3 text-xl text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Available Offers (Select One)</p>
            {offers.map((offer) => (
              <div 
                key={offer.id}
                onClick={() => setSelectedOffer(offer)}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                  selectedOffer?.id === offer.id 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-100 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`mt-1 ${selectedOffer?.id === offer.id ? 'text-blue-500' : 'text-gray-300'}`}>
                  {selectedOffer?.id === offer.id ? <CheckCircle2 size={24} /> : <div className="w-6 h-6 border-2 border-gray-200 rounded-full" />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{offer.title}</h3>
                  <p className="text-sm text-gray-500">{offer.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98]">
            <ShoppingCart size={20} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductOfferUI;