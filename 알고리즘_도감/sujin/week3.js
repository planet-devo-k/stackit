function solution1(arr) {
  let answer = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < answer) answer = arr[i];
  }
}

function solution2(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  return arr;
}

function solution3(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;

    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }

    let temp = arr[i];
    arr[i] = arr[minIdx];
    arr[minIdx] = temp;
  }

  return arr;
}
