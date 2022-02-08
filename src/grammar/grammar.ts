export type Rule = {
    variable: string,
    replacement: string
}

export class Grammar {
    public rules: Rule[];
    constructor(rules: Rule[]) {
        this.rules = rules;
    }

    get startVariable(): string {
        return this.rules[0].variable;
    }

    get variables(): Set<string> {
        const s: Set<string> = new Set();
        this.rules.forEach(rule => {
            s.add(rule.variable);
        });
        return s;
    }

    get terminals(): Set<string> {
        const s: Set<string> = new Set();
        this.rules.forEach(rule => {
            [...rule.replacement].forEach(char => {
                if(!this.variables.has(char)) {
                    s.add(char);
                }
            });
        });
        return s;
    }

    public hasTerminal(char: string) {
        return this.terminals.has(char);
    }

    public hasVariable(char: string) {
        return this.variables.has(char);
    }

    public getReplacements(variable: string): string[] {
        return this.rules.filter(r => r.variable === variable).map(r => r.replacement);
    }
}