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

Deno.test('x{0,2}bbc{0,1} should parse', () => {
    const root = parser.parse('x{0,2}bbc{0,1}');
    asserts.assertExists(root);
});

Deno.test('[kj]{0,2} should parse', () => {
    const root = parser.parse('[kj]{0,2}');
    asserts.assertExists(root);
});

Deno.test('(z){1,2} should parse', () => {
    const root = parser.parse('(z){1,2}');
    asserts.assertExists(root);
});

Deno.test('((xy){1,2}){2} should parse', () => {
    const root = parser.parse('((xy){1,2}){2}');
    asserts.assertExists(root);
});

Deno.test('(bc){2,3} should parse', () => {
    const root = parser.parse('(bc){2,3}');
    asserts.assertExists(root);
});

Deno.test('(bc){2,3} should parse', () => {
    const root = parser.parse('(bc){2,3}');
    asserts.assertExists(root);
});

Deno.test('(b{2}){1,2} should parse', () => {
    const root = parser.parse('(b{2}){1,2}');
    asserts.assertExists(root);
});

Deno.test('((ht){1,2}(gv){0,2}){2} should parse', () => {
    const root = parser.parse('((ht){1,2}(gv){0,2}){2}');
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

Deno.test('(b{2}){1,2 should NOT parse', () => {
    const root = parser.parse('(b{2}){1,2');
    asserts.assertEquals(root, null);
});