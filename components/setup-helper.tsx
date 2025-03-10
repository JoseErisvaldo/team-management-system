"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function SetupHelper() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
  }>({})

  const setupDatabase = async () => {
    setIsLoading(true)
    setResult({})

    try {
      const response = await fetch("/api/setup-database")
      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message || "Banco de dados configurado com sucesso!",
        })
      } else {
        setResult({
          success: false,
          error: data.error || "Erro ao configurar banco de dados",
          message: data.message,
        })
      }
    } catch (error) {
      setResult({
        success: false,
        error: "Erro ao conectar com a API",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Configuração do Banco de Dados</CardTitle>
        <CardDescription>Configure a tabela "employees" no seu banco de dados Supabase</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm">
          Este assistente tentará criar a tabela "employees" e inserir dados de exemplo no seu banco de dados Supabase.
        </p>

        {result.success === true && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Sucesso!</AlertTitle>
            <AlertDescription className="text-green-700">{result.message}</AlertDescription>
          </Alert>
        )}

        {result.success === false && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Erro</AlertTitle>
            <AlertDescription className="text-red-700">
              {result.error}
              {result.message && <p className="mt-2 text-sm">{result.message}</p>}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-50 p-4 rounded-md text-sm">
          <p className="font-medium mb-2">Alternativa manual:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Acesse o painel do Supabase</li>
            <li>Vá para a seção "SQL Editor"</li>
            <li>Execute o script SQL que está no arquivo "setup-database.sql" deste projeto</li>
          </ol>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={setupDatabase} disabled={isLoading} className="w-full">
          {isLoading ? "Configurando..." : "Configurar Banco de Dados"}
        </Button>
      </CardFooter>
    </Card>
  )
}

