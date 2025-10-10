import React from "react";

const Aboutservices = [
  {
    name: "Manicure",
    duration: "45 min",
    price: "HK$25",
    description: "Professional manicure service with nail care",
  },
  {
    name: "Pedicure",
    duration: "60 min",
    price: "HK$35",
    description: "Relaxing pedicure with foot massage",
  },
  {
    name: "Gel Polish",
    duration: "30 min",
    price: "HK$20",
    description: "Long-lasting gel polish application",
  },
];

function AboutServices() {
  return (
    <div className="bg-[#FFF8F1] rounded-2xl p-6 mt-10 w-[915px]">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        About Service
      </h2>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center space-x-4 mb-6">
        <button className="bg-[#E9B787] text-white px-6 py-2 rounded-full text-sm font-medium shadow-sm">
          Hair cut
        </button>
        <button className="text-gray-800 hover:text-[#E9B787] transition-colors">
          wet Shave
        </button>
        <button className="text-gray-800 hover:text-[#E9B787] transition-colors">
          Beared Trimming
        </button>
         <button className="text-gray-800 hover:text-[#E9B787] transition-colors">
          Combination
        </button>
         <button className="text-gray-800 hover:text-[#E9B787] transition-colors">
          Student Cuts
        </button>
      </div>

      {/* Service Items */}
      <div className="space-y-3">
        {Aboutservices.map((service, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#E9B787]/30 shadow-sm"
          >
            <div>
              <h3 className="font-bold text-gray-900">{service.name}</h3>
              <p className="text-sm text-gray-500 mt-2">{service.duration}</p>
              {/* <p className="text-sm text-gray-600">{service.description}</p> */}
              <p className="font-medium text-gray-900 mb-2 mt-4">
                from {service.price}
              </p>
            </div>
            <div className="text-right">
              <button className="bg-[#E9B787] text-white px-4 py-2 rounded-full text-sm hover:bg-[#E89B8B] transition-colors">
                Book
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-start mt-6">
        <button className="flex items-center gap-2 px-6 py-2 bg-[#FFDBB2] text-gray-700 rounded-full hover:bg-[#E9B787] transition-colors">
          See all
          <svg
            width="12"
            height="13"
            viewBox="0 0 12 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_141_3400)">
              <path
                d="M5.5039 1.90495L5.49989 10.6833L3.85731 9.04364C3.76318 8.94688 3.63391 8.89225 3.49891 8.89225C3.05346 8.89603 2.83472 9.43621 3.15223 9.74867L5.65126 12.2507C5.84663 12.4465 6.16389 12.4465 6.35927 12.2507L8.85829 9.74867C9.34772 9.27606 8.61921 8.5516 8.14931 9.04364L6.49989 10.693L6.5039 1.90495C6.50891 1.62309 6.27993 1.39282 5.99804 1.39566C5.72035 1.39755 5.49848 1.6273 5.5039 1.90495Z"
                fill="#2C2C2C"
              />
            </g>
            <defs>
              <clipPath id="clip0_141_3400">
                <rect
                  width="12"
                  height="12"
                  fill="white"
                  transform="translate(0 0.900024)"
                />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default AboutServices;
