import React from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import ListView from "./list"
import CalendarView from "./calendar"

export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()

 
  const isCalendarActive = location.pathname === "/calendar"; 
  const isListActive = !isCalendarActive ; 


  return (
    <div className="p-8">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <button onClick={() => navigate("/")} 
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
          isListActive 
            ? "text-blue-600 border-blue-600" 
            : "text-gray-600 hover:text-gray-900 border-transparent"
          }`}>
            List View
          </button>
          <button onClick={() => navigate("/calendar")} 
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              isCalendarActive 
                ? "text-blue-600 border-blue-600" 
                : "text-gray-600 hover:text-gray-900 border-transparent"
            }`}
            >
            Calendar View
          </button>
        </div>
      </div>

      {/* Content */}
      <Routes>
        <Route index element={<ListView />} />
        <Route path="calendar" element={<CalendarView />} />
      </Routes>
    </div>
  )
}
