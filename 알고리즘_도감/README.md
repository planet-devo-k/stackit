# 알고리즘 도감

## Introduction

**목표**

- 기초부터 탄탄하게 자료구조와 알고리즘(DSA) 장기 학습 체력 기르기

**리소스**

- 책: 알고리즘 도감(도서, 앱) by 이시다 모리테루, 미야자키 쇼이치
- 툴: 깃북, 필요에 따라 머메이드, 옵시디언 등 자율적으로 활용

**운영**

- 일시: 매주 일요일 오후 9:00 ~ 10:00
- 기간: 2026년 4월 26일 ~ 6월 28일
- 장소: 온라인 디스코드 Planet Devo K Stackit 스터디 채널
- 방식:
  - 매주 정해진 분량 학습 후, 정리한 내용 랜덤 발표, 챌린지 풀이 및 리뷰, 질의응답 및 토론
  - 보증금 제도로 운영합니다.

## Schedule

[Overview](https://github.com/planet-devo-k/stackit/issues/13)

<table>
<thead>
<tr>
<th>Week</th>
<th>Period</th>
<th>Main Topics</th>
<th>Issue</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>2026.04.26 ~ 2026.04.26</td>
<td>Orientation: Study Introduction, Rules, and Schedule</td>
<td><a href="https://github.com/planet-devo-k/stackit/issues/14">#1</a></td>
</tr>
<tr>
<td>1</td>
<td>2026.04.27 ~ 2026.05.03</td>
<td>Algorithm Basics, Time Complexity, List, Array</td>
<td><a href="https://github.com/planet-devo-k/stackit/issues/15">#2</a></td>
</tr>
<tr>
<td>2</td>
<td>2026.05.04 ~ 2026.05.10</td>
<td>Stack, Queue, Hash Table, Heap, Binary Search Tree</td>
<td><a href="https://github.com/planet-devo-k/stackit/issues/16">#3</a></td>
</tr>
<tr>
<td>3</td>
<td>2026.05.11 ~ 2026.05.17</td>
<td>Sorting: Bubble, Selection, Insertion, Heap, Merge, Quick</td>
<td><a href="https://github.com/planet-devo-k/stackit/issues/17">#4</a></td>
</tr>
<tr>
<td>4</td>
<td>2026.05.18 ~ 2026.05.24</td>
<td>Searching and Graph Basics: Linear, Binary, BFS, DFS</td>
<td><a href="https://github.com/planet-devo-k/stackit/issues/18">#5</a></td>
</tr>
<tr>
<td>5</td>
<td>2026.05.25 ~ 2026.05.31</td>
<td>Shortest Path Algorithms: Bellman-Ford, Dijkstra, A*</td>
<td><a href="https://github.com/planet-devo-k/stackit/issues/19">#6</a></td>
</tr>
<tr>
<td>6</td>
<td>2026.06.01 ~ 2026.06.07</td>
<td>Security Algorithms I: Hash Functions, Symmetric/Public Key</td>
<td><a href="https://github.com/planet-devo-k/stackit/issues/20">#7</a></td>
</tr>
<tr>
<td>7</td>
<td>2026.06.08 ~ 2026.06.14</td>
<td>Security Algorithms II: Hybrid, Diffie-Hellman, MAC, Signature</td>
<td><a href="https://github.com/planet-devo-k/stackit/issues/21">#8</a></td>
</tr>
<tr>
<td>8</td>
<td>2026.06.15 ~ 2026.06.21</td>
<td>Clustering and Others: k-means, PageRank, Tower of Hanoi</td>
<td><a href="https://github.com/planet-devo-k/stackit/issues/22">#9</a></td>
</tr>
<tr>
<td>9</td>
<td>2026.06.22 ~ 2026.06.28</td>
<td>Final Review and Retrospective</td>
<td><a href="https://github.com/planet-devo-k/stackit/issues/23">#10</a></td>
</tr>
</tbody>
</table>

## Members

<!--
- 송시은 [sgoldenbird](https://github.com/sgoldenbird)
- 손수진 [pappaya109](https://github.com/pappaya109)
- 전유진 [yuj2n](https://github.com/yuj2n)
-->

## [Structure & Workflow](../README.md#structure--workflow)

**1. Individual Study**

- 개별 학습: 주차별 분량을 각자 심도있게 학습합니다.
- 내용 정리: 학습 도구를 활용해 자신만의 방식으로 지식을 구조화합니다.

**2. Challenge**

- 알고리즘 풀이: Alby가 생성한 주차별 챌린지를 원하는 언어로 해결합니다.

**3. PR & Review**

- PR: 정리한 내용과 풀이 코드를 Pull Request로 제출합니다.
- 리뷰: 동료들의 코드를 리뷰하며 인사이트를 나눕니다.

**4. Live: Discussion & Feedback**

- 랜덤 발표: 당일 선정된 발표자가 핵심 내용을 공유합니다.
- 심화 토론: 학습 중 모호했던 부분이나 궁금한 점을 함께 논의합니다.
- 코드 리뷰: Alby의 피드백과 동료 리뷰를 바탕으로 풀이를 회고합니다.

## Rules

**[Ground Rules](../README.md#rules)**
| **[Branch & Directory](../README.md#rules)**
| **[Issue](../README.md#rules)**
| **[GitBook](../README.md#rules)**
| **[Commit](../README.md#rules)**

**Branch & Directory**

- 개인 브랜치와 폴더를 사용하며, 내부 파일은 아래 형식을 유지합니다.
  - [username]/week1.md, week1.js(.py...)
  - 챌린지 풀이 함수명 challenge1, challenge2 ...

**PR**

- PR 마감: 매주 **토요일 자정**까지 `main` 브랜치로 PR을 제출합니다.
- 리뷰 마감: 매주 **일요일 오후 8시**까지 자신을 제외한 모든 팀원의 PR에 각각 1개 이상의 리뷰를 남깁니다.

**Deposit & Penalty**

- 세션이 시작된 이후에는 개인 사정으로 인한 중도 하차를 허용하지 않으며, 예외는 두지 않습니다. (하차 시 보증금 반환 불가)

- 보증금: 인당 20,000원
- 패널티
  - PR 기한 내 미제출 -1,000원
  - 리뷰 기한 내 미완료 -1,000원
  - 결석 -1,000원
- 정산
  - 정산은 세션 마지막 날 진행합니다.
  - 모인 패널티 금액은 참여자 수로 나누어 분배합니다.
