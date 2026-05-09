// 1. 가장 큰 값 찾기 
function challenge1(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

// 2. 두 수 합 계산 시간 비교 
function challenge2(N) {
  
  // O(n)
  function sum_v1(N) {
    let sum = 0;
    for (let i = 1; i <= N; i++) {
      sum += i;
    }
    return sum;
  }

  // O(1)
  function sum_v2(N) {
    return (N * (N + 1)) / 2;
  }

  const start1 = performance.now();
  sum_v1(N);
  const end1 = performance.now();

  const start2 = performance.now();
  sum_v2(N);
  const end2 = performance.now();

  return (end1 - start1) < (end2 - start2) ? 'sum_v1' : 'sum_v2';
}

// 3. 학생 점수 관리 시스템 구현
function challenge3() {
  const students = new Map();

   return {
    addStudent(name, score) {
      students.set(name, score);
    },
    getScore(name) {
      return students.has(name) ? students.get(name) : null;
    }
  };

}


// 4. 리스트에서 특정 값 제거 
function challenge4(arr, value) {
  const result = [ ];

  for (let i = 0; i<arr.length; i++){
    if (arr[i] !== value) {
      result.push(arr[i]);
    }
  }

  return result;
}

// 5. 배열 뒤집기 
function challenge5(arr) {
  const result = [ ];
  
  for (let i = arr.length - 1; i >= 0; i--) {
    result.push(arr[i]);
  }
  
  return result;
}