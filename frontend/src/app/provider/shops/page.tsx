"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ImageUpload } from "@/components/cloudinary/ImageUpload";
import { CloudinaryImage } from "@/components/cloudinary/CloudinaryImage";

// Define the Shop interface
interface Shop {
  id: string;
  businessName: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  website?: string;
  logo?: string;
  coverImage?: string;
  status: string;
  createdAt: string;
}

// Define the shape of the form data state
interface FormData {
  businessName: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  website: string;
  providerType: "individual" | "business"; // Assuming this is an enum on the backend
  logo: string;
  coverImage: string;
}

const initialFormData: FormData = {
  businessName: "",
  description: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  phone: "",
  website: "",
  providerType: "individual",
  logo: "",
  coverImage: "",
};

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const token = localStorage.getItem("providerToken");
      if (!token) {
        throw new Error("Provider token not found");
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/providers/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Treat the provider profile as a single "shop"
      if (response.data) {
        setShops([response.data]);
      }
    } catch (error) {
      console.error("Error fetching shops:", error);
      // Only show a general error if no shops were loaded initially
      if (shops.length === 0) {
        setError("Failed to load shop profile. Please try logging in again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (imageType: "logo" | "coverImage") => (publicId: string) => {
    setFormData((prev) => ({ ...prev, [imageType]: publicId }));
  };

  const handleImageRemove = (imageType: "logo" | "coverImage") => () => {
    setFormData((prev) => ({ ...prev, [imageType]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("providerToken");
      if (!token) {
        setError("Authentication token missing.");
        return;
      }

      // Clean the data before sending (empty website string becomes undefined)
      const submitData = {
        ...formData,
        website: formData.website.trim() === "" ? undefined : formData.website,
        // The API might expect phone, description, etc., to be nullable/optional.
        // It's a good practice to clean up empty strings for optional fields.
        description: formData.description.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        state: formData.state.trim() || undefined,
        logo: formData.logo.trim() || undefined,
        coverImage: formData.coverImage.trim() || undefined,
      };

      if (editingShop) {
        // Update existing shop
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/providers/me`,
          submitData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      } else {
        // Create new shop/provider profile
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/providers`,
          submitData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
      }

      // Reset form and refresh list
      setFormData(initialFormData);
      setShowCreateForm(false);
      setEditingShop(null);
      await fetchShops();
    } catch (error: any) {
      console.error("Error saving shop:", error);
      setError(error.response?.data?.message || "Failed to save shop. Check required fields.");
    }
  };

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop);
    setFormData({
      businessName: shop.businessName,
      description: shop.description || "",
      address: shop.address,
      city: shop.city || "",
      state: shop.state || "",
      country: shop.country || "",
      postalCode: shop.postalCode || "",
      phone: shop.phone || "",
      website: shop.website || "",
      providerType: "individual", // Assuming this is fixed or managed elsewhere
      logo: shop.logo || "",
      coverImage: shop.coverImage || "",
    });
    setShowCreateForm(true);
    setError(""); // Clear previous errors
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingShop(null);
    setFormData(initialFormData);
    setError("");
  };

  // --- JSX Rendering ---

  if (loading) {
    return (
      <div className="p-5 text-center">
        <div className="text-base text-gray-500">Loading shop profile...</div>
      </div>
    );
  }

  const ShopForm = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-xl font-semibold mb-5">
        {editingShop ? "Edit Shop Profile" : "Create Shop Profile"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Business Name */}
          <div>
            <label htmlFor="businessName" className="block text-sm font-semibold mb-1">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              required
              value={formData.businessName}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter business name"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Enter phone number"
            />
          </div>

          {/* Website */}
          <div className="md:col-span-2">
            <label htmlFor="website" className="block text-sm font-semibold mb-1">
              Website
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
        
        {/* Address */}
        <div className="mt-4">
          <label htmlFor="address" className="block text-sm font-semibold mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
            placeholder="Enter full address"
          />
        </div>

        {/* City, State, Country, Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          <div>
            <label htmlFor="city" className="block text-sm font-semibold mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
              placeholder="City"
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-semibold mb-1">
              State / Province
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
              placeholder="State"
            />
          </div>
          
          <div>
            <label htmlFor="country" className="block text-sm font-semibold mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="country"
              name="country"
              required
              value={formData.country}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Country"
            />
          </div>
          
          <div>
            <label htmlFor="postalCode" className="block text-sm font-semibold mb-1">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              required
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-green-500 focus:border-green-500"
              placeholder="Postal Code"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <label htmlFor="description" className="block text-sm font-semibold mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-y focus:ring-green-500 focus:border-green-500"
            placeholder="Describe your business in a few sentences..."
          />
        </div>

        {/* Image Uploads */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo Image */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Business Logo
            </label>
            <div className="mb-3">
              <ImageUpload
                uploadType="shop"
                onImageUploaded={handleImageUpload("logo")}
                maxFiles={1}
              />
            </div>
            
            {/* Display current logo */}
            {formData.logo && (
              <div className="relative w-32 h-32 mt-3">
                <CloudinaryImage
                  src={formData.logo}
                  alt="Business logo"
                  width={128}
                  height={128}
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={handleImageRemove("logo")}
                  className="absolute top-1 right-1 bg-red-500/90 text-white border-none rounded-full w-6 h-6 text-xs font-bold cursor-pointer flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Remove logo"
                >
                  &times;
                </button>
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Cover Image
            </label>
            <div className="mb-3">
              <ImageUpload
                uploadType="shop"
                onImageUploaded={handleImageUpload("coverImage")}
                maxFiles={1}
              />
            </div>
            
            {/* Display current cover image */}
            {formData.coverImage && (
              <div className="relative w-full max-w-sm mt-3">
                <CloudinaryImage
                  src={formData.coverImage}
                  alt="Cover image"
                  width={400} // Increased width for cover image appearance
                  height={180}
                  className="rounded-lg object-cover w-full"
                />
                <button
                  type="button"
                  onClick={handleImageRemove("coverImage")}
                  className="absolute top-1 right-1 bg-red-500/90 text-white border-none rounded-full w-6 h-6 text-xs font-bold cursor-pointer flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Remove cover image"
                >
                  &times;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white border-none rounded-lg py-3 px-6 text-sm font-semibold cursor-pointer transition-colors"
          >
            {editingShop ? "Update Profile" : "Create Profile"}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            className="bg-transparent text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-lg py-3 px-6 text-sm font-semibold cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const ShopCard = ({ shop }: { shop: Shop }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{shop.businessName}</h3>
          
          {shop.description && (
            <p className="text-gray-600 mb-4 leading-relaxed">
              {shop.description}
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
            <div>
              <strong className="text-gray-700 block">Address:</strong>
              <p className="text-gray-600 mt-1">
                {shop.address}
                {shop.city && `, ${shop.city}`}
                {shop.state && `, ${shop.state}`}
                {shop.postalCode && ` ${shop.postalCode}`}
                {shop.country && `, ${shop.country}`}
              </p>
            </div>
            
            {shop.phone && (
              <div>
                <strong className="text-gray-700 block">Phone:</strong>
                <p className="text-gray-600 mt-1">
                  {shop.phone}
                </p>
              </div>
            )}
            
            {shop.website && (
              <div>
                <strong className="text-gray-700 block">Website:</strong>
                <p className="text-gray-600 mt-1">
                  <a href={shop.website} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-600 break-all transition-colors">
                    {shop.website}
                  </a>
                </p>
              </div>
            )}
          </div>
          
          {/* Shop Images */}
          {(shop.logo || shop.coverImage) && (
            <div className="mt-4">
              <strong className="text-sm text-gray-700 block mb-2">
                Images:
              </strong>
              <div className="flex gap-4 flex-wrap items-end">
                {shop.logo && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Logo:</p>
                    <CloudinaryImage
                      src={shop.logo}
                      alt="Business logo"
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
                {shop.coverImage && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Cover:</p>
                    <CloudinaryImage
                      src={shop.coverImage}
                      alt="Cover image"
                      width={120}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <span
              className={`inline-block py-1 px-3 rounded-full text-xs font-semibold uppercase ${
                shop.status === "verified"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {shop.status || "Pending"}
            </span>
          </div>
        </div>
        
        <button
          onClick={() => handleEdit(shop)}
          className="ml-4 flex-shrink-0 bg-transparent text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-lg py-2 px-4 text-sm font-medium cursor-pointer transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Shop Management 🏪
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your business profile and shop information.
          </p>
        </div>

        {shops.length === 0 && !showCreateForm && (
          <button
            onClick={() => {
              setShowCreateForm(true);
              setEditingShop(null); // Ensure we're in create mode
              setFormData(initialFormData); // Clear any old form data
              setError(""); // Clear error
            }}
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-3 px-6 text-sm font-semibold cursor-pointer flex items-center gap-2 transition-colors"
          >
            <span className="text-base font-normal">+</span>
            Create Shop Profile
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg mb-5 text-sm">
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && <ShopForm />}

      {/* Shops List */}
      {shops.length > 0 ? (
        <div className="grid gap-6">
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      ) : (
        !showCreateForm && (
          <div className="text-center p-16 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              No Shop Profile Found
            </h3>
            <p className="text-gray-500 mb-6">
              Create your business profile to start offering services.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-3 px-6 text-sm font-semibold cursor-pointer transition-colors"
            >
              Create Shop Profile
            </button>
          </div>
        )
      )}
    </div>
  );
}