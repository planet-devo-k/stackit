import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

class week7 {
    public static void main(String[] args) {
        HybridMessage hybridMessage = solution1(
            "Hello, Hybrid Encryption!",
            "temp_aes_key_123",
            "SERVER_RSA_PUBLIC_KEY"
        );

        Map<String, Integer> diffieHellmanResult = solution2(23, 5, 6, 15);
        String mac = (String) solution3("CREATE", "This is a secret message.", "mysecretkey", "");
        String signature = (String) solution4("SIGN", "Verify this signature.", "MY_PRIVATE_KEY", "");
        Certificate certificate = (Certificate) solution5(
            "ISSUE",
            new Certificate("A@email.com", "PA"),
            "SC"
        );

        System.out.println(hybridMessage);
        System.out.println(diffieHellmanResult);
        System.out.println(mac);
        System.out.println(solution3("VERIFY", "This is a secret message.", "mysecretkey", mac));
        System.out.println(signature);
        System.out.println(solution4("VERIFY", "Verify this signature.", "MY_PUBLIC_KEY", signature));
        System.out.println(certificate);
        System.out.println(solution5("VERIFY", certificate, "PC"));
    }

    /**
     * 1. 하이브리드 암호화 메시지 생성
     *   - Cipher X 암호화 함수는 예시로만 작성
     * @param plaintext
     * @param symmetricKey
     * @param publicKey
     * @return
     */
    static HybridMessage solution1(String plaintext, String symmetricKey, String publicKey) {
        String payload = encryptAES(plaintext, symmetricKey);
        String encryptedKey = encryptRSA(symmetricKey, publicKey);

        return new HybridMessage(payload, encryptedKey);
    }

    /**
     * 2. 디피-헬만 키 교환 과정 시뮬레이션
     *   - A와 B가 각자 비밀키로 공개키를 계산
     *   - 상대의 공개키와 자신의 비밀키로 같은 공유 비밀키를 계산
     *   - 모듈러 연산은 역방향 계산이 어렵기 때문
     * @param p 소수
     * @param g 생성자
     * @param a A의 비밀키
     * @param b B의 비밀키
     * @return
     */
    static Map<String, Integer> solution2(int p, int g, int a, int b) {
        int aPublicKey = modularPow(g, a, p);
        int bPublicKey = modularPow(g, b, p);
        int sharedSecret = modularPow(bPublicKey, a, p);

        Map<String, Integer> result = new LinkedHashMap<>();
        result.put("A_public_key", aPublicKey);
        result.put("B_public_key", bPublicKey);
        result.put("shared_secret", sharedSecret);

        return result;
    }

    /**
     * 3. 메시지 인증 코드 생성 및 검증
     *   - message와 secretKey로 HMAC-SHA256 값을 생성
     *   - CREATE 모드면 생성된 MAC을 반환
     *   - VERIFY 모드면 전달받은 MAC과 새로 계산한 MAC을 비교
     *   - 자바 라이브러리 사용
     * @param mode
     * @param message
     * @param secretKey
     * @param receivedMac
     * @return
     */
    static Object solution3(String mode, String message, String secretKey, String receivedMac) {
        String calculatedMac = createHmacSHA256(message, secretKey);

        if ("CREATE".equals(mode)) {
            return calculatedMac;
        }

        if ("VERIFY".equals(mode)) {
            return calculatedMac.equals(receivedMac);
        }

        throw new IllegalArgumentException("지원하지 않는 모드입니다.");
    }

    /**
     * 4. 전자 서명 검증
     *   - 원본 메시지를 SHA-256으로 해시
     *   - SIGN 모드면 해시값을 개인키로 암호화한 서명을 반환
     *   - VERIFY 모드면 서명을 공개키로 복호화한 값과 해시값을 비교
     * @param mode
     * @param message
     * @param key
     * @param signature
     * @return
     */
    static Object solution4(String mode, String message, String key, String signature) {
        String hashedMessage = hashSHA256(message);

        if ("SIGN".equals(mode)) {
            return encryptRSA(hashedMessage, key);
        }

        if ("VERIFY".equals(mode)) {
            String decryptedSignature = decryptRSA(signature, key);
            return hashedMessage.equals(decryptedSignature);
        }

        throw new IllegalArgumentException("지원하지 않는 모드입니다.");
    }

