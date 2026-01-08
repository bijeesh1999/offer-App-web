import React from 'react';
import { useFormik } from 'formik';
import { X, Tag, Percent, ShoppingBag, Calendar, Check } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createNewOffer } from "../../redux/slices/offer.slice";

interface OfferFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const OfferFormDrawer: React.FC<OfferFormDrawerProps> = ({ isOpen, onClose }) => {
  const today = new Date().toISOString().split('T')[0];
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      priority: 3,
      config: {} as any, // This will hold dynamic keys
      startDate: today,
      endDate: "",
    },
    onSubmit: (values) => {
      (dispatch as any)(createNewOffer(values));
      onClose();
    },
  });

  // Helper to handle type change and reset config
  const handleTypeChange = (typeId: string) => {
    formik.setFieldValue('type', typeId);
    
    // Reset config based on selected type
    if (typeId === 'flat') {
      formik.setFieldValue('config', { discountAmount: "" });
    } else if (typeId === 'bogo') {
      formik.setFieldValue('config', { buyQuantity: "", getQuantity: "" });
    } else if (typeId === 'percent') {
      formik.setFieldValue('config', { percentage: "" });
    }
  };
  const offerOptions = [
    { id: 'QUANTITY', label: 'Flat Discount', icon: <Tag size={16}/> },
    { id: 'BUY_X_GET_Y', label: 'Buy X Get Y', icon: <ShoppingBag size={16}/> },
    { id: 'PERCENTAGE', label: 'Percentage Off', icon: <Percent size={16}/> }
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      )}

      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create New Offer</h2>
            <p className="text-sm text-gray-500">Set your campaign details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form id="offer-form" onSubmit={formik.handleSubmit} className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-200px)]">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Offer Name</label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Weekend Special"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={14} /> Start Date
              </label>
              <input
                name="startDate"
                type="date"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={formik.handleChange}
                value={formik.values.startDate}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar size={14} /> End Date
              </label>
              <input
                name="endDate"
                type="date"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={formik.handleChange}
                value={formik.values.endDate}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Offer Type</label>
            <div className="space-y-2">
              {offerOptions.map((opt) => (
                <div 
                  key={opt.id}
                  onClick={() => handleTypeChange(opt.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formik.values.type === opt.id ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${formik.values.type === opt.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {opt.icon}
                    </div>
                    <span className={`font-semibold ${formik.values.type === opt.id ? 'text-blue-700' : 'text-gray-700'}`}>{opt.label}</span>
                  </div>
                  {formik.values.type === opt.id && <Check className="text-blue-600" size={20} />}
                </div>
              ))}
            </div>
          </div>

          <div className="animate-in slide-in-from-top-2 duration-300">
            {formik.values.type === 'QUANTITY' && (
              <div className="p-5 bg-blue-600 rounded-2xl text-white shadow-lg">
                <label className="block text-xs font-bold uppercase mb-2 opacity-80">Flat Discount Amount ($)</label>
                <input
                  name="config.discountAmount"
                  type="number"
                  placeholder="Enter amount"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 outline-none"
                  onChange={formik.handleChange}
                  value={formik.values.config.discountAmount || ""}
                />
              </div>
            )}

            {formik.values.type === 'BUY_X_GET_Y' && (
              <div className="p-5 bg-emerald-600 rounded-2xl text-white shadow-lg">
                <label className="block text-xs font-bold uppercase mb-2 opacity-80">BOGO Configuration</label>
                <div className="flex items-center gap-3">
                  <input
                    name="config.buyQuantity"
                    type="number"
                    placeholder="Buy X"
                    className="w-1/2 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 outline-none"
                    onChange={formik.handleChange}
                    value={formik.values.config.buyQuantity || ""}
                  />
                  <span className="font-bold">→</span>
                  <input
                    name="config.getQuantity"
                    type="number"
                    placeholder="Get Y"
                    className="w-1/2 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 outline-none"
                    onChange={formik.handleChange}
                    value={formik.values.config.getQuantity || ""}
                  />
                </div>
              </div>
            )}

            {formik.values.type === 'PERCENTAGE' && (
              <div className="p-5 bg-orange-500 rounded-2xl text-white shadow-lg">
                <label className="block text-xs font-bold uppercase mb-2 opacity-80">Percentage Rate (%)</label>
                <input
                  name="config.percentage"
                  type="number"
                  placeholder="e.g. 25"
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:bg-white/20 outline-none"
                  onChange={formik.handleChange}
                  value={formik.values.config.percentage || ""}
                />
              </div>
            )}
          </div>
        </form>

        <div className="absolute bottom-0 left-0 w-full p-6 border-t bg-white flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600">Cancel</button>
          <button form="offer-form" type="submit" disabled={!formik.values.type} className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black shadow-xl disabled:opacity-50">
            Create Offer
          </button>
        </div>
      </div>
    </>
  );
};

export default OfferFormDrawer;