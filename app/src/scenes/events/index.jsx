import React from "react"
import { Routes, Route } from "react-router-dom"
import ListView from "./list"
import CalendarView from "./calendar"
import TabButton from "@/components/TabButton"

export default function Home() {
  return (
    <div className="p-8">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <TabButton to="/">
            List View
          </TabButton>
          <TabButton to="/calendar">
            Calendar View
          </TabButton>
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
