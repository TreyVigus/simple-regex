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
        //return the children of startVar if a parse tree exists.
        const parseDFS = (startVar: string, start: number, end: number): ParseNode | null => {
            if(start > end) {
                return null;
            }

            const window = expression.slice(start, end+1);
            const replacements = this.grammar.getReplacements(startVar);
            for(const replacement of replacements) {
                if(window.length === 1) {
                    //handle terminal replacements e.g. L->f
                    if(window === replacement) {
                        return {value: startVar, children: [{value: replacement}]}
                    }
                    continue;
                }

                //handle R->(R), R->[P], O->{A}, etc
                const [first, last] = [replacement[0], replacement[replacement.length-1]];
                if(this.grammar.hasTerminal(first) && this.grammar.hasTerminal(last)) {
                    if(window[start] === first && window[end] === last) {
                        const child = parseDFS(replacement[1], start+1, end-1);
                        if(child) {
                            return {value: startVar, children: [child]}
                        }
                    }
                } else if(this.grammar.hasVariable(replacement)) { //handle single var replacements e.g. P->L
                    const child = parseDFS(replacement, start, end);
                    if(child) {
                        return {value: startVar, children: [child]}
                    }
                } else if(replacement === 'I,I') { //handle A->I,I
                    const commaIdx = window.indexOf(',');
                    //TODO: what if mulitiple commas? write unit test for this
                    if(commaIdx) {
                        const leftChild = parseDFS('I', start, commaIdx-1);
                        const rightChild = parseDFS('I', commaIdx+1, end);
                        if(leftChild && rightChild) {
                            return {value: startVar, children: [leftChild, rightChild]}
                        }
                    }
                } else { //handle multiple var replacements i.e R->RO
                    for(let i = start; i < end; i++) {
                        const leftChild = parseDFS(replacement[0], start, i);
                        const rightChild = parseDFS(replacement[1], i+1, end);
                        if(leftChild && rightChild) {
                            return {value: startVar, children: [leftChild, rightChild]};
                        }
                    }
                }
            }

            return null;
        }
        
        return parseDFS(this.grammar.startVariable, 0, expression.length-1);
    }
}

