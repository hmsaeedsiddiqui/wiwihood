"use client";
import React, { useState } from "react";
import ProviderNav from "@/components/ProviderNav";

// Mock data for calendar events
const calendarEvents = [
  {
    id: 1,
    title: "Deep Tissue Massage",
    customer: "Emma Wilson",
    start: "2025-08-29T14:00:00",
    end: "2025-08-29T15:00:00",
    status: "confirmed",
    price: 120
  },
  {
    id: 2,
    title: "Facial Treatment",
    customer: "Michael Brown",
    start: "2025-08-29T16:30:00",
    end: "2025-08-29T18:00:00",
    status: "pending",
    price: 150
  },
  {
    id: 3,
    title: "Swedish Massage",
    customer: "Lisa Chen",
    start: "2025-08-30T10:00:00",
    end: "2025-08-30T11:00:00",
    status: "confirmed",
    price: 100
  },
  {
    id: 4,
    title: "Hot Stone Massage",
    customer: "Anna Taylor",
    start: "2025-08-31T11:00:00",
    end: "2025-08-31T12:30:00",
    status: "confirmed",
    price: 180
  }
];

// Mock working hours
const workingHours = {
  monday: { isWorking: true, start: "09:00", end: "18:00" },
  tuesday: { isWorking: true, start: "09:00", end: "18:00" },
  wednesday: { isWorking: true, start: "09:00", end: "18:00" },
  thursday: { isWorking: true, start: "09:00", end: "18:00" },
  friday: { isWorking: true, start: "09:00", end: "18:00" },
  saturday: { isWorking: true, start: "10:00", end: "16:00" },
  sunday: { isWorking: false, start: "", end: "" }
};

export default function ProviderCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("week");
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showTimeOffModal, setShowTimeOffModal] = useState(false);

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ProviderNav />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar & Availability</h1>
            <p className="text-gray-600">Manage your schedule and working hours</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowAvailabilityModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              ⚙️ Set Availability
            </button>
            <button
              onClick={() => setShowTimeOffModal(true)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              🚫 Request Time Off
            </button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex gap-2">
              {["month", "week", "day"].map((view) => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium capitalize transition ${
                    selectedView === view
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day Headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-3 text-center font-medium text-gray-500 border-b">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {calendarDays.map((date, index) => {
              const events = getEventsForDate(date);
              const dayOfWeek = date.getDay();
              const workingDay = Object.values(workingHours)[dayOfWeek];

              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border border-gray-200 ${
                    isCurrentMonth(date) ? "bg-white" : "bg-gray-50"
                  } ${isToday(date) ? "ring-2 ring-blue-500" : ""}`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday(date) ? "text-blue-600" : isCurrentMonth(date) ? "text-gray-900" : "text-gray-400"
                  }`}>
                    {date.getDate()}
                  </div>

                  {/* Working Hours Indicator */}
                  {workingDay?.isWorking && isCurrentMonth(date) && (
                    <div className="text-xs text-green-600 mb-1">
                      {workingDay.start} - {workingDay.end}
                    </div>
                  )}

                  {/* Events */}
                  <div className="space-y-1">
                    {events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded border ${getStatusColor(event.status)}`}
                      >
                        <div className="font-medium">{formatTime(event.start)}</div>
                        <div className="truncate">{event.title}</div>
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{events.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
          
          {calendarEvents
            .filter(event => {
              const today = new Date();
              const eventDate = new Date(event.start);
              return eventDate.toDateString() === today.toDateString();
            })
            .length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h4 className="text-lg font-medium text-gray-900 mb-1">No appointments today</h4>
              <p className="text-gray-500">Enjoy your free day or set your availability for bookings.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {calendarEvents
                .filter(event => {
                  const today = new Date();
                  const eventDate = new Date(event.start);
                  return eventDate.toDateString() === today.toDateString();
                })
                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">
                          {formatTime(event.start)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.round((new Date(event.end).getTime() - new Date(event.start).getTime()) / 60000)} min
                        </div>
                      </div>
                      <div className="border-l pl-4">
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <p className="text-gray-600">{event.customer}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">${event.price}</div>
                      <div className="flex gap-2 mt-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm">
                          View Details
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 text-sm">
                          Reschedule
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Set Availability Modal */}
      {showAvailabilityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Set Working Hours</h2>
                <button
                  onClick={() => setShowAvailabilityModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {Object.entries(workingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24">
                      <label className="text-sm font-medium text-gray-700 capitalize">{day}</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={hours.isWorking}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-600">Working</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        defaultValue={hours.start}
                        disabled={!hours.isWorking}
                        className="border border-gray-300 rounded px-3 py-1 text-sm disabled:bg-gray-100"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        defaultValue={hours.end}
                        disabled={!hours.isWorking}
                        className="border border-gray-300 rounded px-3 py-1 text-sm disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowAvailabilityModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Save Working Hours
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Off Modal */}
      {showTimeOffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Request Time Off</h2>
                <button
                  onClick={() => setShowTimeOffModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>
                  <textarea
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Vacation, sick leave, personal reasons..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTimeOffModal(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Request Time Off
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
