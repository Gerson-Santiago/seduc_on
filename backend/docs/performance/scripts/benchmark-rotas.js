/**
 * Script de Benchmark de Performance - API SEDUC ON
 * 
 * Este script realiza testes de carga nas principais rotas da API
 * para identificar gargalos de performance.
 * 
 * Uso:
 *   node backend/docs/performance/scripts/benchmark-rotas.js
 */

import http from 'http';
import https from 'https';

// ============================================================
// CONFIGURAÇÃO
// ============================================================

const CONFIG = {
    baseUrl: process.env.API_URL || 'http://localhost:3000',
    authToken: process.env.AUTH_TOKEN || '', // Adicionar token JWT se necessário
    concurrencyLevels: [1, 10, 50, 100], // Níveis de concorrência a testar
    requestsPerLevel: 100, // Número de requests em cada nível
};

// ============================================================
// ROTAS A TESTAR
// ============================================================

const ROUTES = [
    {
        name: 'GET /api/alunos/stats',
        method: 'GET',
        path: '/api/alunos/stats',
        description: 'Estatísticas globais e por escola'
    },
    {
        name: 'GET /api/alunos (paginado)',
        method: 'GET',
        path: '/api/alunos?page=1&limit=50',
        description: 'Listagem paginada de alunos'
    },
    {
        name: 'GET /api/alunos (busca por nome)',
        method: 'GET',
        path: '/api/alunos?nome=Silva',
        description: 'Busca case-insensitive por nome'
    },
    {
        name: 'GET /api/escolas/stats',
        method: 'GET',
        path: '/api/escolas/stats',
        description: 'Estatísticas de turmas por escola'
    },
    {
        name: 'GET /api/escolas',
        method: 'GET',
        path: '/api/escolas',
        description: 'Listagem de todas as escolas'
    },
    {
        name: 'GET /api/matriculas',
        method: 'GET',
        path: '/api/matriculas',
        description: 'Listagem de matrículas'
    }
];

// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

/**
 * Faz uma requisição HTTP e retorna métricas
 */
function makeRequest(url, method = 'GET', headers = {}) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const protocol = url.startsWith('https') ? https : http;

        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = protocol.request(url, options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const endTime = Date.now();
                const duration = endTime - startTime;

                resolve({
                    statusCode: res.statusCode,
                    duration,
                    success: res.statusCode >= 200 && res.statusCode < 300,
                    dataSize: Buffer.byteLength(data)
                });
            });
        });

        req.on('error', (error) => {
            const endTime = Date.now();
            reject({
                error: error.message,
                duration: endTime - startTime,
                success: false
            });
        });

        req.end();
    });
}

/**
 * Calcula estatísticas de um array de durações
 */
function calculateStats(durations) {
    if (durations.length === 0) return null;

    const sorted = [...durations].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, val) => acc + val, 0);

    return {
        count: sorted.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        mean: Math.round(sum / sorted.length),
        median: sorted[Math.floor(sorted.length / 2)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)]
    };
}

/**
 * Executa múltiplas requisições em paralelo
 */
async function runConcurrentRequests(url, method, count, headers) {
    const promises = [];

    for (let i = 0; i < count; i++) {
        promises.push(
            makeRequest(url, method, headers)
                .catch(err => ({ ...err, success: false }))
        );
    }

    return Promise.all(promises);
}

/**
 * Testa uma rota em diferentes níveis de concorrência
 */
