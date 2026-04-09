function challenge1(N) {
  let sum = 0;
  for (let i = 1; i <= N; i++) {
    sum += i;
  }
  return sum;
}

function challenge2(N) {
  let count = 0;
  for (let i = 1; i < N; i++) {
    count++;
  }
  return count;
}

function challenge3(N, names) {
  const storage = [];

  for (let i = 0; i < N; i++) {
    storage.push(names[i]);
  }

  // 저장된 내용을 순서대로 출력
  storage.forEach((name) => console.log(name));
}

function challenge4(N, numbers) {
  const list = [];
  for (let i = 0; i < N; i++) {
    list.push(numbers[i]);
  }

  // 마지막 인덱스는 (전체 길이 - 1)입니다.
  return list[list.length - 1];
}

function challenge5(K) {
  const arr = [10, 20, 30, 40, 50];

  // K가 인덱스 범위를 벗어나지 않는지 확인하는 습관을 들이면 좋습니다.
  return arr[K];
}
