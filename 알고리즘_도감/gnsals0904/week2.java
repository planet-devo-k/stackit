import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Queue;
import java.util.Stack;

class week2 {
    public static void main(String[] args) {
        System.out.println(solution1("([{}])"));
        System.out.println(solution1("(]"));
        System.out.println(solution1("hello (world)"));
        System.out.println(Arrays.toString(solution2(3, new int[] {97, 98, 99, 100, 101})));
        System.out.println(Arrays.toString(solution2(1, new int[] {10, 20, 30})));
        System.out.println(Arrays.toString(solution2(5, new int[] {1, 2})));
        System.out.println(solution3("This is a test. This test is good."));
        System.out.println(solution3(""));
        System.out.println(solution4(new int[] {4, 10, 3, 5, 1}, 3));
        System.out.println(solution5(new int[] {5, 3, 7, 2, 4, 6, 8}));
        System.out.println(solution5(new int[] {5, 3, 8, 3, 1}));
        System.out.println(solution5(new int[] {}));
    }

    /**
     * 1. 괄호 유효성 검사
     *   - stack으로 구현
     *   - 스택에서 나온 괄호가 정확히 내가 들고 있는 괄호와 짝이 맞아야함
     *   - 문자열 끝까지 검토했을때 내가 손에 들고 있는 괄호가 없어야 함.
     * @param input
     * @return
     */
    static boolean solution1(String input) {
        Stack<Character> stack = new Stack<>();

        for (int i = 0; i < input.length(); i++) {
            char current = input.charAt(i);

            if (current == '(' || current == '{' || current == '[') {
                stack.push(current);
            }

            if (current == ')' || current == '}' || current == ']') {
                if (stack.isEmpty()) {
                    return false;
                }

                char open = stack.pop();

                if (current == ')' && open != '(') {
                    return false;
                }

                if (current == '}' && open != '{') {
                    return false;
                }

                if (current == ']' && open != '[') {
                    return false;
                }
            }
        }

        return stack.isEmpty();
    }

    /**
     * 2. 최근 N개의 요청 추적기
     *   - 큐의 크기가 N보다 커지면 가장 오래된 요청을 뺌
     *   - 각 요청을 처리한 뒤 현재 큐의 크기를 반환 배열에 저장
     * @param n
     * @param requests
     * @return
     */
    static int[] solution2(int n, int[] requests) {
        Queue<Integer> queue = new LinkedList<>();
        int[] result = new int[requests.length];

        for (int i = 0; i < requests.length; i++) {
            queue.add(requests[i]);

            if (queue.size() > n) {
                queue.poll();
            }

            result[i] = queue.size();
        }

        return result;
    }

    /**
     * 3. 단어 빈도수 계산
     *   - 대소문자는 구분하지 않으므로 소문자로 변환
     *   - 구두점을 제거한 뒤 공백 기준으로 단어를 나눔
     *   - HashMap에 단어별 개수를 저장
     * @param input
     * @return
     */
    static Map<String, Integer> solution3(String input) {
        Map<String, Integer> result = new HashMap<>();
        String cleanedInput = input.toLowerCase().replaceAll("\\p{Punct}", "").trim();

        if (cleanedInput.isEmpty()) {
            return result;
        }

        String[] words = cleanedInput.split("\\s+");

        for (String word : words) {
            result.put(word, result.getOrDefault(word, 0) + 1);
        }

        return result;
    }

    /**
     * 4. K번째로 작은 값 찾기
     *   - PriorityQueue는 기본적으로 최소 힙
     *   - 모든 값을 넣은 뒤 k번 꺼내면 k번째로 작은 값
     * @param nums
     * @param k
     * @return
     */
    static int solution4(int[] nums, int k) {
        PriorityQueue<Integer> priorityQueue = new PriorityQueue<>();

        for (int num : nums) {
            priorityQueue.add(num);
        }

        int result = 0;

        for (int i = 0; i < k; i++) {
            result = priorityQueue.poll();
        }

        return result;
    }

    /**
     * 5. 이진 탐색 트리 삽입
     *   - 입력 순서대로 BST에 삽입
     *   - 중복 값은 무시
     *   - 완성된 트리를 BFS로 순회
     *   - 마지막 레벨의 의미 없는 null은 제거
     * @param nums
     * @return
     */
    static List<Integer> solution5(int[] nums) {
        if (nums.length == 0) {
            return new ArrayList<>();
        }

        TreeNode root = new TreeNode(nums[0]);

        for (int i = 1; i < nums.length; i++) {
            insert(root, nums[i]);
        }

        List<Integer> result = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);

        while (!queue.isEmpty()) {
            TreeNode current = queue.poll();

            if (current == null) {
                result.add(null);
            } else {
                result.add(current.val);
                queue.add(current.left);
                queue.add(current.right);
            }
        }

        while (!result.isEmpty() && result.get(result.size() - 1) == null) {
            result.remove(result.size() - 1);
        }

        return result;
    }

    static void insert(TreeNode node, int value) {
        if (value < node.val) {
            if (node.left == null) {
                node.left = new TreeNode(value);
            } else {
                insert(node.left, value);
            }
        }

        if (value > node.val) {
            if (node.right == null) {
                node.right = new TreeNode(value);
            } else {
                insert(node.right, value);
            }
        }
    }

    static class TreeNode {
        int val;
        TreeNode left;
        TreeNode right;

        TreeNode(int val) {
            this.val = val;
        }
    }
}
