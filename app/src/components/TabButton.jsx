import React from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function TabButton({ to, children, className = "" }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <button
      onClick={() => navigate(to)}
      className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
        isActive
          ? "text-blue-600 border-blue-600"
          : "text-gray-600 hover:text-gray-900 border-transparent"
      } ${className}`}
    >
      {children}
    </button>
  )
}
