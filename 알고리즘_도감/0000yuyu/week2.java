import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Stack;
import java.util.concurrent.ArrayBlockingQueue;

public class week2 {

  public static void main(String[] args) {
    
    String challenge1_input1 = "([{}])";
    String challenge1_input2 = "}";
    String challenge1_input3 = "e()xa{}m";
    System.out.println(challenge1(challenge1_input1));
    System.out.println(challenge1(challenge1_input2));
    System.out.println(challenge1(challenge1_input3));

    int challenge2_N1 = 3;
    int[] challenge2_request1 = new int[]{97, 98, 99, 100, 101};

    int challenge2_N2 = 1;
    int[] challenge2_request2 = new int[]{10, 20, 30};

    System.out.println(Arrays.toString(challenge2(challenge2_N1, challenge2_request1)));
    System.out.println(Arrays.toString(challenge2(challenge2_N2, challenge2_request2)));

    int challenge2_N3 = 5;
    int[] challenge2_request3 = new int[]{1, 2};

    System.out.println(Arrays.toString(challenge2(challenge2_N3, challenge2_request3)));

    String challenge3_input1 = "This is a test. This test is good";
    String challenge3_input2 = "why? a delicious, banana!";
    String challenge3_input3 = "";
    System.out.println(challenge3(challenge3_input1));
    System.out.println(challenge3(challenge3_input2));
    System.out.println(challenge3(challenge3_input3));

    System.out.println(challenge4(challenge2_N1, challenge2_request1));
    System.out.println(challenge4(challenge2_N2, challenge2_request2));

    int[] challenge5_request1 = new int[]{5, 3, 7, 2, 4, 6, 8};
    System.out.println(Arrays.toString(challenge5(challenge5_request1)));
    int[] challenge5_request2 = new int[]{5, 3, 8, 3, 1};
    System.out.println(Arrays.toString(challenge5(challenge5_request2)));
  }

  static boolean challenge1(String input) {
    Stack<Character> stack = new Stack<>();
    Map<Character, Character> map = Map.of(
        ')', '(',
        '}', '{',
        ']', '['
    );
    for (int i = 0; i < input.length(); i++) {
      char now = input.charAt(i);
      if (map.containsValue(now)) {
        stack.push(now);
      } else if (map.containsKey(now)) {
        if (stack.isEmpty() || (stack.pop() != map.get(now))) {
          return false;
        }
      }
    }
    return stack.isEmpty();
  }

  static int[] challenge2(int n, int[] request) {
    Queue<Integer> queue = new ArrayBlockingQueue<>(n);
    int[] answer = new int[request.length];

    for (int i = 0; i < request.length; i++) {
      queue.offer(request[i]);
      answer[i] = queue.size();
    }
    return answer;
  }

  static HashMap<String, Integer> challenge3(String input) {
    HashMap<String, Integer> hashMap = new HashMap<>();
    if (input.isEmpty()) {
      return hashMap;
    }
    String[] words = input.toLowerCase().replaceAll("[.,!?]", "").split(" ");
    for (String word : words) {
      hashMap.put(word, hashMap.getOrDefault(word, 0) + 1);
    }
    return hashMap;
  }

  static int challenge4(int n, int[] request) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int element : request) {
      minHeap.add(element);
    }
    for (int i = 0; i < n - 1; i++) {
      minHeap.poll();
    }
    return minHeap.isEmpty() ? -1 : minHeap.poll();
  }

  static int[] challenge5(int[] request) {
    if (request.length == 0) {
      return new int[]{};
    }
    TreeNode root = new TreeNode(request[0]);
    for (int element : request) {
      TreeNode parentNode = treeSearch(root, element);
      if (parentNode == null) {
        return null;
      }
      if (parentNode.val == element) {
        continue;
      }
      TreeNode childNode = new TreeNode(element);
      if (parentNode.val > element) {
        parentNode.left = childNode;
      } else {
        parentNode.right = childNode;
      }
    }
    return treeTraversalWithBFS(root);
  }

  static int[] treeTraversalWithBFS(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<>();
    ArrayList<Integer> answer = new ArrayList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
      TreeNode parentNode = queue.poll();
      answer.add(parentNode.val);
      if (parentNode.left != null) {
        queue.offer(parentNode.left);
      }
      if (parentNode.right != null) {
        queue.offer(parentNode.right);
      }
    }
    return answer.stream().mapToInt(Integer::intValue).toArray();
  }

  static TreeNode treeSearch(TreeNode root, int val) {
    TreeNode parentNode = root;
    while (parentNode != null) {
      if (parentNode.val == val) {
        return parentNode;
      }
      if (parentNode.val > val) {
        if (parentNode.left == null) {
          return parentNode;
        }
        parentNode = parentNode.left;
      } else {
        if (parentNode.right == null) {
          return parentNode;
        }
        parentNode = parentNode.right;
      }
    }
    return null;
  }

  static class TreeNode {

    int val;
    TreeNode left, right;

    public TreeNode(int val) {
      this.val = val;
    }
  }
}