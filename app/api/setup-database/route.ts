import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the SQL file
    const sqlFilePath = path.join(process.cwd(), "setup-database.sql")

    if (!fs.existsSync(sqlFilePath)) {
      return NextResponse.json({ error: "Arquivo SQL não encontrado" }, { status: 404 })
    }

    const sqlContent = fs.readFileSync(sqlFilePath, "utf8")

    // Execute the SQL
    const { error } = await supabase.rpc("exec_sql", { sql: sqlContent })

    if (error) {
      return NextResponse.json(
        {
          error: "Erro ao executar SQL",
          details: error.message,
          message: "Você pode precisar executar o SQL manualmente no painel do Supabase.",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Banco de dados configurado com sucesso!",
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: errorMessage,
        message: "Você pode precisar executar o SQL manualmente no painel do Supabase.",
      },
      { status: 500 },
    )
  }
}

