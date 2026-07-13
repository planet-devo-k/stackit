import java.util.Arrays;

class week6 {
    public static void main(String[] args) {
        System.out.println(solution1("Hello World"));
        System.out.println(solution2("Khoor Zruog"));
        System.out.println(solution3("abc"));
        System.out.println(Arrays.toString(toAsciiCodes(solution4("Hello", 72))));
        System.out.println(solution4(solution4("Hello", 72), 72));
        System.out.println(solution5(3, 5, 7));
    }

    /**
     * 1. 데이터 무결성 검증
     *   - 문자열의 각 문자를 순회하며 아스키값을 더하고
     *   - 합이 짝수면 OK, 홀수면 NG를 반환
     * @param message
     * @return
     */
    static String solution1(String message) {
        int sum = 0;

        for (int i = 0; i < message.length(); i++) {
            sum += message.charAt(i);
        }

        return sum % 2 == 0 ? "OK" : "NG";
    }

    /**
     * 2. 시저 암호 복호화
     *   - 알파벳은 암호화할 때 3칸 밀렸으므로 복호화할 때 3칸 되돌림
     *   - 대문자와 소문자로 나누고
     *   - 알파벳이 아닌 문자는 패스
     * @param encryptedMessage
     * @return
     */
    static String solution2(String encryptedMessage) {
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < encryptedMessage.length(); i++) {
            char current = encryptedMessage.charAt(i);

            if (current >= 'A' && current <= 'Z') {
                result.append((char) ('A' + (current - 'A' - 3 + 26) % 26));
            } else if (current >= 'a' && current <= 'z') {
                result.append((char) ('a' + (current - 'a' - 3 + 26) % 26));
            } else {
                result.append(current);
            }
        }

        return result.toString();
    }

    /**
     * 3. 간단한 해시 값 계산
     *   - 현재 해시 값에 문자의 아스키 값을 더함
     *   - 그 결과에 7을 곱하고 101로 나눈 나머지를 새 해시 값으로 사용
     *   - 답은 42라고 하는데, 83이 나오는데 흠
     * @param text
     * @return
     */
    static int solution3(String text) {
        int hash = 0;

        for (int i = 0; i < text.length(); i++) {
            hash = ((hash + text.charAt(i)) * 7) % 101;
        }

        return hash;
    }

    /**
     * 4. XOR 암호화 및 복호화
     *   - 각 문자를 key와 XOR 연산
     *   - XOR은 같은 키로 한 번 더 연산하면 원래 문자열로 돌아옴
     *   - 이것도 답이 좀 다른듯함
     * @param data
     * @param key
     * @return
     */
    static String solution4(String data, int key) {
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < data.length(); i++) {
            result.append((char) (data.charAt(i) ^ key));
        }

        return result.toString();
    }

    /**
     * 5. 모듈러 거듭제곱
     *   - 지수를 절반씩 줄이며 빠르게 계산
     *   - 현재 지수의 마지막 비트가 1이면 result에 현재 base를 곱하기
     * @param base
     * @param exponent
     * @param modulus
     * @return
     */
    static long solution5(long base, long exponent, long modulus) {
        long result = 1;
        long currentBase = base % modulus;

        while (exponent > 0) {
            if (exponent % 2 == 1) {
                result = (result * currentBase) % modulus;
            }

            currentBase = (currentBase * currentBase) % modulus;
            exponent /= 2;
        }

        return result;
    }

    static int[] toAsciiCodes(String text) {
        int[] result = new int[text.length()];

        for (int i = 0; i < text.length(); i++) {
            result[i] = text.charAt(i);
        }

        return result;
    }
}
