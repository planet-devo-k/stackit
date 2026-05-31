import fs from "fs";

// 1. 벨먼-포드: 음수 가중치 경로 찾기
function solution1() {
  // 예제 입력을 줄바꿈 기준으로 분리하여 가져옵니다.
  const input = fs.readFileSync("/dev/stdin").toString().trim().split("\n");
  if (input.length === 0 || input[0] === "") return;

  // 첫 번째 줄: 정점의 개수 N, 간선의 개수 M
  const [N, M] = input[0].split(" ").map(Number);

  // 간선 정보를 저장할 배열
  const edges = [];

  // 입력 데이터를 파싱하여 간선 리스트를 만듭니다.
  for (let i = 1; i <= M; i++) {
    if (!input[i]) break;
    const [u, v, w] = input[i].split(" ").map(Number);
    edges.push({ from: u, to: v, weight: w });
  }

  // 최단 거리를 저장할 배열 (무한대로 초기화). 정점0은 없으므로 0번 인덱스는 비워둔다.
  const dist = Array(N + 1).fill(Infinity);

  // 시작 정점인 1번의 거리는 0으로 설정
  dist[1] = 0;

  // 1. (N - 1)번만큼 모든 간선을 반복해서 확인하며 거리를 갱신합니다.
  for (let i = 1; i < N; i++) {
    for (const edge of edges) {
      const { from, to, weight } = edge;

      // 현재 간선의 출발 정점이 방문된 적이 있고,
      // 거쳐가는 경로가 기존 경로보다 더 짧다면 갱신
      if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {
        dist[to] = dist[from] + weight;
      }
    }
  }

  // 2. 음수 사이클이 존재하는지 마지막으로 한 번 더 확인합니다.
  // (만약 N-1번 다 돌았는데도 또 거리가 줄어든다면 음수 사이클이 있는 것입니다)
  let hasNegativeCycle = false;
  for (const edge of edges) {
    const { from, to, weight } = edge;
    if (dist[from] !== Infinity && dist[from] + weight < dist[to]) {
      hasNegativeCycle = true;
      break;
    }
  }

  if (hasNegativeCycle) {
    console.log("INF");
    return;
  }

  // 음수 사이클이 없을 때만 정상적인 최단 거리 배열을 출력합니다.
  const result = [];
  for (let i = 1; i <= N; i++) {
    if (dist[i] === Infinity) {
      result.push("INF");
    } else {
      result.push(dist[i]);
    }
  }

  console.log(result.join(" "));
}

solution1();

// 2. 다익스트라: 가장 빠른 경로 탐색
function solution2() {
  // 입력 데이터를 줄바꿈 기준으로 분리합니다.
  const input = fs.readFileSync("/dev/stdin").toString().trim().split("\n");
  if (input.length === 0 || input[0] === "") return;

  // 첫 번째 줄: 정점의 개수 N, 간선의 개수 M
  const [N, M] = input[0].split(" ").map(Number);

  // 인접 리스트 생성 (정점 번호가 1부터 시작하므로 N + 1 크기)
  const graph = Array.from({ length: N + 1 }, () => []);

  // 간선 정보 저장
  for (let i = 1; i <= M; i++) {
    if (!input[i]) break;
    const [u, v, w] = input[i].split(" ").map(Number);
    graph[u].push({ to: v, weight: w });
  }

  // 최단 거리를 저장할 배열 (무한대로 초기화)
  const dist = Array(N + 1).fill(Infinity);
  // 방문 여부를 체크할 배열
  const visited = Array(N + 1).fill(false);

  // 시작 정점인 1번의 거리는 0으로 설정
  dist[1] = 0;

  // 다익스트라 알고리즘 시작 (총 N번 반복)
  for (let i = 0; i < N; i++) {
    // 1. 아직 방문하지 않은 정점 중 거리가 가장 짧은 정점을 찾습니다.
    let minDistance = Infinity;
    let curr = -1;

    for (let j = 1; j <= N; j++) {
      if (!visited[j] && dist[j] < minDistance) {
        minDistance = dist[j];
        curr = j;
      }
    }

    // 만약 더 이상 갈 수 있는 정점이 없다면 종료
    if (curr === -1) break;

    // 찾은 정점을 방문 처리 (확정 도장 쾅!)
    visited[curr] = true;

    // 2. 확정된 정점과 연결된 간선들을 보며 장부를 새로고침합니다.
    for (const edge of graph[curr]) {
      const { to, weight } = edge;

      // 현재 정점을 거쳐서 가는 것이 기존 거리보다 짧다면 갱신
      if (dist[curr] + weight < dist[to]) {
        dist[to] = dist[curr] + weight;
      }
    }
  }

  const result = [];
  for (let i = 1; i <= N; i++) {
    if (dist[i] === Infinity) {
      result.push("INF");
    } else {
      result.push(dist[i]);
    }
  }

  console.log(result.join(" "));
}

