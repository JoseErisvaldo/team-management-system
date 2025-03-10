-- Criar a tabela employees
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  performance INTEGER NOT NULL CHECK (performance >= 0 AND performance <= 100),
  parent_id UUID REFERENCES employees(id),
  team TEXT,
  target INTEGER,
  achieved INTEGER,
  is_calculated BOOLEAN DEFAULT FALSE
);

-- Inserir dados de exemplo
INSERT INTO employees (id, name, position, performance, parent_id, team, is_calculated) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Ricardo Queiroz De Souza', 'Diretor', 87, NULL, NULL, TRUE);

-- Gerentes
INSERT INTO employees (id, name, position, performance, parent_id, team, is_calculated) VALUES
  ('00000000-0000-0000-0000-000000000002', 'Amanda Diniz', 'Gerente Corporativo', 90, '00000000-0000-0000-0000-000000000001', 'Corporativo', TRUE),
  ('00000000-0000-0000-0000-000000000003', 'Eliana Cristina', 'Gerente Corporativo', 84, '00000000-0000-0000-0000-000000000001', 'Corporativo', TRUE),
  ('00000000-0000-0000-0000-000000000004', 'Rafael Garcia', 'Gerente Operações', 94, '00000000-0000-0000-0000-000000000001', 'Operações', TRUE),
  ('00000000-0000-0000-0000-000000000005', 'Rogério Ruiz', 'Gerente Operações', 62, '00000000-0000-0000-0000-000000000001', 'Operações', TRUE);

-- Coordenadores
INSERT INTO employees (id, name, position, performance, parent_id, team, is_calculated) VALUES
  ('00000000-0000-0000-0000-000000000006', 'Carlos Mendes', 'Coordenador', 85, '00000000-0000-0000-0000-000000000002', 'Corporativo', TRUE),
  ('00000000-0000-0000-0000-000000000007', 'Fernanda Lopes', 'Coordenador', 79, '00000000-0000-0000-0000-000000000003', 'Corporativo', TRUE),
  ('00000000-0000-0000-0000-000000000008', 'Tatiana Melo', 'Coordenador', 91, '00000000-0000-0000-0000-000000000004', 'Operações', TRUE),
  ('00000000-0000-0000-0000-000000000009', 'Marcelo Souza', 'Coordenador', 58, '00000000-0000-0000-0000-000000000005', 'Operações', TRUE);

-- Supervisores
INSERT INTO employees (id, name, position, performance, parent_id, team, is_calculated) VALUES
  ('00000000-0000-0000-0000-000000000010', 'Juliana Silva', 'Supervisor', 82, '00000000-0000-0000-0000-000000000006', 'Corporativo', TRUE),
  ('00000000-0000-0000-0000-000000000011', 'Roberto Dias', 'Supervisor', 75, '00000000-0000-0000-0000-000000000007', 'Corporativo', TRUE),
  ('00000000-0000-0000-0000-000000000012', 'Gustavo Santos', 'Supervisor', 88, '00000000-0000-0000-0000-000000000008', 'Operações', TRUE),
  ('00000000-0000-0000-0000-000000000013', 'Patrícia Lima', 'Supervisor', 55, '00000000-0000-0000-0000-000000000009', 'Operações', TRUE);

-- Operadores
INSERT INTO employees (id, name, position, performance, parent_id, team, target, achieved, is_calculated) VALUES
  ('00000000-0000-0000-0000-000000000015', 'Pedro Alves', 'Operador', 78, '00000000-0000-0000-0000-000000000010', 'Corporativo', 100, 78, FALSE),
  ('00000000-0000-0000-0000-000000000016', 'Mariana Costa', 'Operador', 92, '00000000-0000-0000-0000-000000000010', 'Corporativo', 100, 92, FALSE),
  ('00000000-0000-0000-0000-000000000017', 'Ana Beatriz', 'Operador', 68, '00000000-0000-0000-0000-000000000011', 'Corporativo', 100, 68, FALSE),
  ('00000000-0000-0000-0000-000000000018', 'Lucas Ferreira', 'Operador', 72, '00000000-0000-0000-0000-000000000011', 'Corporativo', 100, 72, FALSE),
  ('00000000-0000-0000-0000-000000000019', 'Camila Rocha', 'Operador', 86, '00000000-0000-0000-0000-000000000012', 'Operações', 100, 86, FALSE),
  ('00000000-0000-0000-0000-000000000020', 'Diego Oliveira', 'Operador', 90, '00000000-0000-0000-0000-000000000012', 'Operações', 100, 90, FALSE),
  ('00000000-0000-0000-0000-000000000021', 'Fábio Martins', 'Operador', 50, '00000000-0000-0000-0000-000000000013', 'Operações', 100, 50, FALSE),
  ('00000000-0000-0000-0000-000000000022', 'Vanessa Cardoso', 'Operador', 60, '00000000-0000-0000-0000-000000000013', 'Operações', 100, 60, FALSE);

-- Configurar políticas de segurança (RLS)
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura anônima
CREATE POLICY "Allow anonymous read access" 
  ON employees FOR SELECT 
  USING (true);

-- Criar tabela para períodos
CREATE TABLE IF NOT EXISTS periods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT FALSE
);

-- Inserir períodos de exemplo
INSERT INTO periods (id, name, start_date, end_date, is_current) VALUES
  ('2024-11', 'Novembro 2024', '2024-11-01', '2024-11-30', TRUE),
  ('2024-10', 'Outubro 2024', '2024-10-01', '2024-10-31', FALSE),
  ('2024-09', 'Setembro 2024', '2024-09-01', '2024-09-30', FALSE);

-- Criar tabela para resultados por período
CREATE TABLE IF NOT EXISTS period_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  period_id TEXT REFERENCES periods(id),
  employee_id UUID REFERENCES employees(id),
  target INTEGER,
  achieved INTEGER,
  performance INTEGER,
  UNIQUE(period_id, employee_id)
);

-- Inserir alguns resultados de exemplo para o período atual
INSERT INTO period_results (period_id, employee_id, target, achieved, performance) VALUES
  ('2024-11', '00000000-0000-0000-0000-000000000015', 100, 78, 78),
  ('2024-11', '00000000-0000-0000-0000-000000000016', 100, 92, 92),
  ('2024-11', '00000000-0000-0000-0000-000000000017', 100, 68, 68),
  ('2024-11', '00000000-0000-0000-0000-000000000018', 100, 72, 72),
  ('2024-11', '00000000-0000-0000-0000-000000000019', 100, 86, 86),
  ('2024-11', '00000000-0000-0000-0000-000000000020', 100, 90, 90),
  ('2024-11', '00000000-0000-0000-0000-000000000021', 100, 50, 50),
  ('2024-11', '00000000-0000-0000-0000-000000000022', 100, 60, 60);

-- Inserir alguns resultados de exemplo para períodos anteriores
INSERT INTO period_results (period_id, employee_id, target, achieved, performance) VALUES
  ('2024-10', '00000000-0000-0000-0000-000000000015', 100, 82, 82),
  ('2024-10', '00000000-0000-0000-0000-000000000016', 100, 88, 88),
  ('2024-10', '00000000-0000-0000-0000-000000000017', 100, 75, 75),
  ('2024-10', '00000000-0000-0000-0000-000000000018', 100, 70, 70),
  ('2024-10', '00000000-0000-0000-0000-000000000019', 100, 90, 90),
  ('2024-10', '00000000-0000-0000-0000-000000000020', 100, 85, 85),
  ('2024-10', '00000000-0000-0000-0000-000000000021', 100, 55, 55),
  ('2024-10', '00000000-0000-0000-0

