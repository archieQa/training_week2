import React, { useState } from "react"
import { Link } from "react-router-dom"
import { AiOutlineCalendar, AiOutlineEnvironment, AiOutlineUser, AiOutlineCopy, AiOutlineEye, AiOutlineEdit, AiOutlineUsergroupAdd, AiOutlineDelete } from "react-icons/ai"
import { HiDotsVertical } from "react-icons/hi"
import { Menu } from "@headlessui/react"
import Modal from "@/components/modal"
import api from "@/services/api"
import toast from "react-hot-toast"
import useStore from "@/services/store"

function EventAvailabilityBadge({ capacity, availableSpots }) {
  if (capacity <= 0) return null

  if (availableSpots === 0) {
    return (
      <span className="inline-block px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded">Sold out</span>
    )
  }
  return (
    <span className="inline-block px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded">Available spots: {availableSpots}</span>
  )
}

export default function EventCard({ event, onView, onEdit, onViewAttendees, onDuplicate, onDelete, formatDate, getStatusBadge }) {
  const hasMenuActions = !!onView
  const { user } = useStore()
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [registerName, setRegisterName] = useState(user?.name || "")
  const [registerEmail, setRegisterEmail] = useState(user?.email || "")
  const [registering, setRegistering] = useState(false)

  const defaultFormatDate = date => {
    if (!date) return ""
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const formatTime = date => {
    if (!date) return ""
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const dateFormatter = formatDate || defaultFormatDate

  const handleRegister = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!registerName.trim() || !registerEmail.trim()) {
      toast.error("Please provide both name and email")
      return
    }

    setRegistering(true)
    try {
      const { ok, data, code } = await api.post("/attendee/register", {
        event_id: event._id,
        name: registerName.trim(),
        email: registerEmail.trim(),
      })

      if (!ok) {
        const errorMessages = {
          ALREADY_REGISTERED: "You are already registered for this event",
          EVENT_FULL: "This event is full",
          EVENT_NOT_AVAILABLE: "This event is not available for registration",
          EVENT_ALREADY_STARTED: "This event has already started",
          REGISTRATION_CLOSED: "Registration deadline has passed",
        }
        toast.error(errorMessages[code] || "Failed to register for event")
        return
      }

      toast.success("Successfully registered! Check your email for confirmation.")
      setShowRegisterModal(false)
      setRegisterName(user?.name || "")
      setRegisterEmail(user?.email || "")
    } catch (error) {
      toast.error("Failed to register for event")
    } finally {
      setRegistering(false)
    }
  }

  const openRegisterModal = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error("Please sign in to register for events")
      return
    }
    setRegisterName(user.name || "")
    setRegisterEmail(user.email || "")
    setShowRegisterModal(true)
  }

  if (hasMenuActions) {
    return (
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 flex-1 min-w-0">{event.title}</h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                {getStatusBadge && getStatusBadge(event.status)}
                <span className="text-sm px-2 py-1 bg-indigo-100 text-indigo-800 rounded">
                  {event.category}
                </span>
              </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-700">Date:</span>
                <p>{dateFormatter(event.start_date)}</p>
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
              <HiDotsVertical className="w-5 h-5 text-gray-600" />
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
                      <AiOutlineEye className="w-4 h-4 mr-3" />
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
                      <AiOutlineEdit className="w-4 h-4 mr-3" />
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
                      <AiOutlineUsergroupAdd className="w-4 h-4 mr-3" />
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
                      <AiOutlineDelete className="w-4 h-4 mr-3" />
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

  return (
    <>
      <Link to={`/event/${event._id}`} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden block">
        {event.image_url && <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <span className="inline-block px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded">{event.category}</span>
            {event.capacity > 0 && event.available_spots === 0 ? ( 
              <span className="inline-block px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded">Sold out</span>
            ) : event.capacity > 0 ? (
              <span className="inline-block px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded">Available spots: {event.available_spots}</span>
            ): null }
            {event.price > 0 ? (
              <span className="text-sm font-bold text-gray-900">
                {event.price} {event.currency}
              </span>
            ) : (
              <span className="text-sm font-bold text-green-600">FREE</span>
            )}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>

          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <AiOutlineCalendar className="w-4 h-4 mr-2" />
              <span>
                {dateFormatter(event.start_date)} at {formatTime(event.start_date)}
              </span>
            </div>

            {event.venue && (
              <div className="flex items-center">
                <AiOutlineEnvironment className="w-4 h-4 mr-2" />
                <span className="line-clamp-1">
                  {event.venue}, {event.city}
                </span>
              </div>
            )}

            {event.organizer_name && (
              <div className="flex items-center">
                <AiOutlineUser className="w-4 h-4 mr-2" />
                <span className="line-clamp-1">By {event.organizer_name}</span>
              </div>
            )}

            {event.capacity > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Available spots</span>
                  <span className="text-xs font-semibold text-gray-900">
                    {event.capacity - event.available_spots} / {event.capacity}
                  </span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${((event.capacity - event.available_spots ) / event.capacity) * 100}%`  }}></div> 
                </div>
              </div>
            )}
          </div>

          {event.status === "published" && event.capacity > 0 && event.available_spots > 0 && new Date(event.start_date) > new Date() && (
            <button
              onClick={openRegisterModal}
              className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
            >
              Register Now
            </button>
          )}
        </div>
      </Link>

      <Modal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} className="max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Register for Event</h2>
          <p className="text-sm text-gray-600 mb-6">{event.title}</p>

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                disabled={registering}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={registering}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registering ? "Registering..." : "Confirm Registration"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}
