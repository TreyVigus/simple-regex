import { emptyMachine, oneLetterMachine } from "./nfaFactory.ts";
import { asserts } from "../../deps.ts";
import { NFA, State } from "./nfa.ts";

Deno.test("emptyMachine", () => {
  const m = emptyMachine();
  asserts.assertEquals(m.recognizes(""), true);
  asserts.assertEquals(m.recognizes("q"), false);
  asserts.assertEquals(m.recognizes("qd"), false);
  asserts.assertEquals(m.recognizes("qq"), false);
  asserts.assertEquals(m.recognizes("a"), false);
  asserts.assertEquals(m.recognizes("vvaarwf"), false);
});

Deno.test("oneLetterMachine", () => {
  const m = oneLetterMachine("q");
  asserts.assertEquals(m.recognizes("q"), true);
  asserts.assertEquals(m.recognizes(""), false);
  asserts.assertEquals(m.recognizes("qd"), false);
  asserts.assertEquals(m.recognizes("qq"), false);
  asserts.assertEquals(m.recognizes("a"), false);
});

Deno.test("sipster page 51", () => {
  //machine that recognizes all strings from {a,b} containing a 1 in the
  //third position of the end.
  const q1: State = {};
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
  asserts.assertEquals(m.recognizes("aaabaa"), true);
  asserts.assertEquals(m.recognizes("baa"), true);
  asserts.assertEquals(m.recognizes("bab"), true);
  asserts.assertEquals(m.recognizes("b"), false);
  asserts.assertEquals(m.recognizes("ab"), false);
  asserts.assertEquals(m.recognizes("aabb"), false);
  asserts.assertEquals(m.recognizes("bbbbbbbabb"), false);
});

Deno.test("sipster page 52 even", () => {
  const m = evenMachine();
  asserts.assertEquals(m.recognizes(""), true);
  asserts.assertEquals(m.recognizes("aa"), true);
  asserts.assertEquals(m.recognizes("aaaa"), true);
  asserts.assertEquals(m.recognizes("aaaaaaaa"), true);
  asserts.assertEquals(m.recognizes("a"), false);
  asserts.assertEquals(m.recognizes("aaa"), false);
  asserts.assertEquals(m.recognizes("aaaaa"), false);
  asserts.assertEquals(m.recognizes("aaaaaaaaa"), false);
  asserts.assertEquals(m.recognizes("bbaaaa"), false);
});

Deno.test("sipster page 52 mult 3", () => {
  const m = mult3Machine();
  asserts.assertEquals(m.recognizes("a"), false);
  asserts.assertEquals(m.recognizes("aa"), false);
  asserts.assertEquals(m.recognizes("aaa"), true);
  asserts.assertEquals(m.recognizes("aaaa"), false);
  asserts.assertEquals(m.recognizes("aaaaa"), false);
  asserts.assertEquals(m.recognizes("aaaaaa"), true);
  asserts.assertEquals(m.recognizes("abaaaa"), false);
});

Deno.test("sipster page 52 union", () => {
  const m1 = mult3Machine();
  const m2 = evenMachine();
  const union = m1.union(m2);
  asserts.assertEquals(union.recognizes("a"), false);
  asserts.assertEquals(union.recognizes("aa"), true);
  asserts.assertEquals(union.recognizes("aaa"), true);
  asserts.assertEquals(union.recognizes("aaaa"), true);
  asserts.assertEquals(union.recognizes("aaaaa"), false);
  asserts.assertEquals(union.recognizes("aaaaaa"), true);
  asserts.assertEquals(union.recognizes("aaaaaa"), true);
  asserts.assertEquals(union.recognizes("aaaaaaa"), false);
  asserts.assertEquals(union.recognizes("b"), false);
});

Deno.test("sipster page 52 union (reverse)", () => {
  const m1 = mult3Machine();
  const m2 = evenMachine();
  const union = m2.union(m1);
  asserts.assertEquals(union.recognizes("a"), false);
  asserts.assertEquals(union.recognizes("aa"), true);
  asserts.assertEquals(union.recognizes("aaa"), true);
  asserts.assertEquals(union.recognizes("aaaa"), true);
  asserts.assertEquals(union.recognizes("aaaaa"), false);
  asserts.assertEquals(union.recognizes("aaaaaa"), true);
  asserts.assertEquals(union.recognizes("aaaaaa"), true);
  asserts.assertEquals(union.recognizes("aaaaaaa"), false);
  asserts.assertEquals(union.recognizes("b"), false);
});

