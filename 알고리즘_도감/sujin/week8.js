// 1. 1차원 데이터 클러스터링
function solution1(points) {
  const sorted = [...points].sort((a, b) => a - b);
  const groups = [];
  let currentGroup = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - sorted[i - 1] <= 3) {
      currentGroup.push(sorted[i]);
    } else {
      groups.push(currentGroup);
      currentGroup = [sorted[i]];
    }
  }
  groups.push(currentGroup);

  const averages = groups.map((g) => g.reduce((sum, v) => sum + v, 0) / g.length);
  return averages.sort((a, b) => a - b);
}

// 2. K-Means 알고리즘의 1단계 업데이트
function solution2(points, centroids) {
  const nClusters = centroids.length;
  const assignments = Array.from({ length: nClusters }, () => []);

  // 할당 단계
  for (const p of points) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let idx = 0; idx < centroids.length; idx++) {
      const c = centroids[idx];
      const dist = Math.sqrt((p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2);
      if (dist < bestDist) {
        // 동률이면 더 작은 인덱스 유지
        bestDist = dist;
        bestIdx = idx;
      }
    }
    assignments[bestIdx].push(p);
  }

  // 업데이트 단계
  const newCentroids = centroids.map((c, idx) => {
    const group = assignments[idx];
    if (group.length === 0) {
      return c; // 빈 클러스터는 이전 위치 유지
    }
    const avgX = group.reduce((sum, p) => sum + p[0], 0) / group.length;
    const avgY = group.reduce((sum, p) => sum + p[1], 0) / group.length;
    return [avgX, avgY];
  });

  return newCentroids;
}

// 3. 두 점 사이의 거리 계산
function solution3(p1, p2) {
  return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}

// 4. 소수 여부 판별
function solution4(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;

  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

// 5. 간단한 페이지랭크(PageRank) 업데이트
function solution5(links, ranks) {
  // 역방향 그래프 구성 (각 페이지를 누가 가리키는지)
  const incoming = {};
  for (const page in links) {
    incoming[page] = [];
  }
  for (const source in links) {
    for (const target of links[source]) {
      incoming[target].push(source);
    }
  }

  const newRanks = {};
  for (const page in links) {
    if (incoming[page].length === 0) {
      newRanks[page] = 0;
    } else {
      let total = 0;
      for (const source of incoming[page]) {
        const outDegree = links[source].length;
        total += ranks[source] / outDegree;
      }
      newRanks[page] = total;
    }
  }

  return newRanks;
}

// 6. 원반 옮기기 (하노이의 탑)
function solution6(n, start, aux, end) {
  const moves = [];

  function solve(k, src, mid, dst) {
    if (k === 0) return;
    // 1) k-1개의 원반을 src에서 mid로 옮김 (dst를 보조로 사용)
    solve(k - 1, src, dst, mid);
    // 2) k번 원반을 src에서 dst로 옮김
    moves.push(`${k} from ${src} to ${dst}`);
    // 3) k-1개의 원반을 mid에서 dst로 옮김 (src를 보조로 사용)
    solve(k - 1, mid, src, dst);
  }

  solve(n, start, aux, end);
  return moves;
}
