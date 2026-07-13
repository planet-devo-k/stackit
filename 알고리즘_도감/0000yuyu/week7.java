import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.Map;

public class week7 {

  public static void main(String[] args) throws Exception {
    System.out.println("1. 하이브리드 암호화");
    HybridPackage hp = challenge1("Hello, Hybrid Encryption!", "temp_aes_key_123",
        "SERVER_RSA_PUBLIC_KEY");
    System.out.println(hp);

    System.out.println("\n2. 디피-헬만");
    System.out.println(challenge2(23, 5, 6, 15));

    System.out.println("\n3. MAC");
    String mac = (String) challenge3("CREATE", "This is a secret message.", "mysecretkey", "");
    System.out.println("Created: " + mac);
    System.out.println(
        "Verify: " + challenge3("VERIFY", "This is a secret message.", "mysecretkey", mac));

    System.out.println("\n4. 전자 서명");
    String sig = (String) challenge4("SIGN", "Verify this signature.", "MY_PRIVATE_KEY", "");
    System.out.println("Signature: " + sig);
    System.out.println(
        "Verify: " + challenge4("VERIFY", "Verify this signature.", "MY_PUBLIC_KEY", sig));

    System.out.println("\n5. 전자 인증서");
    Certificate cert = (Certificate) challenge5("ISSUE", new Certificate("A@email.com", "PA", ""),
        "SC");
    System.out.println("Issued: " + cert);
    System.out.println("Verify: " + challenge5("VERIFY", cert, "PC"));
  }

  // 가상함수
  static String encryptAES(String text, String key) {
    return "AES_ENCRYPTED_" + text;
  }

  static String encryptRSA(String key, String publicKey) {
    return "RSA_ENCRYPTED_" + key;
  }

  static String hashSHA256(String text) throws Exception {
    return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(text.getBytes()));
  }

  static String decryptRSA(String signature, String publicKey) {
    return signature.replace("RSA_ENCRYPTED_", "");
  }

  static HybridPackage challenge1(String plaintext, String symmetricKey, String publicKey) {
    return new HybridPackage(encryptAES(plaintext, symmetricKey),
        encryptRSA(symmetricKey, publicKey));
  }

  // 디피-헬만 키 교환
  static Map<String, Integer> challenge2(int p, int g, int a, int b) {
    BigInteger P = BigInteger.valueOf(p);
    BigInteger G = BigInteger.valueOf(g);
    BigInteger A = BigInteger.valueOf(a);
    BigInteger B = BigInteger.valueOf(b);

    // G^A mod P
    int aPubKey = G.modPow(A, P).intValue();
    // G^B mod P
    int bPubKey = G.modPow(B, P).intValue();
    // (B의 공개키)^A mod P
    int sharedSecret = BigInteger.valueOf(bPubKey).modPow(A, P).intValue();

    Map<String, Integer> result = new HashMap<>();
    result.put("A_public_key", aPubKey);
    result.put("B_public_key", bPubKey);
    result.put("shared_secret", sharedSecret);
    return result;
  }

  // 메시지 인증 코드 (MAC)
  static Object challenge3(String mode, String message, String secretKey, String receivedMac)
      throws Exception {
    String generatedMac = hashSHA256(message + secretKey);
    if ("CREATE".equals(mode)) {
      return generatedMac;
    }
    return "VERIFY".equals(mode) && generatedMac.equals(receivedMac);
  }

  // 전자 서명 검증
  static Object challenge4(String mode, String message, String key, String signature)
      throws Exception {
    String hash = hashSHA256(message);
    if ("SIGN".equals(mode)) {
      return encryptRSA(hash, key);
    }
    String decryptedHash = decryptRSA(signature, key);
    return hash.equals(decryptedHash);
  }

  static Object challenge5(String mode, Certificate d, String key) throws Exception {
    String content = d.userEmail + d.userPublicKey;
    if ("ISSUE".equals(mode)) {
      return new Certificate(d.userEmail, d.userPublicKey, encryptRSA(hashSHA256(content), key));
    }
    return "VERIFY".equals(mode) && hashSHA256(content).equals(decryptRSA(d.signature, key))
        ? d.userPublicKey
        : "INVALID_CERTIFICATE";
  }

  static class HybridPackage {

    public String payload;
    public String encryptedKey;

    public HybridPackage(String p, String k) {
      this.payload = p;
      this.encryptedKey = k;
    }

    @Override
    public String toString() {
      return String.format("{\"payload\": \"%s\", \"encryptedKey\": \"%s\"}", payload,
          encryptedKey);
    }
  }

  static class Certificate {

    public String userEmail, userPublicKey, signature;

    public Certificate(String e, String k, String s) {
      this.userEmail = e;
      this.userPublicKey = k;
      this.signature = s;
    }

    @Override
    public String toString() {
      return String.format(
          "{\"userEmail\": \"%s\", \"userPublicKey\": \"%s\", \"signature\": \"%s\"}",
          userEmail, userPublicKey, signature);
    }
  }
}