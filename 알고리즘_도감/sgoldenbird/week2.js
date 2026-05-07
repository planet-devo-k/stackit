// 1. 괄호 유효성 검사 
function solution1(S) {
  const stack = [];
  const pairs = {
    ')': '(',
    '}': '{',
    ']': '['
  };

  for (let char of S) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } 
    else if (pairs[char]) {
      const topElement = stack.pop();
      if (topElement !== pairs[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}
 

// 2. 최근 N개의 요청 추적기
function solution2(N, arr) {
  const queue = [];
  const count = [];
  
  for (let i = 0; i < arr.length; i++) {
    queue.push(arr[i]);
    
    if (queue.length > N) {
      // queue.shift();
      for (let j = 0; j < queue.length - 1; j++) {
        queue[j] = queue[j + 1];
      }
      queue.pop();
    }

    count[i] = queue.length;
}
  return count;
}

// 3. 단어 빈도수 계산
function solution3(sentence) {
  if (!sentence || sentence.trim() === "") {
    return {};
  }

  const lowerSentence = sentence.toLowerCase();
  const result = {};
  let currentWord = "";
  
  for (let i = 0; i < lowerSentence.length; i++) {
    const char = lowerSentence[i];

    if (char >= 'a' && char <= 'z') {
      currentWord += char;
    } else {
      if (currentWord.length > 0) {
        result[currentWord] = (result[currentWord] || 0) + 1;
        currentWord = ""; 
      }
    }
  }

  // 문장이 단어로 끝날 경우, 마지막 단어 처리
  if (currentWord.length > 0) {
    result[currentWord] = (result[currentWord] || 0) + 1;
  }

  return result;

}


// 4. K번째로 작은 값 찾기
class Heap {
  constructor() {
    this.heap = [];
  }

  push(val) {
    this.heap.push(val);
    this.bubbleUp();
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop(); // 마지막 요소를 루트로 이동
    this.bubbleDown();
    return min;
  }

  bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex] <= this.heap[index]) break;
      
      // 부모보다 작으면 교체
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  bubbleDown() {
    let index = 0;
    const length = this.heap.length;

    while (true) {
      let leftChildIndex = index * 2 + 1;
      let rightChildIndex = index * 2 + 2;
      let smallest = index;

      if (leftChildIndex < length && this.heap[leftChildIndex] < this.heap[smallest]) {
        smallest = leftChildIndex;
      }

      if (rightChildIndex < length && this.heap[rightChildIndex] < this.heap[smallest]) {
        smallest = rightChildIndex;
      }

      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}

function solution4(arr, K) {
  
  let result;
  const heap = new Heap();

 
  for (const num of arr) {
    heap.push(num);
  }

  for (let i = 0; i < K; i++) {
    result = heap.pop();
  }

  return result;

}

/* 5. 이진 탐색 트리 삽입
- 1단계: 배열의 숫자를 하나씩 꺼내 이진 탐색 트리(BST)를 만든다. 
- 2단계: 만들어진 트리를 층별로 훑으면서(BFS) 배열로 다시 만든다. 
*/
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

function solution5(arr) {
  if (arr.length === 0) return [];

  let root = null;

  // 1단계: BST 삽입 로직
  const insert = (node, val) => {
    if (node === null) return new TreeNode(val);

    if (val < node.val) {
      node.left = insert(node.left, val);
    } else if (val > node.val) {
      node.right = insert(node.right, val);
    }
    // 값이 같으면(중복) 아무것도 하지 않고 현재 노드 반환
    return node;
  };

  // 모든 숫자를 트리에 삽입
  arr.forEach((num) => {
    root = insert(root, num);
  });

  // 2단계: BFS(레벨 순회) 로직
  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const current = queue.shift();

    if (current) {
      result.push(current.val);
      // 자식이 null이더라도 일단 큐에 넣어서 위치를 표시함
      queue.push(current.left);
      queue.push(current.right);
    } else {
      result.push(null);
    }
  }

  // 3단계: 마지막의 trailing null 제거
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }

  return result;

}