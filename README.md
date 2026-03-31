<p align="right">
  <a href="https://discord.gg/8vn2pZ6p">
    <img src="https://img.shields.io/discord/1374753887902498929?color=7289DA&label=Join%20Community&logo=discord&logoColor=white&style=for-the-badge" alt="Discord Join">
  </a>
</p>

<h1 align="center">STACKIT</h1>
<p align="center">천천히, 그러나 확실하게 나아가는 DSA 트랙</p>

## Introduction

자료구조와 알고리즘의 기초를 다지고 심화학습으로 나아가는 스터디입니다.
📌 **진행 상황**은 [Milestones](https://github.com/planet-devo-k/stackit/milestones)와 [Roadmap](https://github.com/orgs/planet-devo-k/projects/4/views/4)을 참고하세요.

## Tracks

<table>
  <thead>
    <tr>
      <th>Track</th>
      <th>Period</th>
      <th>Domain</th>
      <th>Source</th>
      <th>Description</th>
      <th>Document</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>알고리즘 도감</strong></td>
      <td>2026.04 ~ 2026.06</td>
      <td><code>CS, DSA</code></td>
      <td>알고리즘 도감 · 이시다 모리테루, 미야자키 쇼이치</td>
      <td>자료구조와 알고리즘을 시각적으로 이해하고 현대 보안 및 클러스터링 기법까지 폭넓게 탐구</td>
      <td><a href="./알고리즘 도감/README.md">View Link</a></td>
    </tr>
  </tbody>
</table>

## Members

<!--
- 송시은 [sgoldenbird](https://github.com/sgoldenbird)
- 손수진 [pappaya109](https://github.com/pappaya109)
- 조인성 [Insung-Jo](https://github.com/Insung-Jo)
- 전유진 [yuj2n](https://github.com/yuj2n)
-->

## Structure & Workflow

본 저장소는 다음과 같은 구조와 흐름으로 구성되어 있습니다.

- 폴더 구조

  ```
  [source]/[member]/[content.md]
  e.g.알고리즘_도감/sgoldenbird/ch1.md
  ```

- GitHub ↔ GitBook 동기화 흐름

  ```
  [GitHub → GitBook]

  개인 브랜치에서 작업, SUMMARY.md 추가 → PR 생성 → PR 머지 → 자동으로 GitBook 에도 반영


  [GitBook → GitHub]

  GitBook 개인 Space에서 작업 → CR 제목 입력 → CR 머지 → GitHub 개인 브랜치에 반영 → PR 생성 → PR 머지
  ```

  ## Rules

**Ground Rules**

- [PLANET DEVO K GROUND RULES](https://github.com/planet-devo-k#ground-rules)

**PR/CR & Issue**

- 질문이 있을 경우
  - [Q&A](https://github.com/planet-devo-k/diveit/discussions/categories/q-a)활용
  - 해당 PR에 question label을 추가
  - 해당 PR에 이슈 넘버 추가
- **GitBook**에서 작업 시 상단의 <mark style="background-color:yellow;">**CR 제목**</mark>을 커밋 메시지 규칙에 맞게 작성하세요.
- 깃북의 목차와 구조를 결정하는 SUMMARY.md를 작성합니다.

**Commit**

- 정해진 분량 만큼 정리한 내용을 커밋합니다.
  <table>
  <thead>
  <tr>
  <th >Type</th>
  <th >Description</th>
  <th>Example</th>
  </tr>
  </thead>
  <tbody>
  <tr>
  <td><code>study:ch#~ch# </code></td>
  <td><strong>챕터별 정리 추가</strong><br />신규 학습 내용 업로드</td>
  <td><code>study: ch1~ch3.6 정리</code></td>
  </tr>
  <tr>
  <td><code>update:</code></td>
  <td><strong>정리 보강/수정</strong><br />내용 확장, 예제 추가, 오타 수정</td>
  <td><code>update: ch2 예시 추가</code></td>
  </tr>
  <tr>
  <td><code>docs:</code></td>
  <td><strong>메인 문서 관리</strong><br />README 업데이트</td>
  <td><code>docs: update README</code></td>
  </tr>
  <tr>
  <td><code>chore:</code></td>
  <td><strong>기타 변경 사항</strong><br /></td>
  <td><code></code></td>
  </tr>
  </tbody>
  </table>

---

<p align="right">
  <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">
    <img src="https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg" alt="License: CC BY-NC-SA 4.0">
  </a>
  <br/>
  <sub><b>Course Materials</b>: Copyright © Original Author. All rights reserved.</sub>
  <br/>
  <sub><b>Study Notes</b>: Copyright © 2026 sgoldenbird. Licensed under CC BY-NC-SA 4.0.</sub>
</p>
