
import React from "react";
import { useGetServicesQuery } from "@/store/api/servicesApi";

function Services() {
  // Only show approved and active services
  const { data: services = [], isLoading, error } = useGetServicesQuery({ isActive: true, status: "active" });

  // Optionally filter for isApproved if backend supports it
  const filteredServices = Array.isArray(services)
  ? services.filter(s => s.isActive)
    : [];

  return (
    <div className="bg-white rounded-2xl p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        You may also like
      </h2>
      {isLoading && <div>Loading services...</div>}
      {error && <div className="text-red-500">Failed to load services.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {filteredServices.map((service, index) => (
          <div
            key={service.id || index}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={service.featuredImage || "/service1.png"}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{service.category?.name || "Category"}</p>
              <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
              <div className="flex items-start gap-2 mb-3">
                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_155_2696)">
                    <path d="M23.9426 17.7459L11.9996 24.9119L0.0566406 17.7459L5.72064 14.3479L7.19864 15.7929L3.94364 17.7459L12.0006 22.5799L20.0576 17.7459L16.8016 15.7929L18.2796 14.3479L23.9446 17.7469L23.9426 17.7459ZM7.05764 12.8579C4.32164 10.1209 4.32164 5.67988 7.04964 2.95088C8.37164 1.62888 10.1306 0.900879 11.9996 0.900879C13.8686 0.900879 15.6276 1.62888 16.9486 2.95088C18.2706 4.27288 18.9996 6.03088 18.9996 7.90088C18.9996 9.77088 18.2706 11.5279 16.9486 12.8509L11.9996 17.6919L7.05764 12.8579ZM8.46364 11.4359L11.9996 14.8939L15.5426 11.4279C16.4796 10.4909 16.9996 9.23588 16.9996 7.89988C16.9996 6.56388 16.4786 5.30888 15.5346 4.36388C14.5906 3.41888 13.3356 2.89988 11.9996 2.89988C10.6636 2.89988 9.40764 3.41988 8.46364 4.36388C6.51464 6.31388 6.51464 9.48588 8.46364 11.4349V11.4359ZM11.9996 10.8909C13.6566 10.8909 14.9996 9.54788 14.9996 7.89088C14.9996 6.23388 13.6566 4.89088 11.9996 4.89088C10.3426 4.89088 8.99964 6.23388 8.99964 7.89088C8.99964 9.54788 10.3426 10.8909 11.9996 10.8909Z" fill="#757575" />
                  </g>
                  <defs>
                    <clipPath id="clip0_155_2696">
                      <rect width="24" height="24" fill="white" transform="translate(0 0.899902)" />
                    </clipPath>
                  </defs>
                </svg>
                <p className="text-xs text-gray-600 leading-relaxed">{service.provider?.businessName || "Location"}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(service.averageRating || 0) ? "fill-yellow-400" : "fill-gray-200"}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-600 ml-1">({service.totalReviews || 0})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination can be added here if needed */}
    </div>
  );
}

export default Services;
