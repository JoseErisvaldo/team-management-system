"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar } from "@/components/ui/avatar"
import { BarChart2, Calculator, ChevronDown, ChevronRight } from "lucide-react"
import type { TeamMember } from "@/lib/organization-data"

interface TeamTableProps {
  organizationData: TeamMember
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-green-500"
    case "warning":
      return "bg-yellow-500"
    case "danger":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export default function TeamTable({ organizationData }: TeamTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  // Função para alternar a expansão de uma linha
  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Função recursiva para renderizar a hierarquia
  const renderHierarchy = (member: TeamMember, level = 0) => {
    const isExpanded = expandedRows[member.id] || false
    const hasChildren = member.children && member.children.length > 0

    const rows = []

    // Renderizar a linha atual
    rows.push(
      <TableRow key={member.id} className={level > 0 ? "bg-gray-50/50" : ""}>
        <TableCell className="flex items-center">
          <div style={{ marginLeft: `${level * 20}px` }} className="flex items-center">
            {hasChildren && (
              <button onClick={() => toggleRowExpansion(member.id)} className="mr-2 p-1 rounded-full hover:bg-gray-200">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-6"></div>}
            <Avatar className="h-8 w-8 mr-2 bg-gray-200">
              <span className="text-xs">{member.name.charAt(0)}</span>
            </Avatar>
            {member.name}
          </div>
        </TableCell>
        <TableCell>{member.position}</TableCell>
        <TableCell>
          {member.isCalculated ? (
            <div className="flex items-center text-gray-500">
              <Calculator className="h-4 w-4 mr-1" />
              <span>Meta: {member.targetPercentage || 80}%</span>
            </div>
          ) : (
            <span>
              {member.achieved}/{member.target}
            </span>
          )}
        </TableCell>
        <TableCell>{member.performance}%</TableCell>
        <TableCell>{member.team || "Diretoria"}</TableCell>
        <TableCell>
          <div className="flex items-center">
            <div className={`h-4 w-4 rounded-full ${getStatusColor(member.status)} mr-2`}></div>
            <BarChart2 className="h-4 w-4 text-gray-400" />
          </div>
        </TableCell>
      </TableRow>,
    )

    // Se expandido e tem filhos, renderizar os filhos
    if (isExpanded && hasChildren) {
      member.children?.forEach((child) => {
        rows.push(...renderHierarchy(child, level + 1))
      })
    }

    return rows
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Nome</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead>Meta</TableHead>
          <TableHead>Atingimento</TableHead>
          <TableHead>Equipe</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{organizationData.children?.map((manager) => renderHierarchy(manager))}</TableBody>
    </Table>
  )
}

