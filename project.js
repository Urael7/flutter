// 1. Deposit some money into the slot machine
// 2. Detemine number of lines user wants to bet on
// 3. Collect a bet amount
// 4. Spin the wheels
// 5. CHeck if the user won
// 6. Give user their winnings &/or take their bet
// 7. Repeat until user runs out of money or decides to quit

const prompt = require("prompt-sync")();

//global variables for the reels
const ROWS = 3;
const COLUMNS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
}

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
}

const deposit = () => {
    while (true) {
        const depositAmount = prompt("Deposit amount: ");
        const numberDepositAmout = parseFloat(depositAmount);

        if (isNaN(numberDepositAmout) || numberDepositAmout <= 0) {
            console.log("Please enter a valid deposit amount");
        } else {
            return numberDepositAmout;
        }
    }
};

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Number of lines (1-3): ");
        const numberOfLines = parseInt(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0) {
            console.log("Please enter a valid number of lines");
        } else {
            return numberOfLines;
        }
    }
};

const getBetAmount = (depositAmount, lines) => {
    while (true) {
        const betAmount = prompt("Bet amount: ");
        const numberBetAmount = parseFloat(betAmount);

        if (isNaN(numberBetAmount) || numberBetAmount <= 0 || numberBetAmount > depositAmount || numberBetAmount > depositAmount / lines) {
            console.log("Invalid bet amount, try again.");
        } else {
            return numberBetAmount;
        }
    }
}

const spin = () => {
    const symbols = [];
    for(const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }
    const reels = [];
    for(let i = 0; i < COLUMNS; i++){
        reels.push([]);
        const reelSymbols = [...symbols]; //copy what we have in symbols to here. we have this new array to aid in removal
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length)
            const selectedSymbol = reelSymbols[randomIndex]
            reels[i].push(selectedSymbol)
            reelSymbols.splice(randomIndex, 1)
        }
    }
    transpose(reels);
    return reels;
}

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++){
        rows.push([]);
        for (let j = 0; j < 0; j++){
            rows[i].push(reels[j][i]);
        }
    }
}

const printRows = (matrix) => {
    for (const row of matrix) {
        let rowString = "";
        for(const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != (matrix.length - 1)) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

const checkWin = (depositAmount, lines, betAmount, spun) => {
    //need to check the rows to see if they match to declare a win or a loss...
    //check rows
    //if win, add winning, if loss, subtract bet from deposit
    // var balance; ...just made it local
    let count = 0;
    let multiplier = 0;
    //the result of spun is an array of columns the work done here is the check to see if the rows are right 
    //without manipulating the reels

    const isColumnEqual = (matrix, colIndex) => {
        return matrix.every((row) => row[colIndex] === matrix[0][colIndex]);
    };

    const isRowEqual = (matrix, i) => {
        return matrix.every((element) => element === matrix[i]);
    }

    // for (let i = 0; i < COLUMNS; i++) {
    //     if (isColumnEqual(spun, i)) {
    //       count++;
    //     }       
    // }

    for (let i = 0; i < ROWS; i++) {
      if (isRowEqual(spun, i)) {
        count++;
      }
    }

    if (count === 0) {
        const balance = depositAmount - betAmount*lines;
        console.log("Balance: " + balance);
    }
    else{
        const winning = betAmount * Math.min(lines, count);
        const balance = depositAmount + winning;
        console.log("You have won $" + winning + "! New balance: " + balance);
    }
}

const depositAmount = deposit();
const lines = getNumberOfLines();
const betAmount = getBetAmount(depositAmount, lines);
const spun = spin();
// console.table(spun);
printRows(spun);
checkWin(depositAmount, lines, betAmount, spun);