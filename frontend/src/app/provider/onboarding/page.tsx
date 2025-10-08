"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, DollarSign, MapPin, Store, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import axios from "axios";

interface BusinessOnboardingData {
  // Basic Info
  businessName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  
  // Business Details
  businessType: string;
  description: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  
  // Services
  services: Array<{
    name: string;
    description: string;
    price: number;
    duration: number;
    category: string;
  }>;
  
  // Availability
  workingHours: {
    [key: string]: {
      start: string;
      end: string;
      isOpen: boolean;
    };
  };
}

const BusinessOnboarding = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<BusinessOnboardingData>({
    businessName: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    businessType: "individual",
    description: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    services: [
      { name: "", description: "", price: 0, duration: 60, category: "hair-services" }
    ],
    workingHours: {
      monday: { start: "09:00", end: "17:00", isOpen: true },
      tuesday: { start: "09:00", end: "17:00", isOpen: true },
      wednesday: { start: "09:00", end: "17:00", isOpen: true },
      thursday: { start: "09:00", end: "17:00", isOpen: true },
      friday: { start: "09:00", end: "17:00", isOpen: true },
      saturday: { start: "09:00", end: "15:00", isOpen: true },
      sunday: { start: "10:00", end: "14:00", isOpen: false }
    }
  });

  const steps = [
    { number: 1, title: "Basic Information", icon: Store },
    { number: 2, title: "Business Details", icon: MapPin },
    { number: 3, title: "Services Catalog", icon: DollarSign },
    { number: 4, title: "Availability Calendar", icon: Calendar },
    { number: 5, title: "Review & Complete", icon: CheckCircle }
  ];

  const categories = [
    { id: "hair-services", name: "Hair Services" },
    { id: "beauty-services", name: "Beauty Services" },
    { id: "wellness", name: "Wellness & Spa" },
    { id: "fitness", name: "Fitness & Training" },
    { id: "home-services", name: "Home Services" }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: "", description: "", price: 0, duration: 60, category: "hair-services" }]
    }));
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleWorkingHoursChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: { ...prev.workingHours[day], [field]: value }
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const submitOnboarding = async () => {
    setLoading(true);
    setError("");

    try {
      // Step 1: Register user account
      const userResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/register`,
        {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          userRole: 'provider'
        },
        { withCredentials: true }
      );

      if (userResponse.data && userResponse.data.accessToken) {
        const token = userResponse.data.accessToken;
        localStorage.setItem("providerToken", token);

        // Step 2: Create business profile
        const businessResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/providers`,
          {
            businessName: formData.businessName,
            providerType: formData.businessType,
            description: formData.description,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            phone: formData.phone
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
          }
        );

        // Step 3: Create services
        for (const service of formData.services) {
          if (service.name && service.price > 0) {
            await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/services`,
              {
                name: service.name,
                description: service.description,
                basePrice: service.price,
                durationMinutes: service.duration,
                categoryId: service.category,
                serviceType: "appointment",
                pricingType: "fixed",
                isActive: true
              },
              {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
              }
            );
          }
        }

        // Success - redirect to dashboard
        router.push('/provider/dashboard');
      }
    } catch (err: any) {
      console.error('Onboarding error:', err);
      setError(err.response?.data?.message || "Setup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Let's start with your basic information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Smith"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter a secure password"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tell us about your business</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Your Business Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
            <select
              value={formData.businessType}
              onChange={(e) => handleInputChange('businessType', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="individual">Individual Provider</option>
              <option value="business">Business/Company</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Describe your business and services..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Business Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="123 Main Street"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="New York"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="NY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10001"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Add your services and pricing</h3>
        <div className="space-y-4">
          {formData.services.map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">Service #{index + 1}</h4>
                {formData.services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Hair Cut & Style"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={service.category}
                    onChange={(e) => handleServiceChange(index, 'category', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Description</label>
                <textarea
                  value={service.description}
                  onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Describe your service..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (AED) *</label>
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, 'price', parseFloat(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="50"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
                  <input
                    type="number"
                    value={service.duration}
                    onChange={(e) => handleServiceChange(index, 'duration', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="60"
                    min="15"
                    step="15"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addService}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            + Add Another Service
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Set your availability</h3>
        <div className="space-y-4">
          {Object.entries(formData.workingHours).map(([day, hours]) => (
            <div key={day} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-24">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hours.isOpen}
                    onChange={(e) => handleWorkingHoursChange(day, 'isOpen', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="font-medium capitalize">{day}</span>
                </label>
              </div>
              {hours.isOpen ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={hours.start}
                    onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={hours.end}
                    onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>
              ) : (
                <span className="text-gray-500">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Review your information</h3>
        <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Business Information</h4>
            <p><strong>Name:</strong> {formData.businessName}</p>
            <p><strong>Type:</strong> {formData.businessType}</p>
            <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.postalCode}</p>
            <p><strong>Contact:</strong> {formData.email} | {formData.phone}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Services ({formData.services.filter(s => s.name).length})</h4>
            {formData.services.filter(s => s.name).map((service, index) => (
              <div key={index} className="mb-2">
                <p><strong>{service.name}</strong> - AED {service.price} ({service.duration} min)</p>
              </div>
            ))}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Working Hours</h4>
            {Object.entries(formData.workingHours).map(([day, hours]) => (
              <p key={day} className="capitalize">
                <strong>{day}:</strong> {hours.isOpen ? `${hours.start} - ${hours.end}` : 'Closed'}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Wiwihood as a Service Provider</h1>
          <p className="text-gray-600">Set up your business profile in just a few steps</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">{steps[currentStep - 1].title}</h2>
            <div className="text-sm text-gray-500 mt-1">Step {currentStep} of {steps.length}</div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentStep === 5 ? (
            <button
              onClick={submitOnboarding}
              disabled={loading}
              className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Setting up..." : "Complete Setup"}
              <CheckCircle className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessOnboarding;