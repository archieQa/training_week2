import React, { useEffect, useState } from "react"
import { AiOutlineCalendar, AiOutlineFilter, AiOutlineDelete } from "react-icons/ai"
import { Link } from "react-router-dom"
import { AiOutlineCalendar, AiOutlineEnvironment, AiOutlineUser, AiOutlineFilter, AiOutlineDelete, AiOutlineInfoCircle } from "react-icons/ai"
import api from "@/services/api"
import toast from "react-hot-toast"
import EventCard from "@/scenes/events/components/EventCard"
import Loader from "@/components/loader"

export default function ListView() {
  const [allEvents, setAllEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [total, setTotal] = useState(0)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ 
    search: "", 
    category: "", 
    city: "",
    sort: "",
    direction: ""
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => { fetchEvents() }, 300) 
    return () => clearTimeout(timeoutId)
  }, [filters])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { ok, data, total } = await api.post("/event/search", {
        search: filters.search,
        category: filters.category,
        city: filters.city,
        sort: filters.sort,
        direction: filters.direction,
        per_page: 100,
        page: 1
      })

      if (!ok) throw new Error("Failed to fetch events")
      setAllEvents(data || [])
      setTotal(total || 0)
      setEvents(data || [])
    } catch (error) {
      toast.error("Could not load events")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = e => {
    e.preventDefault()
    fetchEvents()

  const applySort = () => {
    let sorted = [...allEvents]

    switch (sortBy) {
      case "latest_date":
        sorted.sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
        break
      case "earliest_date":
        sorted.sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
        break
      case "lowest_price":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "highest_price":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "biggest_capacity":
        sorted.sort((a, b) => b.capacity - a.capacity)
        break
      case "smallest_capacity":
        sorted.sort((a, b) => a.capacity - b.capacity)
        break
      default:
        break
    }

    setFilteredEvents(sorted)
  }

  const clearFilters = () => {
    setFilters({ search: "", category: "", city: "", sort: "", direction: "" })
  }

  const handleSortChange = (e) => {
    const value = e.target.value
    if (!value) {
      setFilters({ ...filters, sort: "", direction: "" })
      return
    }

    const sortMap = {
      "latest_date": { sort: "start_date", direction: "desc" },
      "earliest_date": { sort: "start_date", direction: "asc" },
      "lowest_price": { sort: "price", direction: "asc" },
      "highest_price": { sort: "price", direction: "desc" },
      "biggest_capacity": { sort: "capacity", direction: "desc" },
      "smallest_capacity": { sort: "capacity", direction: "asc" }
    }

    const sortConfig = sortMap[value]
    if (sortConfig) {
      setFilters({ ...filters, sort: sortConfig.sort, direction: sortConfig.direction })
    }
  }

  const getSortOptionValue = () => {
    if (!filters.sort || !filters.direction) return ""
    
    if (filters.sort === "start_date" && filters.direction === "desc") return "latest_date"
    if (filters.sort === "start_date" && filters.direction === "asc") return "earliest_date"
    if (filters.sort === "price" && filters.direction === "asc") return "lowest_price"
    if (filters.sort === "price" && filters.direction === "desc") return "highest_price"
    if (filters.sort === "capacity" && filters.direction === "desc") return "biggest_capacity"
    if (filters.sort === "capacity" && filters.direction === "asc") return "smallest_capacity"
    return ""
  }

  if (loading) {
    return (
      <Loader />
    )
  }

  return (
    <div>
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AiOutlineInfoCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Public Event Search</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                This page displays all <strong>published</strong> events happening in the future.
              </p>
              <p className="mt-1">
                Data comes from <code className="bg-blue-100 px-1 rounded">POST /event/search</code> endpoint.
              </p>
              <p className="mt-1">
                <strong>Public route:</strong> No authentication required - anyone can browse events.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow">
        {/* Search Inputs */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Event title, venue, or description..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                placeholder="Paris, Lyon..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={filters.city}
                onChange={e => setFilters({ ...filters, city: e.target.value })}
              />
            </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Event title, venue, or description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
        </form>

        {/* Actions: Search Button, Category Chips, Sort, Clear */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button 
              type="button"
              onClick={handleSearch}
              className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              Search Events
            </button>
            
            <div className="flex items-center gap-2 flex-wrap">
              <button 
                type="button"
                onClick={() => setFilters({ ...filters, category: "" })} 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.category === "" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilters({ ...filters, category: "conference" })}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.category === "conference" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Conference
              </button>
              <button
                type="button"
                onClick={() => setFilters({ ...filters, category: "workshop" })}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.category === "workshop" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Workshop
              </button>
              <button
                type="button"
                onClick={() => setFilters({ ...filters, category: "seminar" })}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.category === "seminar" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Seminar
              </button>
              <button
                type="button"
                onClick={() => setFilters({ ...filters, category: "networking" })}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.category === "networking" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Networking
              </button>
              <button
                type="button"
                onClick={() => setFilters({ ...filters, category: "social" })}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.category === "social" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Social
              </button>
              <button
                type="button"
                onClick={() => setFilters({ ...filters, category: "other" })}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filters.category === "other" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Other
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                className="px-4 py-2 pl-10 pr-8 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer transition-colors"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-4 py-2 pl-10 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                value={getSortOptionValue()}
                onChange={handleSortChange}
              >
                <option value="">Sort by...</option>
                <option value="latest_date">Latest Date</option>
                <option value="earliest_date">Earliest Date</option>
                <option value="lowest_price">Lowest Price</option>
                <option value="highest_price">Highest Price</option>
                <option value="biggest_capacity">Biggest Capacity</option>
                <option value="smallest_capacity">Smallest Capacity</option>
              </select>
              <AiOutlineFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              title="Clear all filters"
            >
              <AiOutlineDelete className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-4">
        Upcoming events: {total}
        Upcoming events: {events.length}
      </div>

      {/* Events List */}
      {events.length === 0 ? (

      <div className="text-sm text-gray-500 mb-4 pt-4">
        Upcoming events: {filteredEvents.length} !!!!!
      </div> 
      
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <AiOutlineCalendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-4">There are no upcoming events matching your criteria.</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>💡 Tip:</strong> You can create sample events using the seed script: <code className="bg-yellow-100 px-1 rounded">npm run seed</code> in the API folder.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
