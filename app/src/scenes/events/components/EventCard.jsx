import React from "react"
import { Link } from "react-router-dom"
import { AiOutlineCalendar, AiOutlineEnvironment, AiOutlineUser, AiOutlineCopy } from "react-icons/ai"
import { Menu } from "@headlessui/react"

export default function EventCard({
  event,
  onView,
  onEdit,
  onViewAttendees,
  onDuplicate,
  onDelete,
  formatDate,
  getStatusBadge
}) {
  const hasMenuActions = !!onView

  const defaultFormatDate = date => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const formatTime = date => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const dateFormatter = formatDate || defaultFormatDate

  if (hasMenuActions) {
    return (
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
              {getStatusBadge && getStatusBadge(event.status)}
              <span className="text-sm px-2 py-1 bg-indigo-100 text-indigo-800 rounded">
                {event.category}
              </span>
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

  return (
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
      </div>
    </Link>
  )
}
