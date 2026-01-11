import React, { useRef } from "react"; // Added useRef
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  X,
  Package,
  DollarSign,
  Tag,
  Check,
  PlusCircle,
  Layers,
  AlertCircle,
  Upload, // Added missing imports
  FileImage,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createNewProduct, uploadFile } from "../../redux/slices/product.slice";
import { Offer } from "../../redux/slices/offer.slice";

interface ProductFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableOffers: Offer[];
}

interface ProductFormValues {
  name: string;
  image: File | null;
  price: number;
  quantity: number;
  offers: string[];
}

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name is too short")
    .max(50, "Name is too long")
    .required("Product name is required"),
  price: Yup.number()
    .positive("Price must be greater than zero")
    .required("Price is required"),
  quantity: Yup.number()
    .integer("Quantity must be a whole number")
    .min(1, "Minimum 1 unit required")
    .required("Quantity is required"),
  image: Yup.mixed().required("Product image is required"), // Added image validation
  offers: Yup.array().of(Yup.string()),
});

const ProductFormDrawer: React.FC<ProductFormDrawerProps> = ({
  isOpen,
  onClose,
  availableOffers,
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null); // Fixed missing ref

  // const { image, fileStatus } = useSelector((state: any) => state.products);

  const { fileStatus, image } = useSelector((state: any) => state.products);

  console.log({ fileStatus, image });

  const formik = useFormik<ProductFormValues>({
    initialValues: {
      name: "",
      image: null,
      price: 0,
      quantity: 1,
      offers: [],
    },
    validationSchema: ProductSchema,
    onSubmit: (values) => {
      let uploadedImageUrl = "";
      if (values.image instanceof File) {
        // .unwrap() allows us to get the actual result (UploadResponse)
        const result = (dispatch as any)(uploadFile(values.image)).unwrap();
        uploadedImageUrl = result.url;
      }

      if (fileStatus === "created") {
        (dispatch as any)(createNewProduct({ ...values, image: image } as any));
        formik.resetForm();
      }
      onClose();
    },
  });

  console.log({ file: formik.values });

  // Added missing file handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("image", file);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    formik.setFieldValue("image", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleOffer = (offerId: string) => {
    const currentSelectedIds = formik.values.offers;
    const isAlreadySelected = currentSelectedIds.includes(offerId);

    if (isAlreadySelected) {
      const nextIds = currentSelectedIds.filter((id) => id !== offerId);
      formik.setFieldValue("offers", nextIds);
    } else {
      const nextIds = [...currentSelectedIds, offerId];
      formik.setFieldValue("offers", nextIds);
    }
  };

  const ErrorMsg = ({ name }: { name: keyof ProductFormValues }) =>
    formik.touched[name] && formik.errors[name] ? (
      <div className="flex items-center gap-1 text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1">
        <AlertCircle size={12} />
        {formik.errors[name]}
      </div>
    ) : null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
            <p className="text-sm text-gray-500">
              Inventory and Promotional settings
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          encType="multipart/form-data"
          id="product-form"
          onSubmit={formik.handleSubmit}
          className="p-6 space-y-6 overflow-y-auto h-[calc(100vh-140px)] pb-24"
        >
          {/* Product Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Package size={16} className="text-blue-500" /> Product Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="e.g. Wireless Gaming Mouse"
              className={`w-full p-3 bg-gray-50 border rounded-xl outline-none transition-all ${
                formik.touched.name && formik.errors.name
                  ? "border-red-300 ring-1 ring-red-100"
                  : "border-gray-200 focus:ring-2 focus:ring-blue-500"
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            <ErrorMsg name="name" />
          </div>

          {/* File Upload Section - Fixed References */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Package size={16} className="text-blue-500" /> Product Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer
                ${
                  formik.values.image
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 bg-gray-50"
                }
                ${
                  formik.touched.image && formik.errors.image
                    ? "border-red-500 bg-red-50"
                    : ""
                }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                {!formik.values.image ? (
                  <>
                    <div className="p-3 bg-white rounded-full shadow-sm text-blue-500">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm text-gray-600">
                      <span className="font-bold text-blue-600">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG or WEBP (max. 5MB)
                    </p>
                  </>
                ) : (
                  <div className="flex items-center gap-3 w-full animate-in fade-in zoom-in duration-300">
                    <div className="p-2 bg-blue-500 text-white rounded-lg">
                      <FileImage size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formik.values.image.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(formik.values.image.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-2 hover:bg-red-100 text-red-500 rounded-full transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <ErrorMsg name="image" />
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <DollarSign size={16} className="text-emerald-500" /> Price ($)
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                className={`w-full p-3 bg-gray-50 border rounded-xl outline-none ${
                  formik.touched.price && formik.errors.price
                    ? "border-red-300"
                    : "border-gray-200"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
              />
              <ErrorMsg name="price" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Layers size={16} className="text-orange-500" /> Quantity
              </label>
              <input
                name="quantity"
                type="number"
                className={`w-full p-3 bg-gray-50 border rounded-xl outline-none ${
                  formik.touched.quantity && formik.errors.quantity
                    ? "border-red-300"
                    : "border-gray-200"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.quantity}
              />
              <ErrorMsg name="quantity" />
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Offer Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Tag size={16} className="text-purple-500" /> Link Available
              Offers
            </label>

            <div className="flex flex-wrap gap-2 mb-4 min-h-[48px] p-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl">
              {formik.values.offers?.length === 0 && (
                <span className="text-gray-400 text-xs italic mt-1">
                  Click offers below to apply...
                </span>
              )}
              {formik.values.offers.map((id) => {
                const offerDetails = availableOffers.find((o) => o._id === id);
                return (
                  <div
                    key={id}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm animate-in zoom-in-95"
                  >
                    {offerDetails?.name}
                    <X
                      size={12}
                      className="cursor-pointer"
                      onClick={() => toggleOffer(id)}
                    />
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-2 custom-scrollbar">
              {availableOffers?.map((offer) => {
                const isSelected = formik.values.offers.includes(offer._id);
                return (
                  <div
                    key={offer._id}
                    onClick={() => toggleOffer(offer._id)}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50 shadow-sm"
                        : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-bold ${
                          isSelected ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {offer.name}
                      </span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                        {offer.type}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <Check
                          size={14}
                          className="text-white"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </form>

        <div className="absolute bottom-0 left-0 w-full p-6 border-t bg-white flex gap-3 z-20">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all"
          >
            Discard
          </button>
          <button
            form="product-form"
            type="submit"
            disabled={!formik.isValid && formik.submitCount > 0}
            className={`flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all ${
              !formik.isValid && formik.submitCount > 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
          >
            <PlusCircle size={18} /> Save Product
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductFormDrawer;
