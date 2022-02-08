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
        const parseChildren = (startVar: string, start: number, end: number): ParseNode[] => {
            if(start > end) {
                return [];
            }

            const window = expression.slice(start, end+1);
            const replacements = this.grammar.getReplacements(startVar);
            for(const replacement of replacements) {
                if(window.length === 1) {
                    //handle terminal replacements e.g. L
                    if(window === replacement) {
                        return [{value: window}];
                    }
                    continue;
                }

                const [first, last] = [replacement[0], replacement[replacement.length-1]];
                //handle R->(R), R->[P], O->{A}, etc
                if(this.grammar.hasTerminal(first) && this.grammar.hasTerminal(last)) {
                    if(window[start] === first && window[end] === last) {
                        const children = parseChildren(replacement[1], start+1, end-1);
                        if(children.length) {
                            return children;
                        }
                    }
                } else if(this.grammar.hasVariable(replacement)) { //handle single var replacements e.g. P->L
                    const children = parseChildren(replacement, start, end);
                    if(children.length) {
                        return children;
                    }
                } else if(replacement === 'I,I') { //handle A->I,I
                    const commaIdx = window.indexOf(',');
                    //TODO: what if mulitiple commas? write unit test for this
                    if(commaIdx) {
                        const children = parseChildren('I', start, commaIdx-1).concat(parseChildren('I', commaIdx+1, end));
                        if(children.length) {
                            return children;
                        }
                    }
                } else { //handle multiple var replacements i.e R->RO
                    
                }
            }

            return children;
        }
        
        const children = parseChildren(this.grammar.startVariable, 0, expression.length-1);
        if(children.length) {
            return {value: this.grammar.startVariable, children}
        }
        return null;
    }
}

