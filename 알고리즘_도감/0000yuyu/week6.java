public class week6 {

  public static void main(String[] args) {
    System.out.println(challenge1("Hello World"));
    System.out.println(challenge2("Khoor Zroug"));
    System.out.println(challenge3("abc"));
    String encrypted = challenge4("Hello", 72);
    System.out.println("암호화 : " + encrypted);
    String decrypted = challenge4(encrypted, 72);
    System.out.println("복호화 : " + decrypted);
    System.out.println(challenge5(3, 5, 7));
  }

  // 메시지 변경 여부 감지하기
  static String challenge1(String message) {
    int sum = 0;
    for (char c : message.toCharArray()) {
      if (c == ' ') {
        continue;
      }
      sum += c;
    }
    if (sum % 2 == 0) {
      return "OK";
    }
    return "NG";
  }

  // 시저 암호 복호화하기
  static String challenge2(String encryptedMessage) {
    StringBuilder decryptedBuilder = new StringBuilder(encryptedMessage.length());
    for (String s : encryptedMessage.split("")) {
      char decrypted = s.charAt(0);
      if (!s.equals(" ")) {
        int asc = s.charAt(0) - 3;
        decrypted = (char) asc;
      }
      decryptedBuilder.append(decrypted);
    }
    return decryptedBuilder.toString();
  }

  // 해시 값 계산하기
  static int challenge3(String text) {
    int sum = 0;
    for (char c : text.toCharArray()) {
      if (c == ' ') {
        continue;
      }
      sum = (sum + c) * 7 % 101;
    }
    return sum;
  }

  // xor 암호화 및 복호화하기
  static String challenge4(String data, int key) {
    StringBuilder result = new StringBuilder();
    for (char c : data.toCharArray()) {
      char xorChar = (char) (c ^ key);
      result.append(xorChar);
    }
    return result.toString();
  }

  // 모듈러 연산하기
  static int challenge5(long base, long exponent, long modules) {
    long result = 1;

    long baseLong = base % modules;

    for (int i = 0; i < exponent; i++) {
      result = (result * baseLong) % modules;
    }

    return (int) result;
  }
}

