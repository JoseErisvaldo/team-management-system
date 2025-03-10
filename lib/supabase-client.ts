import { createClient } from "@supabase/supabase-js"
import type { TeamMember, PerformanceStatus } from "@/lib/organization-data"

// Crie o cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
export const supabase = createClient(supabaseUrl, supabaseKey)

// Interface para os dados da Supabase
export interface EmployeeData {
  id: string
  name: string
  position: string
  performance: number
  parent_id: string | null
  team: string | null
}

// Função para converter dados da Supabase para a estrutura hierárquica
export async function fetchOrganizationData(): Promise<TeamMember | null> {
  try {
    // Buscar todos os funcionários
    const { data: employees, error } = await supabase.from("employees").select("*").order("id")

    if (error) {
      console.error("Erro ao buscar dados:", error)

      // Check if the error is about the missing table (42P01 is PostgreSQL's error code for "relation does not exist")
      if (error.code === "42P01") {
        console.warn("A tabela 'employees' não existe. Você precisa executar o script SQL para criar a tabela.")
        return null
      }

      return null
    }

    if (!employees || employees.length === 0) {
      console.error("Nenhum dado encontrado")
      return null
    }

    // Converter para o formato hierárquico
    return buildHierarchy(employees)
  } catch (error) {
    console.error("Erro ao processar dados:", error)
    return null
  }
}

// Função para determinar o status baseado na performance
function getStatusFromPerformance(performance: number): PerformanceStatus {
  if (performance >= 80) return "success"
  if (performance >= 70) return "warning"
  return "danger"
}

// Função para construir a hierarquia a partir dos dados planos
function buildHierarchy(employees: EmployeeData[]): TeamMember | null {
  // Mapa para armazenar nós por ID
  const map = new Map<string, TeamMember>()

  // Primeiro, criar todos os nós
  employees.forEach((emp) => {
    map.set(emp.id, {
      id: emp.id,
      name: emp.name,
      position: emp.position,
      performance: emp.performance,
      status: getStatusFromPerformance(emp.performance),
      team: emp.team || undefined,
      children: [],
    })
  })

  // Raiz da hierarquia
  let root: TeamMember | null = null

  // Construir a hierarquia
  employees.forEach((emp) => {
    const node = map.get(emp.id)

    if (!node) return

    if (emp.parent_id === null) {
      // Este é o nó raiz (diretor)
      root = node
    } else {
      // Este é um nó filho
      const parent = map.get(emp.parent_id)
      if (parent && parent.children) {
        parent.children.push(node)
      }
    }
  })

  return root
}

