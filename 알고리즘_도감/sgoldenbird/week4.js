// 1. 최초 등장 값 찾기
function solution1(arr, target) {
  for (let i of arr) {
    if(i === target) return arr[i]; 
  }
  return -1; 
}

// 2. 정렬된 배열에서의 값 위치 찾기
function solution2(nums, target) {
  let left = 0;
  let right = nums.length-1;

  while (left <= right){
    const mid = Math.floor((left+right)/2);

    if (nums[mid] === target){
      return mid;
    }else if (nums[mid] < target){
      left = mid+1; // 탐색 범위를 오른쪽 절반으로 좁힙니다.
    }else {
      right = mid-1; // 탐색 범위를 왼쪽 절반으로 좁힙니다.
    }
  }

  return left;  // 반복문이 끝날 때까지 target을 찾지 못했다면, left 포인터가 가리키는 위치가 target이 삽입되어야 할 올바른 인덱스가 됩니다.
}

// 3. 주어진 노드로부터 연결된 노드 개수 세기
function solution3(adj, startNode) {
    return adj[startNode].length;
}


// 4. 가장 가까운 연결된 노드 찾기
function solution4(adj, startNode, targetNode) {
  if (startNode === targetNode) return 0;

  // 방문 여부를 기록할 배열을 만듭니다. (노드 개수만큼 false로 초기화)
  const visited = new Array(adj.length).fill(false);
    
  // 큐를 생성하고 [현재 노드 번호, 현재까지의 경로 길이] 형태로 시작 노드를 넣습니다.
  const queue = [[startNode, 0]];
  visited[startNode] = true; // 시작 노드 방문 표시

  // 큐가 빌 때까지 반복합니다.
  while (queue.length > 0) {
    // 가장 앞에 있는 노드 정보를 꺼냅니다.
    const [currentNode, currentDistance] = queue.shift();

    // 현재 꺼낸 노드가 목표 노드라면, 이때의 거리가 최단 거리이므로 즉시 반환합니다.
    if (currentNode === targetNode) {
        return currentDistance;
    }

    // 현재 노드와 직접 연결된 이웃 노드들을 살펴봅니다.
    const neighbors = adj[currentNode];
    for (let i = 0; i < neighbors.length; i++) {
      const nextNode = neighbors[i];

      // 아직 방문하지 않은 이웃 노드만 큐에 넣고 방문 표시를 합니다.
      if (!visited[nextNode]) {
          visited[nextNode] = true;
          // 다음 노드로 한 칸 이동하므로 거리를 +1 해줍니다.
          queue.push([nextNode, currentDistance + 1]);
      }
    }
  }

  return -1;
}


// 5. 그래프 경로 존재 여부 확인
function solution5(adj, startNode, targetNode) {
 
  const visited = new Set();

  function dfs(currentNode) {

      if (currentNode === targetNode) {
          return true;
      }

      // 현재 노드를 이미 방문한 적이 있다면 더 이상 들어가지 않고 종료합니다.
      if (visited.has(currentNode)) {
          return false;
      }

      visited.add(currentNode);

      const neighbors = adj[currentNode];
      for (let i = 0; i < neighbors.length; i++) {
          const nextNode = neighbors[i];
          
          // 이웃 노드로 깊숙이 들어갔을 때(재귀 호출) true가 반환된다면
          // 결국 목표 노드를 찾았다는 뜻이므로, 아래에 남은 다른 이웃들은 보지도 않고 true를 위로 쭉 올립니다.
          if (dfs(nextNode)) {
              return true;
          }
      }

      // 모든 이웃을 타고 끝까지 들어가 봤는데도 목표를 못 찾았다면 false를 반환합니다.
      return false;
  }

  // 준비된 재귀 함수에 시작 노드를 넣고 실행한 결과를 그대로 반환합니다.
  return dfs(startNode);
}