Deno.test("sipster page 53", () => {
  const q1: State = { accept: true };
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
  asserts.assertEquals(m.recognizes(""), true);
  asserts.assertEquals(m.recognizes("a"), true);
  asserts.assertEquals(m.recognizes("baba"), true);
  asserts.assertEquals(m.recognizes("baa"), true);
  asserts.assertEquals(m.recognizes("b"), false);
  asserts.assertEquals(m.recognizes("bb"), false);
  asserts.assertEquals(m.recognizes("babba"), false);
});

Deno.test("multiple epsilons", () => {
  const q1: State = { accept: false };
  const q2: State = {};
  const q3: State = {};
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
  asserts.assertEquals(m.recognizes("x"), true);
  asserts.assertEquals(m.recognizes("bx"), true);
  asserts.assertEquals(m.recognizes("cx"), true);
  asserts.assertEquals(m.recognizes("xx"), false);
  asserts.assertEquals(m.recognizes("bcx"), false);
  asserts.assertEquals(m.recognizes("xc"), false);
  asserts.assertEquals(m.recognizes(""), false);
});

Deno.test("oneTwoA", () => {
  const m1 = oneTwoA();
  asserts.assertEquals(m1.recognizes("a"), true);
  asserts.assertEquals(m1.recognizes("aa"), true);
  asserts.assertEquals(m1.recognizes("aaa"), false);
  asserts.assertEquals(m1.recognizes(""), false);
  asserts.assertEquals(m1.recognizes("z"), false);
  asserts.assertEquals(m1.recognizes("aaaaaaaaaaaaaaaa"), false);
});

Deno.test("twoB", () => {
  const m1 = twoB();
  asserts.assertEquals(m1.recognizes("bb"), true);
  asserts.assertEquals(m1.recognizes("b"), false);
  asserts.assertEquals(m1.recognizes("a"), false);
  asserts.assertEquals(m1.recognizes("aa"), false);
  asserts.assertEquals(m1.recognizes(""), false);
  asserts.assertEquals(m1.recognizes("bbbbbbbbbbb"), false);
});

Deno.test("concat", () => {
  const m1 = oneTwoA();
  const m2 = twoB();
  const concat = m1.concat(m2);
  asserts.assertEquals(concat.recognizes("abb"), true);
  asserts.assertEquals(concat.recognizes("aabb"), true);
  asserts.assertEquals(concat.recognizes(""), false);
  asserts.assertEquals(concat.recognizes("aaabb"), false);
  asserts.assertEquals(concat.recognizes("abbb"), false);
  asserts.assertEquals(concat.recognizes("ab"), false);
  asserts.assertEquals(concat.recognizes("aa"), false);
  asserts.assertEquals(concat.recognizes("aab"), false);
  asserts.assertEquals(concat.recognizes("bb"), false);
  asserts.assertEquals(concat.recognizes("a"), false);
  asserts.assertEquals(concat.recognizes("z"), false);
});

Deno.test("concat 2", () => {
  const m1 = oneTwoA();
  const m2 = twoB();
  const concat = m2.concat(m1);
  asserts.assertEquals(concat.recognizes("bba"), true);
  asserts.assertEquals(concat.recognizes("bbaa"), true);
  asserts.assertEquals(concat.recognizes("abb"), false);
  asserts.assertEquals(concat.recognizes("ba"), false);
  asserts.assertEquals(concat.recognizes("b"), false);
  asserts.assertEquals(concat.recognizes("bbaaa"), false);
  asserts.assertEquals(concat.recognizes("bb"), false);
  asserts.assertEquals(concat.recognizes("aabb"), false);
  asserts.assertEquals(concat.recognizes(""), false);
});

Deno.test("concat 3", () => {
  const m1 = oneLetterMachine("b").concat(oneLetterMachine("b"));
  asserts.assertEquals(m1.recognizes("bb"), true);
  asserts.assertEquals(m1.recognizes("b"), false);
  asserts.assertEquals(m1.recognizes("a"), false);
  asserts.assertEquals(m1.recognizes("aa"), false);
  asserts.assertEquals(m1.recognizes(""), false);
  asserts.assertEquals(m1.recognizes("bbbbbbbbbbb"), false);
});

