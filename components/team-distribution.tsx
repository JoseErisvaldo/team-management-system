"use client"
import type { TeamMember } from "@/lib/organization-data"

interface TeamDistributionProps {
  organizationData: TeamMember
}

// Função para calcular a distribuição da equipe por departamento
const calculateTeamDistribution = (member: TeamMember) => {
  const distribution: Record<string, { count: number; percentage: number }> = {}
  let totalCount = 0

  // Função recursiva para contar membros por departamento
  const countMembers = (member: TeamMember) => {
    const team = member.team || "Diretoria"

    if (!distribution[team]) {
      distribution[team] = { count: 0, percentage: 0 }
    }

    distribution[team].count++
    totalCount++

    if (member.children) {
      member.children.forEach(countMembers)
    }
  }

  // Iniciar contagem a partir dos filhos do diretor
  if (member.children) {
    member.children.forEach(countMembers)
  }

  // Calcular percentagens
  Object.keys(distribution).forEach((team) => {
    distribution[team].percentage = (distribution[team].count / totalCount) * 100
  })

  return Object.entries(distribution).map(([team, data]) => ({
    id: team,
    label: team,
    percentage: data.percentage,
    count: data.count,
    color: getTeamColor(team),
  }))
}

// Função para obter a cor do time
const getTeamColor = (team: string): string => {
  switch (team) {
    case "Corporativo":
      return "#3498db" // Azul
    case "Operações":
      return "#e74c3c" // Vermelho
    case "Vendas":
      return "#f1c40f" // Amarelo
    case "Suporte":
      return "#2ecc71" // Verde
    case "Diretoria":
      return "#9b59b6" // Roxo
    default:
      return "#95a5a6" // Cinza
  }
}

export default function TeamDistribution({ organizationData }: TeamDistributionProps) {
  const teamDistribution = calculateTeamDistribution(organizationData)

  return (
    <div className="grid grid-cols-4 gap-4">
      {teamDistribution.map((item) => (
        <div key={item.id} className="flex items-center">
          <div className="mr-3">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: item.color }}
            >
              <span className="text-xs">{item.percentage.toFixed(1)}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">{item.count} pessoas</p>
            <p className="text-xs text-gray-500">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

