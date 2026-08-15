// 1. 최초 등장 값 찾기
function solution1(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// 2. 정렬된 배열에서의 값 위치 찾기
function solution2(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (target > nums[mid]) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return left;
}

// 3. 주어진 노드로부터 연결된 노드 개수 세기
function solution3(adj, startNode) {
  return adj[startNode].length;
}

// 4. 가장 가까운 연결된 노드 찾기
function solution4(adj, startNode, targetNode) {
  const queue = [[startNode, 0]];
  const visited = [startNode];
  while (queue.length !== 0) {
    let deQueue = queue.shift();
    if (deQueue[0] === targetNode) return deQueue[1];
    for (let i of adj[deQueue[0]]) {
      if (!visited.includes(i)) {
        queue.push([i, deQueue[1] + 1]);
        visited.push(i);
      }
    }
  }
  return -1;
}

// 5. 그래프 경로 존재 여부 확인
function solution5(adj, startNode, targetNode) {
  const stack = [startNode];
  const visited = [startNode];
  while (stack.length !== 0) {
    let popped = stack.pop();
    if (targetNode === popped) return true;
    for (let i of adj[popped]) {
      if (!visited.includes(i)) {
        visited.push(i);
        stack.push(i);
      }
    }
  }
  return false;
}

console.log(solution5([[1, 2], [0, 3], [0], [1]], 0, 3));
