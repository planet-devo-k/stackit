import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.PriorityQueue;

class week5 {
    static final int INF = Integer.MAX_VALUE;
    static final int[][] vector = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    public static void main(String[] args) {
        int[][] bellmanFordEdges = new int[][] {
            {1, 2, 1},
            {1, 3, 4},
            {2, 3, -3},
            {3, 4, 2},
            {4, 1, -1}
        };

        int[][] dijkstraEdges = new int[][] {
            {1, 2, 2},
            {1, 3, 4},
            {2, 3, 1},
            {2, 4, 7},
            {3, 5, 3},
            {4, 5, 1}
        };

        char[][] map = new char[][] {
            {'S', '.', 'E'},
            {'.', '.', '.'},
            {'.', '.', '.'}
        };

        System.out.println(solution1(4, bellmanFordEdges));
        System.out.println(solution2(5, dijkstraEdges));
        System.out.println(solution3(map));
    }

    /**
     * 1. 음수 가중치 경로 찾기
     *   - 시작 정점 1의 거리를 0으로 두고 나머지는 INF로 초기화
     *   - 모든 간선을 N - 1번 확인하며 더 짧은 거리를 찾으면 갱신
     *   - 도달할 수 없는 정점은 INF로 출력
     *   - 문제 출력이 이상하긴함.. 음수사이클이 있어서 이게 답을 낼수가 없을 것 같은데
     * @param n
     * @param edges
     * @return
     */
    static String solution1(int n, int[][] edges) {
        List<Edge> graph = new ArrayList<>();

        for (int[] edge : edges) {
            graph.add(new Edge(edge[0], edge[1], edge[2]));
        }

        int[] dist = new int[n + 1];
        Arrays.fill(dist, INF);
        dist[1] = 0;

        for (int i = 0; i < n - 1; i++) {
            boolean updated = false;

            for (Edge edge : graph) {
                if (dist[edge.from] == INF) {
                    continue;
                }

                if (dist[edge.to] > dist[edge.from] + edge.weight) {
                    dist[edge.to] = dist[edge.from] + edge.weight;
                    updated = true;
                }
            }

            if (!updated) {
                break;
            }
        }

        for (Edge edge : graph) {
            if (dist[edge.from] != INF && dist[edge.to] > dist[edge.from] + edge.weight) {
                throw new RuntimeException("음수 사이클");
            }
        }

        return formatDist(dist, n);
    }

    /**
     * 2. 가장 빠른 경로 탐색
     *   - 인접 리스트로 그래프를 구성
     *   - 우선순위 큐에서 현재 가장 가까운 정점을 먼저 꺼냄
     *   - 이미 저장된 거리보다 긴 경로는 무시
     * @param n
     * @param edges
     * @return
     */
    @SuppressWarnings("unchecked")
    static String solution2(int n, int[][] edges) {
        List<Node>[] graph = new ArrayList[n + 1];

        for (int i = 1; i <= n; i++) {
            graph[i] = new ArrayList<>();
        }

        for (int[] edge : edges) {
            graph[edge[0]].add(new Node(edge[1], edge[2]));
        }

        int[] dist = new int[n + 1];
        Arrays.fill(dist, INF);
        dist[1] = 0;

        PriorityQueue<Element> priorityQueue = new PriorityQueue<>();
        priorityQueue.add(new Element(0, 1));

        while (!priorityQueue.isEmpty()) {
            Element current = priorityQueue.poll();

            if (current.dist > dist[current.index]) {
                continue;
            }

            for (Node next : graph[current.index]) {
                int nextDist = current.dist + next.weight;

                if (nextDist < dist[next.index]) {
                    dist[next.index] = nextDist;
                    priorityQueue.add(new Element(nextDist, next.index));
                }
            }
        }

        return formatDist(dist, n);
    }

    /**
     * 3. 최소 이동 횟수 찾기
     *   - 현재까지 이동한 비용과 목표까지의 예상 거리(맨해튼 거리)를 함께 사용
     *   - 예상 총 비용이 가장 작은 칸부터 탐색
     *   - 목표 지점에 도착하면 현재 이동 횟수를 반환
     * @param map
     * @return
     */
    static int solution3(char[][] map) {
        int rowCount = map.length;
        int colCount = map[0].length;
        Point start = null;
        Point end = null;

        for (int row = 0; row < rowCount; row++) {
            for (int col = 0; col < colCount; col++) {
                if (map[row][col] == 'S') {
                    start = new Point(row, col);
                }

                if (map[row][col] == 'E') {
                    end = new Point(row, col);
                }
            }
        }

        int[][] cost = new int[rowCount][colCount];

        for (int row = 0; row < rowCount; row++) {
            Arrays.fill(cost[row], Integer.MAX_VALUE);
        }

        PriorityQueue<PointDist> priorityQueue = new PriorityQueue<>((a, b) -> Integer.compare(a.fCost, b.fCost));
        cost[start.row][start.col] = 0;
        priorityQueue.add(new PointDist(start.row, start.col, 0, manhattanDist(start.row, start.col, end)));

        while (!priorityQueue.isEmpty()) {
            PointDist current = priorityQueue.poll();

            if (current.moveCount > cost[current.row][current.col]) {
                continue;
            }

            if (current.row == end.row && current.col == end.col) {
                return current.moveCount;
            }

            for (int[] v : vector) {
                int nextRow = current.row + v[0];
                int nextCol = current.col + v[1];

                if (nextRow < 0 || nextRow >= rowCount || nextCol < 0 || nextCol >= colCount) {
                    continue;
                }

                if (map[nextRow][nextCol] == '#') {
                    continue;
                }

                int nextMoveCount = current.moveCount + 1;

                if (nextMoveCount < cost[nextRow][nextCol]) {
                    cost[nextRow][nextCol] = nextMoveCount;
                    int fCost = nextMoveCount + manhattanDist(nextRow, nextCol, end);
                    priorityQueue.add(new PointDist(nextRow, nextCol, nextMoveCount, fCost));
                }
            }
        }

        return -1;
    }

    static int manhattanDist(int row, int col, Point end) {
        return Math.abs(row - end.row) + Math.abs(col - end.col);
    }

    static String formatDist(int[] dist, int n) {
        StringBuilder result = new StringBuilder();

        for (int i = 1; i <= n; i++) {
            if (i > 1) {
                result.append(" ");
            }

            if (dist[i] == INF) {
                result.append("INF");
            } else {
                result.append(dist[i]);
            }
        }

        return result.toString();
    }

    static class Edge {
        int from;
        int to;
        int weight;

        Edge(int from, int to, int weight) {
            this.from = from;
            this.to = to;
            this.weight = weight;
        }

        Edge(int to, int weight) {
            this.to = to;
            this.weight = weight;
        }
    }

    static class Node {
        int index;
        int weight;

        Node(int index, int weight) {
            this.index = index;
            this.weight = weight;
        }
    }

    static class Element implements Comparable<Element> {
        int dist;
        int index;

        Element(int dist, int index) {
            this.dist = dist;
            this.index = index;
        }

        @Override
        public int compareTo(Element element) {
            return this.dist - element.dist;
        }
    }

    static class Point {
        int row;
        int col;

        Point(int row, int col) {
            this.row = row;
            this.col = col;
        }
    }

    static class PointDist extends Point {
        int moveCount;
        int fCost;

        PointDist(int row, int col, int moveCount, int fCost) {
            super(row, col);
            this.moveCount = moveCount;
            this.fCost = fCost;
        }
    }
}
