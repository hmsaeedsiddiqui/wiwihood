'use client';'use client';'use client';'use client';



import React, { useState, useEffect } from 'react';

import ProviderNav from '@/components/ProviderNav';

import React, { useState, useEffect } from 'react';

interface Booking {

  id: string;import ProviderNav from '@/components/ProviderNav';

  customer: {

    name: string;import React, { useState, useEffect } from 'react';import React, { useState, useEffect } from 'react';

    email: string;

  };interface CalendarBooking {

  service: {

    name: string;  id: string;import ProviderNav from '@/components/ProviderNav';import ProviderNav from '@/components/ProviderNav';

    duration: number;

    price: number;  customer: {

  };

  scheduledAt: string;    name: string;

  status: string;

}    email: string;



export default function ProviderCalendarPage() {  };interface CalendarBooking {interface CalendarBooking {

  const [currentDate, setCurrentDate] = useState(new Date());

  const [bookings, setBookings] = useState<Booking[]>([]);  service: {

  const [loading, setLoading] = useState(true);

    name: string;  id: string;  id: string;

  useEffect(() => {

    fetchBookings();    duration: number;

  }, [currentDate]);

    price: number;  customer: {  customer: {

  const fetchBookings = async () => {

    try {  };

      setLoading(true);

      const token = localStorage.getItem('auth-token') || localStorage.getItem('accessToken');  scheduledAt: string;    name: string;    name: string;

      

      if (!token) {  status: string;

        setLoading(false);

        return;}    email: string;    email: string;

      }



      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);interface TimeSlot {  };  };

      

      const response = await fetch(  time: string;

        `http://localhost:8000/api/v1/bookings/my-bookings?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,

        {  isAvailable: boolean;  service: {  service: {

          method: 'GET',

          headers: {  booking?: CalendarBooking;

            'Content-Type': 'application/json',

            'Authorization': `Bearer ${token}`,}    name: string;    name: string;

          },

        }

      );

interface CalendarDay {    duration: number;    duration: number;

      if (response.ok) {

        const data = await response.json();  date: Date;

        setBookings(data);

      }  isCurrentMonth: boolean;    price: number;    price: number;

    } catch (error) {

      console.error('Failed to fetch bookings:', error);  isToday: boolean;

    } finally {

      setLoading(false);  isWorkingDay: boolean;  };  };

    }

  };  timeSlots: TimeSlot[];



  const navigateMonth = (direction: 'prev' | 'next') => {  bookingsCount: number;  scheduledAt: string;  scheduledAt: string;

    setCurrentDate(date => {

      const newDate = new Date(date);}

      newDate.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));

      return newDate;  status: string;  status: string;

    });

  };export default function ProviderCalendarPage() {



  const generateCalendarDays = () => {  const [currentDate, setCurrentDate] = useState(new Date());}}

    const year = currentDate.getFullYear();

    const month = currentDate.getMonth();  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

    const firstDay = new Date(year, month, 1);

    const startDate = new Date(firstDay);  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

    startDate.setDate(startDate.getDate() - firstDay.getDay());

      const [bookings, setBookings] = useState<CalendarBooking[]>([]);

    const days = [];

    for (let i = 0; i < 42; i++) {  const [loading, setLoading] = useState(true);interface TimeSlot {interface TimeSlot {

      const date = new Date(startDate);

      date.setDate(startDate.getDate() + i);  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

      days.push(date);

    }  const [showTimeSlots, setShowTimeSlots] = useState(false);  time: string;  time: string;

    return days;

  };



  const getBookingsForDate = (date: Date) => {  useEffect(() => {  isAvailable: boolean;  isAvailable: boolean;

    return bookings.filter(booking => 

      new Date(booking.scheduledAt).toDateString() === date.toDateString()    generateCalendarDays();

    );

  };    fetchBookings();  booking?: CalendarBooking;  booking?: CalendarBooking;



  const getStatusColor = (status: string) => {  }, [currentDate]);

    switch (status) {

      case 'confirmed': return 'bg-green-500';}}

      case 'pending': return 'bg-yellow-500';

      case 'completed': return 'bg-blue-500';  const generateCalendarDays = () => {

      case 'cancelled': return 'bg-red-500';

      default: return 'bg-gray-500';    const year = currentDate.getFullYear();

    }

  };    const month = currentDate.getMonth();



  const calendarDays = generateCalendarDays();    interface CalendarDay {interface CalendarDay {



  return (    // Get first day of month and calculate start of calendar

    <div className="min-h-screen bg-gray-50">

      <ProviderNav />    const firstDay = new Date(year, month, 1);  date: Date;  date: Date;

      

      <div className="max-w-7xl mx-auto px-4 py-8">    const startDate = new Date(firstDay);

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">

          <div>    startDate.setDate(startDate.getDate() - firstDay.getDay());  isCurrentMonth: boolean;  isCurrentMonth: boolean;

            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>

            <p className="text-gray-600">View your schedule and manage appointments</p>    

          </div>

        </div>    const days: CalendarDay[] = [];  isToday: boolean;  isToday: boolean;



        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">    

          <div className="flex items-center justify-between mb-6">

            <button    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days  isWorkingDay: boolean;  isWorkingDay: boolean;

              onClick={() => navigateMonth('prev')}

              className="p-2 hover:bg-gray-100 rounded-full"      const date = new Date(startDate);

            >

              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">      date.setDate(startDate.getDate() + i);  timeSlots: TimeSlot[];  timeSlots: TimeSlot[];

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />

              </svg>      

            </button>

                  const isCurrentMonth = date.getMonth() === month;  bookingsCount: number;  bookingsCount: number;

            <h2 className="text-xl font-semibold">

              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}      const isToday = date.toDateString() === new Date().toDateString();

            </h2>

                  const isWorkingDay = date.getDay() !== 0 && date.getDay() !== 6; // Exclude weekends for now}}

            <button

              onClick={() => navigateMonth('next')}      

              className="p-2 hover:bg-gray-100 rounded-full"

            >      days.push({

              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />        date,

              </svg>

            </button>        isCurrentMonth,export default function ProviderCalendarPage() {// Default working hours - can be fetched from availability API

          </div>

        isToday,

          <div className="grid grid-cols-7 gap-1">

            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (        isWorkingDay,  const [currentDate, setCurrentDate] = useState(new Date());const workingHours = {

              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">

                {day}        timeSlots: generateTimeSlots(date),

              </div>

            ))}        bookingsCount: 0 // Will be updated when bookings are loaded  const [view, setView] = useState<'month' | 'week' | 'day'>('month');  monday: { isWorking: true, start: "09:00", end: "18:00" },

            

            {calendarDays.map((day, index) => {      });

              const dayBookings = getBookingsForDate(day);

              const isCurrentMonth = day.getMonth() === currentDate.getMonth();    }  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);  tuesday: { isWorking: true, start: "09:00", end: "18:00" },

              const isToday = day.toDateString() === new Date().toDateString();

                  

              return (

                <div    setCalendarDays(days);  const [bookings, setBookings] = useState<CalendarBooking[]>([]);  wednesday: { isWorking: true, start: "09:00", end: "18:00" },

                  key={index}

                  className={`min-h-[80px] p-2 border border-gray-200 ${  };

                    !isCurrentMonth ? 'bg-gray-100 text-gray-400' : 'bg-white'

                  } ${isToday ? 'ring-2 ring-blue-500' : ''}`}  const [loading, setLoading] = useState(true);  thursday: { isWorking: true, start: "09:00", end: "18:00" },

                >

                  <div className="flex justify-between items-start mb-1">  const generateTimeSlots = (date: Date): TimeSlot[] => {

                    <span className={`text-sm font-medium ${

                      isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'    const slots: TimeSlot[] = [];  const [selectedDate, setSelectedDate] = useState<Date | null>(null);  friday: { isWorking: true, start: "09:00", end: "18:00" },

                    }`}>

                      {day.getDate()}    const startHour = 9; // 9 AM

                    </span>

                  </div>    const endHour = 17; // 5 PM  const [showTimeSlots, setShowTimeSlots] = useState(false);  saturday: { isWorking: true, start: "10:00", end: "16:00" },

                  

                  {dayBookings.length > 0 && (    

                    <div className="space-y-1">

                      {dayBookings.slice(0, 2).map((booking, idx) => (    for (let hour = startHour; hour < endHour; hour++) {  sunday: { isWorking: false, start: "", end: "" }

                        <div

                          key={idx}      const time = `${hour.toString().padStart(2, '0')}:00`;

                          className={`text-xs p-1 rounded text-white truncate ${getStatusColor(booking.status)}`}

                        >      slots.push({  useEffect(() => {};

                          {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {

                            hour: 'numeric',        time,

                            minute: '2-digit',

                            hour12: true        isAvailable: true,    generateCalendarDays();

                          })} {booking.service.name.substring(0, 10)}

                        </div>        booking: undefined

                      ))}

                      {dayBookings.length > 2 && (      });    fetchBookings();export default function ProviderCalendar() {

                        <div className="text-xs text-gray-500">

                          +{dayBookings.length - 2} more    }

                        </div>

                      )}      }, [currentDate]);  const [currentDate, setCurrentDate] = useState(new Date());

                    </div>

                  )}    return slots;

                </div>

              );  };  const [selectedView, setSelectedView] = useState("week");

            })}

          </div>

        </div>

  const fetchBookings = async () => {  const generateCalendarDays = () => {  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

        <div className="bg-white rounded-lg shadow-sm p-6">

          <h3 className="font-semibold mb-4">Legend</h3>    try {

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="flex items-center gap-2">      setLoading(true);    const year = currentDate.getFullYear();  const [showTimeOffModal, setShowTimeOffModal] = useState(false);

              <div className="w-4 h-4 bg-green-500 rounded"></div>

              <span className="text-sm">Confirmed</span>      const token = localStorage.getItem('auth-token') || localStorage.getItem('accessToken');

            </div>

            <div className="flex items-center gap-2">          const month = currentDate.getMonth();

              <div className="w-4 h-4 bg-yellow-500 rounded"></div>

              <span className="text-sm">Pending</span>      if (!token) {

            </div>

            <div className="flex items-center gap-2">        setLoading(false);      // Generate calendar days for the current month

              <div className="w-4 h-4 bg-blue-500 rounded"></div>

              <span className="text-sm">Completed</span>        return;

            </div>

            <div className="flex items-center gap-2">      }    // Get first day of month and calculate start of calendar  const generateCalendarDays = () => {

              <div className="w-4 h-4 bg-red-500 rounded"></div>

              <span className="text-sm">Cancelled</span>

            </div>

          </div>      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);    const firstDay = new Date(year, month, 1);    const year = currentDate.getFullYear();

        </div>

      </div>      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    </div>

  );          const startDate = new Date(firstDay);    const month = currentDate.getMonth();

}
      const response = await fetch(

        `http://localhost:8000/api/v1/bookings/my-bookings?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,    startDate.setDate(startDate.getDate() - firstDay.getDay());    const firstDay = new Date(year, month, 1);

        {

          method: 'GET',        const lastDay = new Date(year, month + 1, 0);

          headers: {

            'Content-Type': 'application/json',    const days: CalendarDay[] = [];    const startDate = new Date(firstDay);

            'Authorization': `Bearer ${token}`,

          },        startDate.setDate(startDate.getDate() - firstDay.getDay());

        }

      );    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days



      if (response.ok) {      const date = new Date(startDate);    const days = [];

        const data = await response.json();

        setBookings(data);      date.setDate(startDate.getDate() + i);    const currentDay = new Date(startDate);

        updateCalendarWithBookings(data);

      }      

    } catch (error) {

      console.error('Failed to fetch bookings:', error);      const isCurrentMonth = date.getMonth() === month;    for (let i = 0; i < 42; i++) {

    } finally {

      setLoading(false);      const isToday = date.toDateString() === new Date().toDateString();      days.push(new Date(currentDay));

    }

  };      const isWorkingDay = date.getDay() !== 0 && date.getDay() !== 6; // Exclude weekends for now      currentDay.setDate(currentDay.getDate() + 1);



  const updateCalendarWithBookings = (bookingsData: CalendarBooking[]) => {          }

    setCalendarDays(days => 

      days.map(day => {      days.push({

        const dayBookings = bookingsData.filter(booking => 

          new Date(booking.scheduledAt).toDateString() === day.date.toDateString()        date,    return days;

        );

                isCurrentMonth,  };

        return {

          ...day,        isToday,

          bookingsCount: dayBookings.length

        };        isWorkingDay,  const getEventsForDate = (date: Date) => {

      })

    );        timeSlots: generateTimeSlots(date),    return calendarEvents.filter(event => {

  };

        bookingsCount: 0 // Will be updated when bookings are loaded      const eventDate = new Date(event.start);

  const navigateMonth = (direction: 'prev' | 'next') => {

    setCurrentDate(date => {      });      return eventDate.toDateString() === date.toDateString();

      const newDate = new Date(date);

      newDate.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));    }    });

      return newDate;

    });      };

  };

    setCalendarDays(days);

  const getStatusColor = (status: string) => {

    switch (status) {  };  const getStatusColor = (status: string) => {

      case 'confirmed': return 'bg-green-500';

      case 'pending': return 'bg-yellow-500';    switch (status) {

      case 'completed': return 'bg-blue-500';

      case 'cancelled': return 'bg-red-500';  const generateTimeSlots = (date: Date): TimeSlot[] => {      case "confirmed": return "bg-green-100 text-green-800 border-green-200";

      default: return 'bg-gray-500';

    }    const slots: TimeSlot[] = [];      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";

  };

    const startHour = 9; // 9 AM      case "completed": return "bg-blue-100 text-blue-800 border-blue-200";

  const openDayView = (date: Date) => {

    setSelectedDate(date);    const endHour = 17; // 5 PM      case "cancelled": return "bg-red-100 text-red-800 border-red-200";

    setShowTimeSlots(true);

  };    const slotDuration = 60; // 60 minutes      default: return "bg-gray-100 text-gray-800 border-gray-200";



  const getDayBookings = (date: Date) => {        }

    return bookings.filter(booking => 

      new Date(booking.scheduledAt).toDateString() === date.toDateString()    for (let hour = startHour; hour < endHour; hour++) {  };

    );

  };      const time = `${hour.toString().padStart(2, '0')}:00`;



  const getTodayBookings = () => {      slots.push({  const formatTime = (dateString: string) => {

    const today = new Date();

    return bookings.filter(booking =>         time,    return new Date(dateString).toLocaleTimeString('en-US', {

      new Date(booking.scheduledAt).toDateString() === today.toDateString()

    ).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());        isAvailable: true,      hour: 'numeric',

  };

        booking: undefined      minute: '2-digit',

  return (

    <div className="min-h-screen bg-gray-50">      });      hour12: true

      <ProviderNav />

          }    });

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}      };

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">

          <div>    return slots;

            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>

            <p className="text-gray-600">View your schedule and manage appointments</p>  };  const navigateMonth = (direction: number) => {

          </div>

              const newDate = new Date(currentDate);

          <div className="flex gap-3 mt-4 md:mt-0">

            <div className="flex bg-white rounded-lg border border-gray-300">  const fetchBookings = async () => {    newDate.setMonth(newDate.getMonth() + direction);

              {['month', 'week', 'day'].map((viewType) => (

                <button    try {    setCurrentDate(newDate);

                  key={viewType}

                  onClick={() => setView(viewType as any)}      setLoading(true);  };

                  className={`px-4 py-2 text-sm font-medium capitalize ${

                    view === viewType      const token = localStorage.getItem('auth-token') || localStorage.getItem('accessToken');

                      ? 'bg-blue-600 text-white'

                      : 'text-gray-700 hover:bg-gray-50'        const isToday = (date: Date) => {

                  } ${viewType === 'month' ? 'rounded-l-lg' : viewType === 'day' ? 'rounded-r-lg' : ''}`}

                >      if (!token) {    const today = new Date();

                  {viewType}

                </button>        setLoading(false);    return date.toDateString() === today.toDateString();

              ))}

            </div>        return;  };

          </div>

        </div>      }



        {/* Calendar Navigation */}  const isCurrentMonth = (date: Date) => {

        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">

          <div className="flex items-center justify-between mb-6">      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);    return date.getMonth() === currentDate.getMonth();

            <button

              onClick={() => navigateMonth('prev')}      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);  };

              className="p-2 hover:bg-gray-100 rounded-full"

            >      

              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />      const response = await fetch(  const calendarDays = generateCalendarDays();

              </svg>

            </button>        `http://localhost:8000/api/v1/bookings/my-bookings?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,  const monthNames = [

            

            <h2 className="text-xl font-semibold">        {    "January", "February", "March", "April", "May", "June",

              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}

            </h2>          method: 'GET',    "July", "August", "September", "October", "November", "December"

            

            <button          headers: {  ];

              onClick={() => navigateMonth('next')}

              className="p-2 hover:bg-gray-100 rounded-full"            'Content-Type': 'application/json',

            >

              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">            'Authorization': `Bearer ${token}`,  return (

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />

              </svg>          },    <div className="min-h-screen bg-gray-50">

            </button>

          </div>        }      <ProviderNav />



          {/* Calendar Grid */}      );      

          <div className="grid grid-cols-7 gap-1">

            {/* Day headers */}      <div className="max-w-7xl mx-auto px-4 py-8">

            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (

              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">      if (response.ok) {        {/* Header */}

                {day}

              </div>        const data = await response.json();        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">

            ))}

                    setBookings(data);          <div>

            {/* Calendar days */}

            {calendarDays.map((day, index) => (        updateCalendarWithBookings(data);            <h1 className="text-2xl font-bold text-gray-900">Calendar & Availability</h1>

              <div

                key={index}      }            <p className="text-gray-600">Manage your schedule and working hours</p>

                onClick={() => openDayView(day.date)}

                className={`min-h-[80px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition ${    } catch (error) {          </div>

                  !day.isCurrentMonth ? 'bg-gray-100 text-gray-400' : 'bg-white'

                } ${day.isToday ? 'ring-2 ring-blue-500' : ''}`}      console.error('Failed to fetch bookings:', error);          <div className="flex gap-3 mt-4 md:mt-0">

              >

                <div className="flex justify-between items-start mb-1">    } finally {            <button

                  <span className={`text-sm font-medium ${

                    day.isToday ? 'text-blue-600' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'      setLoading(false);              onClick={() => setShowAvailabilityModal(true)}

                  }`}>

                    {day.date.getDate()}    }              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"

                  </span>

                  {!day.isWorkingDay && day.isCurrentMonth && (  };            >

                    <span className="text-xs text-red-500">•</span>

                  )}              ⚙️ Set Availability

                </div>

                  const updateCalendarWithBookings = (bookingsData: CalendarBooking[]) => {            </button>

                {day.bookingsCount > 0 && (

                  <div className="space-y-1">    setCalendarDays(days =>             <button

                    {getDayBookings(day.date).slice(0, 2).map((booking, idx) => (

                      <div      days.map(day => {              onClick={() => setShowTimeOffModal(true)}

                        key={idx}

                        className={`text-xs p-1 rounded text-white truncate ${getStatusColor(booking.status)}`}        const dayBookings = bookingsData.filter(booking =>               className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"

                      >

                        {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {          new Date(booking.scheduledAt).toDateString() === day.date.toDateString()            >

                          hour: 'numeric',

                          minute: '2-digit',        );              🚫 Request Time Off

                          hour12: true

                        })} {booking.service.name}                    </button>

                      </div>

                    ))}        return {          </div>

                    {day.bookingsCount > 2 && (

                      <div className="text-xs text-gray-500">          ...day,        </div>

                        +{day.bookingsCount - 2} more

                      </div>          bookingsCount: dayBookings.length

                    )}

                  </div>        };        {/* Calendar Navigation */}

                )}

              </div>      })        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">

            ))}

          </div>    );          <div className="flex items-center justify-between mb-4">

        </div>

  };            <div className="flex items-center gap-4">

        {/* Today's Schedule */}

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">              <button

          <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>

            const navigateMonth = (direction: 'prev' | 'next') => {                onClick={() => navigateMonth(-1)}

          {getTodayBookings().length === 0 ? (

            <div className="text-center py-8">    setCurrentDate(date => {                className="p-2 hover:bg-gray-100 rounded-lg transition"

              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />      const newDate = new Date(date);              >

              </svg>

              <h4 className="text-lg font-medium text-gray-900 mb-1">No appointments today</h4>      newDate.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

              <p className="text-gray-500">Enjoy your free day or set your availability for bookings.</p>

            </div>      return newDate;                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />

          ) : (

            <div className="space-y-4">    });                </svg>

              {getTodayBookings().map((booking) => (

                <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">  };              </button>

                  <div className="flex items-center gap-4">

                    <div className="text-center">              <h2 className="text-xl font-semibold">

                      <div className="text-lg font-bold text-gray-900">

                        {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {  const getStatusColor = (status: string) => {                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}

                          hour: 'numeric',

                          minute: '2-digit',    switch (status) {              </h2>

                          hour12: true

                        })}      case 'confirmed': return 'bg-green-500';              <button

                      </div>

                      <div className="text-sm text-gray-500">      case 'pending': return 'bg-yellow-500';                onClick={() => navigateMonth(1)}

                        {booking.service.duration} min

                      </div>      case 'completed': return 'bg-blue-500';                className="p-2 hover:bg-gray-100 rounded-lg transition"

                    </div>

                    <div className="border-l pl-4">      case 'cancelled': return 'bg-red-500';              >

                      <h4 className="font-semibold text-gray-900">{booking.service.name}</h4>

                      <p className="text-gray-600">{booking.customer.name}</p>      default: return 'bg-gray-500';                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(booking.status)}`}>

                        {booking.status}    }                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />

                      </span>

                    </div>  };                </svg>

                  </div>

                  <div className="text-right">              </button>

                    <div className="text-lg font-bold text-gray-900">${booking.service.price}</div>

                    <div className="flex gap-2 mt-2">  const openDayView = (date: Date) => {            </div>

                      <button className="text-blue-600 hover:text-blue-700 text-sm">

                        View Details    setSelectedDate(date);

                      </button>

                      <button className="text-gray-600 hover:text-gray-700 text-sm">    setShowTimeSlots(true);            <div className="flex gap-2">

                        Reschedule

                      </button>  };              {["month", "week", "day"].map((view) => (

                    </div>

                  </div>                <button

                </div>

              ))}  const getDayBookings = (date: Date) => {                  key={view}

            </div>

          )}    return bookings.filter(booking =>                   onClick={() => setSelectedView(view)}

        </div>

      new Date(booking.scheduledAt).toDateString() === date.toDateString()                  className={`px-3 py-1 rounded-lg text-sm font-medium capitalize transition ${

        {/* Legend */}

        <div className="bg-white rounded-lg shadow-sm p-6">    );                    selectedView === view

          <h3 className="font-semibold mb-4">Legend</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">  };                      ? "bg-blue-600 text-white"

            <div className="flex items-center gap-2">

              <div className="w-4 h-4 bg-green-500 rounded"></div>                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"

              <span className="text-sm">Confirmed</span>

            </div>  const getTodayBookings = () => {                  }`}

            <div className="flex items-center gap-2">

              <div className="w-4 h-4 bg-yellow-500 rounded"></div>    const today = new Date();                >

              <span className="text-sm">Pending</span>

            </div>    return bookings.filter(booking =>                   {view}

            <div className="flex items-center gap-2">

              <div className="w-4 h-4 bg-blue-500 rounded"></div>      new Date(booking.scheduledAt).toDateString() === today.toDateString()                </button>

              <span className="text-sm">Completed</span>

            </div>    ).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());              ))}

            <div className="flex items-center gap-2">

              <div className="w-4 h-4 bg-red-500 rounded"></div>  };            </div>

              <span className="text-sm">Cancelled</span>

            </div>          </div>

          </div>

        </div>  return (

      </div>

    <div className="min-h-screen bg-gray-50">          {/* Calendar Grid */}

      {/* Day Detail Modal */}

      {showTimeSlots && selectedDate && (      <ProviderNav />          <div className="grid grid-cols-7 gap-1">

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">                  {/* Day Headers */}

            <div className="p-6">

              <div className="flex items-center justify-between mb-6">      <div className="max-w-7xl mx-auto px-4 py-8">            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (

                <h2 className="text-xl font-semibold">

                  {selectedDate.toLocaleDateString('en-US', {         {/* Header */}              <div key={day} className="p-3 text-center font-medium text-gray-500 border-b">

                    weekday: 'long', 

                    year: 'numeric',         <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">                {day}

                    month: 'long', 

                    day: 'numeric'           <div>              </div>

                  })}

                </h2>            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>            ))}

                <button

                  onClick={() => setShowTimeSlots(false)}            <p className="text-gray-600">View your schedule and manage appointments</p>

                  className="text-gray-400 hover:text-gray-600"

                >          </div>            {/* Calendar Days */}

                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />                      {calendarDays.map((date, index) => {

                  </svg>

                </button>          <div className="flex gap-3 mt-4 md:mt-0">              const events = getEventsForDate(date);

              </div>

            <div className="flex bg-white rounded-lg border border-gray-300">              const dayOfWeek = date.getDay();

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>              {['month', 'week', 'day'].map((viewType) => (              const workingDay = Object.values(workingHours)[dayOfWeek];

                  <h3 className="font-semibold mb-4">Time Slots</h3>

                  <div className="space-y-2">                <button

                    {generateTimeSlots(selectedDate).map((slot, index) => {

                      const booking = getDayBookings(selectedDate).find(b =>                   key={viewType}              return (

                        new Date(b.scheduledAt).toLocaleTimeString('en-US', { 

                          hour12: false,                   onClick={() => setView(viewType as any)}                <div

                          hour: '2-digit', 

                          minute: '2-digit'                   className={`px-4 py-2 text-sm font-medium capitalize ${                  key={index}

                        }) === slot.time

                      );                    view === viewType                  className={`min-h-[120px] p-2 border border-gray-200 ${

                      

                      return (                      ? 'bg-blue-600 text-white'                    isCurrentMonth(date) ? "bg-white" : "bg-gray-50"

                        <div

                          key={index}                      : 'text-gray-700 hover:bg-gray-50'                  } ${isToday(date) ? "ring-2 ring-blue-500" : ""}`}

                          className={`p-3 rounded-lg border ${

                            booking                   } ${viewType === 'month' ? 'rounded-l-lg' : viewType === 'day' ? 'rounded-r-lg' : ''}`}                >

                              ? `${getStatusColor(booking.status)} text-white`

                              : 'border-gray-200 hover:bg-gray-50'                >                  <div className={`text-sm font-medium mb-1 ${

                          }`}

                        >                  {viewType}                    isToday(date) ? "text-blue-600" : isCurrentMonth(date) ? "text-gray-900" : "text-gray-400"

                          <div className="flex justify-between items-center">

                            <span className="font-medium">{slot.time}</span>                </button>                  }`}>

                            {booking ? (

                              <span className="text-sm">              ))}                    {date.getDate()}

                                {booking.customer.name} - {booking.service.name}

                              </span>            </div>                  </div>

                            ) : (

                              <span className="text-sm text-gray-500">Available</span>          </div>

                            )}

                          </div>        </div>                  {/* Working Hours Indicator */}

                        </div>

                      );                  {workingDay?.isWorking && isCurrentMonth(date) && (

                    })}

                  </div>        {/* Calendar Navigation */}                    <div className="text-xs text-green-600 mb-1">

                </div>

        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">                      {workingDay.start} - {workingDay.end}

                <div>

                  <h3 className="font-semibold mb-4">Bookings for This Day</h3>          <div className="flex items-center justify-between mb-6">                    </div>

                  <div className="space-y-3">

                    {getDayBookings(selectedDate).map((booking, index) => (            <button                  )}

                      <div key={index} className="border border-gray-200 rounded-lg p-4">

                        <div className="flex justify-between items-start mb-2">              onClick={() => navigateMonth('prev')}

                          <h4 className="font-medium">{booking.customer.name}</h4>

                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(booking.status)}`}>              className="p-2 hover:bg-gray-100 rounded-full"                  {/* Events */}

                            {booking.status}

                          </span>            >                  <div className="space-y-1">

                        </div>

                        <p className="text-sm text-gray-600 mb-1">{booking.service.name}</p>              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">                    {events.slice(0, 2).map((event) => (

                        <p className="text-sm text-gray-500">

                          {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />                      <div

                            hour: 'numeric',

                            minute: '2-digit',              </svg>                        key={event.id}

                            hour12: true

                          })} • {booking.service.duration} min • ${booking.service.price}            </button>                        className={`text-xs p-1 rounded border ${getStatusColor(event.status)}`}

                        </p>

                      </div>                                  >

                    ))}

                                <h2 className="text-xl font-semibold">                        <div className="font-medium">{formatTime(event.start)}</div>

                    {getDayBookings(selectedDate).length === 0 && (

                      <p className="text-gray-500 text-center py-8">No bookings for this day</p>              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}                        <div className="truncate">{event.title}</div>

                    )}

                  </div>            </h2>                      </div>

                </div>

              </div>                                ))}

            </div>

          </div>            <button                    {events.length > 2 && (

        </div>

      )}              onClick={() => navigateMonth('next')}                      <div className="text-xs text-gray-500">

    </div>

  );              className="p-2 hover:bg-gray-100 rounded-full"                        +{events.length - 2} more

}
            >                      </div>

              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">                    )}

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />                  </div>

              </svg>                </div>

            </button>              );

          </div>            })}

          </div>

          {/* Calendar Grid */}        </div>

          <div className="grid grid-cols-7 gap-1">

            {/* Day headers */}        {/* Today's Schedule */}

            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (        <div className="bg-white rounded-lg shadow-sm p-6">

              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">          <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>

                {day}          

              </div>          {calendarEvents

            ))}            .filter(event => {

                          const today = new Date();

            {/* Calendar days */}              const eventDate = new Date(event.start);

            {calendarDays.map((day, index) => (              return eventDate.toDateString() === today.toDateString();

              <div            })

                key={index}            .length === 0 ? (

                onClick={() => openDayView(day.date)}            <div className="text-center py-8">

                className={`min-h-[80px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition ${              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                  !day.isCurrentMonth ? 'bg-gray-100 text-gray-400' : 'bg-white'                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />

                } ${day.isToday ? 'ring-2 ring-blue-500' : ''}`}              </svg>

              >              <h4 className="text-lg font-medium text-gray-900 mb-1">No appointments today</h4>

                <div className="flex justify-between items-start mb-1">              <p className="text-gray-500">Enjoy your free day or set your availability for bookings.</p>

                  <span className={`text-sm font-medium ${            </div>

                    day.isToday ? 'text-blue-600' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'          ) : (

                  }`}>            <div className="space-y-4">

                    {day.date.getDate()}              {calendarEvents

                  </span>                .filter(event => {

                  {!day.isWorkingDay && day.isCurrentMonth && (                  const today = new Date();

                    <span className="text-xs text-red-500">•</span>                  const eventDate = new Date(event.start);

                  )}                  return eventDate.toDateString() === today.toDateString();

                </div>                })

                                .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

                {day.bookingsCount > 0 && (                .map((event) => (

                  <div className="space-y-1">                  <div key={event.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">

                    {getDayBookings(day.date).slice(0, 2).map((booking, idx) => (                    <div className="flex items-center gap-4">

                      <div                      <div className="text-center">

                        key={idx}                        <div className="text-lg font-bold text-gray-900">

                        className={`text-xs p-1 rounded text-white truncate ${getStatusColor(booking.status)}`}                          {formatTime(event.start)}

                      >                        </div>

                        {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {                        <div className="text-sm text-gray-500">

                          hour: 'numeric',                          {Math.round((new Date(event.end).getTime() - new Date(event.start).getTime()) / 60000)} min

                          minute: '2-digit',                        </div>

                          hour12: true                      </div>

                        })} {booking.service.name}                      <div className="border-l pl-4">

                      </div>                        <h4 className="font-semibold text-gray-900">{event.title}</h4>

                    ))}                        <p className="text-gray-600">{event.customer}</p>

                    {day.bookingsCount > 2 && (                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>

                      <div className="text-xs text-gray-500">                          {event.status}

                        +{day.bookingsCount - 2} more                        </span>

                      </div>                      </div>

                    )}                    </div>

                  </div>                    <div className="text-right">

                )}                      <div className="text-lg font-bold text-gray-900">${event.price}</div>

              </div>                      <div className="flex gap-2 mt-2">

            ))}                        <button className="text-blue-600 hover:text-blue-700 text-sm">

          </div>                          View Details

        </div>                        </button>

                        <button className="text-gray-600 hover:text-gray-700 text-sm">

        {/* Today's Schedule */}                          Reschedule

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">                        </button>

          <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>                      </div>

                              </div>

          {getTodayBookings().length === 0 ? (                  </div>

            <div className="text-center py-8">                ))}

              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">            </div>

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />          )}

              </svg>        </div>

              <h4 className="text-lg font-medium text-gray-900 mb-1">No appointments today</h4>      </div>

              <p className="text-gray-500">Enjoy your free day or set your availability for bookings.</p>

            </div>      {/* Set Availability Modal */}

          ) : (      {showAvailabilityModal && (

            <div className="space-y-4">        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">

              {getTodayBookings().map((booking) => (          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">

                <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">            <div className="p-6">

                  <div className="flex items-center gap-4">              <div className="flex items-center justify-between mb-6">

                    <div className="text-center">                <h2 className="text-xl font-semibold">Set Working Hours</h2>

                      <div className="text-lg font-bold text-gray-900">                <button

                        {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {                  onClick={() => setShowAvailabilityModal(false)}

                          hour: 'numeric',                  className="text-gray-400 hover:text-gray-600"

                          minute: '2-digit',                >

                          hour12: true                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                        })}                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />

                      </div>                  </svg>

                      <div className="text-sm text-gray-500">                </button>

                        {booking.service.duration} min              </div>

                      </div>

                    </div>              <div className="space-y-6">

                    <div className="border-l pl-4">                {Object.entries(workingHours).map(([day, hours]) => (

                      <h4 className="font-semibold text-gray-900">{booking.service.name}</h4>                  <div key={day} className="flex items-center gap-4">

                      <p className="text-gray-600">{booking.customer.name}</p>                    <div className="w-24">

                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(booking.status)}`}>                      <label className="text-sm font-medium text-gray-700 capitalize">{day}</label>

                        {booking.status}                    </div>

                      </span>                    <div className="flex items-center gap-2">

                    </div>                      <input

                  </div>                        type="checkbox"

                  <div className="text-right">                        defaultChecked={hours.isWorking}

                    <div className="text-lg font-bold text-gray-900">${booking.service.price}</div>                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"

                    <div className="flex gap-2 mt-2">                      />

                      <button className="text-blue-600 hover:text-blue-700 text-sm">                      <span className="text-sm text-gray-600">Working</span>

                        View Details                    </div>

                      </button>                    <div className="flex items-center gap-2">

                      <button className="text-gray-600 hover:text-gray-700 text-sm">                      <input

                        Reschedule                        type="time"

                      </button>                        defaultValue={hours.start}

                    </div>                        disabled={!hours.isWorking}

                  </div>                        className="border border-gray-300 rounded px-3 py-1 text-sm disabled:bg-gray-100"

                </div>                      />

              ))}                      <span className="text-gray-500">to</span>

            </div>                      <input

          )}                        type="time"

        </div>                        defaultValue={hours.end}

                        disabled={!hours.isWorking}

        {/* Legend */}                        className="border border-gray-300 rounded px-3 py-1 text-sm disabled:bg-gray-100"

        <div className="bg-white rounded-lg shadow-sm p-6">                      />

          <h3 className="font-semibold mb-4">Legend</h3>                    </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">                  </div>

            <div className="flex items-center gap-2">                ))}

              <div className="w-4 h-4 bg-green-500 rounded"></div>

              <span className="text-sm">Confirmed</span>                <div className="flex gap-3 pt-4 border-t">

            </div>                  <button

            <div className="flex items-center gap-2">                    onClick={() => setShowAvailabilityModal(false)}

              <div className="w-4 h-4 bg-yellow-500 rounded"></div>                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"

              <span className="text-sm">Pending</span>                  >

            </div>                    Cancel

            <div className="flex items-center gap-2">                  </button>

              <div className="w-4 h-4 bg-blue-500 rounded"></div>                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">

              <span className="text-sm">Completed</span>                    Save Working Hours

            </div>                  </button>

            <div className="flex items-center gap-2">                </div>

              <div className="w-4 h-4 bg-red-500 rounded"></div>              </div>

              <span className="text-sm">Cancelled</span>            </div>

            </div>          </div>

          </div>        </div>

        </div>      )}

      </div>

      {/* Time Off Modal */}

      {/* Day Detail Modal */}      {showTimeOffModal && (

      {showTimeSlots && selectedDate && (        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">          <div className="bg-white rounded-lg max-w-md w-full">

          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">            <div className="p-6">

            <div className="p-6">              <div className="flex items-center justify-between mb-6">

              <div className="flex items-center justify-between mb-6">                <h2 className="text-xl font-semibold">Request Time Off</h2>

                <h2 className="text-xl font-semibold">                <button

                  {selectedDate.toLocaleDateString('en-US', {                   onClick={() => setShowTimeOffModal(false)}

                    weekday: 'long',                   className="text-gray-400 hover:text-gray-600"

                    year: 'numeric',                 >

                    month: 'long',                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                    day: 'numeric'                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />

                  })}                  </svg>

                </h2>                </button>

                <button              </div>

                  onClick={() => setShowTimeSlots(false)}

                  className="text-gray-400 hover:text-gray-600"              <form className="space-y-4">

                >                <div>

                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>

                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />                  <input

                  </svg>                    type="date"

                </button>                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

              </div>                  />

                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">                <div>

                <div>                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>

                  <h3 className="font-semibold mb-4">Time Slots</h3>                  <input

                  <div className="space-y-2">                    type="date"

                    {generateTimeSlots(selectedDate).map((slot, index) => {                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

                      const booking = getDayBookings(selectedDate).find(b =>                   />

                        new Date(b.scheduledAt).toLocaleTimeString('en-US', {                 </div>

                          hour12: false,                 <div>

                          hour: '2-digit',                   <label className="block text-sm font-medium text-gray-700 mb-1">Reason (Optional)</label>

                          minute: '2-digit'                   <textarea

                        }) === slot.time                    rows={3}

                      );                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

                                          placeholder="Vacation, sick leave, personal reasons..."

                      return (                  />

                        <div                </div>

                          key={index}

                          className={`p-3 rounded-lg border ${                <div className="flex gap-3 pt-4">

                            booking                   <button

                              ? `${getStatusColor(booking.status)} text-white`                    type="button"

                              : 'border-gray-200 hover:bg-gray-50'                    onClick={() => setShowTimeOffModal(false)}

                          }`}                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"

                        >                  >

                          <div className="flex justify-between items-center">                    Cancel

                            <span className="font-medium">{slot.time}</span>                  </button>

                            {booking ? (                  <button

                              <span className="text-sm">                    type="submit"

                                {booking.customer.name} - {booking.service.name}                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"

                              </span>                  >

                            ) : (                    Request Time Off

                              <span className="text-sm text-gray-500">Available</span>                  </button>

                            )}                </div>

                          </div>              </form>

                        </div>            </div>

                      );          </div>

                    })}        </div>

                  </div>      )}

                </div>    </div>

  );

                <div>}

                  <h3 className="font-semibold mb-4">Bookings for This Day</h3>
                  <div className="space-y-3">
                    {getDayBookings(selectedDate).map((booking, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{booking.customer.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{booking.service.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })} • {booking.service.duration} min • ${booking.service.price}
                        </p>
                      </div>
                    ))}
                    
                    {getDayBookings(selectedDate).length === 0 && (
                      <p className="text-gray-500 text-center py-8">No bookings for this day</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}