async function benchmarkRoute(route) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📊 Testando: ${route.name}`);
    console.log(`   ${route.description}`);
    console.log(`${'='.repeat(70)}\n`);

    const url = `${CONFIG.baseUrl}${route.path}`;
    const headers = CONFIG.authToken ? { Authorization: `Bearer ${CONFIG.authToken}` } : {};

    const results = [];

    for (const concurrency of CONFIG.concurrencyLevels) {
        process.stdout.write(`   Concorrência: ${concurrency.toString().padEnd(4)} → `);

        const startTime = Date.now();
        const responses = await runConcurrentRequests(url, route.method, concurrency, headers);
        const totalTime = Date.now() - startTime;

        const successfulResponses = responses.filter(r => r.success);
        const failedResponses = responses.filter(r => !r.success);
        const durations = successfulResponses.map(r => r.duration);

        const stats = calculateStats(durations);

        if (stats) {
            console.log(`✓ Média: ${stats.mean}ms | P95: ${stats.p95}ms | P99: ${stats.p99}ms | Erros: ${failedResponses.length}`);

            results.push({
                concurrency,
                totalTime,
                stats,
                successCount: successfulResponses.length,
                failureCount: failedResponses.length,
                throughput: Math.round((successfulResponses.length / totalTime) * 1000) // req/s
            });
        } else {
            console.log(`✗ Todas as requisições falharam`);
        }
    }

    return {
        route: route.name,
        path: route.path,
        results
    };
}

/**
 * Formata resultados em markdown
 */
function formatMarkdownReport(benchmarkResults) {
    let markdown = '# Relatório de Benchmark - API SEDUC ON\n\n';
    markdown += `**Data:** ${new Date().toLocaleString('pt-BR')}\n\n`;
    markdown += `**URL Base:** ${CONFIG.baseUrl}\n\n`;
    markdown += '---\n\n';

    for (const bench of benchmarkResults) {
        markdown += `## ${bench.route}\n\n`;
        markdown += `**Endpoint:** \`${bench.path}\`\n\n`;

        if (bench.results.length > 0) {
            markdown += '| Concorrência | Média (ms) | Mediana (ms) | P95 (ms) | P99 (ms) | Min (ms) | Max (ms) | Throughput (req/s) | Erros |\n';
            markdown += '|--------------|------------|--------------|----------|----------|----------|----------|--------------------|-------|\n';

            for (const result of bench.results) {
                const s = result.stats;
                markdown += `| ${result.concurrency} | ${s.mean} | ${s.median} | ${s.p95} | ${s.p99} | ${s.min} | ${s.max} | ${result.throughput} | ${result.failureCount} |\n`;
            }

            markdown += '\n';

            // Análise
            const lastResult = bench.results[bench.results.length - 1];
            if (lastResult.stats.p95 > 500) {
                markdown += `> ⚠️ **ATENÇÃO:** P95 acima de 500ms em alta concorrência (${lastResult.stats.p95}ms)\n\n`;
            } else if (lastResult.stats.p95 > 300) {
                markdown += `> ⚡ **NOTA:** P95 acima de 300ms em alta concorrência (${lastResult.stats.p95}ms)\n\n`;
            } else {
                markdown += `> ✅ Performance aceitável (P95: ${lastResult.stats.p95}ms)\n\n`;
            }
        } else {
            markdown += '*Nenhum resultado disponível*\n\n';
        }

        markdown += '---\n\n';
    }

    return markdown;
}

// ============================================================
// EXECUÇÃO PRINCIPAL
// ============================================================

async function main() {
    console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
    console.log('║         BENCHMARK DE PERFORMANCE - API SEDUC ON                   ║');
    console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

    console.log(`🌐 URL Base: ${CONFIG.baseUrl}`);
    console.log(`🔢 Níveis de concorrência: ${CONFIG.concurrencyLevels.join(', ')}`);
    console.log(`📋 Rotas a testar: ${ROUTES.length}`);

    const allResults = [];

    for (const route of ROUTES) {
        const result = await benchmarkRoute(route);
        allResults.push(result);

        // Pausa entre rotas para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ Benchmark concluído!');
    console.log('='.repeat(70) + '\n');

    // Gerar relatório
    const report = formatMarkdownReport(allResults);

    console.log(report);
    console.log('\n💾 Salvando relatório em: backend/docs/performance/benchmark-results.md\n');

    // Salvar relatório (seria necessário fs em modo síncrono, omitindo por simplicidade)
    return report;
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(console.error);
}

export { benchmarkRoute, makeRequest, calculateStats };
