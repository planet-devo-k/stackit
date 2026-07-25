import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

class week1 {
    public static void main(String[] args) {
        System.out.println(challenge1(new int[] {3, 1, 4, 1, 5, 9, 2, 6}));
        System.out.println(challenge2(100));

        StudentScoreManager studentScoreManager = challenge3();
        studentScoreManager.addStudent("Alice", 90);
        studentScoreManager.addStudent("lee", 85);
        System.out.println(studentScoreManager.getScore("lee"));
        System.out.println(studentScoreManager.getScore("Alice"));
        System.out.println(studentScoreManager.getScore("Bob"));

        System.out.println(challenge4(new LinkedList<>(List.of(1, 2, 3, 2, 4, 2, 5)), 2));
        System.out.println(Arrays.toString(challenge5(new Object[] {1, "hello", true, 3.14})));
    }

    // 1. 가장 큰 값 찾기
    static int challenge1(int[] arr) {
        int max = arr[0];

        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }

        return max;
    }

    // 2. 두 수 합 계산 시간 비교
    static String challenge2(int n) {
        long start1 = System.nanoTime();
        sumV1(n);
        long end1 = System.nanoTime();

        long start2 = System.nanoTime();
        sumV2(n);
        long end2 = System.nanoTime();

        return (end1 - start1) < (end2 - start2) ? "sumV1" : "sumV2";
    }

    static int sumV1(int n) {
        int sum = 0;

        for (int i = 1; i <= n; i++) {
            sum += i;
        }

        return sum;
    }

    static int sumV2(int n) {
        return n * (n + 1) / 2;
    }

    // 3. 학생 점수 관리 시스템 구현
    static StudentScoreManager challenge3() {
        return new StudentScoreManager();
    }

    static class StudentScoreManager {
        private final Map<String, Integer> students = new HashMap<>();

        void addStudent(String name, int score) {
            students.put(name, score);
        }

        Integer getScore(String name) {
            return students.get(name);
        }
    }

    // 4. 리스트에서 특정 값 제거
    static LinkedList<Integer> challenge4(LinkedList<Integer> list, int value) {
        LinkedList<Integer> result = new LinkedList<>();

        for (int number : list) {
            if (number != value) {
                result.add(number);
            }
        }

        return result;
    }

    // 5. 배열 뒤집기
    static Object[] challenge5(Object[] arr) {
        Object[] result = new Object[arr.length];

        for (int i = arr.length - 1; i >= 0; i--) {
            result[arr.length - 1 - i] = arr[i];
        }

        return result;
    }
}
