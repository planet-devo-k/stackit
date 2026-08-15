# 7. 일상적인 코드 속 빅 오

빅오 → 데이터 원소가 N개일 때, 얼마나 많은 단계 수가 필요한가

1. 데이터 원소 N이 무엇인지 알아낸다.
2. 값 N개를 처리하는 데 얼마나 많은 단계 수가 필요한지 알아낸다.

## 7.5 의류 상표

- 바깥 루프가 N번 실행될 때 안쪽 루프는 N개 문자열 각각에 대해 5번 실행 → 5N → O(N)

```python
def mark_inventory(clothing_items):
  clothing_options = []

  for item in clothing_items:
    # For sizes 1 through 5 (Python ranges go UP TO second
    # number, but do not include it):
    for size in range(1, 6):
      clothing_options.append(item + " Size: " + str(size))

  return clothing_options
```

## 7.6 1 세기

- 모든 중첩 루프가 O(N^2)은 아니다.
- 아래 코드에서 루프 두개는 완전히 다른 배열을 순회한다. 바깥 루프는 안쪽 배열을 순회하고, 안쪽 배열은 실제 수를 순회한다.
- 결국에는 안쪽 루프가 총 수 개수 만큼만 실행되므로, N은 수의 개수다. → O(N)

```python
def count_ones(outer_array):
  count = 0

  for inner_array in outer_array:
    for number in inner_array:
      if number == 1:
        count += 1

  return count
```

- [과자 상자 비유]
  - 큰 상자(outer_array) 안에 작은 봉지 3개(inner_array)가 들어있고, 봉지 속 과자(number)를 모두 합치니 총 10개라고 해봅시다.
  - 바깥 루프: 봉지 3개를 하나씩 꺼내는 작업
  - 안쪽 루프: 꺼낸 봉지 안에 있는 과자를 하나씩 꺼내서 1인지 확인하는 작업
  - 이때 우리가 확인하는 총 과자의 개수는 몇 개일까요? 봉지 개수와 상관없이 결국 전체 과자 개수인 10개입니다. 과자가 총 N개라면, 안쪽 루프에서 'if number == 1'을 검사하는 횟수는 정확히 N번입니다.

- [O(N^2)과의 결정적인 차이]
  - O(N^2)이 되는 경우: 과자가 10개 있을 때, 1번째 과자를 보면서 10번 검사하고, 2번째 과자를 보면서 또 10번 검사해서 총 10 x 10 = 100번을 검사할 때입니다. (예: 10명의 사람이 서로 전부 한 번씩 악수하기)
  - 위 코드의 경우: 2차원 배열 형태로 예쁘게 포장되어 있을 뿐, 결국 바닥에 흩뿌려진 N개의 숫자를 처음부터 끝까지 한 줄로 세워두고 한 번씩 훑어보는 것과 똑같습니다.
- 결론적으로 N을 '배열 안에 들어있는 전체 숫자의 개수'라고 할 때, 데이터가 아무리 여러 겹으로 감싸져 있어도 전체 숫자를 한 번씩만 방문하므로 시간 복잡도는 O(N)이 됩니다.

## 7.8 모든 곱 구하기

- N의 관점에서 보면 안쪽 루프는 대략 N+(N-1)+(N-2)+...+1 번 실행되고, 이 공식은 대략 N^2/2 로 계산된다. (p149 그럼7-2) → O(N^2)
  - 배열의 전체 개수를 N이라고 해봅시다. (예: N = 5일 때)
    - i = 0 일 때: j는 index 1부터 4까지, 총 4번 (N - 1 번) 실행
    - i = 1 일 때: j는 index 2부터 4까지, 총 3번 (N - 2 번) 실행
    - i = 2 일 때: j는 index 3부터 4까지, 총 2번 (N - 3 번) 실행
    - i = 3 일 때: j는 index 4부터 4까지, 총 1번 실행
  - 즉, 안쪽 루프의 총 실행 횟수는 (N-1) + (N-2) + ... + 2 + 1 번이 됩니다.
  - 1부터 (N-1)까지 더하는 유명한 수학 공식(가우스의 더하기)을 활용하면 됩니다.

  ```
    4 + 3 + 2 + 1

    1 + 2 + 3 + 4

    5 + 5 + 5 + 5 = 5 x 4 = 20
  ```

  - 위처럼 순서를 뒤집어서 각 쌍을 더하면 모두 5(N)가 되고, 이 5가 총 4개(N-1개) 만들어집니다.
  - 두 번 더한 셈이니 다시 2로 나누면, 원래 구하려던 합은 (5 x 4) / 2 = 10이 됩니다.

