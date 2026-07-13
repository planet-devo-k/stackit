// 1. 보안 알고리즘의 필요성: 데이터 무결성 검증
function solution1(message) {
  let answer = 0;
  for (let i of message) {
    answer += i.charCodeAt();
  }
  return answer % 2 === 0 ? "OK" : "NG";
}

// 2. 암호의 기본: 시저 암호 복호화
function solution2(encryptedMessage) {
  let answer = "";

  for (let char of encryptedMessage) {
    let charToCode = char.charCodeAt();
    if (charToCode >= 65 && charToCode <= 90) {
      // 대문자
      answer += String.fromCharCode(((charToCode - 65 - 3 + 26) % 26) + 65);
    } else if (charToCode >= 97 && charToCode <= 122) {
      // 소문자
      answer += String.fromCharCode(((charToCode - 97 - 3 + 26) % 26) + 97);
    } else {
      // 다른 문자
      answer += char;
    }
  }
  return answer;
}

// 3. 해시 함수의 기본: 간단한 해시 값 계산

function solution3(text) {
  let answer = 0;
  for (let i of text) {
    answer = ((answer + i.charCodeAt()) * 7) % 101;
  }
  return answer;
}

function solution4(data, key) {
  let result = "";
  for (let i of data) {
    result += String.fromCharCode(i.charCodeAt() ^ key); // XOR 연산
  }
  return result;
}

function solution5(base, exponent, modulus) {
  let result = 1;
  base = base % modulus;

  while (exponent > 0) {
    if (exponent % 2 === 1) {
      // 지수가 홀수면
      result = (result * base) % modulus;
    }
    base = (base * base) % modulus; // base 제곱
    exponent = Math.floor(exponent / 2); // 지수 절반
  }

  return result;
}
