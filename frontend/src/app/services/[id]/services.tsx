import React from "react";

const relatedServices = [
  {
    name: "Lumi Nail Studio",
    image: "/service1.png",
    rating: 4.5,
    reviews: 12,
    location: "Double Tree by Hilton, M-Square AWR Properties, Al Mankhool",
  },
  {
    name: "Lumi Nail Studio",
    image: "/service1.png",
    rating: 4.5,
    reviews: 12,
    location: "Double Tree by Hilton, M-Square AWR Properties, Al Mankhool",
  },
  {
    name: "Lumi Nail Studio",
    image: "/service1.png",
    rating: 4.5,
    reviews: 12,
    location: "Double Tree by Hilton, M-Square AWR Properties, Al Mankhool",
  },
  {
    name: "Lumi Nail Studio",
    image: "/service1.png",
    rating: 4.5,
    reviews: 12,
    location: "Double Tree by Hilton, M-Square AWR Properties, Al Mankhool",
  },
];

function Services() {
  return (
    <div className="bg-white rounded-2xl p-6">
      {/* You May Also Like Section */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        You may also like
      </h2>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {relatedServices.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Category */}
              <p className="text-xs text-gray-500 mb-1">Nails</p>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 mb-2">
                {service.name}
              </h3>

              {/* Location */}
              <div className="flex items-start gap-2 mb-3">
                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_155_2696)">
                    <path
                      d="M23.9426 17.7459L11.9996 24.9119L0.0566406 17.7459L5.72064 14.3479L7.19864 15.7929L3.94364 17.7459L12.0006 22.5799L20.0576 17.7459L16.8016 15.7929L18.2796 14.3479L23.9446 17.7469L23.9426 17.7459ZM7.05764 12.8579C4.32164 10.1209 4.32164 5.67988 7.04964 2.95088C8.37164 1.62888 10.1306 0.900879 11.9996 0.900879C13.8686 0.900879 15.6276 1.62888 16.9486 2.95088C18.2706 4.27288 18.9996 6.03088 18.9996 7.90088C18.9996 9.77088 18.2706 11.5279 16.9486 12.8509L11.9996 17.6919L7.05764 12.8579ZM8.46364 11.4359L11.9996 14.8939L15.5426 11.4279C16.4796 10.4909 16.9996 9.23588 16.9996 7.89988C16.9996 6.56388 16.4786 5.30888 15.5346 4.36388C14.5906 3.41888 13.3356 2.89988 11.9996 2.89988C10.6636 2.89988 9.40764 3.41988 8.46364 4.36388C6.51464 6.31388 6.51464 9.48588 8.46364 11.4349V11.4359ZM11.9996 10.8909C13.6566 10.8909 14.9996 9.54788 14.9996 7.89088C14.9996 6.23388 13.6566 4.89088 11.9996 4.89088C10.3426 4.89088 8.99964 6.23388 8.99964 7.89088C8.99964 9.54788 10.3426 10.8909 11.9996 10.8909Z"
                      fill="#757575"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_155_2696">
                      <rect
                        width="24"
                        height="24"
                        fill="white"
                        transform="translate(0 0.899902)"
                      />
                    </clipPath>
                  </defs>
                </svg>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {service.location}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(service.rating)
                        ? "fill-yellow-400"
                        : "fill-gray-200"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-600 ml-1">
                  ({service.reviews})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2">
        <button className="w-10 h-10 rounded-lg bg-[#E89B8B] text-white font-medium hover:bg-[#D4876F] transition-colors">
          1
        </button>
        <button className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors">
          2
        </button>
        <button className="w-10 h-10 rounded-lg bg-[#E89B8B] text-white flex items-center justify-center hover:bg-[#D4876F] transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Services;
