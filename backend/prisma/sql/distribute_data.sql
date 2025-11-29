-- Limpar tabelas de destino (opcional, para re-execução)
TRUNCATE TABLE alunos_regular_ei_ef9 RESTART IDENTITY;
TRUNCATE TABLE alunos_aee RESTART IDENTITY;
TRUNCATE TABLE alunos_eja RESTART IDENTITY;

-- 1. Povoar alunos_regular_ei_ef9
-- Regra: Ensino Fundamental 9 anos ou Educação Infantil, Situação ATIVO, RA Único
INSERT INTO alunos_regular_ei_ef9 (
  tipo_de_ensino, serie1, n_chamada, nome_aluno, ra, dig, uf, data_nasci, 
  data_inicial, data_fim, situacao, data_movimentacao, deficiencia, endereco, 
  pos_censo, genero, transporte, etnia, cod_turma, periodo, email_aluno, 
  ra_senha, telefone, nome_responsavel, turma, filtro_serie, cod_escola, 
  nome_escola, inep, letra_turma, letra_turno, tipo_32, turma_escola, prof1, 
  mais_info1, mais_info2, mais_info3, mais_info4, mais_info5, mais_info6, ra_uuid
)
SELECT DISTINCT ON (ra)
  tipo_de_ensino, serie1, n_chamada, nome_aluno, ra, dig, uf, data_nasci, 
  data_inicial, data_fim, situacao, data_movimentacao, deficiencia, endereco, 
  pos_censo, genero, transporte, etnia, cod_turma, periodo, email_aluno, 
  ra_senha, telefone, nome_responsavel, turma, filtro_serie, cod_escola, 
  nome_escola, inep, letra_turma, letra_turno, tipo_32, turma_escola, prof1, 
  mais_info1, mais_info2, mais_info3, mais_info4, mais_info5, mais_info6, ra_uuid
FROM alunos_integracao_all
WHERE 
  tipo_de_ensino IN ('ENSINO FUNDAMENTAL DE 9 ANOS', 'EDUCACAO INFANTIL')
  AND situacao = 'ATIVO'
ORDER BY ra, data_movimentacao DESC; -- Prioriza o registro mais recente se houver duplicidade (embora DISTINCT ON pegue o primeiro)

-- 2. Povoar alunos_aee
-- Regra: Atendimento Educacional Especializado, Situação ATIVO, RA Único
INSERT INTO alunos_aee (
  tipo_de_ensino, serie1, n_chamada, nome_aluno, ra, dig, uf, data_nasci, 
  data_inicial, data_fim, situacao, data_movimentacao, deficiencia, endereco, 
  pos_censo, genero, transporte, etnia, cod_turma, periodo, email_aluno, 
  ra_senha, telefone, nome_responsavel, turma, filtro_serie, cod_escola, 
  nome_escola, inep, letra_turma, letra_turno, tipo_32, turma_escola, prof1, 
  mais_info1, mais_info2, mais_info3, mais_info4, mais_info5, mais_info6, ra_uuid
)
SELECT DISTINCT ON (ra)
  tipo_de_ensino, serie1, n_chamada, nome_aluno, ra, dig, uf, data_nasci, 
  data_inicial, data_fim, situacao, data_movimentacao, deficiencia, endereco, 
  pos_censo, genero, transporte, etnia, cod_turma, periodo, email_aluno, 
  ra_senha, telefone, nome_responsavel, turma, filtro_serie, cod_escola, 
  nome_escola, inep, letra_turma, letra_turno, tipo_32, turma_escola, prof1, 
  mais_info1, mais_info2, mais_info3, mais_info4, mais_info5, mais_info6, ra_uuid
FROM alunos_integracao_all
WHERE 
  tipo_de_ensino = 'ATENDIMENTO EDUCACIONAL ESPECIALIZADO'
  AND situacao = 'ATIVO'
ORDER BY ra, data_movimentacao DESC;

-- 3. Povoar alunos_eja
-- Regra: EJA, RA Duplicado Permitido
INSERT INTO alunos_eja (
  tipo_de_ensino, serie1, n_chamada, nome_aluno, ra, dig, uf, data_nasci, 
  data_inicial, data_fim, situacao, data_movimentacao, deficiencia, endereco, 
  pos_censo, genero, transporte, etnia, cod_turma, periodo, email_aluno, 
  ra_senha, telefone, nome_responsavel, turma, filtro_serie, cod_escola, 
  nome_escola, inep, letra_turma, letra_turno, tipo_32, turma_escola, prof1, 
  mais_info1, mais_info2, mais_info3, mais_info4, mais_info5, mais_info6, ra_uuid
)
SELECT 
  tipo_de_ensino, serie1, n_chamada, nome_aluno, ra, dig, uf, data_nasci, 
  data_inicial, data_fim, situacao, data_movimentacao, deficiencia, endereco, 
  pos_censo, genero, transporte, etnia, cod_turma, periodo, email_aluno, 
  ra_senha, telefone, nome_responsavel, turma, filtro_serie, cod_escola, 
  nome_escola, inep, letra_turma, letra_turno, tipo_32, turma_escola, prof1, 
  mais_info1, mais_info2, mais_info3, mais_info4, mais_info5, mais_info6, ra_uuid
FROM alunos_integracao_all
WHERE 
  tipo_de_ensino IN ('EJA1A', 'EJA FUNDAMENTAL - ANOS INICIAIS')
  AND situacao = 'ATIVO'; -- Assumindo filtro ATIVO também para EJA, conforme sugestão
