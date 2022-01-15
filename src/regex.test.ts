import { asserts } from "../deps.ts";
import { Regex } from "./regex.ts";

type Test = {
  expr: string;
  cases: TestCase[];
};
type TestCase = {
  s: string;
  expected: boolean;
};

const tests: Test[] = [
  {
    expr: "hello",
    cases: [
      { s: "hello", expected: true },
      { s: "hi", expected: false },
      { s: "hellos", expected: false },
      { s: "hell0", expected: false },
      { s: "HELLo", expected: false },
    ],
  },
  {
    expr: "h{3}",
    cases: [
      { s: "hhh", expected: true },
      { s: "hh", expected: false },
      { s: "hhhh", expected: false },
      { s: "ahhh", expected: false },
      { s: "aaa", expected: false },
    ],
  },
  {
    expr: "h{2,5}",
    cases: [
      { s: "hh", expected: true },
      { s: "hhh", expected: true },
      { s: "hhhh", expected: true },
      { s: "hhhhh", expected: true },
      { s: "h", expected: false },
      { s: "hhhhhh", expected: false },
      { s: "hhahh", expected: false },
    ],
  },
  {
    expr: "h{1,2}b{1,3}",
    cases: [
      { s: "hb", expected: true },
      { s: "hbb", expected: true },
      { s: "hbbb", expected: true },
      { s: "hhbbb", expected: true },
      { s: "hhbb", expected: true },
      { s: "hhb", expected: true },
      { s: "hhhbb", expected: false },
      { s: "hhhbbb", expected: false },
      { s: "b", expected: false },
      { s: "hh", expected: false },
      { s: "xhb", expected: false },
      { s: "hbbbh", expected: false },
      { s: "bh", expected: false },
    ],
  },
  {
    expr: "xx{0,2}",
    cases: [
      { s: "x", expected: true },
      { s: "xx", expected: true },
      { s: "xxx", expected: true },
      { s: "", expected: false },
      { s: "xxxx", expected: false },
      { s: "yxx", expected: false },
      { s: "xxyx", expected: false },
    ],
  },
  {
    expr: "x{0,2}bbc{0,1}",
    cases: [
      { s: "bbc", expected: true },
      { s: "xbbc", expected: true },
      { s: "xxbb", expected: true },
      { s: "bb", expected: true },
      { s: "xxbbc", expected: true },
      { s: "xxbbcc", expected: false },
      { s: "xxxbbc", expected: false },
      { s: "x", expected: false },
      { s: "", expected: false },
    ],
  },
  {
    expr: "[oz]",
    cases: [
      { s: "o", expected: true },
      { s: "z", expected: true },
      { s: "oz", expected: false },
      { s: "", expected: false },
      { s: "ooz", expected: false },
      { s: "y", expected: false },
    ],
  },
  {
    expr: "[o]",
    cases: [
      { s: "o", expected: true },
      { s: "oo", expected: false },
      { s: "z", expected: false },
      { s: "oz", expected: false },
      { s: "", expected: false },
      { s: "ooz", expected: false },
      { s: "y", expected: false },
    ],
  },
  {
    expr: "[kj]{0,2}",
    cases: [
      { s: "", expected: true },
      { s: "k", expected: true },
      { s: "j", expected: true },
      { s: "kj", expected: true },
      { s: "jj", expected: true },
      { s: "kk", expected: true },
      { s: "jk", expected: true },
      { s: "xj", expected: false },
      { s: "kjk", expected: false },
      { s: "jjjj", expected: false },
      { s: "kkj", expected: false },
    ],
  },
  {
    expr: "[kj]{0,2}[xyz]{1,2}",
    cases: [
      { s: "kjxy", expected: true },
      { s: "kjzx", expected: true },
      { s: "zz", expected: true },
      { s: "xy", expected: true },
      { s: "kz", expected: true },
      { s: "jy", expected: true },
      { s: "xyz", expected: false },
      { s: "kjjx", expected: false },
      { s: "jyj", expected: false },
      { s: "jyzx", expected: false },
      { s: "kp", expected: false },
      { s: "kkjjx", expected: false },
      { s: "", expected: false },
    ],
  },
  {
    expr: "[yx]{3}",
    cases: [
      { s: "xxx", expected: true },
      { s: "yyy", expected: true },
      { s: "xyy", expected: true },
      { s: "xyx", expected: true },
      { s: "yxx", expected: true },
      { s: "y", expected: false },
      { s: "xxxx", expected: false },
      { s: "xyyx", expected: false },
      { s: "xy", expected: false },
      { s: "xybcy", expected: false },
    ],
  },
  {
    expr: "(bc){2,3}",
    cases: [
      { s: "bcbc", expected: true },
      { s: "bcbcbc", expected: true },
      { s: "bc", expected: false },
      { s: "bbcc", expected: false },
      { s: "bbbccc", expected: false },
      { s: "bcbcbcbc", expected: false },
      { s: "bcb", expected: false },
      { s: "cbcb", expected: false },
      { s: "cb", expected: false },
    ],
  },
  {
    expr: "(b{2}){1,2}",
    cases: [
      { s: "bb", expected: true },
      { s: "bbbb", expected: true },
      { s: "b", expected: false },
      { s: "bbbbb", expected: false },
      { s: "bbbbbb", expected: false },
      { s: "ab", expected: false },
      { s: "", expected: false },
    ],
  },
  {
    expr: "((xy){1,2}){2}",
    cases: [
      { s: "xyxy", expected: true },
      { s: "xyxyxy", expected: true },
      { s: "xyxyxyxy", expected: true },
      { s: "xyxyxyxyxy", expected: false },
      { s: "xy", expected: false },
      { s: "xyy", expected: false },
      { s: "xxyy", expected: false },
      { s: "xxyyxxyy", expected: false },
    ],
  },
  {
    expr: "(z){1,2}",
    cases: [
      { s: "z", expected: true },
      { s: "zz", expected: true },
      { s: "", expected: false },
      { s: "zzz", expected: false },
    ],
  },
  {
    expr: "((ht){1,2}(gv){0,2}){2}",
    cases: [
      { s: "htht", expected: true },
      { s: "hthththt", expected: true },
      { s: "htgvhtgv", expected: true },
      { s: "htgvgvhtgvgv", expected: true },
      { s: "hthththtgv", expected: true },
      { s: "htgvgvhthtgv", expected: true },
      { s: "gv", expected: false },
      { s: "hhtggv", expected: false },
      { s: "hththththt", expected: false },
    ],
  },
];

tests.forEach((test) => {
  Deno.test(`${test.expr}`, () => {
    const regex = new Regex(test.expr);
    test.cases.forEach((testCase) => {
      const res = regex.test(testCase.s);
      asserts.assertEquals(res, testCase.expected);
    });
  });
});
