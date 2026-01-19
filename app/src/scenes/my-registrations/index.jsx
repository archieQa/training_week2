import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AiOutlineCalendar } from "react-icons/ai"
import api from "@/services/api"
import toast from "react-hot-toast"
import Loader from "@/components/loader"
import { ATTENDEE_STATUS_BADGE_STYLES } from "@/utils/constants"

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      setLoading(true)
      const { ok, data, total } = await api.post("/attendee/my-registrations/search", {
        per_page: 50,
        page: 1,
      })

      if (!ok) throw new Error("Failed to fetch registrations")
      setRegistrations(data || [])
      setTotal(total || 0)
    } catch (error) {
      toast.error("Could not load registrations")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (registrationId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your registration for "${eventTitle}"?`)) {
      return
    }

    try {
      const { ok } = await api.delete(`/attendee/${registrationId}`)
      if (!ok) throw new Error("Failed to cancel registration")

      toast.success("Registration cancelled successfully")
      fetchRegistrations()
    } catch (error) {
      toast.error("Failed to cancel registration")
    }
  }

  const formatDate = date => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = status => {
    const style = ATTENDEE_STATUS_BADGE_STYLES[status] || ATTENDEE_STATUS_BADGE_STYLES.pending
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${style}`}>
        {status ? status.toUpperCase() : "PENDING"}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="p-8">
        <Loader />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Registrations</h1>
        <p className="text-gray-600 mt-2">Events you've registered for</p>
      </div>

      {registrations.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <AiOutlineCalendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations yet</h3>
          <p className="text-gray-600 mb-4">You haven't registered for any events.</p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {registrations.map(registration => (
                  <tr key={registration._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {registration.event_title || "Unknown Event"}
                      </div>
                      {registration.event_venue && (
                        <div className="text-sm text-gray-500">{registration.event_venue}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {registration.event_start_date ? formatDate(registration.event_start_date) : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(registration.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {registration.ticket_number || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(registration.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {registration.status !== "cancelled" && (
                        <button
                          onClick={() => handleCancel(registration._id, registration.event_title)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      )}
                      {registration.status === "cancelled" && (
                        <span className="text-gray-400">Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
