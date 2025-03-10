// Tipos para a estrutura organizacional
export type PerformanceStatus = "success" | "warning" | "danger"

export interface Period {
  id: string
  name: string
  startDate: Date
  endDate: Date
  isCurrent?: boolean
}

export interface TeamMember {
  id: string
  name: string
  position: string
  performance: number // 0-100 (percentual de atingimento)
  status: PerformanceStatus
  team?: string
  children?: TeamMember[]
  // Novos campos
  target?: number // Meta direta (apenas para operadores)
  achieved?: number // Valor alcançado (apenas para operadores)
  isCalculated?: boolean // Indica se o percentual é calculado com base nos subordinados
  targetPercentage?: number // Meta de percentual de atingimento para gestores (ex: 80%)
  expanded?: boolean // Para controlar a expansão na tabela
}

// Períodos disponíveis
export const availablePeriods: Period[] = [
  {
    id: "2024-11",
    name: "Novembro 2024",
    startDate: new Date(2024, 10, 1),
    endDate: new Date(2024, 10, 30),
    isCurrent: true,
  },
  {
    id: "2024-10",
    name: "Outubro 2024",
    startDate: new Date(2024, 9, 1),
    endDate: new Date(2024, 9, 31),
  },
  {
    id: "2024-09",
    name: "Setembro 2024",
    startDate: new Date(2024, 8, 1),
    endDate: new Date(2024, 8, 30),
  },
]

