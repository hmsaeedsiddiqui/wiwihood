"use client";
import React from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const SelectTime = () => {
  const dates = [
    { day: "20", weekday: "Tue" },
    { day: "21", weekday: "Wed" },
    { day: "22", weekday: "Thu" },
    { day: "23", weekday: "Fri" },
    { day: "24", weekday: "Sat" },
    { day: "25", weekday: "Sun" },
    { day: "26", weekday: "Mon" },
  ];

  return (
    <section className="flex py-12">
      <div className="bg-[#FFF5EE] border border-[#F0CBB6] rounded-xl p-8 w-[915px]">
        {/* Header */}
        <h2 className="block text-sm text-gray-500 mb-6">September 2025</h2>

        {/* Date Selector */}
        <div className="flex items-center justify-between mb-8">
          <button className="text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            {dates.map((date) => (
              <button
                key={date.day}
                className="flex flex-col items-center justify-center w-12 h-12 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-[#F7E1D5] transition"
              >
                <span className="font-medium">{date.day}</span>
                <span className="text-xs text-gray-500">{date.weekday}</span
                >
              </button>
            ))}
          </div>

          <button className="text-gray-500 hover:text-gray-700">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Fully Booked Section */}
        <div className="bg-white border border-gray-200 rounded-md p-12 text-center">
          <div className="flex justify-center mb-6">
            <Calendar className="w-10 h-10 text-[#E89B8B]" strokeWidth={1.5} />
          </div>

          <h3 className="text-gray-700 font-medium text-lg mb-2">
            Selected date is fully booked on this date
          </h3>

          <p className="text-gray-500 mb-6">Available from Thu, 18 Sept</p>

          <button
            className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-full hover:bg-gray-100 transition"
          >
            Go to next available date
          </button>

          <p className="text-xs text-gray-400 mt-4">
            You can join the waitlist instead
          </p>
        </div>
      </div>
    </section>
  );
};

export default SelectTime;
