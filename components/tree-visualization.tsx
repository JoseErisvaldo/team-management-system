"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { type TeamMember, getStatusColor, getTeamColor } from "@/lib/organization-data"

interface TreeVisualizationProps {
  zoomLevel: number
  organizationData: TeamMember
}

export default function TreeVisualization({ zoomLevel, organizationData }: TreeVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 500, height: 400 })
  const [hoveredMember, setHoveredMember] = useState<TeamMember | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Armazenar as posições dos nós para detecção de hover
  const [nodePositions, setNodePositions] = useState<
    Array<{
      member: TeamMember
      x: number
      y: number
      radius: number
    }>
  >([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Ajustar dimensões do canvas para o container
    const updateDimensions = () => {
      const container = canvas.parentElement
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  // Manipuladores de eventos para arrastar
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoomLevel
    const y = (e.clientY - rect.top) / zoomLevel

    setIsDragging(true)
    setDragStart({ x: x - offset.x, y: y - offset.y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoomLevel
    const y = (e.clientY - rect.top) / zoomLevel

    setMousePosition({ x, y })

    if (isDragging) {
      setOffset({
        x: x - dragStart.x,
        y: y - dragStart.y,
      })
    } else {
      // Verificar se o mouse está sobre algum nó
      let hoveredNode = null
      for (const node of nodePositions) {
        const distance = Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2))
        if (distance <= node.radius) {
          hoveredNode = node.member
          break
        }
      }
      setHoveredMember(hoveredNode)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Aplicar o zoom e offset
    ctx.save()
    ctx.scale(zoomLevel, zoomLevel)
    ctx.translate(offset.x, offset.y)

    // Centralizar a árvore
    const centerX = canvas.width / (2 * zoomLevel)
    const centerY = canvas.height / (3 * zoomLevel) // Movido mais para cima

    // Armazenar as posições dos nós para detecção de hover
    const positions: Array<{
      member: TeamMember
      x: number
      y: number
      radius: number
    }> = []

    // Desenhar o tronco principal
    drawTrunk(ctx, centerX, centerY)

    // Desenhar a hierarquia organizacional
    drawOrganizationTree(ctx, organizationData, centerX, centerY, positions)

    // Atualizar as posições dos nós
    setNodePositions(positions)

    // Desenhar tooltip se houver um membro em hover
    if (hoveredMember && !isDragging) {
      drawTooltip(ctx, hoveredMember, mousePosition.x - offset.x, mousePosition.y - offset.y)
    }

    ctx.restore()
  }, [zoomLevel, dimensions, hoveredMember, mousePosition, offset, isDragging, organizationData])

  // Função para desenhar o tronco principal
  const drawTrunk = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    const trunkHeight = 150
    const trunkWidth = 40

    // Desenhar base verde
    ctx.fillStyle = "#4CAF50"
    ctx.beginPath()
    ctx.rect(centerX - trunkWidth / 1.5, centerY + trunkHeight, trunkWidth * 1.3, trunkWidth / 3)
    ctx.fill()

    // Gradiente para o tronco
    const trunkGradient = ctx.createLinearGradient(centerX - trunkWidth / 2, centerY, centerX + trunkWidth / 2, centerY)
    trunkGradient.addColorStop(0, "#8B4513")
    trunkGradient.addColorStop(0.5, "#A0522D")
    trunkGradient.addColorStop(1, "#8B4513")

    ctx.fillStyle = trunkGradient

    // Desenhar o tronco como um retângulo mais reto
    ctx.beginPath()
    ctx.moveTo(centerX - trunkWidth / 2, centerY + trunkHeight)
    ctx.lineTo(centerX - trunkWidth / 2, centerY)
    ctx.lineTo(centerX + trunkWidth / 2, centerY)
    ctx.lineTo(centerX + trunkWidth / 2, centerY + trunkHeight)
    ctx.closePath()
    ctx.fill()

    // Adicionar textura ao tronco
    ctx.strokeStyle = "#5D4037"
    ctx.lineWidth = 1

    // Linhas horizontais para textura
    for (let i = 0; i < trunkHeight; i += 15) {
      ctx.beginPath()
      ctx.moveTo(centerX - trunkWidth / 2, centerY + i)
      ctx.lineTo(centerX + trunkWidth / 2, centerY + i)
      ctx.stroke()
    }
  }

  // Função para desenhar a árvore organizacional
  const drawOrganizationTree = (
    ctx: CanvasRenderingContext2D,
    member: TeamMember,
    x: number,
    y: number,
    positions: Array<{ member: TeamMember; x: number; y: number; radius: number }>,
    level = 0,
    branchAngle = 0,
    parentX = 0,
    parentY = 0,
  ) => {
    // Configurações baseadas no nível hierárquico
    const nodeRadius = 20 - level * 2.5
    const nodeColor = getStatusColor(member.status)
    const teamColor = getTeamColor(member.team)

    // Armazenar a posição do nó para detecção de hover
    positions.push({
      member,
      x,
      y,
      radius: nodeRadius,
    })

    // Desenhar o nó (pessoa)
    ctx.fillStyle = nodeColor
    ctx.beginPath()
    ctx.arc(x, y, nodeRadius, 0, Math.PI * 2)
    ctx.fill()

    // Adicionar borda ao nó
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Adicionar texto (iniciais)
    ctx.fillStyle = "#FFF"
    ctx.font = `${nodeRadius * 0.8}px Arial`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(member.name.charAt(0), x, y)

    // Desenhar galho conectando ao pai (exceto para o nó raiz)
    if (level > 0) {
      drawBranch(ctx, parentX, parentY, x, y, level, teamColor)
    }

    // Desenhar folhas ao redor do nó
    drawLeaves(ctx, x, y, nodeRadius, member.performance, member.status)

    // Desenhar indicador de meta para operadores
    if (!member.isCalculated) {
      drawTargetIndicator(ctx, x, y, nodeRadius, member)
    } else if (member.performance === 100) {
      // Indicador visual para gestores que atingiram 100%
      drawManagerSuccess(ctx, x, y, nodeRadius)
    }

    // Desenhar filhos recursivamente
    if (member.children && member.children.length > 0) {
      const childCount = member.children.length
      const angleStep = Math.PI / Math.max(childCount + 1, 4) // Aumentar o denominador para galhos mais próximos
      const baseAngle = -Math.PI / 2 + branchAngle
      const levelDistance = 70 - level * 10 // Reduzido de 100 para 70 para galhos mais curtos

      member.children.forEach((child, index) => {
        const angle = baseAngle + angleStep * (index + 1)
        const childX = x + Math.cos(angle) * levelDistance
        const childY = y + Math.sin(angle) * levelDistance

        drawOrganizationTree(ctx, child, childX, childY, positions, level + 1, angle, x, y)
      })
    }
  }

  // Função para desenhar um galho
  const drawBranch = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    level: number,
    teamColor: string,
  ) => {
    ctx.strokeStyle = teamColor
    ctx.lineWidth = 8 - level * 1.5 // Galhos mais grossos
    ctx.lineCap = "round"

    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
  }

  // Função para desenhar folhas ao redor de um nó
  const drawLeaves = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    nodeRadius: number,
    performance: number,
    status: string,
  ) => {
    const leafCount = Math.max(8, Math.floor(performance / 10))
    const leafRadius = nodeRadius * 0.8

    for (let i = 0; i < leafCount; i++) {
      const angle = (i / leafCount) * Math.PI * 2
      const distance = nodeRadius * 1.2
      const leafX = x + Math.cos(angle) * distance
      const leafY = y + Math.sin(angle) * distance

      // Desenhar folha circular
      ctx.fillStyle = getStatusColor(status)
      ctx.beginPath()
      ctx.arc(leafX, leafY, leafRadius / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Função para desenhar indicador de meta para operadores
  const drawTargetIndicator = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    nodeRadius: number,
    member: TeamMember,
  ) => {
    if (!member.target || !member.achieved) return

    const targetY = y - nodeRadius - 10
    const width = 30
    const height = 6

    // Fundo da barra de progresso
    ctx.fillStyle = "#e0e0e0"
    ctx.beginPath()
    ctx.roundRect(x - width / 2, targetY, width, height, 3)
    ctx.fill()

    // Progresso atual
    const progress = Math.min(member.achieved / member.target, 1)
    ctx.fillStyle = getStatusColor(member.status)
    ctx.beginPath()
    ctx.roundRect(x - width / 2, targetY, width * progress, height, 3)
    ctx.fill()

    // Texto da meta
    ctx.fillStyle = "#333"
    ctx.font = "8px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`${member.performance}%`, x, targetY - 3)
  }

  // Função para desenhar indicador de sucesso para gestores
  const drawManagerSuccess = (ctx: CanvasRenderingContext2D, x: number, y: number, nodeRadius: number) => {
    const starY = y - nodeRadius - 10

    // Desenhar uma estrela ou outro indicador de sucesso
    ctx.fillStyle = "#FFD700" // Dourado
    ctx.font = "10px Arial"
    ctx.textAlign = "center"
    ctx.fillText("★", x, starY)
  }

  // Função para desenhar tooltip
  const drawTooltip = (ctx: CanvasRenderingContext2D, member: TeamMember, x: number, y: number) => {
    const padding = 10
    const lineHeight = 20

    const lines = [
      member.name,
      member.position,
      `Equipe: ${member.team || "Diretoria"}`,
      `Atingimento: ${member.performance}%`,
    ]

    // Adicionar informações de meta para operadores
    if (!member.isCalculated && member.target && member.achieved) {
      lines.push(`Meta: ${member.target}`)
      lines.push(`Realizado: ${member.achieved}`)
    } else if (member.isCalculated) {
      lines.push(`Meta: ${member.targetPercentage || 80}% da equipe`)
      if (member.performance === 100) {
        lines.push("Meta atingida!")
      } else {
        lines.push("Meta não atingida")
      }
    }

    const maxLineWidth = Math.max(
      ...lines.map((line) => {
        ctx.font = "14px Arial"
        return ctx.measureText(line).width
      }),
    )

    const tooltipWidth = maxLineWidth + padding * 2
    const tooltipHeight = lines.length * lineHeight + padding * 2

    const tooltipX = x + 15
    const tooltipY = y - tooltipHeight / 2

    // Desenhar fundo do tooltip
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 5)
    ctx.fill()
    ctx.stroke()

    // Desenhar texto
    ctx.fillStyle = "#333"
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "left"
    ctx.textBaseline = "top"

    ctx.fillText(lines[0], tooltipX + padding, tooltipY + padding)

    ctx.font = "14px Arial"
    for (let i = 1; i < lines.length; i++) {
      ctx.fillText(lines[i], tooltipX + padding, tooltipY + padding + i * lineHeight)
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="transition-transform duration-300"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          cursor: isDragging ? "grabbing" : hoveredMember ? "pointer" : "grab",
        }}
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 px-3 py-1 rounded-full text-sm">
        Árvore de Produtividade
      </div>
      <div className="absolute top-4 left-4 bg-white/80 px-3 py-1 rounded-md text-xs">
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span>Concluído (≥80%)</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <span>Quase lá (70-79%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span>Ruim (&lt;70%)</span>
        </div>
      </div>
    </div>
  )
}

