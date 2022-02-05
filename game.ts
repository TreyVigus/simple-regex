function maxDecision(maxScore: number, minScore: number, nums: number[], winningScore: number): number {
    if(nums.length === 1) {
        if(maxScore + nums[0] === winningScore) {
            return 1;
        } else {
            return 0;
        }
    }
    let localMax = 0;
    for(let i = 0; i < nums.length; i++) {
        if(maxScore + nums[i] === winningScore) {
            return 1;
        }
        const choiceScore = minDecision(maxScore + nums[i], minScore, nums.filter(n => n !== nums[i]), winningScore);
        if(choiceScore > localMax) {
            localMax = choiceScore;
        }
    }
    return localMax;
}

function minDecision(maxScore: number, minScore: number, nums: number[], winningScore: number): number {
    let localMin = 0;
    for(let i = 0; i < nums.length; i++) {
        if(minScore + nums[i] === winningScore) {
            return -1;
        }
        const choiceScore = maxDecision(maxScore, minScore + nums[i], nums.filter(n => n !== nums[i]), winningScore);
        if(choiceScore < localMin) {
            localMin = choiceScore;
        }
    }
    return localMin;
}


const choices = [];
for(let i = 1; i <= 9; i++) {
    choices.push(i);
}

for(let i = 1; i <= 15; i++) {
    const res = maxDecision(0, 0, choices, i);
    console.log("winning score: ", i, " winner: ", res);
}