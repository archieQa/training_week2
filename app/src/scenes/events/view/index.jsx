import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Routes, Route, useParams, useNavigate } from "react-router-dom"
import api from "@/services/api"
import toast from "react-hot-toast"
import useStore from "@/services/store"
import OverviewTab from "./overview"
import EditTab from "./edit"
import AttendeesTab from "./attendees"
import PaymentsTab from "./payments"
import RawView from "./raw"
import Loader from "@/components/loader"

export default function EventView() {
  const { id } = useParams()
  const location = useLocation();
  const navigate = useNavigate()
  const { user } = useStore()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  const isOverviewActive = location.pathname === `/event/${id}`
  const isEditActive = location.pathname === `/event/${id}/edit`
  const isAttendeesActive = location.pathname === `/event/${id}/attendees`
  const isPaymentsActive = location.pathname === `/event/${id}/payments`
  const isRawActive = location.pathname === `/event/${id}/raw`

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const { ok, data } = await api.get(`/event/${id}`)
      if (!ok) throw new Error("Failed to fetch event")
      setEvent(data)
    } catch (error) {
      toast.error("Could not load event")
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader />
  }

  if (!event) return null

  const isOrganizer = user && event.organizer_id === user.id

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <button onClick={() => navigate(`/event/${id}`)} 
          className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            isOverviewActive
              ? "text-blue-600 border-blue-600"
              : "text-gray-600 hover:text-gray-900 border-transparent"
          }`}>
            Overview
          </button>
          {isOrganizer && (
            <button onClick={() => navigate(`/event/${id}/edit`)} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              isEditActive
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 hover:text-gray-900 border-transparent"
            }`}>
              Edit
            </button>
          )}
          <button onClick={() => navigate(`/event/${id}/attendees`)} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            isAttendeesActive
              ? "text-blue-600 border-blue-600"
              : "text-gray-600 hover:text-gray-900 border-transparent"
          }`}>
            Attendees
          </button>
          <button onClick={() => navigate(`/event/${id}/payments`)} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            isPaymentsActive
              ? "text-blue-600 border-blue-600"
              : "text-gray-600 hover:text-gray-900 border-transparent"
          }`}>
            Payments
          </button>
          <button onClick={() => navigate(`/event/${id}/raw`)} className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
            isRawActive
              ? "text-blue-600 border-blue-600"
              : "text-gray-600 hover:text-gray-900 border-transparent"
          }`}>
            Raw
          </button>
        </div>
      </div>

      {/* Content */}
      <Routes>
        <Route index element={<OverviewTab event={event} />} />
        <Route path="edit" element={<EditTab event={event} fetchEvent={fetchEvent} />} />
        <Route path="attendees" element={<AttendeesTab eventId={id} />} />
        <Route path="payments" element={<PaymentsTab eventId={id} />} />
        <Route path="raw" element={<RawView event={event} />} />
      </Routes>
    </div>
  )
}
