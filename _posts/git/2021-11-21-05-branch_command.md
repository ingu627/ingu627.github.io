---
layout: single
title: "깃(GIT) (6)- branch 명령어(command)"
categories: git
tag : [git, command]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2021-11-21
---

## branch 명령어  

### 1. branch 생성

```bash
git branch 브랜치명
```

### 2. branch 이동 

```bash
git checkout 브랜치명
```

### 3. branch 생성 & 이동 

```bash
git checkout -b 브랜치명
```

### 4. branch 상태 확인 (local)

```bash
git branch
```

### 5. branch 상태 확인 (remote)

```bash
git branch -r
```

### 6. branch 상태 확인 (local + remote)

```bas
git branch -a
```

### 7. remote branch 가져오기

```bash
git checkout -t 닉네임/브랜치명

git checkout --track 닉네임/브랜치명
```

### 8. branch 병합

- 다른 브랜치를 현재 Checkout된 브랜치에 Merge 하는 명령

```bash
git merge 브랜치명
```

### 9. branch 삭제 (local)

```bash
git branch -d 브랜치명
```

### 10. branch 강제 삭제 (local)

```bash
git branch -D 브랜치명 
```

### 11. branch 원격저장소 삭제 (remote)

```bash
git push origin -d 브랜치명

git push origin --delete 브랜치명
```

### 12. 유효하지 않은 branch 업데이트 (청소) (remote내에서)

- 리모트 브랜치의 더 이상 유효하지 않은 참조를 깨끗이 지우는 명령어

```bash
git remote prune origin

git remote update --prune
```

### 13. branch 로컬 업데이트

- 로컬 저장소를 최신 정보로 갱신(리모트 저장소와 동기화)하며 자동적으로 더이상 유효하지 않은 참조를 제거한다.

```bash
git fetch -p
```

### 14. commit 기록 그래프화 

```bash
git log --all --oneline --graph
```

### 15. branch 업로드

```bash
git push origin 브랜치명 
```

### 16. branch명 변경

```bash
git branch -m 브랜치명 새로운 브랜치명
```

### 17. merge여부 branch 보여줌

- 현재 Checkout한 브랜치에 Merge한 브랜치를 살펴본다.
- 현재 Checkout한 브랜치에 Merge하지 않은 브랜치를 살펴본다.

```bash 
git branch --merged

git branch --no-merged
```

## References 

- [https://github.com/edujustin-hphk](https://github.com/edujustin-hphk)