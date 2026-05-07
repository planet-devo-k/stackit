// 1. 가장 큰값 찾기
function solution1(num_list) {
  let answer = 0;
  for (let i of num_list) {
    if (answer < i) answer = i;
  }
  return answer;
}

// 2. 두 수 합 계산 시간 비교
function solution2(num) {
  function sum_v1(num) {
    let answer = 0;
    for (let i = 1; i <= num; i++) {
      answer += i;
    }
    return answer;
  }
  function sum_v2(num) {
    return num > 1 ? (num * (1 + num)) / 2 : 1;
  }

  const time1_start = performance.now();
  const sum_1 = sum_v1(1000000);
  const time1_end = performance.now();
  const time1 = time1_end - time1_start;

  const time2_start = performance.now();
  const sum_2 = sum_v2(1000000);
  const time2_end = performance.now();
  const time2 = time2_end - time2_start;
  return time2 < time1 ? "sum_v2" : "sum_v1";
}
// 3. 학생 점수 관리 시스템
const student_list = {};

function add_student(name, score) {
  student_list[name] = score;
}

function find_student(name) {
  return student_list[name] ? student_list[name] : null;
}

// 4. 리스트에서 특정 값 제거
function solution4(data, value) {
  return data.filter((item) => item !== value);
}

// 5. 배열 뒤집기
function solution5(arr) {
  return arr.reverse();
}
