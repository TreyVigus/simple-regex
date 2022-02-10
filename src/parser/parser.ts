import { Grammar } from "../grammar/grammar.ts";
import { getRegexGrammar } from "../grammar/grammarFactory.ts";

export type ParseNode = {
    value: string,
    children?: ParseNode[]
}

export interface Parser {
    parse(expression: string): ParseNode | null;
}

export class RegexParser implements Parser {
    private grammar: Grammar;
    constructor() {
        this.grammar = getRegexGrammar();
    }

    /**
     * Parse the expression and return the root of the parse tree.
     * If impossible, return null.
     * 
     * TODO: this isn't generic enough to handle changes to the grammar rules.
     */
    public parse(expression: string): ParseNode | null {
        const parseDFS = (startVar: string, start: number, end: number): ParseNode | null => {
            if(start > end) {
                return null;
            }

            const window = expression.slice(start, end+1);
            const replacements = this.grammar.getReplacements(startVar);

            for(const replacement of replacements) {
                if(this.grammar.hasTerminal(replacement)) { //handle terminal replacements e.g. L->f
                    if(replacement === window) {
                        return {value: startVar, children: [{value: replacement}]};
                    }
                } else if(['(R)', '[P]', '{A}'].includes(replacement)) {
                    const [first, last] = [replacement[0], replacement[replacement.length-1]];
                    if(expression[start] === first && expression[end] === last && window.length > 1) {
                        const child = parseDFS(replacement[1], start+1, end-1);
                        if(child) {
                            return {
                                value: startVar, 
                                children: [
                                    child,
                                    {value: first},
                                    {value: last}
                                ]
                            };
                        }
                    }
                } else if(['I,I'].includes(replacement)) {
                    for(let i = start; i < end; i++) {
                        if(expression[i] === ',') {
                            const leftChild = parseDFS('I', start, i-1);
                            if(!leftChild) {
                                continue;
                            }
                            const rightChild = parseDFS('I', i+1, end);
                            if(rightChild) {
                                return {
                                    value: startVar, 
                                    children: [
                                        leftChild, 
                                        {value: ','},
                                        rightChild
                                    ]
                                };
                            }
                        }
                    }
                } else if(this.grammar.hasVariable(replacement)) { //handle single var replacements e.g. P->L
                    const child = parseDFS(replacement, start, end);
                    if(child) {
                        return {value: startVar, children: [child]}
                    }
                } else { //handle multiple var replacements i.e R->RO
                    for(let i = start; i < end; i++) {
                        const leftChild = parseDFS(replacement[0], start, i);
                        if(!leftChild) {
                            continue;
                        }
                        const rightChild = parseDFS(replacement[1], i+1, end);
                        if(rightChild) {
                            return {value: startVar, children: [leftChild, rightChild]};
                        }
                    }
                }
            }

            return null;
        }
        
        return parseDFS(this.grammar.startVariable, 0, expression.length-1);
    }

    private getEmptyCache(expression: string): Map<string, (ParseNode|null)[][]> {
        const cache: Map<string, (ParseNode|null)[][]> = new Map();
        this.grammar.variables.forEach(v => {
            cache.set(v, this.getEmptyMatrix(expression.length));
        });
        return cache;
    }

    private getEmptyMatrix(dimension: number): (ParseNode|null)[][] {
        const matrix: (ParseNode|null)[][] = [];
        for(let i = 0; i < dimension; i++) {
            matrix.push([]);
            for(let j = 0; j < dimension; j++) {
                matrix[i].push(null);
            }
        }
        return matrix;
    }
}

