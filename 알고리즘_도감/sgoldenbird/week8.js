// 1. 1차원 데이터 클러스터링
function solution1(points) {
  if (points.length === 0) return [];

  points.sort((a, b) => a - b);

  const result = [];
  let currentGroup = [points[0]];

  for (let i = 1; i < points.length; i++) {
    if (points[i] - points[i - 1] <= 3) {
      currentGroup.push(points[i]);
    } else {
      const sum = currentGroup.reduce((acc, val) => acc + val, 0);
      result.push(sum / currentGroup.length);
      currentGroup = [points[i]];
    }
  }

  const sum = currentGroup.reduce((acc, val) => acc + val, 0);
  result.push(sum / currentGroup.length);

  return result;
}

// 2. K-Means 알고리즘의 1단계 업데이트
function solution2(points, centroids) {
  // 1. 각 중심점별로 할당된 포인트들을 저장할 배열 초기화
  // centroids의 인덱스에 매칭되도록 빈 배열 생성 (예: [[], []])
  const groups = centroids.map(() => []);

  // 2. 할당 단계 (Assignment): 각 포인트를 가장 가까운 중심점에 배정
  for (const point of points) {
    let minDistance = Infinity;
    let closestIndex = 0;

    for (let i = 0; i < centroids.length; i++) {
      const centroid = centroids[i];

      // 유클리드 거리 계산
      const distance = Math.sqrt(
        Math.pow(point[0] - centroid[0], 2) +
          Math.pow(point[1] - centroid[1], 2),
      );

      // 더 가까운 중심점을 찾은 경우 업데이트
      // (미세하게 거리가 같을 때는 인덱스가 작은 쪽이 유지되도록 '<' 사용)
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    groups[closestIndex].push(point);
  }

  // 3. 업데이트 단계: 각 그룹의 평균 계산
  const updatedCentroids = centroids.map((centroid, i) => {
    const assignedPoints = groups[i];

    // 예외 처리: 할당된 포인트가 없다면 이전 위치 유지
    if (assignedPoints.length === 0) {
      return [...centroid];
    }

    // 해당 중심점에 할당된 포인트들의 x, y 좌표 합산
    let sumX = 0;
    let sumY = 0;
    for (const p of assignedPoints) {
      sumX += p[0];
      sumY += p[1];
    }

    // 새로운 평균 중심점 반환
    return [sumX / assignedPoints.length, sumY / assignedPoints.length];
  });

  return updatedCentroids;
}

// 3. 두 점 사이의 거리 계산
function solution3(p1, p2) {
  const diffX = p1[0] - p2[0];
  const diffY = p1[1] - p2[1];

  return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
}

// 4. 소수 여부 판별
function solution4(n) {
  if (n <= 1) return false;
  if (n === 2) return true;

  const sqrt = Math.sqrt(n);

  for (let i = 2; i <= sqrt; i++) {
    if (n % i === 0) {
      return false;
    }
  }

  return true;
}

// 5. 간단한 페이지랭크(PageRank) 업데이트
function solution5(links, ranks) {
  // 1. 모든 페이지의 새로운 랭크를 0으로 초기화한 객체 생성
  const newRanks = {};
  for (const page in ranks) {
    newRanks[page] = 0;
  }

  // 2. 각 페이지가 가진 현재 랭크를 아웃링크 대상들에게 나누어주기
  for (const fromPage in links) {
    const targetPages = links[fromPage];
    const outLinkCount = targetPages.length;

    // 만약 다른 곳으로 가는 링크(아웃링크)가 없다면 점수를 나눠주지 못하고 소멸됨
    if (outLinkCount === 0) continue;

    // 이웃 페이지들에게 나눠줄 분배량 계산 = (현재 페이지 랭크 / 아웃링크 수)
    const distributedRank = ranks[fromPage] / outLinkCount;

    // 연결된 타겟 페이지들의 새 랭크에 누적 합산
    for (const toPage of targetPages) {
      if (toPage in newRanks) {
        newRanks[toPage] += distributedRank;
      }
    }
  }

  return newRanks;
}

// 6. 원반 옮기기
function solution6(n, start, aux, end) {
  const moves = [];

  function hanoi(num, from, to, assist) {
    if (num === 0) return;

    // 1단계: 맨 밑의 원반을 제외한 위쪽의 n-1개 원반을 보조 기둥으로 대피시킴
    hanoi(num - 1, from, assist, to);

    // 2단계: 맨 밑에 남은 가장 큰 원반을 목표 기둥으로 이동
    moves.push(`${num} from ${from} to ${to}`);

    // 3단계: 보조 기둥에 대피시켰던 n-1개 원반을 다시 목표 기둥으로 이동
    hanoi(num - 1, assist, to, from);
  }

  // 하노이 함수 시작
  hanoi(n, start, end, aux);

  return moves;
}
