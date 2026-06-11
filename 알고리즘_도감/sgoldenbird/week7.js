// 1. 하이브리드 암호화 메시지 생성
function solution1(plaintext, symmetricKey, publicKey) {
  // 1단계: 대칭키(AES)를 사용하여 실제 본문 데이터(plaintext)를 암호화합니다.
  const payload = encryptAES(plaintext, symmetricKey);

  // 2단계: 공개키(RSA)를 사용하여 본문을 잠근 대칭키(symmetricKey)를 암호화합니다.
  const encryptedKey = encryptRSA(symmetricKey, publicKey);

  return {
    payload: payload,
    encryptedKey: encryptedKey,
  };
}

// 2. 디피-헬만 키 교환 과정 시뮬레이션
function solution2(p, g, a, b) {
  // 자바스크립트의 일반 숫자는 거듭제곱 시 값이 너무 커지면 오차가 발생하므로,
  // 정확한 정수 계산을 위해 BigInt 타입으로 변환합니다.
  const BigP = BigInt(p);
  const BigG = BigInt(g);
  const BigA = BigInt(a);
  const BigB = BigInt(b);

  // 1단계: 각자의 비밀키를 사용하여 '공개키'를 계산합니다.
  // 공식: (g^비밀키) % p
  const aPublicKey = BigG ** BigA % BigP;
  const bPublicKey = BigG ** BigB % BigP;

  // 2단계: 상대방의 공개키와 나의 비밀키를 사용하여 '공유 비밀키'를 계산합니다.
  // 공식: (상대방_공개키^내_비밀키) % p
  // A가 계산한 결과와 B가 계산한 결과는 수학적으로 완전히 같습니다.
  const sharedSecretA = bPublicKey ** BigA % BigP;

  // 3단계: 문제에서 요구한 3개의 결과만 맵(자바스크립트 객체)에 담아 반환합니다.
  return {
    A_public_key: Number(aPublicKey),
    B_public_key: Number(bPublicKey),
    shared_secret: Number(sharedSecretA),
  };
}

// 3. 메시지 인증 코드 (MAC) 생성 및 검증
function solution3(mode, message, secretKey, receivedMac) {
  const crypto = require("crypto");

  // 메시지와 키로 HMAC을 계산합니다.
  const calculatedMac = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("hex");

  if (mode === "CREATE") {
    return calculatedMac;
  } else if (mode === "VERIFY") {
    return calculatedMac === receivedMac;
  }
}

// 4. 전자 서명 검증
function solution4(mode, message, key, signature) {
  if (mode === "SIGN") {
    const messageHash = hashSHA256(message);
    const finalSignature = encryptRSA(messageHash, key);
    return finalSignature;
  } else if (mode === "VERIFY") {
    // 1. 내가 가진 원본 메시지를 해시 함수로 변환합니다. (내가 계산한 결과물)
    const originalMessageHash = hashSHA256(message);

    // 2. 전달받은 전자 서명을 상대방의 '공개키'로 복호화합니다. (서명 안에 숨겨진 결과물)
    const decryptedSignatureHash = decryptRSA(signature, key);

    // 3. 두 해시값이 완벽히 일치하는지 비교하여 유효성을 반환합니다.
    return originalMessageHash === decryptedSignatureHash;
  }
}

// 5. 전자 인증서 발급 및 검증 시뮬레이션
function solution5(mode, data, key) {
  if (mode === "ISSUE") {
    // [인증기관(CA)의 인증서 발급]
    // data 형식: { userEmail: "A의 메일", userPublicKey: "PA" }
    // key 형식: 인증기관의 비밀키 "SC"

    // 1. A의 데이터(메일+공개키)를 하나로 묶어 해시값을 구합니다.
    const certDataString = data.userEmail + data.userPublicKey;
    const dataHash = hashSHA256(certDataString);

    // 2. 인증기관의 비밀키(SC)로 해시값을 암호화하여 전자 서명을 작성합니다.
    const caSignature = encryptRSA(dataHash, key);

    // 3. 서명과 데이터를 하나의 파일(객체)로 만들어 A에게 반환합니다. (전자 인증서 완성)
    return {
      userEmail: data.userEmail,
      userPublicKey: data.userPublicKey,
      signature: caSignature,
    };
  } else if (mode === "VERIFY") {
    // [B의 인증서 검증 및 공개키 PA 추출]
    // data 형식: 위에서 발급된 certificate 객체
    // key 형식: 인증기관의 공개키 "PC"

    // 1. B는 받은 인증서의 메일 주소가 A의 것이 맞는지 확인하고, 내부 데이터를 다시 해시합니다.
    const certDataString = data.userEmail + data.userPublicKey;
    const calculatedHash = hashSHA256(certDataString);

    // 2. 인증서 내의 서명을 인증기관의 공개키(PC)로 복호화하여 원래 해시를 꺼냅니다.
    const decryptedHash = decryptRSA(data.signature, key);

    // 3. 두 값이 일치하는지 확인하여 인증기관이 발행한 진짜 A의 인증서인지 검증합니다.
    if (calculatedHash === decryptedHash) {
      // 4. 확인 완료 시, 인증서에서 A의 공개키(PA)를 꺼내어 반환합니다. (전달 완료)
      return data.userPublicKey;
    } else {
      return "INVALID_CERTIFICATE";
    }
  }
}
