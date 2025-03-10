"use client"

import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

interface CalendarGroup {
  name: string
  items: string[]
}

interface CalendarsProps {
  calendars: CalendarGroup[]
}

export function Calendars({ calendars }: CalendarsProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    calendars.reduce((acc, group) => ({ ...acc, [group.name]: true }), {}),
  )

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Calendários</h3>
      <div className="space-y-2">
        {calendars.map((group) => (
          <div key={group.name} className="space-y-1">
            <button
              className="flex w-full items-center justify-between text-sm hover:text-primary"
              onClick={() => toggleGroup(group.name)}
            >
              <span>{group.name}</span>
              {expandedGroups[group.name] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {expandedGroups[group.name] && (
              <div className="ml-4 space-y-1">
                {group.items.map((item) => (
                  <div key={item} className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

