import { Grammar, Rule } from "./grammar.ts";

export function getRegexGrammar(): Grammar {
    const rules: Rule[] = [
        {variable: 'R', replacement: 'RNO'},
        {variable: 'R', replacement: 'RN'},
        {variable: 'R', replacement: 'N'},
        {variable: 'R', replacement: 'NO'},

        {variable: 'N', replacement: '[P]'},
        {variable: 'N', replacement: '(R)'},
        {variable: 'N', replacement: 'L'},
    
        {variable: 'O', replacement: '{A}'},
        {variable: 'O', replacement: 'OO'},
    
        {variable: 'A', replacement: 'I'},
        {variable: 'A', replacement: 'I,I'},

        {variable: 'P', replacement: 'L'},
        {variable: 'P', replacement: 'LP'},
    
        {variable: 'I', replacement: 'D'},
        {variable: 'I', replacement: 'DI'},
    
        {variable: 'D', replacement: '0'},
        {variable: 'D', replacement: '1'},
        {variable: 'D', replacement: '2'},
        {variable: 'D', replacement: '3'},
        {variable: 'D', replacement: '4'},
        {variable: 'D', replacement: '5'},
        {variable: 'D', replacement: '6'},
        {variable: 'D', replacement: '7'},
        {variable: 'D', replacement: '8'},
        {variable: 'D', replacement: '9'},
    
        {variable: 'L', replacement: 'a'},
        {variable: 'L', replacement: 'b'},
        {variable: 'L', replacement: 'c'},
        {variable: 'L', replacement: 'd'},
        {variable: 'L', replacement: 'e'},
        {variable: 'L', replacement: 'f'},
        {variable: 'L', replacement: 'g'},
        {variable: 'L', replacement: 'h'},
        {variable: 'L', replacement: 'i'},
        {variable: 'L', replacement: 'j'},
        {variable: 'L', replacement: 'k'},
        {variable: 'L', replacement: 'l'},
        {variable: 'L', replacement: 'm'},
        {variable: 'L', replacement: 'n'},
        {variable: 'L', replacement: 'o'},
        {variable: 'L', replacement: 'p'},
        {variable: 'L', replacement: 'q'},
        {variable: 'L', replacement: 'r'},
        {variable: 'L', replacement: 's'},
        {variable: 'L', replacement: 't'},
        {variable: 'L', replacement: 'u'},
        {variable: 'L', replacement: 'v'},
        {variable: 'L', replacement: 'w'},
        {variable: 'L', replacement: 'x'},
        {variable: 'L', replacement: 'y'},
        {variable: 'L', replacement: 'z'},
    ];
    return new Grammar(rules);
}