import React, { useEffect, useState, useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { AiOutlineCalendar, AiOutlinePlus, AiOutlineCopy } from "react-icons/ai"
import { Menu } from "@headlessui/react"
import api from "@/services/api"
import toast from "react-hot-toast"
import CreateEventModal from "@/components/CreateEventModal"
import Loader from "@/components/loader"

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
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

function EventCard({
  event,
  onView,
  onEdit,
  onViewAttendees,
  onDuplicate,
  onDelete,
  formatDate,
  getStatusBadge
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
            {getStatusBadge(event.status)}
            <span className="text-sm px-2 py-1 bg-indigo-100 text-indigo-800 rounded">
              {event.category}
            </span>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-700">Date:</span>
              <p>{formatDate(event.start_date)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Location:</span>
              <p>{event.city || "Not specified"}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Capacity:</span>
              <p>{event.capacity === 0 ? "Unlimited" : `${event.available_spots} / ${event.capacity}`}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Price:</span>
              <p>{event.price === 0 ? "FREE" : `${event.price} ${event.currency}`}</p>
            </div>
          </div>
        </div>

        <Menu as="div" className="relative ml-4">
          <Menu.Button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </Menu.Button>

          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onView}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View Details
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onEdit}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Event
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onDuplicate}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                  >
                    <AiOutlineCopy className="w-4 h-4 mr-3" />
                    Duplicate Event
                  </button>
                )}
              </Menu.Item>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onViewAttendees}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    View Attendees
                  </button>
                )}
              </Menu.Item>

              <div className="border-t border-gray-100 my-1"></div>

              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={onDelete}
                    className={`${
                      active ? "bg-red-50" : ""
                    } flex items-center w-full px-4 py-2 text-sm text-red-600`}
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Event
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
    </div>
  )
}
