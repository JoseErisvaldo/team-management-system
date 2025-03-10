"use client"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { availablePeriods, type Period } from "@/lib/organization-data"

interface PeriodSelectorProps {
  selectedPeriod: Period
  onPeriodChange: (period: Period) => void
}

export function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
  return (
    <div className="flex items-center">
      <span className="text-sm text-gray-500 mr-2">Período:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-1">
            {selectedPeriod.name}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {availablePeriods.map((period) => (
            <DropdownMenuItem
              key={period.id}
              onClick={() => onPeriodChange(period)}
              className={period.id === selectedPeriod.id ? "bg-muted" : ""}
            >
              {period.name}
              {period.isCurrent && <span className="ml-2 text-xs text-green-500">(Atual)</span>}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

