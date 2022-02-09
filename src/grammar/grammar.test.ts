import { Grammar } from "./grammar.ts";
import { Rule } from "./grammar.ts";
import { asserts } from "../../deps.ts";

const rules: Rule[] = [
    {variable: 'S', replacement: 'aXbY'},
    {variable: 'X', replacement: 'XX'},
    {variable: 'X', replacement: 'hello'},
    {variable: 'Y', replacement: 'YX'},
    {variable: 'Y', replacement: 't'},
    {variable: 'Y', replacement: ''}
];

const grammar = new Grammar(rules);

Deno.test('extracts variables', () => {
    asserts.assertEquals(grammar.startVariable, 'S');
    asserts.assertEquals([...grammar.variables], ['S', 'X', 'Y']);
    asserts.assertEquals(grammar.hasVariable('S'), true);
    asserts.assertEquals(grammar.hasVariable('Y'), true);
    asserts.assertEquals(grammar.hasVariable('Z'), false);
});

Deno.test('extracts terminals', () => {
    asserts.assertEquals([...grammar.terminals], ['a', 'b', 'h', 'e', 'l', 'o', 't']);
    asserts.assertEquals(grammar.hasTerminal('t'), true);
    asserts.assertEquals(grammar.hasTerminal('o'), true);
    asserts.assertEquals(grammar.hasTerminal(''), false);
    asserts.assertEquals(grammar.hasTerminal('x'), false);
});

Deno.test('getReplacements', () => {
    asserts.assertEquals(grammar.getReplacements('X'), ['XX', 'hello']);
    asserts.assertEquals(grammar.getReplacements('Y'), ['YX', 't', '']);
    asserts.assertEquals(grammar.getReplacements('Q'), []);
});