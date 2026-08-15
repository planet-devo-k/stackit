# 6장 긍정적인 시나리오 최적화

## 1. 삽입 정렬

1. 임시 저장 
    1. 첫 번째 패스스루 - 인덱스( 두 번째 셀)의 값을 삭제하고 임시 변수에 저장한다
2. 비교 및 시프트 (Shift)
    1. 왼쪽에 있는 값과 비교 → 왼쪽 값이 더 크면 그 값을 오른쪽으로 시프트. 공백을 왼쪽으로 옮긴다.
3. 삽입
    1. 임시 변수 값을 공백에 넣는다

## 2. 삽입 정렬 실제로 해보기

### 1. 삽입 정렬 구현

```python
def insertion_sort(array):
	for index in range(1, len(array)):
		
		temp_value = array[index]
		position = index - 1
		
		while position >= 0:
			if array[position] > temp_value:
				array[position + 1] = array[position]
				position = position - 1
			else:
				break
				
		array[position + 1] = temp_value
	
	return array
```

## 3. 삽입 정렬의 효율성

- 비교 및 스프트
    - $N^2/2$
    - 비교 + 시프트 = $N^2$
- 삽입 및 삭제
    - $N-1$
- 비교 + 시프트 + 삽입 + 삭제 = $N^2+2N-2$

**`빅 오 표기법은 가장 높은 차수의 N만 고려한다.`**

## 4. 평균적인 경우

가장 자주 일어나는 경우는 ‘**평균 시나리오**’다.

- 삽입 정렬 → 성능에 따라 크게 좌우된다
    - 최악  : $O(N^2)$
    - 평균 : $O(N^2/2)$
    - 최선 : $O(N)$

## 5. 실제 예제

- 두 정렬의 교집합을 구하는 예제
    - 평균 성능: $N$과 $N^2$  사이