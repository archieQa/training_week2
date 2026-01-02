import React from "react"
import { Link } from "react-router-dom"
import { AiOutlineCalendar, AiOutlineUser } from "react-icons/ai"
import useStore from "@/services/store"

export default function Dashboard() {
  const { user } = useStore()

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Week 2: Shipping Quality Code</h1>
          <p className="text-sm text-gray-600 mt-1">Learn how to collaborate effectively and ship small, focused PRs in a team environment</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded font-medium">✅ Week 1 Complete</div>
        </div>
      </div>

      {/* Week 2: Collaboration & Tickets */}
      <div className="max-w-5xl">
        <div className="space-y-6">
          {/* MONDAY: Kickoff */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🚀</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-gray-900">MONDAY: Kickoff with your manager</h2>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">9am-1pm</span>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2 text-sm">Collaboration Patterns</h4>
                    <ul className="text-xs text-purple-800 space-y-1">
                      <li>• How to read tickets</li>
                      <li>• How to ask good questions</li>
                      <li>• Code review feedback</li>
                      <li>• When to ask vs research</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2 text-sm">Coding Mindset</h4>
                    <ul className="text-xs text-purple-800 space-y-1">
                      <li>• Ship small, ship often</li>
                      <li>• Self-review before submitting</li>
                      <li>• Test edge cases first</li>
                      <li>• Clarity over cleverness</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2 text-sm">Priorities</h4>
                    <ul className="text-xs text-purple-800 space-y-1">
                      <li>• Urgent vs Important</li>
                      <li>• Unblock others first</li>
                      <li>• Communicate delays early</li>
                      <li>• Realistic estimates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DAILY WORKFLOW */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-3xl">📅</span>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">TUE-FRI: Daily Workflow</h2>
                <p className="text-sm text-gray-600">Practice shipping quality code with real tickets</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="font-mono text-blue-600 font-bold">9:00am</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Standup</div>
                  <div className="text-gray-600 text-xs mt-1">Yesterday, Today, Blockers - be clear and concise</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="font-mono text-green-600 font-bold">9:15am-4pm</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Work on Tickets (3-4/day)</div>
                  <div className="text-gray-600 text-xs mt-1 space-y-1">
                    <div>• Start with 1-2 quick bugs (warm up)</div>
                    <div>• Each ticket = one focused PR (30min-1.5hrs)</div>
                    <div>• Ask questions after 30min if stuck</div>
                    <div>• Self-review + test before submitting</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="font-mono text-purple-600 font-bold">Throughout</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Submit PRs as you go</div>
                  <div className="text-gray-600 text-xs mt-1">Don't wait til end of day! Submit each ticket when done. Small PRs = fast reviews.</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="font-mono text-orange-600 font-bold">4:30pm</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Trainer Review</div>
                  <div className="text-gray-600 text-xs mt-1">Receive feedback, extract 1 improvement for next PR</div>
                </div>
              </div>
            </div>
          </div>

          {/* AVAILABLE TICKETS */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-3xl">🎫</span>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Available Tickets (Goal: 12-15 this week)</h2>
                <p className="text-sm text-gray-600">Each ticket = 30min-1.5hrs. Ship 3-4 tickets/day. One PR per ticket.</p>
                <div className="mt-2 flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-red-50 text-red-700 rounded">🐛 Bug = Something is broken, fix it</span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">✨ Feature = Build something new</span>
                  <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded">🔧 Refactor = Improve existing code</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* BUG FIXES */}
              <div>
                <h4 className="text-sm font-semibold text-red-700 mb-2">🐛 Bugs to Fix</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  <TicketCard
                    number="B01"
                    type="bug"
                    title="Event Page: The 'Edit' button never shows up, even when I'm the organizer of the event"
                    duration="45min"
                    complexity="Medium"
                  />
                  <TicketCard
                    number="B02"
                    type="bug"
                    title="Events Search: When I type in the search box or change category, I have to click 'Search' - it should update automatically"
                    duration="30min"
                    complexity="Easy"
                  />
                  <TicketCard
                    number="B03"
                    type="bug"
                    title="Event Page: All tabs look the same - I can't tell which one is currently selected"
                    duration="30min"
                    complexity="Easy"
                  />
                  <TicketCard
                    number="B04"
                    type="bug"
                    title="Create Event Modal: When I close the modal without submitting, then reopen it, my previous text is still there"
                    duration="30min"
                    complexity="Easy"
                  />
                  <TicketCard
                    number="B05"
                    type="bug"
                    title="Event Card: The progress bar shows the wrong percentage - text says '30/100 filled' but bar shows 70% full"
                    duration="30min"
                    complexity="Easy"
                  />
                  <TicketCard
                    number="B06"
                    type="bug"
                    title="Edit Event: I can set the end date to be before the start date and it saves without any error"
                    duration="45min"
                    complexity="Medium"
                  />
                </div>
              </div>

              {/* FEATURES */}
              <div>
                <h4 className="text-sm font-semibold text-blue-700 mb-2">✨ Features to Build</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  <TicketCard number="F01" type="feature" title="Display a 'SOLD OUT' badge or 'X spots left' on event cards" duration="45min" complexity="Easy" />
                  <TicketCard number="F02" type="feature" title="Add a 'Duplicate' button to create a new event from an existing one" duration="1h" complexity="Medium" />
                  <TicketCard number="F03" type="feature" title="Allow sorting the events list by date, price, or capacity" duration="1h30" complexity="Medium" />
                  <TicketCard number="F04" type="feature" title="Add quick filter buttons by category (clickable chips)" duration="1h" complexity="Medium" />
                  <TicketCard number="F05" type="feature" title="Display a 'Draft' or 'Published' badge on each event in My Events" duration="45min" complexity="Easy" />
                  <TicketCard number="F06" type="feature" title="Show the number of upcoming events on the user dashboard" duration="45min" complexity="Easy" />
                  <TicketCard number="F07" type="feature" title="Add a 'Reset' button to clear all filters at once" duration="30min" complexity="Easy" />
                </div>
              </div>

              {/* REFACTORING */}
              <div>
                <h4 className="text-sm font-semibold text-purple-700 mb-2">🔧 Refactoring Tasks</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  <TicketCard number="R01" type="refactor" title="Clean up my-events/index.jsx: the code is messy and hard to maintain" duration="1h30" complexity="Medium" />
                  <TicketCard number="R02" type="refactor" title="Extract EventCard into a reusable component (currently duplicated)" duration="1h" complexity="Medium" />
                  <TicketCard number="R03" type="refactor" title="Remove all console.log statements and commented/dead code from the project" duration="45min" complexity="Easy" />
                  <TicketCard number="R04" type="refactor" title="Add loading states to all action buttons" duration="1h" complexity="Easy" />
                  <TicketCard number="R05" type="refactor" title="Improve error messages: be more specific than 'An error occurred'" duration="1h" complexity="Medium" />
                </div>
              </div>

              {/* EDGE CASES */}
              <div>
                <h4 className="text-sm font-semibold text-orange-700 mb-2">⚠️ Edge Cases to Handle</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  <TicketCard number="E01" type="bug" title="The available spots display breaks when capacity = 0 (division by zero)" duration="30min" complexity="Easy" />
                  <TicketCard number="E02" type="bug" title="Event times display incorrectly for users in different timezones" duration="1h" complexity="Medium" />
                  <TicketCard number="E03" type="bug" title="No message is displayed when search returns no results" duration="30min" complexity="Easy" />
                  <TicketCard number="E04" type="bug" title="Very long event titles overflow their container and break the layout" duration="45min" complexity="Easy" />
                  <TicketCard number="E05" type="bug" title="The event card shows 'undefined' when venue or city is not set" duration="30min" complexity="Easy" />
                  <TicketCard number="E06" type="bug" title="Users can register for an event even after the registration deadline" duration="45min" complexity="Medium" />
                </div>
              </div>

              {/* COMMUNICATION TESTS */}
              <div>
                <h4 className="text-sm font-semibold text-pink-700 mb-2">💬 Communication Tests (ASK BEFORE CODING!)</h4>
                <div className="grid md:grid-cols-2 gap-2">
                  <TicketCard number="C01" type="feature" title="Add the ability to upload an image for an event" duration="???" complexity="???" />
                  <TicketCard number="C02" type="feature" title="Allow sharing an event on social media" duration="???" complexity="???" />
                  <TicketCard number="C03" type="feature" title="Export the attendee list as CSV or Excel" duration="???" complexity="???" />
                  <TicketCard number="C04" type="feature" title="Send a reminder email to attendees before the event" duration="???" complexity="???" />
                  <TicketCard number="C05" type="bug" title="Event search is very slow when there are many results" duration="???" complexity="???" />
                  <TicketCard number="C06" type="feature" title="Allow the organizer to set a registration deadline" duration="???" complexity="???" />
                </div>
                <div className="mt-2 p-3 bg-pink-50 border border-pink-200 rounded text-xs text-pink-800">
                  <p className="font-semibold mb-1">⚠️ These tickets are intentionally incomplete!</p>
                  <p>You MUST ask questions before starting: What format? What limits? What's the expected behavior? What edge cases?</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
              <p className="font-semibold text-yellow-900 mb-1">💡 Week 2 Strategy:</p>
              <p className="text-yellow-800 text-xs">
                Start each day with 1-2 bugs (quick wins), then tackle features/refactoring. Mix easy + medium tickets. Ask for help after 30min if stuck - don't waste time!
              </p>
            </div>
          </div>

          {/* WEEK 2 GATEKEEPER */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🚪</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Week 2 Gatekeeper: Collaboration & Quality</h3>
                <p className="text-sm text-gray-700 mb-3">To move to Week 3, you must demonstrate:</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-indigo-900 mb-2">Technical</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">✓</span>
                        <span>12-15 PRs merged (3-4/day)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">✓</span>
                        <span>Mix: bugs + features + refactoring</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">✓</span>
                        <span>Code quality consistent</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">✓</span>
                        <span>All PRs small & focused</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-900 mb-2">Collaboration</h4>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">✓</span>
                        <span>PRs are small, focused</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">✓</span>
                        <span>Good commit messages</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">✓</span>
                        <span>Self-reviews before submitting</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">✓</span>
                        <span>Asks when stuck (doesn't waste time)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">✓</span>
                        <span>Addresses feedback quickly</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">✓</span>
                        <span>Estimates improve over week</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-indigo-200 grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-red-700 mb-1">🚨 RED FLAGS (1-on-1 required):</p>
                    <p className="text-xs text-red-600">No commits 24hrs+, stuck 3+ days, missing standups, can't explain code</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-1">💡 FAST-TRACK:</p>
                    <p className="text-xs text-green-600">Finishes early, insightful questions, proactive, applies feedback immediately</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TicketCard({ number, type, title, duration, complexity }) {
  const typeConfig = {
    bug: { icon: "🐛", color: "border-red-200 bg-red-50 hover:border-red-300" },
    feature: { icon: "✨", color: "border-blue-200 bg-blue-50 hover:border-blue-300" },
    refactor: { icon: "🔧", color: "border-purple-200 bg-purple-50 hover:border-purple-300" }
  }

  const complexityColors = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Hard: "bg-red-100 text-red-700",
    "???": "bg-pink-100 text-pink-700"
  }

  const config = typeConfig[type] || typeConfig.feature

  return (
    <div className={`p-3 border-2 rounded-lg transition-colors ${config.color}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">{config.icon}</span>
          <span className="font-mono text-xs font-bold text-gray-700">#{number}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${complexityColors[complexity] || complexityColors["???"]}`}>{complexity}</span>
      </div>
      <div className="text-sm font-medium text-gray-900 mb-1">{title}</div>
      <div className="text-xs text-gray-500">⏱️ {duration}</div>
    </div>
  )
}