// Dados da organização
export const organizationData: TeamMember = {
  id: "1",
  name: "Ricardo Queiroz De Souza",
  position: "Diretor",
  performance: 87,
  status: "success",
  isCalculated: true,
  targetPercentage: 80,
  children: [
    {
      id: "2",
      name: "Amanda Diniz",
      position: "Gerente Corporativo",
      performance: 90,
      status: "success",
      team: "Corporativo",
      isCalculated: true,
      targetPercentage: 80,
      children: [
        {
          id: "6",
          name: "Carlos Mendes",
          position: "Coordenador",
          performance: 85,
          status: "success",
          team: "Corporativo",
          isCalculated: true,
          targetPercentage: 80,
          children: [
            {
              id: "10",
              name: "Juliana Silva",
              position: "Supervisor",
              performance: 82,
              status: "success",
              team: "Corporativo",
              isCalculated: true,
              targetPercentage: 80,
              children: [
                {
                  id: "15",
                  name: "Pedro Alves",
                  position: "Operador",
                  performance: 78,
                  status: "warning",
                  team: "Corporativo",
                  target: 100,
                  achieved: 78,
                  isCalculated: false,
                },
                {
                  id: "16",
                  name: "Mariana Costa",
                  position: "Operador",
                  performance: 92,
                  status: "success",
                  team: "Corporativo",
                  target: 100,
                  achieved: 92,
                  isCalculated: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "3",
      name: "Eliana Cristina",
      position: "Gerente Corporativo",
      performance: 84,
      status: "warning",
      team: "Corporativo",
      isCalculated: true,
      targetPercentage: 80,
      children: [
        {
          id: "7",
          name: "Fernanda Lopes",
          position: "Coordenador",
          performance: 79,
          status: "warning",
          team: "Corporativo",
          isCalculated: true,
          targetPercentage: 80,
          children: [
            {
              id: "11",
              name: "Roberto Dias",
              position: "Supervisor",
              performance: 75,
              status: "warning",
              team: "Corporativo",
              isCalculated: true,
              targetPercentage: 80,
              children: [
                {
                  id: "17",
                  name: "Ana Beatriz",
                  position: "Operador",
                  performance: 68,
                  status: "danger",
                  team: "Corporativo",
                  target: 100,
                  achieved: 68,
                  isCalculated: false,
                },
                {
                  id: "18",
                  name: "Lucas Ferreira",
                  position: "Operador",
                  performance: 72,
                  status: "warning",
                  team: "Corporativo",
                  target: 100,
                  achieved: 72,
                  isCalculated: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "4",
      name: "Rafael Garcia",
      position: "Gerente Operações",
      performance: 94,
      status: "success",
      team: "Operações",
      isCalculated: true,
      targetPercentage: 80,
      children: [
        {
          id: "8",
          name: "Tatiana Melo",
          position: "Coordenador",
          performance: 91,
          status: "success",
          team: "Operações",
          isCalculated: true,
          targetPercentage: 80,
          children: [
            {
              id: "12",
              name: "Gustavo Santos",
              position: "Supervisor",
              performance: 88,
              status: "success",
              team: "Operações",
              isCalculated: true,
              targetPercentage: 80,
              children: [
                {
                  id: "19",
                  name: "Camila Rocha",
                  position: "Operador",
                  performance: 86,
                  status: "success",
                  team: "Operações",
                  target: 100,
                  achieved: 86,
                  isCalculated: false,
                },
                {
                  id: "20",
                  name: "Diego Oliveira",
                  position: "Operador",
                  performance: 90,
                  status: "success",
                  team: "Operações",
                  target: 100,
                  achieved: 90,
                  isCalculated: false,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "5",
      name: "Rogério Ruiz",
      position: "Gerente Operações",
      performance: 62,
      status: "danger",
      team: "Operações",
      isCalculated: true,
      targetPercentage: 80,
      children: [
        {
          id: "9",
          name: "Marcelo Souza",
          position: "Coordenador",
          performance: 58,
          status: "danger",
          team: "Operações",
          isCalculated: true,
          targetPercentage: 80,
          children: [
            {
              id: "13",
              name: "Patrícia Lima",
              position: "Supervisor",
              performance: 55,
              status: "danger",
              team: "Operações",
              isCalculated: true,
              targetPercentage: 80,
              children: [
                {
                  id: "21",
                  name: "Fábio Martins",
                  position: "Operador",
                  performance: 50,
                  status: "danger",
                  team: "Operações",
                  target: 100,
                  achieved: 50,
                  isCalculated: false,
                },
                {
                  id: "22",
                  name: "Vanessa Cardoso",
                  position: "Operador",
                  performance: 60,
                  status: "danger",
                  team: "Operações",
                  target: 100,
                  achieved: 60,
                  isCalculated: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

// Função para obter a cor baseada no status de desempenho
export function getStatusColor(status: PerformanceStatus): string {
  switch (status) {
    case "success":
      return "#4CAF50" // Verde
    case "warning":
      return "#FFC107" // Amarelo
    case "danger":
      return "#F44336" // Vermelho
    default:
      return "#9E9E9E" // Cinza (neutro)
  }
}

// Função para obter a cor do time
export function getTeamColor(team?: string): string {
  switch (team) {
    case "Corporativo":
      return "#3498db" // Azul
    case "Operações":
      return "#e67e22" // Laranja
    case "Vendas":
      return "#9b59b6" // Roxo
    case "Suporte":
      return "#1abc9c" // Verde-água
    default:
      return "#95a5a6" // Cinza
  }
}

// Função para obter o status baseado na performance
export function getStatusFromPerformance(performance: number): PerformanceStatus {
  if (performance >= 80) return "success"
  if (performance >= 70) return "warning"
  return "danger"
}

// Função para calcular o percentual de atingimento de um gestor com base em seus subordinados
export function calculateManagerPerformance(member: TeamMember): number {
  if (!member.children || member.children.length === 0) {
    return member.performance
  }

  // Para gestores, calculamos a proporção de subordinados que atingiram a meta
  const targetPercentage = member.targetPercentage || 80 // Meta padrão de 80% se não especificada

  // Primeiro, precisamos encontrar os operadores finais (folhas da árvore)
  const findOperators = (node: TeamMember): TeamMember[] => {
    if (!node.children || node.children.length === 0) {
      return node.isCalculated ? [] : [node]
    }

    return node.children.flatMap(findOperators)
  }

  const operators = findOperators(member)

  if (operators.length === 0) {
    // Se não houver operadores subordinados, usamos a média dos gestores imediatos
    const totalPerformance = member.children.reduce((sum, child) => sum + child.performance, 0)
    return Math.round(totalPerformance / member.children.length)
  }

  // Contamos quantos operadores atingiram suas metas
  const successfulOperators = operators.filter((op) => op.performance >= 80).length

  // Calculamos a porcentagem de operadores que atingiram a meta
  const successRate = (successfulOperators / operators.length) * 100

  // Se atingiu a meta de porcentagem, o gestor tem 100% de atingimento
  // Caso contrário, o atingimento é proporcional à meta
  if (successRate >= targetPercentage) {
    return 100
  } else {
    // Regra: se não atingiu a meta, o atingimento é 0
    return 0

    // Alternativa: atingimento proporcional
    // return Math.round((successRate / targetPercentage) * 100)
  }
}

// Função para recalcular o desempenho de toda a hierarquia
export function recalculateHierarchyPerformance(data: TeamMember): TeamMember {
  // Cria uma cópia profunda para não modificar o original
  const result = JSON.parse(JSON.stringify(data)) as TeamMember

  // Função recursiva para atualizar o desempenho
  const updatePerformance = (member: TeamMember): void => {
    if (member.children && member.children.length > 0) {
      // Atualiza os filhos primeiro
      member.children.forEach(updatePerformance)

      // Se for um gestor (isCalculated = true), recalcula seu desempenho
      if (member.isCalculated) {
        // Para gestores, calculamos a proporção de subordinados que atingiram a meta
        const targetPercentage = member.targetPercentage || 80 // Meta padrão de 80% se não especificada

        // Primeiro, precisamos encontrar os operadores finais (folhas da árvore)
        const findOperators = (node: TeamMember): TeamMember[] => {
          if (!node.children || node.children.length === 0) {
            return node.isCalculated ? [] : [node]
          }

          return node.children.flatMap(findOperators)
        }

        const operators = findOperators(member)

        if (operators.length === 0) {
          // Se não houver operadores subordinados, usamos a média dos gestores imediatos
          const totalPerformance = member.children.reduce((sum, child) => sum + child.performance, 0)
          member.performance = Math.round(totalPerformance / member.children.length)
        } else {
          // Contamos quantos operadores atingiram suas metas
          const successfulOperators = operators.filter((op) => op.performance >= 80).length

          // Calculamos a porcentagem de operadores que atingiram a meta
          const successRate = (successfulOperators / operators.length) * 100

          // Se atingiu a meta de porcentagem, o gestor tem 100% de atingimento
          // Caso contrário, o atingimento é proporcional à meta
          if (successRate >= targetPercentage) {
            member.performance = 100
          } else {
            // Regra: se não atingiu a meta, o atingimento é 0
            member.performance = 0
          }
        }

        member.status = getStatusFromPerformance(member.performance)
      }
    }
  }

  updatePerformance(result)
  return result
}

