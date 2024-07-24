// hello -> olleh

function reverseString(text) {
  let result = "";
  for(let i = text.length - 1; i >= 0; i--) {
    result += text[i];
  }
  return result;
}

// console.log(reverseString("O'zbekiston"))

// 0, 1, 1, 2, 3, 5, 8, 13, ...


function isTub(number) {
  let counter = 0;
  for(let i = 0; i<= number/2; i++) {
    if(number % i == 0) {
      counter++;
    }
  }
  return counter >= 2 ? false : true;
}

let fibonachiNumbersCount = 5;

function findFibonachi(count) {
  let firstNum = 0, secondNum = 1;
  let result = [firstNum, secondNum];
  for(let i = 0; i <= count; i++) {
    let thirdNum = firstNum + secondNum;
    firstNum = secondNum;
    secondNum = thirdNum;
    result.push(thirdNum);
  }
  return result;
}

function recursiveFibonachi(numbersCount, firstNum = 0, secondNum = 1, resultArr = []) {
  if(resultArr.length == numbersCount) {
    return resultArr;
  } else {
    let thirdNum = firstNum + secondNum;
    resultArr.push(thirdNum);
    return recursiveFibonachi(numbersCount, secondNum, thirdNum, resultArr);
  }
}

function recursiveFibonachi(numbersCount, firstNum = 0, secondNum = 1, resultArr = [firstNum, secondNum]) {
  if(resultArr.length >= numbersCount) {
    return resultArr.slice(0, numbersCount);
  } else {
    let thirdNum = firstNum + secondNum;
    resultArr.push(thirdNum);
    return recursiveFibonachi(numbersCount, secondNum, thirdNum, resultArr);
  }
}

console.log(recursiveFibonachi(fibonachiNumbersCount));

// printFibobanachiNums(findFibonachi(fibonachiNumbersCount));

function printFibobanachiNums(numbers) {
  numbers.forEach((num) => {
    isTub(num) ? console.log(`${num} - tub`) : console.log(num)
  })
}

