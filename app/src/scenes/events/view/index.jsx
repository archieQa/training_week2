import React, { useEffect, useState } from "react"
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
import TabButton from "@/components/TabButton"

export default function EventView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useStore()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const { ok, data, message } = await api.get(`/event/${id}`)
      if (!ok) {
        const errorMsg = message || data?.message || "Server returned an error while fetching the event"
        throw new Error(errorMsg)
      }
      setEvent(data)
    } catch (error) {
      const errorMessage = error.message || error.code || "Unable to load event. The event may not exist or you may not have permission to view it."
      toast.error(`Failed to load event: ${errorMessage}`)
      console.error("Error fetching event:", error)
      navigate("/")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader />
  }

  if (!event) return null

  const isOrganizer = user && event.organizer_id.toString() === user._id.toString()
 
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <TabButton to={`/event/${id}`}>
            Overview
          </TabButton>
          {isOrganizer && (
            <TabButton to={`/event/${id}/edit`}>
              Edit
            </TabButton>
          )}
          <TabButton to={`/event/${id}/attendees`}>
            Attendees
          </TabButton>
          <TabButton to={`/event/${id}/payments`}>
            Payments
          </TabButton>
          <TabButton to={`/event/${id}/raw`}>
            Raw
          </TabButton>
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
