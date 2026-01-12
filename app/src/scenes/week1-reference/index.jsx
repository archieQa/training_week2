import React, { useState } from "react"
import useStore from "@/services/store"

export default function Week1Reference() {
  const { user } = useStore()
  const [showArchitecture, setShowArchitecture] = useState(true)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Week 1 Reference</h1>
        <p className="text-sm text-gray-600 mt-1">Architecture patterns, what you built, and key learnings</p>
      </div>

      {/* Week 1 Review */}
      <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-green-900 mb-4">✅ Week 1: What You Built & Learned</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-900 mb-3">Built:</h4>
            <ul className="space-y-2 text-green-800 text-sm">
              <li>• Event module (model + controller + frontend)</li>
              <li>• Venue module (CRUD + search)</li>
              <li>• Google Calendar service</li>
              <li>• Calendar webhook</li>
              <li>• Event reminders cron</li>
              <li>• Cleanup script</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-green-900 mb-3">Learned:</h4>
            <ul className="space-y-2 text-green-800 text-sm">
              <li>• Controllers vs Services vs Webhooks vs Crons vs Scripts</li>
              <li>• POST /search pattern for filtering</li>
              <li>• MongoDB models and pagination</li>
              <li>• Security (req.user vs req.body)</li>
              <li>• React routing and state management</li>
            </ul>
          </div>
        </div>
      </div>

      {/* API Architecture */}
      <div className="mb-6">
        <button
          onClick={() => setShowArchitecture(!showArchitecture)}
          className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4"
        >
          <span>{showArchitecture ? "▼" : "▶"}</span>
          <span>Current API Architecture</span>
        </button>
        
        {showArchitecture && (
          <div className="grid grid-cols-2 gap-4">
            {/* Controllers */}
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-blue-400 font-semibold">controllers/</span>
                <span className="text-gray-500">HTTP endpoints</span>
              </div>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>event.js</span>
                  <span className="text-gray-600 ml-auto">POST /event/*</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>attendee.js</span>
                  <span className="text-gray-600 ml-auto">POST /attendee/*</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>user.js</span>
                  <span className="text-gray-600 ml-auto">POST /user/*</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>webhook.js</span>
                  <span className="text-gray-600 ml-auto">POST /webhook/*</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700 text-gray-500 text-xs">
                Frontend → API (HTTP)
              </div>
            </div>

            {/* Services */}
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-purple-400 font-semibold">services/</span>
                <span className="text-gray-500">External APIs</span>
              </div>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>googleCalendar.js</span>
                </div>
                <div className="pl-6 text-gray-600 text-xs">
                  Export events to Google
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700 text-gray-500 text-xs">
                API → External (Google, Stripe...)
              </div>
            </div>

            {/* Crons */}
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-yellow-400 font-semibold">cron/</span>
                <span className="text-gray-500">Scheduled jobs</span>
              </div>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>eventReminders.js</span>
                </div>
                <div className="pl-6 text-gray-600 text-xs">
                  Send reminders 24h before
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700 text-gray-500 text-xs">
                Time-triggered (automatic)
              </div>
            </div>

            {/* Scripts */}
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-orange-400 font-semibold">scripts/</span>
                <span className="text-gray-500">Manual CLI</span>
              </div>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>seed.js</span>
                  <span className="text-gray-600 ml-auto text-xs">npm run seed</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span>cleanupBadEvents.js</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700 text-gray-500 text-xs">
                Manual command (npm run)
              </div>
            </div>

            {/* Models */}
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs col-span-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-emerald-400 font-semibold">models/</span>
                <span className="text-gray-500">MongoDB schemas</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-gray-300">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400">✓</span>
                    <span>user.js</span>
                  </div>
                  <div className="pl-6 text-gray-600 text-xs">name, email, password</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400">✓</span>
                    <span>event.js</span>
                  </div>
                  <div className="pl-6 text-gray-600 text-xs">title, dates, capacity</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400">✓</span>
                    <span>attendee.js</span>
                  </div>
                  <div className="pl-6 text-gray-600 text-xs">event_id, user_id, status</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Git Workflow */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">🔀</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Git Workflow & Pull Requests</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-2">✅ DO:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• <strong>Fork first</strong> - work on your own copy</li>
                  <li>• <strong>One feature = One PR</strong></li>
                  <li>• <strong>Full-stack & working</strong> - Backend + Frontend, tested</li>
                  <li>• <strong>Self-contained</strong> - Each PR works independently</li>
                  <li>• <strong>Clear commits</strong> - <code className="bg-indigo-100 px-1 rounded">feat: add venue module</code></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">❌ DON'T:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Don't submit giant PRs with multiple features</li>
                  <li>• Don't submit incomplete features (only backend)</li>
                  <li>• Don't submit broken code or linter errors</li>
                  <li>• Don't mix unrelated changes in one PR</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