    /**
     * 5. 전자 인증서 발급 및 검증 시뮬레이션
     *   - ISSUE 모드에서는 이메일과 공개키를 해시하고 CA 비밀키로 서명
     *   - VERIFY 모드에서는 직접 만든 해시와 CA 공개키로 복호화한 서명을 비교
     *   - 검증에 성공하면 사용자 공개키를 반환
     * @param mode
     * @param data
     * @param key
     * @return
     */
    static Object solution5(String mode, Certificate data, String key) {
        String certificateData = data.userEmail + data.userPublicKey;
        String hashedCertificateData = hashSHA256(certificateData);

        if ("ISSUE".equals(mode)) {
            String signature = encryptRSA(hashedCertificateData, key);
            return new Certificate(data.userEmail, data.userPublicKey, signature);
        }

        if ("VERIFY".equals(mode)) {
            String decryptedSignature = decryptRSA(data.signature, key);

            if (hashedCertificateData.equals(decryptedSignature)) {
                return data.userPublicKey;
            }

            return "INVALID_CERTIFICATE";
        }

        throw new IllegalArgumentException("지원하지 않는 모드입니다.");
    }

    static int modularPow(int base, int exponent, int modulus) {
        long result = 1;
        long currentBase = base % modulus;

        while (exponent > 0) {
            if (exponent % 2 == 1) {
                result = (result * currentBase) % modulus;
            }

            currentBase = (currentBase * currentBase) % modulus;
            exponent /= 2;
        }

        return (int) result;
    }

    static String createHmacSHA256(String message, String secretKey) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);

            return toHex(mac.doFinal(message.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    static String hashSHA256(String text) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            return toHex(messageDigest.digest(text.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * AES 가상함수
     * @param text
     * @param key
     * @return
     */
    static String encryptAES(String text, String key) {
        return "AES(" + text + "," + key + ")";
    }

    /**
     * RSA 가상함수
     * @param text
     * @param key
     * @return
     */
    static String encryptRSA(String text, String key) {
        return "RSA(" + text + "," + key + ")";
    }

    static String decryptRSA(String encryptedText, String key) {
        if (!encryptedText.startsWith("RSA(") || !encryptedText.endsWith(")")) {
            return "";
        }

        String content = encryptedText.substring(4, encryptedText.length() - 1);
        int splitIndex = content.lastIndexOf(",");

        if (splitIndex == -1) {
            return "";
        }

        return content.substring(0, splitIndex);
    }

    static String toHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();

        for (byte value : bytes) {
            result.append(String.format("%02x", value));
        }

        return result.toString();
    }

    static class HybridMessage {
        String payload;
        String encryptedKey;

        HybridMessage(String payload, String encryptedKey) {
            this.payload = payload;
            this.encryptedKey = encryptedKey;
        }

        @Override
        public String toString() {
            return "{payload='" + payload + "', encryptedKey='" + encryptedKey + "'}";
        }
    }

    static class Certificate {
        String userEmail;
        String userPublicKey;
        String signature;

        Certificate(String userEmail, String userPublicKey) {
            this.userEmail = userEmail;
            this.userPublicKey = userPublicKey;
        }

        Certificate(String userEmail, String userPublicKey, String signature) {
            this.userEmail = userEmail;
            this.userPublicKey = userPublicKey;
            this.signature = signature;
        }

        @Override
        public String toString() {
            return "{userEmail='" + userEmail + "', userPublicKey='" + userPublicKey + "', signature='" + signature + "'}";
        }
    }
}
