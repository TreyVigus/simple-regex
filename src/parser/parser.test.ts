import { asserts } from "../../deps.ts";
import { RegexParser } from "./parser.ts";

const parser = new RegexParser();

const successes = [
    '[k]{0,2}',
    'c',
    'hello', 'h{3}', 'h{2,5}',
    'h{3}',
    'h{1,2}b{1,3}'
];
successes.forEach(success => {
    Deno.test(`${success} should parse`, () => {
        const root = parser.parse(success);
        asserts.assertEquals(root, null);
    });
});

const failures = [
    '(', '()', '{', 
    '{}', '{1,2}', 
    '1', 'h3}', 
    '{h3}'
];
failures.forEach(failure => {
    Deno.test(`${failure} should NOT parse`, () => {
        const root = parser.parse(failure);
        asserts.assertEquals(root, null);
    });
});