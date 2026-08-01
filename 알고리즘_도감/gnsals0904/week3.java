class week3 {
    public static void main(String[] args) {
        System.out.println(solution1(new int[] {3, 1, 4, 1, 5, 9, 2, 6}));
        System.out.println(solution2(new int[] {64, 34, 25, 12, 22, 11, 90}));
        System.out.println(solution3(new int[] {17, 5, 12, 8, 1}));
        System.out.println(solution4(new int[] {5, 2, 4, 6, 1, 3}));
        System.out.println(solution5(new int[] {4, 10, 3, 5, 1}));
        System.out.println(solution6(new int[] {38, 27, 43, 3, 9, 82, 10}));
        System.out.println(solution7(new int[] {10, 7, 8, 9, 1, 5}));
    }

    /**
     * 1. 정렬의 기본: 최소값 찾기
     *   - 배열을 순회하며 현재까지 가장 작은 값을 갱신
     * @param arr
     * @return
     */
    static int solution1(int[] arr) {
        int min = arr[0];

        for (int i = 1; i < arr.length; i++) {
            if (arr[i] < min) {
                min = arr[i];
            }
        }

        return min;
    }

    /**
     * 2. 버블 정렬: 인접 요소 교환
     *   - 인접한 두 값을 비교해서 큰 값을 오른쪽으로 보냄
     *   - 정렬 후 마지막 요소를 반환
     * @param arr
     * @return
     */
    static int solution2(int[] arr) {
        bubbleSort(arr);
        return arr[arr.length - 1];
    }

    static void bubbleSort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    swap(arr, j, j + 1);
                }
            }
        }
    }

    /**
     * 3. 선택 정렬: 최소값 선택
     *   - 남은 구간에서 가장 작은 값을 찾아 현재 위치와 교환
     *   - 정렬 후 두 번째 요소를 반환
     * @param arr
     * @return
     */
    static int solution3(int[] arr) {
        selectionSort(arr);
        return arr[1];
    }

    static void selectionSort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            int minIndex = i;

            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }

            swap(arr, i, minIndex);
        }
    }

    /**
     * 4. 삽입 정렬: 삽입 위치 찾기
     *   - 현재 값을 이미 정렬된 왼쪽 구간의 알맞은 위치에 삽입
     *   - 정렬 후 첫 번째 요소를 반환
     * @param arr
     * @return
     */
    static int solution4(int[] arr) {
        insertionSort(arr);
        return arr[0];
    }

    static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int current = arr[i];
            int j = i - 1;

            while (j >= 0 && arr[j] > current) {
                arr[j + 1] = arr[j];
                j--;
            }

            arr[j + 1] = current;
        }
    }

    /**
     * 5. 힙 정렬: 최대값 추출
     *   - 최대 힙을 만든 뒤 최대값을 한 번 제거
     *   - 다시 루트에 오는 값이 두 번째로 큰 값
     * @param arr
     * @return
     */
    static int solution5(int[] arr) {
        int heapSize = arr.length;

        buildMaxHeap(arr, heapSize);
        swap(arr, 0, heapSize - 1);
        heapSize--;
        heapify(arr, heapSize, 0);

        return arr[0];
    }

    static void buildMaxHeap(int[] arr, int heapSize) {
        for (int i = heapSize / 2 - 1; i >= 0; i--) {
            heapify(arr, heapSize, i);
        }
    }

    static void heapify(int[] arr, int heapSize, int rootIndex) {
        int largest = rootIndex;
        int left = rootIndex * 2 + 1;
        int right = rootIndex * 2 + 2;

        if (left < heapSize && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < heapSize && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest != rootIndex) {
            swap(arr, rootIndex, largest);
            heapify(arr, heapSize, largest);
        }
    }

    /**
     * 6. 병합 정렬: 분할 정복
     *   - 배열을 반으로 나누고 정렬된 두 구간을 병합
     *   - 길이가 짝수면 왼쪽 중간 값을 반환
     * @param arr
     * @return
     */
    static int solution6(int[] arr) {
        mergeSort(arr, 0, arr.length - 1);
        return arr[(arr.length - 1) / 2];
    }

    static void mergeSort(int[] arr, int left, int right) {
        if (left >= right) {
            return;
        }

        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }

    static void merge(int[] arr, int left, int mid, int right) {
        int[] sorted = new int[right - left + 1];
        int leftIndex = left;
        int rightIndex = mid + 1;
        int sortedIndex = 0;

        while (leftIndex <= mid && rightIndex <= right) {
            if (arr[leftIndex] <= arr[rightIndex]) {
                sorted[sortedIndex] = arr[leftIndex];
                leftIndex++;
            } else {
                sorted[sortedIndex] = arr[rightIndex];
                rightIndex++;
            }

            sortedIndex++;
        }

        while (leftIndex <= mid) {
            sorted[sortedIndex] = arr[leftIndex];
            leftIndex++;
            sortedIndex++;
        }

        while (rightIndex <= right) {
            sorted[sortedIndex] = arr[rightIndex];
            rightIndex++;
            sortedIndex++;
        }

        for (int i = 0; i < sorted.length; i++) {
            arr[left + i] = sorted[i];
        }
    }

    /**
     * 7. 퀵 정렬: 피벗 선택
     *   - 첫 번째 요소를 피벗으로 선택
     *   - 피벗보다 작은 값은 왼쪽, 큰 값은 오른쪽으로 나눈 뒤 재귀 정렬
     *   - 정렬 후 첫 번째 요소와 마지막 요소의 합을 반환
     *   - 근데 그렇다면.. 1 + 10 이라서 11이 맞는 것 같은데 문제 출력은 6이네 흠...
     * @param arr
     * @return
     */
    static int solution7(int[] arr) {
        quickSort(arr, 0, arr.length - 1);
        return arr[0] + arr[arr.length - 1];
    }

    static void quickSort(int[] arr, int left, int right) {
        if (left >= right) {
            return;
        }

        int pivotIndex = partition(arr, left, right);
        quickSort(arr, left, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, right);
    }

    static int partition(int[] arr, int left, int right) {
        int pivot = arr[left];
        int low = left + 1;
        int high = right;

        while (low <= high) {
            while (low <= right && arr[low] <= pivot) {
                low++;
            }

            while (high > left && arr[high] > pivot) {
                high--;
            }

            if (low < high) {
                swap(arr, low, high);
            }
        }

        swap(arr, left, high);
        return high;
    }

    static void swap(int[] arr, int firstIndex, int secondIndex) {
        int temp = arr[firstIndex];
        arr[firstIndex] = arr[secondIndex];
        arr[secondIndex] = temp;
    }
}
