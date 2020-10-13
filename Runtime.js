export default function Runtime(cellcount) {
    this.memory = new Uint8Array(cellcount);

    this.execute = async function(program, input, output) {
        this.memory.fill(0, 0);

        let dp = 0;
        let pc = 0;
        let pc2;
        let nestedLoops;

        const pcToString = (pc) => {
            let line = 0;
            let column = 0;
            for(let i = 0; i < pc; i++) {
                if(program.charAt(i) == '\n') {
                    line++;
                    column = 0;
                }
                else {
                    column++;
                }
            }
            return `line ${ line + 1 }:${ column + 1 }`;
        }

        const assertIsCellIndexValid = () => {
            if(dp < 0 || dp >= cellcount) {
                throw new Error(`Trying to access non-existing cell ${ dp } at ${ pcToString(pc) }`);
            }
        };

        for(; pc < program.length; pc++) {
            const nextInstruction = program.charAt(pc);
            switch(nextInstruction) {
                case '>':
                    dp++;
                    break;
                case '<':
                    dp--;
                    break;
                case '+':
                    assertIsCellIndexValid();
                    this.memory[dp]++;
                    break;
                case '-':
                    assertIsCellIndexValid();
                    this.memory[dp]--;
                    break;
                case ',':
                    assertIsCellIndexValid();
                    this.memory[dp] = await input();
                    break;
                case '.':
                    assertIsCellIndexValid();
                    output(String.fromCharCode(this.memory[dp]));
                    break;
                case '[':
                    pc2 = pc + 1;
                    nestedLoops = 0;
                    while(pc2 < program.length) {
                        const nextInstruction = program.charAt(pc2);
                        if(nextInstruction == '[') {
                            nestedLoops++;
                        }
                        else if(nextInstruction == ']' && nestedLoops > 0) {
                            nestedLoops--;
                        }
                        else if(nextInstruction == ']') {
                            break;
                        }
                        pc2++;
                    }
                    if(pc2 == program.length) {
                        throw new Error(`No matching ] found for [ at ${ pcToString(pc) }`);
                    }
                    if(this.memory[dp] == 0) {
                        pc = pc2;
                    }
                    break;
                case ']':
                    pc2 = pc - 1;
                    nestedLoops = 0;
                    while(pc2 >= 0) {
                        const nextInstruction = program.charAt(pc2);
                        if(nextInstruction == ']') {
                            nestedLoops++;
                        }
                        else if(nextInstruction == '[' && nestedLoops > 0) {
                            nestedLoops--;
                        }
                        else if(nextInstruction == '[') {
                            pc2--;
                            break;
                        }
                        pc2--;
                    }
                    if(pc2 < 0) {
                        throw new Error(`Unexpected ] at ${ pcToString(pc) }`);
                    }
                    pc = pc2;
                    break;
                default:
                    break;
            }
        }
    }
};