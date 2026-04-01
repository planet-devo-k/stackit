# Infrastructure

## Commit Convention

이 레포의 인프라/자동화 작업에 사용하는 커밋 타입입니다.

| Type       | Description                                    | Example                                       |
| ---------- | ---------------------------------------------- | --------------------------------------------- |
| `feat`     | 새로운 스크립트, 워크플로우, 자동화 기능 추가  | `feat: add goal track automation`             |
| `refactor` | 기존 스크립트/워크플로우 구조 변경 (동작 동일) | `refactor: move milestone_id to session data` |
| `fix`      | 스크립트/워크플로우 버그 수정                  | `fix: correct template placeholder mismatch`  |
| `chore`    | 설정, 의존성, 환경 변수 등 단순 변경           | `chore: update secrets config`                |
| `docs`     | 문서 추가/수정 (README, 템플릿 등)             | `docs: add infrastructure guide`              |
| `data`     | 세션 데이터 추가/수정                          | `data: add session_7 schedule`                |
