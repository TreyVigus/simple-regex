import { emptyMachine, oneLetterMachine } from "./nfaFactory.ts";
import { assertEquals } from "../../deps.ts";
import { NFA, State } from "./nfa.ts";

Deno.test("emptyMachine", () => {
  const m = emptyMachine();
  assertEquals(m.recognizes(""), true);
  assertEquals(m.recognizes("q"), false);
  assertEquals(m.recognizes("qd"), false);
  assertEquals(m.recognizes("qq"), false);
  assertEquals(m.recognizes("a"), false);
  assertEquals(m.recognizes("vvaarwf"), false);
});

Deno.test("oneLetterMachine", () => {
  const m = oneLetterMachine("q");
  assertEquals(m.recognizes("q"), true);
  assertEquals(m.recognizes(""), false);
  assertEquals(m.recognizes("qd"), false);
  assertEquals(m.recognizes("qq"), false);
  assertEquals(m.recognizes("a"), false);
});

Deno.test("sipster page 51", () => {
  //machine that recognizes all strings from {a,b} containing a 1 in the
  //third position of the end.
  const q1: State = { start: true };
  const q2: State = {};
  const q3: State = {};
  const q4: State = { accept: true };

  q1.transitions = [
    { letter: "a", state: q1 },
    { letter: "b", state: q1 },
    { letter: "b", state: q2 },
  ];
  q2.transitions = [
    { letter: "a", state: q3 },
    { letter: "b", state: q3 },
  ];
  q3.transitions = [
    { letter: "a", state: q4 },
    { letter: "b", state: q4 },
  ];

  const m = new NFA(q1);
  assertEquals(m.recognizes("aaabaa"), true);
  assertEquals(m.recognizes("baa"), true);
  assertEquals(m.recognizes("bab"), true);
  assertEquals(m.recognizes("b"), false);
  assertEquals(m.recognizes("ab"), false);
  assertEquals(m.recognizes("aabb"), false);
  assertEquals(m.recognizes("bbbbbbbabb"), false);
});

Deno.test("sipster page 52 even", () => {
  const m = evenMachine();
  assertEquals(m.recognizes(""), true);
  assertEquals(m.recognizes("aa"), true);
  assertEquals(m.recognizes("aaaa"), true);
  assertEquals(m.recognizes("aaaaaaaa"), true);
  assertEquals(m.recognizes("a"), false);
  assertEquals(m.recognizes("aaa"), false);
  assertEquals(m.recognizes("aaaaa"), false);
  assertEquals(m.recognizes("aaaaaaaaa"), false);
  assertEquals(m.recognizes("bbaaaa"), false);
});

Deno.test("sipster page 52 mult 3", () => {
  const m = mult3Machine();
  assertEquals(m.recognizes("a"), false);
  assertEquals(m.recognizes("aa"), false);
  assertEquals(m.recognizes("aaa"), true);
  assertEquals(m.recognizes("aaaa"), false);
  assertEquals(m.recognizes("aaaaa"), false);
  assertEquals(m.recognizes("aaaaaa"), true);
  assertEquals(m.recognizes("abaaaa"), false);
});

Deno.test("sipster page 52 union", () => {
  const m1 = mult3Machine();
  const m2 = evenMachine();
  const union = m1.union(m2);
  assertEquals(union.recognizes("a"), false);
  assertEquals(union.recognizes("aa"), true);
  assertEquals(union.recognizes("aaa"), true);
  assertEquals(union.recognizes("aaaa"), true);
  assertEquals(union.recognizes("aaaaa"), false);
  assertEquals(union.recognizes("aaaaaa"), true);
  assertEquals(union.recognizes("aaaaaa"), true);
  assertEquals(union.recognizes("aaaaaaa"), false);
  assertEquals(union.recognizes("b"), false);
});

Deno.test("sipster page 52 union (reverse)", () => {
  const m1 = mult3Machine();
  const m2 = evenMachine();
  const union = m2.union(m1);
  assertEquals(union.recognizes("a"), false);
  assertEquals(union.recognizes("aa"), true);
  assertEquals(union.recognizes("aaa"), true);
  assertEquals(union.recognizes("aaaa"), true);
  assertEquals(union.recognizes("aaaaa"), false);
  assertEquals(union.recognizes("aaaaaa"), true);
  assertEquals(union.recognizes("aaaaaa"), true);
  assertEquals(union.recognizes("aaaaaaa"), false);
  assertEquals(union.recognizes("b"), false);
});

Deno.test("sipster page 53", () => {
  const q1: State = { start: true, accept: true };
  const q2: State = {};
  const q3: State = {};

  q1.transitions = [
    { letter: "b", state: q2 },
    { letter: "ε", state: q3 },
  ];

  q2.transitions = [
    { letter: "a", state: q2 },
    { letter: "a", state: q3 },
    { letter: "b", state: q3 },
  ];

  q3.transitions = [
    { letter: "a", state: q1 },
  ];

  const m = new NFA(q1);
  assertEquals(m.recognizes(""), true);
  assertEquals(m.recognizes("a"), true);
  assertEquals(m.recognizes("baba"), true);
  assertEquals(m.recognizes("baa"), true);
  assertEquals(m.recognizes("b"), false);
  assertEquals(m.recognizes("bb"), false);
  assertEquals(m.recognizes("babba"), false);
});