solution2();

// 3. A*: 최소 이동 횟수 찾기
function solution3() {
  const input = fs.readFileSync("/dev/stdin").toString().trim().split("\n");
  if (input.length === 0 || input[0] === "") return;

  // 1) 입력 파싱
  const [R, C] = input[0].split(" ").map(Number);
  const map = [];
  let start = null;
  let end = null;

  for (let i = 1; i <= R; i++) {
    const row = input[i].trim().split("");
    map.push(row);

    // 시작 지점(S)과 목표 지점(E) 위치 찾기
    for (let j = 0; j < C; j++) {
      if (row[j] === "S") start = { r: i - 1, c: j };
      if (row[j] === "E") end = { r: i - 1, c: j };
    }
  }

  // 2) 8방향 이동 벡터 (상하좌우 + 대각선 4방향)
  const dr = [-1, 1, 0, 0, -1, -1, 1, 1];
  const dc = [0, 0, -1, 1, -1, 1, -1, 1];

  // 3) 휴리스틱 함수: 체비쇼프 거리
  // 대각선 이동 비용이 상하좌우와 같은 1일 때 가장 정확한 예측 지표가 됩니다.
  function heuristic(p1, p2) {
    return Math.max(Math.abs(p1.r - p2.r), Math.abs(p1.c - p2.c));
  }

  // 4) A* 알고리즘 데이터 구조 설정
  // 방문 여부 및 시작점으로부터의 최소 비용(gScore) 기록 배열
  const gScore = Array.from({ length: R }, () => Array(C).fill(Infinity));
  gScore[start.r][start.c] = 0;

  // 탐색 예정인 노드들을 담는 openSet (우선순위 큐를 쓰면 좋으나, 맵이 최대 50x50으로 작으므로 배열로 구현)
  const openSet = [];
  openSet.push({
    r: start.r,
    c: start.c,
    g: 0,
    f: heuristic(start, end), // f = g + h
  });

  // 5) 메인 루프
  while (openSet.length > 0) {
    // fScore가 가장 작은 노드를 선택 (A*의 핵심)
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();

    // 목표 지점에 도달했을 때 최소 이동 횟수 반환
    if (current.r === end.r && current.c === end.c) {
      console.log(current.g);
      return;
    }

    // 8방향 탐색
    for (let i = 0; i < 8; i++) {
      const nr = current.r + dr[i];
      const nc = current.c + dc[i];

      // 맵 범위를 벗어나거나 벽(#)인 경우 건너뜀
      if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
      if (map[nr][nc] === "#") continue;

      // 다음 칸으로 이동할 때의 새로운 gScore 계산 (기존 비용 + 1)
      const tentativeGScore = current.g + 1;

      // 새로 계산한 비용이 기존에 기록된 비용보다 작다면 갱신 후 openSet에 추가
      if (tentativeGScore < gScore[nr][nc]) {
        gScore[nr][nc] = tentativeGScore;

        // 이미 openSet에 있는지 확인 후 없으면 추가
        const exists = openSet.some((node) => node.r === nr && node.c === nc);
        if (!exists) {
          openSet.push({
            r: nr,
            c: nc,
            g: tentativeGScore,
            f: tentativeGScore + heuristic({ r: nr, c: nc }, end),
          });
        }
      }
    }
  }

  // openSet이 비어있을 때까지 목적지를 못 찾았다면 도달 불가능한 상태
  console.log(-1);
}

solution3();

/**
 * 차이점
 * 1. 데이터 저장 방식 (간선 리스트 vs 인접 리스트)
 * - 벨만-포드: 모든 간선을 매번 순회해야 하므로 edges = [] 배열 하나에 몽땅 때려 박았습니다.
 * - 다익스트라: "현재 확정된 정점"에서 출발하는 간선만 쏙쏙 골라서 봐야 하므로 graph[u].push(...) 형태로 각 정점별 인접 리스트를 만들었습니다.
 *
 * 2. 핵심 루프의 타겟
 * - 벨만-포드: for (const edge of edges) -> 정점 상태와 상관없이 그냥 전체 간선을 뺑뺑이 돌립니다.
 * - 다익스트라: 내부의 for (let j = 1; j <= N; j++) 루프를 통해 "아직 방문 안 한 정점 중 제일 가까운 정점(curr)"을 골라낸 뒤, 그 정점 주위만 탐색합니다.
 *
 */
