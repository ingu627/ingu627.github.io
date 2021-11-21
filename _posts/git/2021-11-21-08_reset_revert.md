---
layout: single
title: "깃(GIT) (9)- reset, revert"
categories: git
tag : [git]
toc: true
toc_sticky: true
sidebar_main: true

last_modified_at: 2021-11-21
---


## reset vs revert

## reset

- [https://git-scm.com/docs/git-reset](https://git-scm.com/docs/git-reset)
- **"시계를 마치 과거로 돌리는 듯한 행위"**
- 특정 커밋으로 되돌아가며 되돌아간 특정 커밋 이후의 커밋들은 모두 사라지며, 파일 상태는 옵션을 통해 결정

## 3가지 옵션

### 1. `--soft`

- reset하기 전까지 했던 SA, WD 작업은 남겨둠
- **돌아가려는 커밋으로 되돌아가고,**
- 이후의 commit된 파일들을 `staging area`로 돌려놓음 (commit 하기 전 상태)
- 즉, 바로 다시 커밋할 수 있는 상태가 됨

### 2. `--mixed`

- (기본) SA reset, WD작업은 남겨둠
- **돌아가려는 커밋으로 되돌아가고,**
- 이후의 commit된 파일들을 `working directory`로 돌려놓음 (add 하기 전 상태)
- 즉, unstaged 된 상태로 남아있음
- 기본값

### 3. `--hard`

- reset하기 전 SA, WD 모든 작업 리셋
- **돌아가려는 커밋으로 되돌아가고,**
- 이후의 commit된 파일들(`tracked 파일들`)은 모두 working directory에서 삭제
- 단, Untracked 파일은 Untracked로 남음

<img width="717" alt="08-2" src="https://user-images.githubusercontent.com/78655692/142772873-ec02ed28-b141-4b75-9546-ed0d87394aee.png">

```bash
# undoing 폴더에서 했던 내용 이어서 진행

# --hard 예시
$ git log --oneline
d6175dd (HEAD -> master) foo & bar
d984105 text file
a46391e first commit
```

```bash
$ git reset --hard d984105
HEAD is now at d984105 text file
```

```bash
$ git log --oneline
d984105 (HEAD -> master) text file
a46391e first commit

$ git status
On branch master
nothing to commit, working tree clean
```

### reset 특징들 

- `reset`은 과거로 돌아가게 되면 돌아간 커밋 이후의 커밋은 모두 히스토리에서 사라짐
- **커밋 히스토리가 바뀌기 때문에** 다른 사람과  공유하는 브랜치에서 사용 시 충돌이 발생
- 공유하는 브랜치에서 이전 커밋을 수정하고 싶을 때는 `git revert` 사용


## revert

- https://git-scm.com/docs/git-revert

- **"특정 사건을 없었던 일로 만드는 행위"**
- **이전 커밋 내역을 그대로 남겨둔 채 새로운 커밋(==없었던 일입니다!를 의미하는 commit)을 생성**
- **커밋 히스토리 변경 없이 해당 커밋 내용만을 삭제한 상태의 새로운 커밋을 생성**

<img width="705" alt="08-1" src="https://user-images.githubusercontent.com/78655692/142773019-1272bbcc-1c63-4d51-bf10-a475acbca930.png">


### 추가 commit 2개만 더 남기자

```bash
# undoing에서 이어서 진행
$ touch c.txt d.txt
$ git add c.txt
$ git commit -m "Add c.txt"
[master d9c38f7] Add c.txt
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 c.txt

$ git add d.txt
$ git commit -m "Add d.txt"
[master aaf2db9] Add d.txt
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 d.txt
```


```bash
$ git log --oneline
aaf2db9 (HEAD -> master) Add d.txt
d9c38f7 Add c.txt
d984105 text file
a46391e first commit
```

### revert commit 편집기 실행

- 다른 사람과 공유하는 브랜치에서 이전 커밋을 수정하고 싶을 때 사용
- 커밋 히스토리가 바뀌지 않기 때문에 충돌이 발생하지 않음

```bash
$ git revert d984105
Removing b.txt
hint: Waiting for your editor to close the file... error: There was a problem 
with the editor 'vi'.
                     Please supply the message using either -m or -F option.

$ git log --oneline
# 기존 commit 이력이 그대로 남아있기 때문에 해당 하는 시점으로 언제든 
aaf2db9 (HEAD -> master) Add d.txt
d9c38f7 Add c.txt
d984105 text file
a46391e first commit
```

## 정리

<img width="716" alt="08-3" src="https://user-images.githubusercontent.com/78655692/142773150-2bdc36ec-38a5-4b84-ad08-1dfb31951746.png">

![image](https://user-images.githubusercontent.com/78655692/142773166-d77fe378-ade5-42ab-a055-7b0f293d80f1.png)

## 그외 방법

```bash
$ git reflog
aaf2db9 (HEAD -> master) HEAD@{0}: reset: moving to aaf2db9
d47f656 HEAD@{1}: reset: moving to d47f656
d47f656 HEAD@{2}: commit: text file amend
aaf2db9 (HEAD -> master) HEAD@{3}: commit: Add d.txt
d9c38f7 HEAD@{4}: commit: Add c.txt
d984105 HEAD@{5}: reset: moving to d984105
d6175dd HEAD@{6}: commit (amend): foo & bar
48f0541 HEAD@{7}: commit: foo & bar
d984105 HEAD@{8}: commit (amend): text file
2cc67ed HEAD@{9}: commit: amend text file
a46391e HEAD@{10}: commit (initial): first commit
```

- `reflog`는 이런식으로 이전까지했던 작업들 reflog를 확인해 몇번째 HEAD로 이동할지 확인한다.

- 만약 HEAD@{7}로 이동할꺼라면 

```bash
$ git reset --hard HEAD@{7}
```

## References 

- [https://github.com/edujustin-hphk](https://github.com/edujustin-hphk)