Deno.test("modifying clone accept state does not change original", () => {
  const m1 = emptyMachine();
  const clone = m1.clone();
  clone.start.accept = false;
  asserts.assertNotEquals(m1.start.accept, false);
});

Deno.test("modifying clone transitions does not change original", () => {
  const m1 = evenMachine();
  const clone = m1.clone();
  //change q3
  clone.states[1].transitions![0].letter = 'b';
  clone.states[1].transitions![0].state = {
    accept: false
  };
  asserts.assertEquals(m1.states[1].transitions![0].letter, 'a');
  asserts.assertEquals(m1.states[1].transitions![0].state.accept, true);
});

Deno.test("clone has equivalent transitions", () => {
  const start: State = { accept: true };
  start.transitions = [
    {letter: 'a', state: start},
    {letter: 'b', state: start}
  ];
  const machine = new NFA(start);
  const clone = machine.clone();
  asserts.assertStrictEquals(clone.start.transitions![0].state, clone.start.transitions![1].state);
});

Deno.test("concat is pure", () => {
  const m1 = evenMachine();
  const m2 = mult3Machine();
  const concat = m1.concat(m2);
  concat.states.forEach(s => {
    s.transitions = [];
  });
  
  const emptyM1 = m1.states.filter(s => s.transitions && s.transitions.length === 0).length;
  asserts.assertNotEquals(emptyM1, m1.states.length);

  const emptyM2 = m2.states.filter(s => s.transitions && s.transitions.length === 0).length;
  asserts.assertNotEquals(emptyM2, m2.states.length);
});

Deno.test("union is pure", () => {
  const m1 = evenMachine();
  const m2 = mult3Machine();
  const union = m1.union(m2);
  union.states.forEach(s => {
    s.transitions = [];
  });
  
  const emptyM1 = m1.states.filter(s => s.transitions && s.transitions.length === 0).length;
  asserts.assertNotEquals(emptyM1, m1.states.length);

  const emptyM2 = m2.states.filter(s => s.transitions && s.transitions.length === 0).length;
  asserts.assertNotEquals(emptyM2, m2.states.length);
});

Deno.test("empty union", () => {
  let m1 = oneLetterMachine("q").union(emptyMachine());
  asserts.assertEquals(m1.recognizes("q"), true);
  asserts.assertEquals(m1.recognizes(""), true);
  asserts.assertEquals(m1.recognizes("qd"), false);
  asserts.assertEquals(m1.recognizes("qq"), false);
  asserts.assertEquals(m1.recognizes("a"), false);

  m1 = oneLetterMachine("q").union(emptyMachine());
  asserts.assertEquals(m1.recognizes("q"), true);
  asserts.assertEquals(m1.recognizes(""), true);
  asserts.assertEquals(m1.recognizes("qd"), false);
  asserts.assertEquals(m1.recognizes("qq"), false);
  asserts.assertEquals(m1.recognizes("a"), false);
});

Deno.test("empty concat", () => {
  const m1 = oneLetterMachine("q").concat(emptyMachine());
  asserts.assertEquals(m1.recognizes("q"), true);
  asserts.assertEquals(m1.recognizes(""), false);
  asserts.assertEquals(m1.recognizes("qd"), false);
  asserts.assertEquals(m1.recognizes("qq"), false);
  asserts.assertEquals(m1.recognizes("a"), false);

  const m2 = emptyMachine().concat(oneLetterMachine("q"));
  asserts.assertEquals(m2.recognizes("q"), true);
  asserts.assertEquals(m2.recognizes(""), false);
  asserts.assertEquals(m2.recognizes("qd"), false);
  asserts.assertEquals(m2.recognizes("qq"), false);
  asserts.assertEquals(m2.recognizes("a"), false);
});

Deno.test("infinite loop machine", () => {
  const s1: State = { accept: true };
  const s2: State = {};
  s1.transitions = [
    { letter: "ε", state: s2 },
  ];
  s2.transitions = [
    { letter: "ε", state: s1 },
  ];
  const m = new NFA(s1);
  asserts.assertThrows(() => {
    m.recognizes("");
  });
});

