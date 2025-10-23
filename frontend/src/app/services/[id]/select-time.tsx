"use client";
import React from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import type { Service } from "@/store/api/servicesApi";

interface SelectTimeProps {
  service: Service;
}

const SelectTime = ({ service }: SelectTimeProps) => {
  const dates = [
    { day: "20", weekday: "Tue" },
    { day: "21", weekday: "Wed" },
    { day: "22", weekday: "Thu" },
    { day: "23", weekday: "Fri" },
    { day: "24", weekday: "Sat" },
    { day: "25", weekday: "Sun" },
    { day: "26", weekday: "Mon" },
  ];

  // Use available slots from service or fallback to default times
  const availableSlots = service?.availableSlots || [
    "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", 
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
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
                {/* Available Time Slots */}
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-[#E89B8B] mr-2" strokeWidth={1.5} />
            <h3 className="text-gray-700 font-medium text-lg">
              Available Time Slots
            </h3>
          </div>

          {availableSlots && availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {availableSlots.map((slot, index) => (
                <button
                  key={index}
                  className="bg-[#FFF5EE] border border-[#E89B8B] text-[#E89B8B] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#E89B8B] hover:text-white transition-colors"
                >
                  {slot}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No available slots for the selected date</p>
              <button className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-full hover:bg-gray-100 transition">
                Check other dates
              </button>
            </div>
          )}

          <p className="text-xs text-gray-400 mt-4 text-center">
            Duration: {service?.durationMinutes} minutes • Booking advance notice: {service?.minAdvanceBookingHours || 2} hours
          </p>
        </div>
      </div>
    </section>
  );
};

export default SelectTime;
