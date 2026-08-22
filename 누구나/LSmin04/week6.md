# 7. 일상적인 코드 속 빅 오

- 코드의 효율성 알아내기
  1단계: 최적화
  - N이 무엇인가? → 데이터 원소가 N개 일 때, 얼마나 많은 단계 수가 필요한가?

## 4. 평균 섭씨 온도 구하기

```ruby
def average_celsius(fahrenheit_readings)

    # 섭씨 온도를 모으는 컬렉션
    celsius_numbers = []

    # 읽은 값을 섭씨로 변환해 배열에 추가한다.
    # 첫 번재 루프
    fahrenheit_readings.each do |fahrenheit_reading|
        celsius_conversion = (fahrenheit_reading - 32) / 1.8
        celsius_numbers.push(celsius_conversion)
    end

    # 섭씨 온도의 합을 구한다.
    sum = 0.0

    # 두 번째 루프
    celsius_numbers.each do |celsius_number|
        sum += celsius_number
    end

    # 평균을 반환한다.
    return sum / celsius_numbers.length
end
```

- 단어 생성기 예제는 **중첩**루프이기 때문에 N단계 \* N단계 → O(N^2)
- 하지만 평균 섭씨 온도는 루프 두 개를 나란히 실행한 것이기 때문에 N단계+N단계 → O(N)

## 5. 의류 상표 6. 1세기

- 중첩 루프가 O(N^2)가 되는 경우는 각 루프에서 N개씩 처리할 때이다
- 5.의류 상표 예제
  - 안쪽 루프는 N개 문자열 각각에 대해 5번 실행된다. → 5N번 실행 → O(N)
- 6.1세기 예제
  - 바깥 루프 → 안쪽 배열 순회, 안쪽 루프 → 총 개수 만큼 실행
  - N은 수의 개수로 시간 복잡도는 O(N)이다.

## 8. 모든 곱 구하기

- N의 관점에서 안쪽 루프는 대략 N + (N-1) + (N-2) + … + 1 번 실행 ⇒ 항상 N^2 /2로 계산된다.

⇒ 상수는 무시되므로 빅 오는 O(N^2)

### 1. 여러 데이터 세트 다루기

- “한 배열의 모든 수 \* 다른 한 뱅려의 모든 수 “ 의 곱

```jsx
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

- 시나리오에 따라 빅 오 표기법 관점에서 효율성을 정확하게 정의할 수 없다.
  - 시나리오1: 크기가 5인 배열 2개인 경우, N=10, O(N^2)
  - 시나리오2: 크기가 9인 배열과 1인 배열인 경우, N=10, O(N)
- 한 배열의 크기를 N, 다른 배열의 크기를 M으로 해서 O(N \* M)으로 표현한다.
  - 하지만 O(N x M)이 속하는 특정 범위가 있다.
  - 따라서 O(N x M)은 O(N)과 O(N^2) 사이로 이해할 수 있다.

## 11. 연습 문제

1. O(N)
2. O(N)
3. O(N\*M)
4. O(N^3)
5. O(logN)
