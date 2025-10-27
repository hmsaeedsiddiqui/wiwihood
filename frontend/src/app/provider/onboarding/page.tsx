"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Store, CheckCircle, ArrowRight, ArrowLeft, MapPin } from "lucide-react";
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
  country: string;
  postalCode: string;
}

const BusinessOnboarding = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExistingUser, setIsExistingUser] = useState(false);

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
    country: "UAE",
    postalCode: ""
  });

  // Check if user is already logged in and pre-populate form
  useEffect(() => {
    const token = localStorage.getItem("providerToken");
    const providerData = localStorage.getItem("provider");
    
    if (token && providerData) {
      try {
        const user = JSON.parse(providerData);
        setIsExistingUser(true);
        setFormData(prev => ({
          ...prev,
          email: user.email || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: user.phone || ""
        }));
        // Skip to business details step since user is already registered
        setCurrentStep(2);
      } catch (e) {
        console.error("Failed to parse provider data:", e);
      }
    }

    // Check if onboarding is already complete
    checkOnboardingComplete();
  }, []);

  const checkOnboardingComplete = async () => {
    try {
      const token = localStorage.getItem("providerToken");
      if (!token) return;

      // Check if provider profile exists and is complete
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/providers/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      if (response.data) {
        const provider = response.data;
        const requiredFields = ['businessName', 'address', 'city', 'country'];
        const missingFields = requiredFields.filter(field => !provider[field]);

        if (missingFields.length === 0) {
          // Onboarding is complete, redirect to dashboard
          console.log('Onboarding already complete, redirecting to dashboard');
          router.push('/provider/dashboard');
        }
      }
    } catch (error) {
      // If error checking, continue with onboarding
      console.log('Could not verify onboarding status, continuing with onboarding');
    }
  };

  const steps = [
    { number: 1, title: "Basic Information", icon: Store },
    { number: 2, title: "Business Details", icon: MapPin },
    { number: 3, title: "Review & Complete", icon: CheckCircle }
  ];

  const handleInputChange = (field: string, value: any) => {
    // Validate country field length (max 100 characters as per backend)
    if (field === 'country' && typeof value === 'string' && value.length > 100) {
      return; // Don't update if too long
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const submitOnboarding = async () => {
    setLoading(true);
    setError("");

    try {
      // Check if user is already authenticated
      const existingToken = localStorage.getItem("providerToken");
      let token: string | null = existingToken;

      // If no existing token, try to register new user
      if (!token) {
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

        if (userResponse.data?.accessToken) {
          const accessToken = userResponse.data.accessToken as string;
          token = accessToken;
          localStorage.setItem("providerToken", accessToken);
        } else {
          throw new Error("Registration failed - no token received");
        }
      }

      // If we have a token, continue with business profile creation
      if (!token) {
        throw new Error("No authentication token available");
      }

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
          country: formData.country,
          postalCode: formData.postalCode,
          phone: formData.phone
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      // Get the provider ID from the business response
      const providerId = businessResponse.data.id;
      console.log('Created provider with ID:', providerId);

      // Success - redirect to dashboard
      // Services and availability can be set up from the dashboard
      router.push('/provider/dashboard');
      
    } catch (err: any) {
      console.error('Onboarding error:', err);
      
      let errorMessage = "Setup failed. Please try again.";
      
      // Handle specific error cases
      if (err.response?.status === 409) {
        // User already exists
        errorMessage = "An account with this email already exists. Please log in first, then complete your business setup.";
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/auth/provider/login');
        }, 3000);
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        {isExistingUser ? (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">
                Welcome back! We found your account. Let's complete your business profile setup.
              </p>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm your information</h3>
          </>
        ) : (
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Let's start with your basic information</h3>
        )}
        
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
              disabled={isExistingUser}
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
              disabled={isExistingUser}
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
              disabled={isExistingUser}
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
              disabled={isExistingUser}
            />
          </div>
        </div>
        {!isExistingUser && (
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
        )}
        {isExistingUser && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              Since you're already registered, you can skip to setting up your business details.
            </p>
          </div>
        )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dubai"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State/Region</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dubai Emirate"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="UAE">United Arab Emirates</option>
                <option value="Saudi Arabia">Saudi Arabia</option>
                <option value="Qatar">Qatar</option>
                <option value="Kuwait">Kuwait</option>
                <option value="Bahrain">Bahrain</option>
                <option value="Oman">Oman</option>
                <option value="Egypt">Egypt</option>
                <option value="Jordan">Jordan</option>
                <option value="Lebanon">Lebanon</option>
                <option value="Pakistan">Pakistan</option>
                <option value="India">India</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="12345"
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Review your information</h3>
        <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Business Information</h4>
            <p><strong>Name:</strong> {formData.businessName}</p>
            <p><strong>Type:</strong> {formData.businessType}</p>
            <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state ? formData.state + ', ' : ''}{formData.country} {formData.postalCode}</p>
            <p><strong>Contact:</strong> {formData.email} | {formData.phone}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Next Steps</h4>
            <p className="text-blue-800 text-sm">
              After completing setup, you can add your services and set your availability from your dashboard.
            </p>
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
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-3 mr-3">
              <span className="text-2xl font-bold text-white">W</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-br from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Wiwihood
            </span>
          </div>
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

          {currentStep === 3 ? (
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