import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

class week8 {
    public static void main(String[] args) {
        Map<String, List<String>> links = new LinkedHashMap<>();
        links.put("A", Arrays.asList("B", "C"));
        links.put("B", Arrays.asList("C"));
        links.put("C", Arrays.asList("A"));

        Map<String, Double> ranks = new LinkedHashMap<>();
        ranks.put("A", 1.0);
        ranks.put("B", 1.0);
        ranks.put("C", 1.0);

        System.out.println(Arrays.toString(solution1(new int[] {1, 11, 2, 10})));
        System.out.println(Arrays.deepToString(solution2(
            new double[][] {{1, 1}, {2, 2}, {5, 5}, {6, 6}},
            new double[][] {{0, 0}, {7, 7}}
        )));
        System.out.println(solution3(new double[] {0, 0}, new double[] {3, 4}));
        System.out.println(solution4(17));
        System.out.println(solution5(links, ranks));
        System.out.println(solution6(2, "A", "B", "C"));
    }

    /**
     * 1. 1차원 데이터 클러스터링
     *   - 좌표를 오름차순으로 정렬
     *   - 인접한 값의 차이가 3 이하이면 같은 그룹으로 묶음
     *   - 그룹이 끊길 때마다 평균값을 결과에 추가
     * @param points
     * @return
     */
    static double[] solution1(int[] points) {
        Arrays.sort(points);

        List<Double> result = new ArrayList<>();
        int sum = points[0];
        int count = 1;

        for (int i = 1; i < points.length; i++) {
            if (points[i] - points[i - 1] <= 3) {
                sum += points[i];
                count++;
            } else {
                result.add((double) sum / count);
                sum = points[i];
                count = 1;
            }
        }

        result.add((double) sum / count);

        double[] averages = new double[result.size()];

        for (int i = 0; i < result.size(); i++) {
            averages[i] = result.get(i);
        }

        return averages;
    }

    /**
     * 2. K-Means 알고리즘의 1단계 업데이트
     *   - 각 점을 가장 가까운 중심점에 할당
     *   - 중심점별로 할당된 점들의 x, y 평균을 새 위치로 사용
     *   - 할당된 점이 없으면 기존 중심점을 유지
     * @param points
     * @param centroids
     * @return
     */
    static double[][] solution2(double[][] points, double[][] centroids) {
        double[][] sums = new double[centroids.length][2];
        int[] counts = new int[centroids.length];

        for (double[] point : points) {
            int nearestCentroidIndex = findNearestCentroidIndex(point, centroids);

            sums[nearestCentroidIndex][0] += point[0];
            sums[nearestCentroidIndex][1] += point[1];
            counts[nearestCentroidIndex]++;
        }

        double[][] result = new double[centroids.length][2];

        for (int i = 0; i < centroids.length; i++) {
            if (counts[i] == 0) {
                result[i][0] = centroids[i][0];
                result[i][1] = centroids[i][1];
            } else {
                result[i][0] = sums[i][0] / counts[i];
                result[i][1] = sums[i][1] / counts[i];
            }
        }

        return result;
    }

    /**
     * 3. 두 점 사이의 거리 계산
     *   - x 좌표 차이와 y 좌표 차이를 각각 제곱
     *   - 두 제곱값의 합에 루트를 씌워 직선거리를 구함
     * @param p1
     * @param p2
     * @return
     */
    static double solution3(double[] p1, double[] p2) {
        double xDiff = p1[0] - p2[0];
        double yDiff = p1[1] - p2[1];

        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    /**
     * 4. 소수 여부 판별
     *   - 1 이하는 소수가 아님
     *   - 2부터 n의 제곱근까지 나누어 떨어지는 수가 있는지 확인
     * @param n
     * @return
     */
    static boolean solution4(int n) {
        if (n <= 1) {
            return false;
        }

        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * 5. 간단한 페이지랭크 업데이트
     *   - 모든 페이지의 새 랭크를 0으로 초기화
     *   - 각 페이지가 가진 랭크를 아웃링크 수만큼 나누어 연결된 페이지에 더함
     * @param links
     * @param ranks
     * @return
     */
    static Map<String, Double> solution5(Map<String, List<String>> links, Map<String, Double> ranks) {
        Map<String, Double> newRanks = new LinkedHashMap<>();

        for (String page : ranks.keySet()) {
            newRanks.put(page, 0.0);
        }

        for (String fromPage : links.keySet()) {
            List<String> outLinks = links.get(fromPage);

            if (outLinks.isEmpty()) {
                continue;
            }

            double score = ranks.get(fromPage) / outLinks.size();

            for (String toPage : outLinks) {
                newRanks.put(toPage, newRanks.get(toPage) + score);
            }
        }

        return newRanks;
    }

    /**
     * 6. 원반 옮기기
     *   - n - 1개 원반을 보조 기둥으로 이동
     *   - 가장 큰 원반을 목표 기둥으로 이동
     *   - 보조 기둥의 n - 1개 원반을 목표 기둥으로 이동
     * @param n
     * @param start
     * @param aux
     * @param end
     * @return
     */
    static List<String> solution6(int n, String start, String aux, String end) {
        List<String> result = new ArrayList<>();
        moveHanoi(n, start, aux, end, result);

        return result;
    }

    static int findNearestCentroidIndex(double[] point, double[][] centroids) {
        int nearestCentroidIndex = 0;
        double minDistance = euclideanDistance(point, centroids[0]);

        for (int i = 1; i < centroids.length; i++) {
            double distance = euclideanDistance(point, centroids[i]);

            if (distance < minDistance) {
                minDistance = distance;
                nearestCentroidIndex = i;
            }
        }

        return nearestCentroidIndex;
    }

    static double euclideanDistance(double[] p1, double[] p2) {
        double xDiff = p1[0] - p2[0];
        double yDiff = p1[1] - p2[1];

        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    static void moveHanoi(int n, String start, String aux, String end, List<String> result) {
        if (n == 1) {
            result.add(n + " from " + start + " to " + end);
            return;
        }

        moveHanoi(n - 1, start, end, aux, result);
        result.add(n + " from " + start + " to " + end);
        moveHanoi(n - 1, aux, start, end, result);
    }
}
