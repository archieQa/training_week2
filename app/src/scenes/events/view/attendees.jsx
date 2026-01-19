import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { AiOutlineUser } from "react-icons/ai"
import api from "@/services/api"
import { apiURL } from "@/config"
import toast from "react-hot-toast"
import Loader from "@/components/loader"
import { ATTENDEE_STATUS_BADGE_STYLES } from "@/utils/constants"

export default function AttendeesTab({ eventId }) {
  const { id } = useParams()
  const eventIdToUse = eventId || id
  const [attendees, setAttendees] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchAttendees()
  }, [eventIdToUse])

  const fetchAttendees = async () => {
    try {
      setLoading(true)
      const { ok, data, total } = await api.post(`/attendee/event/${eventIdToUse}`, {
        per_page: 100,
        page: 1,
      })

      if (!ok) throw new Error("Failed to fetch attendees")
      setAttendees(data || [])
      setTotal(total || 0)
    } catch (error) {
      toast.error("Could not load attendees")
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      const response = await fetch(`${apiURL}/attendee/event/${eventIdToUse}/export`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `JWT ${api.getToken()}`,
        },
      })

      if (!response.ok) throw new Error("Failed to export CSV")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `attendees-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("CSV exported successfully")
    } catch (error) {
      toast.error("Failed to export CSV")
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
      <div>
        <Loader />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Attendees</h2>
          <p className="text-sm text-gray-600 mt-1">Total: {total} registered</p>
        </div>
        {attendees.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </button>
        )}
      </div>

      {attendees.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <AiOutlineUser className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No attendees yet</h3>
          <p className="text-sm text-gray-600">No one has registered for this event yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendees.map(attendee => (
                  <tr key={attendee._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{attendee.name || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{attendee.email || "N/A"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">
                        {attendee.ticket_number || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(attendee.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(attendee.created_at)}</div>
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