- 이를 일반화하면 다음과 같습니다.
  - 양 끝을 짝지어 더한 값: N
  - 짝의 개수: N - 1
  - 거꾸로 한 번 더 더했으니 2로 나누기: N x (N - 1) / 2
  - (N^2 - N) / 2 가 됩니다.

```js
function twoNumberProducts(array) {
  let products = [];

  // Outer array:
  for (let i = 0; i < array.length - 1; i++) {
    // Inner array, in which j always begins one index
    // to the right of i:
    for (let j = i + 1; j < array.length; j++) {
      products.push(array[i] * array[j]);
    }
  }

  return products;
}
```

### 7.8.1 여러 데이터 세트 다루기

별개의 두 데이터 세트를 서로 곱해야할 때 두 데이터 세트를 별개로 구분해야만 빅 오 관점에서 효율성을 나타낼 수 있다.

- 아래와 같은 코드는 시나리오에 따라 효율성이 완전히 다르다.
  - 시나리오1: 크기가 5인 배열 두 개 → 5\*5 = 25번 실행 → O(N^2)
  - 시나리오2: 크기가 9인 배열과 크기가 1인 배열 → 9\*1 = 9번 실행 → 거의 O(N)
- 시나리오에 따라 달라지니 빅 오 표기법 관점에서 효율성을 정확하게 정의할 수 없으므로 N을 두 배열의 총 정수 개수로 볼 수 없다.
- 한 배열의 크기를 N, 다른 배열의 크기를 M으로 해서 시간복잡도를 O(N\*M)으로 표현할 수 밖에 없다.
- N과 M이 같으면 O(N^2)과 동등하다. 같지 않으면 더 작은수(이 수가 1만큼 작더라도)를 임의로 M에 할당함으로써 O(N)이 된다.
- 따라서 어떤 의미에서는 O(M\*N)을 O(N)과 O(N^2) 사이 정도로 이해할 수 있다.

```js
function twoNumberProducts(array1, array2) {
  let products = [];

  for (let i = 0; i < array1.length; i++) {
    for (let j = 0; j < array2.length; j++) {
      products.push(array1[i] * array2[j]);
    }
  }

  return products;
}
```

## 7.9 암호 크래커

- p152 그림 7-3을 보면 O(2^N)은 어떤 시점부터 O(N^3)보다 훨씬 느리다.
- O(2^N)은 어떻게 보면 O(logN)의 반대다.
  - O(logN): 데이터가 두 배로 늘어날 때 알고리즘에 한 단계씩 더 걸린다.
  - O(2^N): 데이터가 한 개 늘어날 때 알고리즘에 필요한 단계가 두 배로 늘어난다.

## 연습문제

```python
// 4번

def largest_product(array)
  largest_product_so_far = array[0] * array[1] * array[2]
  i = 0

  while i < array.length
    j = i + 1
    while j < array.length
      k = j + 1
      while k < array.length
        if array[i] * array[j] * array[k] > largest_product_so_far
          largest_product_so_far = array[i] * array[j] * array[k]
        end
        k += 1
      end
      j += 1
    end
    i += 1
  end

  return largest_product_so_far

end
```

- 바깥루프: N
- 중간루프: N/2
- 제일 안쪽 루프: N/4

- 핵심은 시작점이 i를 따라 계속 움직인다는 것. i가 커지면 j의 출발점도 같이 밀려 올라가서, 남은 구간이 점점 짧아집니다.

```
N=8일 때 중간 루프가 실제로 도는 횟수:

i=0 → j: 1,2,3,4,5,6,7   (7번)
i=1 → j: 2,3,4,5,6,7     (6번)
i=2 → j: 3,4,5,6,7       (5번)
i=3 → j: 4,5,6,7         (4번)
i=4 → j: 5,6,7           (3번)
i=5 → j: 6,7             (2번)
i=6 → j: 7               (1번)
i=7 → (없음)              (0번)

```

- 바깥 루프는 8번 돌고, 그 8번 동안 중간 루프가 평균 몇 번 돌았냐를 보면 (7+6+5+4+3+2+1+0) / 8 = 28/8 = 3.5번. N=8이니까 딱 N/2입니다.
- 그러니까 "중간 루프는 N/2번 실행한다"는 말은 한 번 들어갈 때마다 항상 N/2번 돈다가 아니라, 바깥 루프 한 바퀴당 평균 N/2번 돈다는 뜻이다.
  총 실행 횟수를 계산할 때 N × N/2 = N²/2 이 되니까.
- 안쪽 k 루프도 똑같은 이유. j가 이미 평균적으로 배열 중간쯤에 가 있으니, k가 훑을 남은 구간은 더 짧아져서 대략 N/4로 잡는 것.
