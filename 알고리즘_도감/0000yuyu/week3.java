public class week3 {

  public static void main(String[] args) {
    getTime(() -> {
      int result = challenge1(new int[]{3, 1, 4, 1, 5, 9, 2, 6});
      System.out.println("1 : " + result);
    });
    getTime(() -> {
      int result = challenge2(new int[]{64, 34, 25, 12, 22, 11, 90});
      System.out.println("2 : " + result);
    });
    getTime(() -> {
      int result = challenge3(new int[]{17, 5, 12, 8, 1});
      System.out.println("3 : " + result);
    });
    getTime(() -> {
      int result = challenge4(new int[]{9, 4, 3, 5, 1});
      System.out.println("4 : " + result);
    });
    getTime(() -> {
      int result = challenge5(new int[]{4, 10, 3, 5, 1});
      System.out.println("5 : " + result);
    });
    getTime(() -> {
      int result = challenge6(new int[]{38, 27, 43, 3, 9, 82, 10});
      System.out.println("6 : " + result);
    });
    getTime(() -> {
      int result = challenge7(new int[]{10, 7, 8, 9, 1, 5});
      System.out.println("7 : " + result);
    });
  }

  // 최솟값 찾기
  static int challenge1(int[] arr) {
    int min = Integer.MAX_VALUE;
    for (int element : arr) {
      if (element < min) {
        min = element;
      }
    }
    return min;
  }

  // 버블 정렬
  static int challenge2(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
      for (int j = 1; j < arr.length - i; j++) {
        if (arr[j - 1] > arr[j]) {
          int temp = j - 1;
          arr[j - 1] = arr[j];
          arr[j] = temp;
        }
      }
    }
    return arr[arr.length - 1];
  }

  // 선택 정렬
  static int challenge3(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
      int min = i;
      for (int j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[min]) {
          min = j;
        }
      }
      if (min != i) {
        int temp = arr[i];
        arr[i] = arr[min];
        arr[min] = temp;
      }
    }
    return arr[1];
  }

  // 삽입 정렬
  static int challenge4(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
      for (int j = i; j > 0; j--) {
        if (arr[j - 1] > arr[j]) {
          int temp = arr[j - 1];
          arr[j - 1] = arr[j];
          arr[j] = temp;
        }
      }
    }
    return arr[1];
  }

  // 힙 정렬
  static int challenge5(int[] arr) {
    int n = arr.length;

    for (int i = n / 2 - 1; i >= 0; i--) {
      heapAdjust(arr, i, n);
    }

    for (int i = n - 1; i > 0; i--) {
      int temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;
      heapAdjust(arr, 0, i);
    }
    return arr[arr.length - 2];
  }

  static void heapAdjust(int[] arr, int root, int n) {
    int rootKey = arr[root];
    int child = 2 * root + 1;

    while (child < n) {
      if ((child + 1 < n) && (arr[child] < arr[child + 1])) {
        child++;
      }

      if (rootKey >= arr[child]) {
        break;
      } else {
        arr[root] = arr[child];
        root = child;
        child = 2 * root + 1;
      }
    }
    arr[root] = rootKey;
  }

  // 병합 정렬
  static int challenge6(int[] a) {
    int[] aux = new int[a.length];
    mergeSort(a, aux, 0, a.length - 1);
    return a[a.length / 2];
  }

  static void mergeSort(int[] a, int[] aux, int lo, int hi) {
    if (hi > lo) {
      int mid = lo + (hi - lo) / 2;
      mergeSort(a, aux, lo, mid);
      mergeSort(a, aux, mid + 1, hi);
      merge(a, aux, lo, mid, hi);
    }
  }

  static void merge(int[] a, int[] aux, int lo, int mid, int hi) {
    if (hi + 1 - lo >= 0) {
      System.arraycopy(a, lo, aux, lo, hi + 1 - lo);
    }
    int i = lo, j = mid + 1;
    for (int k = lo; k <= hi; k++) {
      if (i > mid) {
        a[k] = aux[j++];
      } else if (j > hi) {
        a[k] = aux[i++];
      } else if (aux[j] < aux[i]) {
        a[k] = aux[j++];
      } else {
        a[k] = aux[i++];
      }
    }
  }

  // 퀵 정렬
  static int challenge7(int[] arr) {
    quickSort(arr, 0, arr.length - 1);
    return arr[0] + arr[arr.length - 1];
  }

  static void quickSort(int[] arr, int lo, int hi) {
    if (lo >= hi) {
      return;
    }

    int i = lo;
    int j = hi;
    int pivot = arr[(lo + hi) / 2];

    while (i <= j) {
      while (arr[i] < pivot) {
        i++;
      }
      while (arr[j] > pivot) {
        j--;
      }

      if (i <= j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

        i++;
        j--;
      }
    }

    if (lo < j) {
      quickSort(arr, lo, j);
    }
    if (i < hi) {
      quickSort(arr, i, hi);
    }
  }

  static <T> void getTime(Runnable task) {
    long startTime = System.nanoTime();

    task.run();

    double duration = ((System.nanoTime() - startTime) / 1_000_000.0);

    System.out.println("걸린 시간 : " + duration);
  }
}
