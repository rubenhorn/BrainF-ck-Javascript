export default function textToProgram(text) {
    let cellValue = 0;
    let program = '';

    const findTwoFactors = (number) => {
        let a = number;
        let b = 1;
        for (let b2 = b + 1; b2 < number / 2; b2++) {
            if (number % b2 == 0) {
                let a2 = number / b2;
                if (a + b > a2 + b2) {
                    a = a2;
                    b = b2;
                }
                else {
                    break;
                }
            }
        }
        return [a, b];
    }

    for (let i = 0; i < text.length; i++) {
        const nextChar = text.charCodeAt(i);
        if (nextChar > 256) {
            throw new Error(`Character code of ${String.fromCharCode(nextChar)} cannot be expressed in 8 bits`);
        }

        const calculateDifferenceAndOperation = () => {
            let difference;
            let operation;
            const fwdCost = (nextChar - cellValue + 256) % 256;
            const bwdCost = (cellValue - nextChar + 256) % 256; 
            if(fwdCost < bwdCost) {
                difference = fwdCost;
                operation = '+';
            }
            else {
                difference = bwdCost;
                operation = '-';
            }
            return [difference, operation];
        }

        let [difference, operation] = calculateDifferenceAndOperation();

        if (difference == 0) { }
        else if (Math.abs(difference) < 10) {
            operation = nextChar > cellValue ? '+' : '-';
            for (let i = 0; i < Math.abs(difference); i++) {
                program += operation;
            }
        }
        else {
            let [a, b] = findTwoFactors(Math.abs(difference));
            while (a == 1 || b == 1) {
                cellValue = (cellValue + 1) % 256;
                program += '+';
                [difference, operation] = calculateDifferenceAndOperation();
                [a, b] = findTwoFactors(Math.abs(difference));
            }
            program += '>>';
            for (; a > 0; a--) {
                program += '+';
            }
            program += '[<';
            for (; b > 0; b--) {
                program += '+';
            }
            program += '>-]<';
            program += `[<${ operation }>-]<`;
        }
        cellValue = nextChar;
        program += '.';
    }
    return program;
}