Deno.test("clone recognizes same language", () => {
  let m1 = oneLetterMachine("b").concat(oneLetterMachine("b")).clone();
  asserts.assertEquals(m1.recognizes("bb"), true);
  asserts.assertEquals(m1.recognizes("b"), false);
  asserts.assertEquals(m1.recognizes("a"), false);
  asserts.assertEquals(m1.recognizes("aa"), false);
  asserts.assertEquals(m1.recognizes(""), false);
  asserts.assertEquals(m1.recognizes("bbbbbbbbbbb"), false);

  const union = evenMachine().union(mult3Machine()).clone();
  asserts.assertEquals(union.recognizes("a"), false);
  asserts.assertEquals(union.recognizes("aa"), true);
  asserts.assertEquals(union.recognizes("aaa"), true);
  asserts.assertEquals(union.recognizes("aaaa"), true);
  asserts.assertEquals(union.recognizes("aaaaa"), false);
  asserts.assertEquals(union.recognizes("aaaaaa"), true);
  asserts.assertEquals(union.recognizes("aaaaaa"), true);
  asserts.assertEquals(union.recognizes("aaaaaaa"), false);
  asserts.assertEquals(union.recognizes("b"), false);

  const m = evenMachine().clone();
  asserts.assertEquals(m.recognizes(""), true);
  asserts.assertEquals(m.recognizes("aa"), true);
  asserts.assertEquals(m.recognizes("aaaa"), true);
  asserts.assertEquals(m.recognizes("aaaaaaaa"), true);
  asserts.assertEquals(m.recognizes("a"), false);
  asserts.assertEquals(m.recognizes("aaa"), false);
  asserts.assertEquals(m.recognizes("aaaaa"), false);
  asserts.assertEquals(m.recognizes("aaaaaaaaa"), false);
  asserts.assertEquals(m.recognizes("bbaaaa"), false);

  m1 = oneLetterMachine("q").union(emptyMachine());
  asserts.assertEquals(m1.recognizes("q"), true);
  asserts.assertEquals(m1.recognizes(""), true);
  asserts.assertEquals(m1.recognizes("qd"), false);
  asserts.assertEquals(m1.recognizes("qq"), false);
  asserts.assertEquals(m1.recognizes("a"), false);

  m1 = oneLetterMachine("q").concat(emptyMachine()).clone();
  asserts.assertEquals(m1.recognizes("q"), true);
  asserts.assertEquals(m1.recognizes(""), false);
  asserts.assertEquals(m1.recognizes("qd"), false);
  asserts.assertEquals(m1.recognizes("qq"), false);
  asserts.assertEquals(m1.recognizes("a"), false);
});

Deno.test("twoB pow 3", () => {
  const m = twoB().pow(3);
  console.log('pow states: ', m.states.length);
  asserts.assertEquals(m.recognizes("bbbbbb"), true);
  asserts.assertEquals(m.recognizes("bb"), false);
  asserts.assertEquals(m.recognizes("bbbb"), false);
  asserts.assertEquals(m.recognizes("bbbbbbbb"), false);
  asserts.assertEquals(m.recognizes("b"), false);
  asserts.assertEquals(m.recognizes(""), false);
});

Deno.test("oneTwoA pow 3", () => {
  const m = oneTwoA().pow(3);
  asserts.assertEquals(m.recognizes("aaa"), true);
  asserts.assertEquals(m.recognizes("aaaa"), true);
  asserts.assertEquals(m.recognizes("aaaaa"), true);
  asserts.assertEquals(m.recognizes("aaaaaa"), true);
  asserts.assertEquals(m.recognizes("a"), false);
  asserts.assertEquals(m.recognizes("aa"), false);
  asserts.assertEquals(m.recognizes("aaaaaaaa"), false);
  asserts.assertEquals(m.recognizes("aaaaaaaaa"), false);
});

//machine that recognizes all strings from {a} containing an even number of a's
function evenMachine(): NFA {
  const q2: State = { accept: true };
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
  const q4: State = { accept: true };
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
  const q1: State = {};
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
  const q5: State = {};
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
