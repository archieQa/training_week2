import React, { useEffect, useState, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { AiOutlineCalendar, AiOutlinePlus, AiOutlineCopy } from "react-icons/ai"
import { Menu } from "@headlessui/react"
import api from "@/services/api"
import toast from "react-hot-toast"
import CreateEventModal from "@/components/CreateEventModal"
import Loader from "@/components/loader"
import EventCard from "@/scenes/events/components/EventCard"
import { formatDateTimeLocal } from "@/utils"  

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Published" }
]

const STATUS_BADGE_STYLES = {
  draft: "bg-gray-100 text-gray-800",
  published: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
}

export default function MyEvents() {
  const [allEvents, setAllEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [createEventModal, setCreateEventModal] = useState(false)
  const navigate = useNavigate()

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const { ok, data } = await api.post("/event/my-events/search", { per_page: 50, page: 1 })
      
      if (!ok) {
        throw new Error("Failed to fetch events")
      }
      
      setAllEvents(data || [])
    } catch (error) {
      toast.error("Could not load your events")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const filteredEvents = useMemo(() => {
    if (filter === "all") {
      return allEvents
    }
    return allEvents.filter(event => event.status === filter)
  }, [allEvents, filter])

  const handleDuplicate = async eventId => {
    try {
      const { ok, data } = await api.post(`/event/duplicate/${eventId}`)
      if (!ok) throw new Error("Failed to duplicate event")
      
      toast.success("Event duplicated successfully")
      navigate(`/event/${data._id}/edit`)
      fetchEvents()
    } catch (error) {
      toast.error("Failed to duplicate event")
    }
  }

  const handleDelete = async eventId => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return
    }

    try {
      const { ok } = await api.delete(`/event/${eventId}`)
      if (!ok) throw new Error("Failed to delete event")
      
      toast.success("Event deleted successfully")
      setAllEvents(prev => prev.filter(event => event._id !== eventId))
    } catch (error) {
      toast.error("Failed to delete event")
    }
  }

  const formatDate = date => {
    return formatDateTimeLocal(date, {
      year: "numeric",
      month: "short",
      day: "numeric"
    }, {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getStatusBadge = status => {
    const style = STATUS_BADGE_STYLES[status] || STATUS_BADGE_STYLES.draft
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${style}`}>
        {status.toUpperCase()}
      </span>
    )
  }

  if (loading) {
    return (
      <div>
        <Loader size="small" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
            <p className="text-gray-600 mt-2">Events you've created and organized</p>
          </div>
          <button
            onClick={() => setCreateEventModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <AiOutlinePlus className="w-5 h-5" />
            Create Event
          </button>
        </div>

        <div className="mt-4 flex gap-2">
          {FILTER_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1 rounded ${
                filter === option.value
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <AiOutlineCalendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
          <p className="text-gray-600 mb-4">Create your first event to get started!</p>
          <button
            onClick={() => setCreateEventModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <AiOutlinePlus className="w-5 h-5" />
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map(event => (
            <EventCard
              key={event._id}
              event={event}
              onView={() => navigate(`/event/${event._id}`)}
              onEdit={() => navigate(`/event/${event._id}/edit`)}
              onViewAttendees={() => navigate(`/event/${event._id}/attendees`)}
              onDuplicate={() => handleDuplicate(event._id)}
              onDelete={() => handleDelete(event._id)}
              formatDate={formatDate}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </div>
      )}

      <CreateEventModal
        isOpen={createEventModal}
        onClose={() => setCreateEventModal(false)}
        onSuccess={fetchEvents}
      />
    </div>
  )
}

