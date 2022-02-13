import { asserts } from "../../deps.ts";
import { ParseNode, RegexParser } from "./parser.ts";

const parser = new RegexParser();

function getLeafValues(root: ParseNode, leafValues: string[]) {
    if(root.children) {
        root.children.forEach(child => {
            getLeafValues(child, leafValues);
        });
    } else {
        leafValues.push(root.value);
    }
}

Deno.test('[k]{0,2} should parse', () => {
    const root = parser.parse('[k]{0,2}');
    asserts.assertExists(root);
    const leafValues: string[] = [];
    getLeafValues(root, leafValues);
    asserts.assertEquals('[k]{0,2}', leafValues.join(''));
});

Deno.test('[oz] should parse', () => {
    const root = parser.parse('[oz]');
    asserts.assertExists(root);
    const leafValues: string[] = [];
    getLeafValues(root, leafValues);
    asserts.assertEquals('[oz]', leafValues.join(''));
});

Deno.test('h should parse', () => {
    const root = parser.parse('h');
    asserts.assertExists(root);
    const leafValues: string[] = [];
    getLeafValues(root, leafValues);
    asserts.assertEquals('h', leafValues.join(''));
});

Deno.test('hello should parse', () => {
    const root = parser.parse('hello');
    asserts.assertExists(root);
    const leafValues: string[] = [];
    getLeafValues(root, leafValues);
    asserts.assertEquals('hello', leafValues.join(''));
});

Deno.test('h{3} should parse', () => {
    const root = parser.parse('h{3}');
    asserts.assertExists(root);
    const leafValues: string[] = [];
    getLeafValues(root, leafValues);
    asserts.assertEquals('h{3}', leafValues.join(''));
});

Deno.test('h{1,2}b{1,3} should parse', () => {
    const root = parser.parse('h{1,2}b{1,3}');
    asserts.assertExists(root);
    const leafValues: string[] = [];
    getLeafValues(root, leafValues);
    asserts.assertEquals('h{1,2}b{1,3}', leafValues.join(''));
});

Deno.test('x{0,2}bbc{0,1} should parse', () => {
    const root = parser.parse('x{0,2}bbc{0,1}');
    asserts.assertExists(root);
    const leafValues: string[] = [];
    getLeafValues(root, leafValues);
    asserts.assertEquals('x{0,2}bbc{0,1}', leafValues.join(''));
});

Deno.test('[kj]{0,2} should parse', () => {
    const root = parser.parse('[kj]{0,2}');
    asserts.assertExists(root);
    const leafValues: string[] = [];
    getLeafValues(root, leafValues);
    asserts.assertEquals('[kj]{0,2}', leafValues.join(''));
});

Deno.test('(z){1,2} should parse', () => {
    const root = parser.parse('(z){1,2}');
    asserts.assertExists(root);
    const leafValues: string[] = [];
    getLeafValues(root, leafValues);
    asserts.assertEquals('(z){1,2}', leafValues.join(''));
});

Deno.test('((xy){1,2}){2} should parse', () => {
    const root = parser.parse('((xy){1,2}){2}');
    asserts.assertExists(root);
    const leafValues: string[] = [];
    getLeafValues(root, leafValues);
    asserts.assertEquals('((xy){1,2}){2}', leafValues.join(''));
});

Deno.test('(bc){2,3} should parse', () => {
    const root = parser.parse('(bc){2,3}');
    asserts.assertExists(root);
    const leafValues: string[] = [];
    getLeafValues(root, leafValues);
    asserts.assertEquals('(bc){2,3}', leafValues.join(''));
});

Deno.test('(b{2}){1,2} should parse', () => {
    const root = parser.parse('(b{2}){1,2}');
    asserts.assertExists(root);
    const leafValues: string[] = [];
    getLeafValues(root, leafValues);
    asserts.assertEquals('(b{2}){1,2}', leafValues.join(''));
});

Deno.test('b{1,2}{4,5}{7,8}{1,2} should parse', () => {
    const root = parser.parse('b{1,2}{4,5}{7,8}{1,2}');
    asserts.assertExists(root);
    const leafValues: string[] = [];
    getLeafValues(root, leafValues);
    asserts.assertEquals('b{1,2}{4,5}{7,8}{1,2}', leafValues.join(''));
});

Deno.test('((ht){1,2}(gv){0,2}) should parse', () => {
    const root = parser.parse('((ht){1,2}(gv){0,2})');
    asserts.assertExists(root);
    const leafValues: string[] = [];
    getLeafValues(root, leafValues);
    asserts.assertEquals('((ht){1,2}(gv){0,2})', leafValues.join(''));
});

Deno.test('((ht){1,2}(gv){0,2}){2} should parse', () => {
    const root = parser.parse('((ht){1,2}(gv){0,2}){2}');
    asserts.assertExists(root);
    const leafValues: string[] = [];
    getLeafValues(root, leafValues);
    asserts.assertEquals('((ht){1,2}(gv){0,2}){2}', leafValues.join(''));
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

Deno.test('b{1,2{4,5}{7,8}{1,2 should not parse', () => {
    const root = parser.parse('b{1,2{4,5}{7,8}{1,2');
    asserts.assertEquals(root, null);
});

Deno.test('{1,2}abc should NOT parse', () => {
    const root = parser.parse('{1,2}abc');
    asserts.assertEquals(root, null);
});

Deno.test('x{a,b} should NOT parse', () => {
    const root = parser.parse('x{a,b}');
    asserts.assertEquals(root, null);
});

Deno.test('x{a,2} should NOT parse', () => {
    const root = parser.parse('x{a,2}');
    asserts.assertEquals(root, null);
});

Deno.test('x2 should NOT parse', () => {
    const root = parser.parse('x2');
    asserts.assertEquals(root, null);
});