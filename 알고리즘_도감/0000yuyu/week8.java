import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

public class week8 {
  public static void main(String[] args) {
    // challenge 1
    System.out.println(Arrays.toString(challenge1(new int[]{1, 11, 2, 10})));
    System.out.println(Arrays.toString(challenge1(new int[]{5, 20, 6, 7})));
    System.out.println(Arrays.toString(challenge1(new int[]{5, 20, 6, 7,1})));

    // challenge 2
    System.out.println(
        Arrays.deepToString(challenge2(new double[][]{{1, 1}, {2, 2}, {5, 5}, {6, 6}},
            new double[][]{{0, 0}, {7, 7}}
        )));
    System.out.println(
        Arrays.deepToString(challenge2(new double[][]{{1, 1}, {2, 2},{3,5},{4,4}, {5, 5}, {6, 6}},
            new double[][]{{0, 0}, {7, 7}}
        )));

    // challenge 3
    System.out.println(challenge3(new double[]{0,0},new double[]{3,4}));
    System.out.println(challenge3(new double[]{1.5,2.5},new double[]{4.5,6.5}));

    // challenge 4
    for(int i=2;i<50;i++) {
      System.out.print("제곱근 판별 : " + challenge4(i));
      System.out.print(" 메르센 판별 : " + challenge4_1(i));
      System.out.println(" => " + (challenge4(i) == challenge4_1(i)));
    }

    // challenge 5
    System.out.println(challenge5(
        Map.of(
            "A", List.of("B", "C"),
            "B", List.of("C"),
            "C", List.of("A")
        ),
        Map.of("A", 1.0, "B", 1.0, "C", 1.0)
    ));

    // challenge 6
    System.out.println(Arrays.toString(challenge6(2, "A", "B", "C")));
    System.out.println(Arrays.toString(challenge6(3, "A", "B", "C")));
    System.out.println(Arrays.toString(challenge6(5, "A", "B", "C")));
  }
  // 클러스터링
  static double[] challenge1(int[] points) {
    List<List<Integer>> clusters = new ArrayList<>();
    Arrays.sort(points);
    List<Integer> nowCluster = new ArrayList<>();
    for(int point : points) {
      if (!nowCluster.isEmpty() && Math.abs(nowCluster.getLast()-point) > 3) {
        clusters.add(nowCluster);
        nowCluster = new ArrayList<>();
      }
      nowCluster.add(point);
    }
    if (!nowCluster.isEmpty()) {clusters.add(nowCluster);}
    return clusters.stream()
        .mapToDouble(cluster -> cluster.stream()
            .mapToInt(Integer::intValue)
            .average()
            .orElse(0.0))
        .toArray();
  }

  static double getDistance(double[] pointA,double[] pointB) {
    return Math.sqrt(Math.pow(pointA[0]-pointB[0],2) + Math.pow(pointA[1]-pointB[1],2));
  }

  // k-means
  static double[][] challenge2(double[][] points, double[][] centroids) {
    List<double[]>[] clusters = (List<double[]>[]) Stream.generate(ArrayList<double[]>::new)
        .limit(centroids.length)
        .toArray(List[]::new);

    // 2. 각 점들을 가장 가까운 중심점에 할당
    for (double[] point : points) {
      int closeCentroidIdx = 0;
      double closeCentroidDistance = getDistance(point, centroids[0]);

      for (int i = 1; i < centroids.length; i++) {
        double nowDistance = getDistance(point, centroids[i]);
        if (nowDistance < closeCentroidDistance) {
          closeCentroidIdx = i;
          closeCentroidDistance = nowDistance;
        }
      }
      clusters[closeCentroidIdx].add(point);
    }

    return Arrays.stream(clusters)
        .map(cluster -> {
          if (cluster.isEmpty()) {
            return new double[]{0.0, 0.0};
          }

          int dimension = points[0].length;
          double[] meanSum = new double[dimension];

          for (double[] p : cluster) {
            for (int d = 0; d < dimension; d++) {
              meanSum[d] += p[d];
            }
          }

          for (int d = 0; d < dimension; d++) {
            meanSum[d] /= cluster.size();
          }
          return meanSum;
        })
        .toArray(double[][]::new);
  }

  // 두 점 사이의 거리 계산
  static double challenge3(double[] point1,double[] point2) {
    return getDistance(point1,point2);
  }

  // 소수 판별
  static boolean challenge4(int num) {
    for (int i=2;i<=Math.sqrt(num);i++) {
      if (num % i == 0) {
        return false;
      }
    }
    return true;
  }
  static boolean challenge4_1(int num) {
    if (num == 2) return true;
    return Math.pow(2,num) % num == 2;
  }

  // 페이지 랭크
  static Map<String, Double> challenge5(Map<String, List<String>> links, Map<String, Double> ranks) {
    Map<String, Double> newRanks = new HashMap<>();

    for (String page : ranks.keySet()) {
      newRanks.put(page, 0.0);
    }
    for (Map.Entry<String, List<String>> entry : links.entrySet()) {
      String fromPage = entry.getKey();
      List<String> toPages = entry.getValue();

      if (toPages == null || toPages.isEmpty()) {
        continue;
      }
      double contribution = ranks.get(fromPage) / toPages.size();

      for (String toPage : toPages) {
        if (newRanks.containsKey(toPage)) {
          newRanks.put(toPage, newRanks.get(toPage) + contribution);
        }
      }
    }
    return newRanks;
  }

  //하노이의 탑
  static String[] challenge6(int n, String start, String aux, String end) {
    List<String> moves = new ArrayList<>();
    hanoi(n, start, aux, end, moves);
    return moves.toArray(new String[0]);
  }

  private static void hanoi(int n, String from, String aux, String to, List<String> moves) {
    if (n == 0) {
      return;
    }
    hanoi(n - 1, from, to, aux, moves);
    moves.add(n + " from " + from + " to " + to);
    hanoi(n - 1, aux, from, to, moves);
  }
}
