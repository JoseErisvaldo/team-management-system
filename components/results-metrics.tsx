"use client"
import type { TeamMember } from "@/lib/organization-data"
import { BarChart2, Target } from "lucide-react"

interface ResultsMetricsProps {
  organizationData: TeamMember
  periodName: string
}

// Função para calcular métricas de resultados
const calculateResultsMetrics = (member: TeamMember) => {
  let totalMembers = 0
  let successCount = 0
  let warningCount = 0
  let dangerCount = 0
  let totalTarget = 0
  let totalAchieved = 0
  let operatorCount = 0
  let managersWithFullPerformance = 0
  let totalManagers = 0

  // Função recursiva para calcular métricas
  const processMembers = (member: TeamMember) => {
    totalMembers++

    if (member.status === "success") {
      successCount++
    } else if (member.status === "warning") {
      warningCount++
    } else if (member.status === "danger") {
      dangerCount++
    }

    // Contabilizar metas e realizações apenas para operadores
    if (!member.isCalculated && member.target && member.achieved) {
      totalTarget += member.target
      totalAchieved += member.achieved
      operatorCount++
    }

    // Contabilizar gestores que atingiram 100% de performance
    if (member.isCalculated && member.children && member.children.length > 0) {
      totalManagers++
      if (member.performance === 100) {
        managersWithFullPerformance++
      }
    }

    if (member.children) {
      member.children.forEach(processMembers)
    }
  }

  // Iniciar cálculo a partir do diretor
  processMembers(member)

  // Calcular percentual de gestores que atingiram a meta
  const managerSuccessRate = totalManagers > 0 ? (managersWithFullPerformance / totalManagers) * 100 : 0

  // Calcular percentual geral de atingimento de metas para operadores
  const operatorSuccessRate = operatorCount > 0 ? (successCount / operatorCount) * 100 : 0

  return [
    {
      id: 1,
      label: "Operadores",
      value: `${operatorSuccessRate.toFixed(1)}%`,
      subValue: `${successCount} de ${operatorCount} atingiram meta`,
      icon: <Target className="h-5 w-5" />,
      color: "#3498db",
    },
    {
      id: 2,
      label: "Gestores",
      value: `${managerSuccessRate.toFixed(1)}%`,
      subValue: `${managersWithFullPerformance} de ${totalManagers} atingiram meta`,
      icon: <BarChart2 className="h-5 w-5" />,
      color: "#2ecc71",
    },
  ]
}

export default function ResultsMetrics({ organizationData, periodName }: ResultsMetricsProps) {
  const resultsData = calculateResultsMetrics(organizationData)

  return (
    <div>
      <div className="text-sm text-gray-500 mb-4">Período: {periodName}</div>
      <div className="grid grid-cols-2 gap-4">
        {resultsData.map((item) => (
          <div key={item.id} className="flex items-center">
            <div className="mr-3">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">{item.value}</p>
              <p className="text-xs text-gray-500">
                {item.label} <span className="block">{item.subValue}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

