import { describe, test, expect } from '@jest/globals';
import { converterData, converterIntSeguro, sanitizarTexto } from '../../src/utils/formatters.js';

describe('Utilitários: formatadores', () => {

    describe('sanitizarTexto', () => {
        test('deve remover espaços extras e aparar as pontas', () => {
            expect(sanitizarTexto('  Teste   de   String  ')).toBe('Teste de String');
        });

        test('deve retornar null para strings vazias ou apenas espaços', () => {
            expect(sanitizarTexto('')).toBeNull();
            expect(sanitizarTexto('   ')).toBeNull();
        });

        test('deve lidar com entradas não-string convertendo para string', () => {
            expect(sanitizarTexto(123)).toBe("123");
        });

        test('deve retornar null para null/undefined', () => {
            expect(sanitizarTexto(null)).toBeNull();
            expect(sanitizarTexto(undefined)).toBeNull();
        });
    });

    describe('converterIntSeguro', () => {
        test('deve converter strings numéricas válidas', () => {
            expect(converterIntSeguro('123')).toBe(123);
        });

        test('deve retornar null para strings não numéricas', () => {
            expect(converterIntSeguro('abc')).toBeNull();
        });

        test('deve retornar null para null/undefined', () => {
            expect(converterIntSeguro(null)).toBeNull();
            expect(converterIntSeguro(undefined)).toBeNull();
        });
    });

    describe('converterData', () => {
        test('deve converter DD/MM/YYYY para objeto Date', () => {
            const data = converterData('31/12/2023');
            expect(data).toBeInstanceOf(Date);
            expect(data.getFullYear()).toBe(2023);
            expect(data.getMonth()).toBe(11); // Mês é indexado em 0
            expect(data.getDate()).toBe(31);
        });

        test('deve retornar null para formatos inválidos', () => {
            expect(converterData('2023-12-31')).toBeNull();
            expect(converterData('31/13/2023')).toBeNull(); // Mês 13
            expect(converterData('ab/cd/efgh')).toBeNull();
        });

        test('deve retornar null para anos fora do intervalo', () => {
            expect(converterData('01/01/1800')).toBeNull();
        });
    });

});
