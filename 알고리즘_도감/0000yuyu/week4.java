import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Objects;
import java.util.Queue;

public class week4 {

  public static void main(String[] args) {
    System.out.println("Q1   : " + challenge1(new int[]{3, 1, 4, 1, 5, 9, 2, 6, 1}, 1));
    System.out.println("Q2-1 : " + challenge2(new int[]{1, 3, 5, 6}, 5));
    System.out.println("Q2-2 : " + challenge2(new int[]{1, 3, 4, 5, 6, 7, 8, 9}, 2));
    System.out.println("Q3   : " + challenge3(new int[][]{{1, 2}, {0, 3}, {0}, {1}}, 0));
    System.out.println("Q4-1 : " + challenge4(new int[][]{{1, 2}, {0, 3}, {0}, {1}}, 0, 3));
    System.out.println("Q4-2 : " + challenge4(new int[][]{{1}, {0, 3}, {0, 4}, {1, 2}, {1}}, 0, 4));
    System.out.println("Q5-1 : " + challenge5(new int[][]{{1, 2}, {0, 3}, {0}, {1}}, 0, 3));
    System.out.println("Q5-2 : " + challenge5(new int[][]{{1}, {0, 3}, {0, 1}, {1, 2}, {1}}, 0, 4));
  }

  //최조 등장 값 찾기
  static int challenge1(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
      if (Objects.equals(arr[i], target)) {
        return i;
      }
    }
    return -1;
  }

  // 정렬된 배열에서의 값 위치 찾기
  static int challenge2(int[] arr, int target) {
    return binSearch(arr, 0, arr.length - 1, target);
  }

  private static int binSearch(int[] arr, int start, int end, int target) {
    if (start > end) {
      return -1;
    }
    int mid = (start + end) / 2;
    if (Objects.equals(arr[mid], target)) {
      return mid;
    }
    if (target < arr[mid]) {
      return binSearch(arr, start, mid - 1, target);
    } else {
      return binSearch(arr, mid + 1, end, target);
    }
  }

  // 주어진 노드로부터 연결된 노드 개수 세기
  static int challenge3(int[][] adj, int startNode) {
    return adj[startNode].length;
  }

  // 그래프 너비 우선 탐색
  static int challenge4(int[][] adj, int startNode, int targetNode) {
    Queue<Integer> queue = new LinkedList<>();
    Map<Integer, Integer> dist = new HashMap<>();

    queue.add(startNode);
    dist.put(startNode, 0);

    while (!queue.isEmpty()) {
      int current = queue.poll();

      if (current == targetNode) {
        return dist.get(current);
      }

      for (int neighbor : adj[current]) {
        if (!dist.containsKey(neighbor)) {
          dist.put(neighbor, dist.get(current) + 1);
          queue.add(neighbor);
        }
      }
    }
    return -1;
  }

  // 그래프 깊이 우선 탐색 (도달 가능한지만 판단)
  static boolean challenge5(int[][] adj, int startNode, int targetNode) {
    boolean[] visited = new boolean[adj.length];
    return dfs(adj, startNode, targetNode, visited);
  }

  private static boolean dfs(int[][] adj, int currentNode, int targetNode, boolean[] visited) {
    if (currentNode == targetNode) {
      return true;
    }
    visited[currentNode] = true;
    for (int neighbor : adj[currentNode]) {
      if (!visited[neighbor]) {
        if (dfs(adj, neighbor, targetNode, visited)) {
          return true;
        }
      }
    }
    return false;
  }
}

