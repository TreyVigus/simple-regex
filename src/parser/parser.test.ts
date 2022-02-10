import { asserts } from "../../deps.ts";
import { RegexParser } from "./parser.ts";

const parser = new RegexParser();

Deno.test('[k]{0,2} should parse', () => {
    const root = parser.parse('[k]{0,2}');
    asserts.assertExists(root);
});

Deno.test('h should parse', () => {
    const root = parser.parse('h');
    asserts.assertExists(root);
});

Deno.test('hello should parse', () => {
    const root = parser.parse('hello');
    asserts.assertExists(root);
});

Deno.test('h{3} should parse', () => {
    console.log('xxxxxxxxxxxx');
    const root = parser.parse('h{3}');
    asserts.assertExists(root);
});

Deno.test('h{1,2}b{1,3} should parse', () => {
    const root = parser.parse('h{1,2}b{1,3}');
    asserts.assertExists(root);
});

/** The following tests should NOT parse */
Deno.test('( should NOT parse', () => {
    const root = parser.parse('(');
    asserts.assertEquals(root, null);
});

Deno.test('() should NOT parse', () => {
    const root = parser.parse('()');
    asserts.assertEquals(root, null);
});

Deno.test('{1,2} should NOT parse', () => {
    const root = parser.parse('{1,2}');
    asserts.assertEquals(root, null);
});

Deno.test('h3} should NOT parse', () => {
    const root = parser.parse('h3}');
    asserts.assertEquals(root, null);
});

Deno.test('{h3} should NOT parse', () => {
    const root = parser.parse('{h3}');
    asserts.assertEquals(root, null);
});

Deno.test('1 should NOT parse', () => {
    const root = parser.parse('1');
    asserts.assertEquals(root, null);
});

Deno.test('{ should NOT parse', () => {
    const root = parser.parse('{');
    asserts.assertEquals(root, null);
});

Deno.test('R should NOT parse', () => {
    const root = parser.parse('R');
    asserts.assertEquals(root, null);
});