Deno.test("multiple epsilons", () => {
  const q1: State = { start: true, accept: false };
  const q2: State = { start: false };
  const q3: State = { start: true };
  const q4: State = { accept: true };

  q1.transitions = [
    { letter: "ε", state: q2 },
    { letter: "b", state: q2 },
    { letter: "c", state: q3 },
  ];

  q2.transitions = [
    { letter: "ε", state: q3 },
  ];

  q3.transitions = [
    { letter: "x", state: q4 },
  ];

  const m = new NFA(q1);
  assertEquals(m.recognizes("x"), true);
  assertEquals(m.recognizes("bx"), true);
  assertEquals(m.recognizes("cx"), true);
  assertEquals(m.recognizes("xx"), false);
  assertEquals(m.recognizes("bcx"), false);
  assertEquals(m.recognizes("xc"), false);
  assertEquals(m.recognizes(""), false);
});

Deno.test("oneTwoA", () => {
  const m1 = oneTwoA();
  assertEquals(m1.recognizes("a"), true);
  assertEquals(m1.recognizes("aa"), true);
  assertEquals(m1.recognizes("aaa"), false);
  assertEquals(m1.recognizes(""), false);
  assertEquals(m1.recognizes("z"), false);
  assertEquals(m1.recognizes("aaaaaaaaaaaaaaaa"), false);
});

Deno.test("twoB", () => {
  const m1 = twoB();
  assertEquals(m1.recognizes("bb"), true);
  assertEquals(m1.recognizes("b"), false);
  assertEquals(m1.recognizes("a"), false);
  assertEquals(m1.recognizes("aa"), false);
  assertEquals(m1.recognizes(""), false);
  assertEquals(m1.recognizes("bbbbbbbbbbb"), false);
});

Deno.test("concat", () => {
  const m1 = oneTwoA();
  const m2 = twoB();
  const concat = m1.concat(m2);
  assertEquals(concat.recognizes("abb"), true);
  assertEquals(concat.recognizes("aabb"), true);
  assertEquals(concat.recognizes(""), false);
  assertEquals(concat.recognizes("aaabb"), false);
  assertEquals(concat.recognizes("abbb"), false);
  assertEquals(concat.recognizes("ab"), false);
  assertEquals(concat.recognizes("aa"), false);
  assertEquals(concat.recognizes("aab"), false);
  assertEquals(concat.recognizes("bb"), false);
  assertEquals(concat.recognizes("a"), false);
  assertEquals(concat.recognizes("z"), false);
});

Deno.test("concat 2", () => {
  const m1 = oneTwoA();
  const m2 = twoB();
  const concat = m2.concat(m1);
  assertEquals(concat.recognizes("bba"), true);
  assertEquals(concat.recognizes("bbaa"), true);
  assertEquals(concat.recognizes("abb"), false);
  assertEquals(concat.recognizes("ba"), false);
  assertEquals(concat.recognizes("b"), false);
  assertEquals(concat.recognizes("bbaaa"), false);
  assertEquals(concat.recognizes("bb"), false);
  assertEquals(concat.recognizes("aabb"), false);
  assertEquals(concat.recognizes(""), false);
});

Deno.test("concat 3", () => {
  const m1 = oneLetterMachine("b").concat(oneLetterMachine("b"));
  assertEquals(m1.recognizes("bb"), true);
  assertEquals(m1.recognizes("b"), false);
  assertEquals(m1.recognizes("a"), false);
  assertEquals(m1.recognizes("aa"), false);
  assertEquals(m1.recognizes(""), false);
  assertEquals(m1.recognizes("bbbbbbbbbbb"), false);
});

//machine that recognizes all strings from {a} containing an even number of a's
function evenMachine(): NFA {
  const q2: State = { start: true, accept: true };
  const q3: State = {};

  q2.transitions = [
    { letter: "a", state: q3 },
  ];
  q3.transitions = [
    { letter: "a", state: q2 },
  ];

  return new NFA(q2);
}

//machine that recognizes all strings from {a} containing 3k a's, where k is a natural number
function mult3Machine(): NFA {
  const q4: State = { start: true, accept: true };
  const q5: State = {};
  const q6: State = {};

  q4.transitions = [
    { letter: "a", state: q5 },
  ];
  q5.transitions = [
    { letter: "a", state: q6 },
  ];
  q6.transitions = [
    { letter: "a", state: q4 },
  ];

  return new NFA(q4);
}

//recognizes 'a' or 'aa'
function oneTwoA(): NFA {
  const q1: State = { start: true };
  const q2: State = { accept: true };
  const q3: State = {};
  const q4: State = { accept: true };

  q1.transitions = [
    { letter: "a", state: q2 },
    { letter: "a", state: q3 },
  ];

  q3.transitions = [
    { letter: "a", state: q4 },
  ];

  return new NFA(q1);
}

//recognizes 'bb'
function twoB(): NFA {
  const q5: State = { start: true };
  const q6: State = {};
  const q7: State = { accept: true };

  q5.transitions = [
    { letter: "b", state: q6 },
  ];
  q6.transitions = [
    { letter: "b", state: q7 },
  ];

  return new NFA(q5);
}
