import java.util.LinkedList;
import java.util.Queue;

class week4 {
    public static void main(String[] args) {
        int[][] adj = new int[][] {
            {1, 2},
            {0, 3},
            {0},
            {1}
        };

        System.out.println(solution1(new int[] {3, 1, 4, 1, 5, 9, 2, 6}, 1));
        System.out.println(solution2(new int[] {1, 3, 5, 6}, 5));
        System.out.println(solution3(adj, 0));
        System.out.println(solution4(adj, 0, 3));
        System.out.println(solution5(adj, 0, 3));
    }

    /**
     * 1. 최초 등장 값 찾기
     *   - 배열을 처음부터 순서대로 확인
     *   - target을 처음 발견한 인덱스를 반환
     *   - 끝까지 찾지 못하면 -1을 반환
     * @param arr
     * @param target
     * @return
     */
    static int solution1(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }

        return -1;
    }

    /**
     * 2. 정렬된 배열에서의 값 위치 찾기
     *   - 이진 탐색으로 탐색 범위를 절반씩 줄임
     *   - target이 있으면 해당 인덱스를 반환
     *   - target이 없으면 left가 삽입될 위치가 됨
     * @param nums
     * @param target
     * @return
     */
    static int solution2(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;
        int minIndex = nums.length;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (nums[mid] >= target) {
                minIndex = Math.min(minIndex, mid);
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        return minIndex;
    }

    /**
     * 3. 주어진 노드로부터 연결된 노드 개수 세기
     *   - 인접 리스트에서 startNode 위치의 배열 길이를 확인
     *   - 직접 연결된 노드 개수를 반환
     * @param adj
     * @param startNode
     * @return
     */
    static int solution3(int[][] adj, int startNode) {
        return adj[startNode].length;
    }

    /**
     * 4. 가장 가까운 연결된 노드 찾기
     *   - BFS로 가까운 노드부터 탐색
     *   - targetNode에 도착하면 현재 거리를 반환
     * @param adj
     * @param startNode
     * @param targetNode
     * @return
     */
    static int solution4(int[][] adj, int startNode, int targetNode) {
        boolean[] visited = new boolean[adj.length];
        Queue<Integer> queue = new LinkedList<>();

        queue.add(startNode);
        visited[startNode] = true;
        int distance = 0;

        while (!queue.isEmpty()) {
            int size = queue.size();

            for (int i = 0; i < size; i++) {
                int currentNode = queue.poll();

                if (currentNode == targetNode) {
                    return distance;
                }

                for (int nextNode : adj[currentNode]) {
                    if (!visited[nextNode]) {
                        visited[nextNode] = true;
                        queue.add(nextNode);
                    }
                }
            }

            distance++;
        }

        return -1;
    }

    /**
     * 5. 그래프 경로 존재 여부 확인
     *   - DFS로 한 방향을 최대한 깊게 탐색
     *   - targetNode를 찾으면 true
     *   - 모든 경로를 확인해도 찾지 못하면 false
     * @param adj
     * @param startNode
     * @param targetNode
     * @return
     */
    static boolean solution5(int[][] adj, int startNode, int targetNode) {
        boolean[] visited = new boolean[adj.length];
        return dfs(adj, startNode, targetNode, visited);
    }

    static boolean dfs(int[][] adj, int currentNode, int targetNode, boolean[] visited) {
        if (currentNode == targetNode) {
            return true;
        }

        visited[currentNode] = true;

        for (int nextNode : adj[currentNode]) {
            if (!visited[nextNode] && dfs(adj, nextNode, targetNode, visited)) {
                return true;
            }
        }

        return false;
    }
}
