// 1. 정렬의 기본: 최소값 찾기 
function solution1(arr) {
  let min = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
        min = arr[i];
    }
  }

  return min;
}

// 2. 버블 정렬: 인접 요소 교환
function solution2(arr) {
  for (let i = 0; i < arr.length-1; i++) {

    for (let j = 0; j< arr.length-1-i; j++ ){
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }

  return arr[arr.length - 1];
}

// 3. 선택 정렬: 최소값 선택
function solution3(arr) {
  for (let i = 0; i < arr.length-1; i++) {
        let minIndex = i;

    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
  
    if (minIndex !== i) {
      let temp = arr[i];
      arr[i] = arr[minIndex];
      arr[minIndex] = temp;
    }
  }

  return arr[1];
}


// 4. 삽입 정렬: 삽입 위치 찾기
function solution4(arr) {
  for (let i = 1; i < arr.length; i++) {
        let currentVal = arr[i]; 
        let j = i - 1; 

        while (j >= 0 && arr[j] > currentVal) {
            arr[j + 1] = arr[j]; 
            j--; 
        }

        arr[j + 1] = currentVal;
    }

  return arr[0];
}


// 5. 힙 정렬: 최대값 추출
function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

function maxHeapify(arr, size, i) {
  let largest = i;       
  let left = 2 * i + 1;  
  let right = 2 * i + 2; 

  if (left < size && arr[left] > arr[largest]) {
      largest = left;
  }

  // 오른쪽 자식이 존재하고, 현재까지 가장 큰 값보다 크다면 largest 갱신
  if (right < size && arr[right] > arr[largest]) {
      largest = right;
  }

  // 부모보다 큰 자식이 있다면 위치를 교환하고, 자식 노드로 내려가며 재귀적으로 heapify 수행
  if (largest !== i) {
      swap(arr, i, largest);
      maxHeapify(arr, size, largest);
  }
}

function solution5(arr) {
  let heapSize = arr.length;

  // 1. 최대 힙 생성 (Build Heap)
  // 자식이 있는 마지막 부모 노드(heapSize / 2 - 1)부터 역순으로 heapify를 수행합니다.
  for (let i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {
      maxHeapify(arr, heapSize, i);
  }

  // 2. 가장 큰 값(루트 노드, 인덱스 0)을 배열의 맨 뒤로 보냅니다.
  swap(arr, 0, heapSize - 1);
  
  // 힙 크기를 1 줄여서 가장 큰 값을 힙에서 제외합니다.
  heapSize--;

  // 3. 루트 노드가 바뀌었으므로 다시 힙 속성을 만족하도록 재정렬합니다.
  maxHeapify(arr, heapSize, 0);

  // 4. 이제 다시 루트 노드(인덱스 0)에 두 번째로 큰 값이 위치하게 됩니다.
  return arr[0];
}

// 6. 병합 정렬: 분할 정복

// 배열을 반으로 쪼개는 재귀 함수
function mergeSort(arr) {
  if (arr.length <= 1) {
      return arr;
  }

  // 중간 지점을 찾아 배열을 왼쪽과 오른쪽으로 나눕니다.
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  // 쪼갠 양쪽을 각각 다시 정렬한 후 병합합니다.
  return merge(mergeSort(left), mergeSort(right));
}

// 정렬된 두 배열을 하나로 합치는 함수
function merge(left, right) {
  const result = [];
  let i = 0; // left 배열을 가리키는 포인터
  let j = 0; // right 배열을 가리키는 포인터

  while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
          result.push(left[i]);
          i++;
      } else {
          result.push(right[j]);
          j++;
      }
  }

  // 한쪽 배열이 먼저 비었을 때, 남은 요소들을 결과 배열에 뒤이어 붙여줍니다.
  return result.concat(left.slice(i)).concat(right.slice(j));
}

function solution6(arr) {
  // 1. 병합 정렬을 통해 배열을 오름차순으로 정렬합니다.
  const sortedArr = mergeSort(arr);
  
  let midIndex;
  
  // 2. 중간 인덱스를 계산합니다.
  if (sortedArr.length % 2 === 0) {
      // 길이가 짝수일 때 (예: 길이 4 -> 인덱스 1, 2 중 왼쪽인 1 선택)
      midIndex = ( sortedArr.length / 2) - 1;
  } else {
      midIndex = Math.floor( sortedArr.length / 2);
  }
  
  return sortedArr[midIndex];
}

// 7. 퀵 정렬: 피벗 선택
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[0]; // 문제 조건에 따라 첫 번째 요소를 피벗으로 선택합니다.
    const left = [];
    const right = [];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);  // 피벗보다 작은 값은 왼쪽 배열로
        } else {
            right.push(arr[i]); // 피벗보다 크거나 같은 값은 오른쪽 배열로
        }
    }

    // 쪼개진 왼쪽과 오른쪽 배열을 각각 다시 퀵 정렬하고, 피벗과 하나로 합칩니다.
    return [...quickSort(left), pivot, ...quickSort(right)];
}

function solution7(arr) {
    const sortedArr = quickSort(arr);

    const firstElement = sortedArr[0];
    const lastElement = sortedArr[sortedArr.length - 1];

    return firstElement + lastElement;
}