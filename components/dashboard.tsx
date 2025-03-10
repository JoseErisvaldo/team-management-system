"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Search, ZoomIn, ZoomOut } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import TreeVisualization from "./tree-visualization"
import TeamDistribution from "./team-distribution"
import ResultsMetrics from "./results-metrics"
import TeamTable from "./team-table"
import {
  organizationData,
  availablePeriods,
  type TeamMember,
  type Period,
  recalculateHierarchyPerformance,
} from "@/lib/organization-data"
import { fetchOrganizationData } from "@/lib/supabase-client"
import { SetupHelper } from "./setup-helper"
import { PeriodSelector } from "./period-selector"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [orgData, setOrgData] = useState<TeamMember | null>(organizationData)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(
    availablePeriods.find((p) => p.isCurrent) || availablePeriods[0],
  )

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const data = await fetchOrganizationData()
        if (data) {
          // Recalcular o desempenho para garantir que os gestores tenham valores baseados em seus subordinados
          const recalculatedData = recalculateHierarchyPerformance(data)
          setOrgData(recalculatedData)
        } else {
          // If no data is returned, keep using the sample data
          console.log("Usando dados de exemplo porque a tabela não existe ou está vazia")
          setOrgData(organizationData)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        // Fall back to sample data on error
        setOrgData(organizationData)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Efeito para simular a mudança de dados quando o período muda
  useEffect(() => {
    if (orgData) {
      // Aqui você poderia buscar dados específicos para o período selecionado
      // Por enquanto, vamos apenas simular uma pequena variação nos dados

      // Cria uma cópia profunda dos dados
      const newData = JSON.parse(JSON.stringify(orgData)) as TeamMember

      // Função para ajustar aleatoriamente o desempenho dos operadores
      const adjustPerformance = (member: TeamMember) => {
        if (!member.isCalculated && member.target && member.achieved) {
          // Ajusta o desempenho dos operadores com uma variação de ±10%
          const variation = Math.random() * 20 - 10
          member.achieved = Math.max(0, Math.min(member.target, Math.round(member.achieved * (1 + variation / 100))))
          member.performance = Math.round((member.achieved / member.target) * 100)
          member.status = member.performance >= 80 ? "success" : member.performance >= 70 ? "warning" : "danger"
        }

        if (member.children) {
          member.children.forEach(adjustPerformance)
        }
      }

      // Não aplicamos a variação ao período atual
      if (!selectedPeriod.isCurrent) {
        adjustPerformance(newData)
        // Recalcula o desempenho dos gestores com base nos novos valores dos operadores
        const recalculatedData = recalculateHierarchyPerformance(newData)
        setOrgData(recalculatedData)
      }
    }
  }, [selectedPeriod])

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 1.5))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando dados da organização...</p>
        </div>
      </div>
    )
  }

  if (!orgData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <SetupHelper />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button className="flex items-center text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Árvore</span>
        </button>
        <div className="ml-auto flex items-center space-x-4">
          <PeriodSelector selectedPeriod={selectedPeriod} onPeriodChange={handlePeriodChange} />
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Pedro Souza</span>
            <Avatar className="h-8 w-8 bg-blue-500">
              <span className="text-xs font-medium text-white">PS</span>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Pesquisar"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-16 w-16 bg-blue-100 mb-2">
                  <span className="text-lg font-medium text-blue-600">{orgData.name.charAt(0)}</span>
                </Avatar>
                <h3 className="text-lg font-medium">{orgData.name}</h3>
                <p className="text-sm text-gray-500">{orgData.position}</p>
              </div>

              <Tabs defaultValue="hierarquia" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="hierarquia" className="flex-1">
                    HIERARQUIA
                  </TabsTrigger>
                  <TabsTrigger value="resultados" className="flex-1">
                    RESULTADOS
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="hierarquia" className="mt-4">
                  <div className="space-y-2">
                    {orgData.children?.map((manager) => (
                      <div key={manager.id} className="p-3 border rounded-md">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 bg-${manager.status === "success" ? "green" : manager.status === "warning" ? "yellow" : "red"}-500`}
                          ></div>
                          <span className="font-medium">{manager.name}</span>
                        </div>
                        <p className="text-sm text-gray-500 ml-5">{manager.position}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="resultados">
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="text-center">
                      <p className="text-lg font-medium">Desempenho Geral: {orgData.performance}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className={`h-2.5 rounded-full ${
                            orgData.status === "success"
                              ? "bg-green-500"
                              : orgData.status === "warning"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${orgData.performance}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Right Column - Tree Visualization */}
          <Card className="relative">
            <CardContent className="p-6 flex items-center justify-center h-[450px]">
              <div className="absolute top-4 right-4 flex space-x-2 z-10">
                <div className="flex items-center space-x-2 bg-white rounded-md shadow-sm p-1">
                  <button onClick={handleZoomIn} className="p-1 hover:bg-gray-100 rounded">
                    <ZoomIn className="h-5 w-5 text-gray-500" />
                  </button>
                  <button onClick={handleZoomOut} className="p-1 hover:bg-gray-100 rounded">
                    <ZoomOut className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <TreeVisualization zoomLevel={zoomLevel} organizationData={orgData} />
            </CardContent>
          </Card>
        </div>

        {/* Team Distribution and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                DISTRIBUIÇÃO DA EQUIPE
              </h3>
              <TeamDistribution organizationData={orgData} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">RESULTADOS</h3>
              <ResultsMetrics organizationData={orgData} periodName={selectedPeriod.name} />
            </CardContent>
          </Card>
        </div>

        {/* Team Table */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-medium">
                {orgData.name} / {orgData.position}
              </h3>
              <div className="ml-auto">
                <Tabs defaultValue="membros">
                  <TabsList>
                    <TabsTrigger value="membros">MEMBROS</TabsTrigger>
                    <TabsTrigger value="desempenho">DESEMPENHO</TabsTrigger>
                    <TabsTrigger value="simulador">SIMULADOR</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Pesquisar" className="pl-10" />
            </div>
            <TeamTable organizationData={orgData} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

