// 1. 보안 알고리즘의 필요성: 데이터 무결성 검증
function solution1(message) {
  let sum = 0;

  for (let i = 0; i < message.length; i++) {
    sum += message.charCodeAt(i);
  }

  if (sum % 2 === 0) {
    return "OK";
  } else {
    return "NG";
  }
}

// 2. 암호의 기본: 시저 암호 복호화
function solution2(encryptedMessage) {
  let result = "";

  for (let i = 0; i < encryptedMessage.length; i++) {
    let char = encryptedMessage[i];
    let code = encryptedMessage.charCodeAt(i);

    // 대문자 처리 (A: 65 ~ Z: 90)
    if (code >= 65 && code <= 90) {
      // 3칸 앞으로 당긴 후, 범위를 벗어나면 26을 더해 알파벳 안으로 순환시킵니다.
      let nextCode = code - 3;
      if (nextCode < 65) nextCode += 26;
      result += String.fromCharCode(nextCode);
    }
    // 소문자 처리 (a: 97 ~ z: 122)
    else if (code >= 97 && code <= 122) {
      let nextCode = code - 3;
      if (nextCode < 97) nextCode += 26;
      result += String.fromCharCode(nextCode);
    }
    // 알파벳이 아닌 문자(공백, 특수문자 등)는 그대로 유지
    else {
      result += char;
    }
  }

  return result;
}

// 3. 해시 함수의 기본: 간단한 해시 값 계산
function solution3(text) {
  let hash = 0;

  for (let i = 0; i < text.length; i++) {
    hash += text.charCodeAt(i);
    hash *= 7;
    hash %= 101;
  }

  return hash;
}

// 4. 공통키 암호: XOR 암호화 및 복호화
function solution4(data, key) {
  let result = "";

  for (let i = 0; i < data.length; i++) {
    let asciiCode = data.charCodeAt(i);

    // XOR(^) 연산자
    let xorValue = asciiCode ^ key;

    result += String.fromCharCode(xorValue);
  }

  return result;
}

// 5. 공개키 암호: 간단한 모듈러 연산 - 거듭제곱을 한 뒤에 나머지 연산(Modulus, %)
// * 모듈러 연산을 각 단계에 적용하라 → 계산 과정에서 숫자가 너무 커져 컴퓨터가 뻗는 것을 막으라는 뜻
// 3을 10만 번 곱한 뒤에 7로 나누려고 하면 컴퓨터는 숫자가 너무 커서 메모리를 초과해 버린다.(Infinity 에러 발생)
// 곱할 때마다 7로 나눈 나머지를 다음 곱셈에 쓰면, 최종 결과는 똑같다. 곱할 때마다 숫자를 작게 리셋해 주면서 가라는 뜻
// * '고속 거듭제곱 알고리즘(Binary Exponentiation)' 지수를 이진수로 쪼개서 반씩 접어가며 곱하는 알고리즘
// 만약 3^{16}을 계산해야 한다면, 3을 총 15번 연속으로 곱해야 하니 느리다.
// 하지만 3 * 3 = 3^2 (곱셈 1번) 3^2 * 3^2 = 3^4 (곱셈 2번) 3^4 * 3^4 = 3^8 (곱셈 3번) 3^8 * 3^8 = 3^{16} (곱셈 4번)
// 숫자 11을 이진수로 바꾸면 1011. 이것은 십진수로 풀었을 때 8 + 2 + 1 = 11. 즉, 3^{11} = 3^8 * 3^2 * 3^1
// * RSA 암호나 디피-헬먼 알고리즘이 바로 이 모듈러 거듭제곱을 기반으로 만들어졌다. 암호학에서는 이를 "일방향 함수"의 일종으로 사용
// 정방향 계산은 쉽고, 역방향은 엄청나게 어려움.

function solution5(base, exponent, modulus) {
  // 아주 큰 수를 다루기 위해 모든 숫자를 BigInt 유형으로 변환합니다.
  let b = BigInt(base);
  let e = BigInt(exponent);
  let m = BigInt(modulus);

  if (m === 1n) return 0n;

  let result = 1n;
  b = b % m; // 기본 base 값도 미리 modulus 연산을 적용

  while (e > 0n) {
    // 지수의 현재 이진수 자릿수가 1인지 확인 (홀수인지 확인하는 것과 같음)
    if (e % 2n === 1n) {
      result = (result * b) % m; // 매 단계마다 모듈러 연산 적용!
    }

    // 지수를 반으로 접습니다 (이진수 우측 시프트 연산과 같음)
    e = e / 2n;

    // base를 제곱해 나갑니다 (3 -> 3^2 -> 3^4 -> 3^8 ...)
    b = (b * b) % m; // 여기서도 매 단계마다 모듈러 연산 적용!
  }

  return Number(result);
}
