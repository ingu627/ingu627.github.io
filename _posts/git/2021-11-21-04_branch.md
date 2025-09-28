---
layout: single
title: "Git 브랜치 전략: branch·checkout·merge 흐름 & 충돌 최소화"
categories: git
tags: [git, branch, checkout, merge]
excerpt: "브랜치 생성·분기·병합(Merge) 전략과 충돌 최소화 워크플로우(branch/checkout/merge) 실전 베스트 프랙티스"
toc: true
toc_sticky: true
sidebar_main: false

date: 2021-11-21
last_modified_at: 2025-09-20
---

**참고**: 이 포스트의 실습 예제는 `master` 브랜치를 사용합니다. 새로운 프로젝트에서는 `main` 브랜치 사용을 권장합니다.
{: .notice--info}

<br>

## branch command

```bash
$ git init
Initialized empty Git repository in F:/branch_practice/.git/

$ touch a.txt
$ git add .
$ git commit -m 'Finish a.txt'
[master (root-commit) 31d9b7b] Finish a.txt
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 a.txt
```

<br>

### 브랜치 생성

```bash
$ git branch 브랜치이름

# 예시
$ git branch feature
```

<br>

### 브랜치 목록 확인

- `*` 가 찍혀있는 것은 현재 위치한 브랜치를 의미함

```bash
$ git branch
  feature
* master
```

<br>

### 브랜치 이동

```bash
$ git checkout 브랜치이름

# 예시
$ git checkout feature
Switched to branch 'feature'

$ git branch
* feature
  master
```

<br>

### 브랜치 생성 + 이동

```bash
$ git checkout -b 브랜치명

# 예시
$ git checkout -b feature2
Switched to a new branch 'feature2'

$ git branch
  feature
* feature2
  master
```

<br>

### 브랜치 병합 (merge)

- `HEAD` : 현재 브랜치의 최신 커밋

```bash
# feature2 브랜치에서 b.txt 파일 생성 후 add, commit
$ touch b.txt
$ git add .
$ git commit -m "Finish b.txt in feature2 branch"
[feature2 b4c6264] Finish b.txt in feature2 branch
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 b.txt
``` 

- feature2에서 b.txt를 생성했다. 이를 다시 master로 가서 feature2와 merge를 할 것이다.

```bash
# master 브랜치로 이동
$ git checkout master
Switched to branch 'master'

# merge
$ git merge 머지할브랜치이름

# 예시
$ git merge feature2 
Updating 31d9b7b..b4c6264
Fast-forward
 b.txt | 0
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 b.txt

# 확인
$ git log
commit b4c6264a5c45aacb80d58851e6800848723c1122 (HEAD -> master, feature2)
Author: ingu627 <rjsdudans@naver.com>
Date:   Sun Nov 21 16:11:05 2021 +0900

    Finish b.txt in feature2 branch

commit 31d9b7b69c3441f83c1f05295c74ac519c797d87 (feature)
Author: ingu627 <rjsdudans@naver.com>
Date:   Sun Nov 21 16:06:23 2021 +0900

    Finish a.txt
```

<br>

### 브랜치 삭제

```bash
$ git branch -d 브랜치이름

# 예시
$ git branch -d feature2
Deleted branch feature2 (was b4c6264).

# 확인
$ git branch
  feature
* master
```

<br>

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

```bash
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

### 11. branch 원격 저장소 삭제 (remote)

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

<br>

## branch scenario 

## 1. branch 사용법

{: .notice--warning}
**중요**: 브랜치를 조작할 때는 반드시 `master` 브랜치에 최소 1개의 커밋이 있어야 합니다!

<br>

### 실습 준비

- 따라해 본다.

```bash
# git 초기화 및 commit 남겨놓기

$ git init
$ touch a.txt 
# a.txt에 text 1이라는 글을 작성한다.

$ git add .
$ git commit -m'text2'
[master 67f01f6] text2
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 b.txt
```

```bash
# 3개의 커밋을 더 남긴다.
$ git log --oneline
b9aaaf5 (HEAD -> master) test3
67f01f6 text2
acf00f0 Initial commit
```

<br>

### HEAD

- [https://stackoverflow.com/questions/2304087/what-is-head-in-git](https://stackoverflow.com/questions/2304087/what-is-head-in-git)

- 현재 위치한 브랜치의 최신 커밋
- HEAD는 현재 브랜치를 가리키는 포인터 

<br>

### ex. 이제 우리는 로그인 기능을 개발해본다고 가정

```bash
$ git branch feature/login # 브랜치 생성만
$ git branch
  feature/login
* master
```

<br>

### master 브랜치에서 마지막 줄 추가

```bash
text 1
text 2
text 3
master에서 작성한 text 4 # 추가

# add, commit
$ touch d.txt # master에서 d.txt를 생성했다.
$ git add .
$ git commit -m'master text 4'
[master 121a503] master text 4
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 d.txt

 
 # log
$ git log --oneline
121a503 (HEAD -> master) master text 4
b9aaaf5 (feature/login) test3
67f01f6 text2
acf00f0 Initial commit
```

<br>

### 브랜치 이동을 하고 `a.txt`를 확인해보자

```bash
$ git checkout feature/login 
Switched to branch 'feature/login'

# master text 4가 사라짐

# log 확인
$ git log --oneline
b9aaaf5 (HEAD -> feature/login) test3
67f01f6 text2
acf00f0 Initial commit
```

```bash
# 현재 브랜치는 feature/login

text 1
text 2
text 3
login text 4 # 추가
```

{: .notice--warning}
**브랜치를 다룰 때는 현재 내가 '어떤' 브랜치에 있는지를 반드시 알아야 합니다!**

```bash
# login.txt

login text 4 # 추가
```

```bash
$ touch login.txt

$ git status
On branch feature/login
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        login.txt # WD + commit 이력 없음(git이 지금까지 한번도 추적한적 없음)

nothing added to commit but untracked files present (use "git add" to track)


# add, commit
$ git add .
$ git commit -m'login text4'
[feature/login f6dda89] login text4
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 login.txt

# 현재 브랜치는? feature/login
$ git log --oneline
f6dda89 (HEAD -> feature/login) login text4
b9aaaf5 test3
67f01f6 text2
acf00f0 Initial commit


# 다른 브랜치의 그래프까지 보는 방법
$ git log --all --graph --oneline
* f6dda89 (HEAD -> feature/login) login text4
| * 121a503 (master) master text 4
|/
* b9aaaf5 test3
* 67f01f6 text2
* acf00f0 Initial commit
```

<br>

## 2. branch merge scenario 

- 드라이브에 git-merge 폴더 생성 후 해당 폴더에서 VS Code를 열자!
![image](https://user-images.githubusercontent.com/78655692/142758517-0a20bf9c-1a0c-400c-a9bd-e8ce94a84ca6.png)

- `Ctrl + 백틱(1왼쪽에 있는)`을 누른 후 `Git Bash` 클릭 후 작업

![image](https://user-images.githubusercontent.com/78655692/142758567-7916dea1-4590-44df-b850-f0dd53b19376.png)

```bash
$ git init
Initialized empty Git repository in F:/git-merge/.git/

$ touch test.txt
```

- test.txt에 master test 1이라고 채워넣기 (저장 꼭!!)
![image](https://user-images.githubusercontent.com/78655692/142758599-ce672eaa-b3a5-4eb7-9285-24711f3bb6ee.png)

```bash
$ git status
On branch master

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        test.txt

nothing added to commit but untracked files present (use "git add" to track) 

$ git add .
$ git commit -m'master test 1'
[master (root-commit) 9fe5f83] master test 1
 1 file changed, 1 insertion(+)
 create mode 100644 test.txt
 
# log
$ git log
commit 9fe5f839afe5de4e366dc981f62f9692cce859ee (HEAD -> master)
Author: ingu627 <rjsdudans@naver.com>
Date:   Sun Nov 21 19:41:06 2021 +0900

    master test 1
```

<br>

## 3가지 병합 상황

## 1. fast-forward

![image-20210706133955957](https://user-images.githubusercontent.com/78655692/142758733-69dc414e-c6a6-4fa2-8513-06f75b29f9d3.png)

{: .notice--warning}
**주의사항**: 반드시 master 브랜치에는 1개 이상의 커밋이 존재해야 합니다!

> "다른 브랜치가 생성된 이후에 master 브랜치의 변경 사항이 없는 상황 => 단순하게 master 브랜치의 포인터를 최신 commit으로 이동시킨다."

master 브랜치에서 `feature/login` 브랜치를 병합(merge) 할 때 `feature/login` 브랜치가 master 브랜치 이후의 commit을 가리키고 있다면 master 브랜치는 `feature/login` 브랜치가 가리키고 있는 최신 commit으로 포인터(HEAD)를 이동시키면 된다.

### 1. feature/login 브랜치 생성 후 이동

```bash
$ git checkout -b feature/login
Switched to a new branch 'feature/login'
```

### 2. 특정한 작업을 완료하고 commit 진행

```bash
$ touch login.txt
$ git add .
$ git commit -m'login test 1'
[feature/login 6302c25] login test 1
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 login.txt

# log
$ git log --oneline
# master 브랜치에서 feature/login 브랜치 생성 -> feature/login 브랜치에서 새로운 commit 생성
6302c25 (HEAD -> feature/login) login test 1
9fe5f83 (master) master test 1
```

![image](https://user-images.githubusercontent.com/78655692/142759038-abd7ef50-0889-42e4-a4ca-a59aa148a36a.png)

### 3. master 브랜치로 이동

- 브랜치를 이동하는 순간 login.txt 파일이 사라진다.
- 왜냐하면 login.txt 파일은 master 브랜치가 아니라 feature/login 브랜치에서 commit(버전)을 했기 때문임

 ```bash
 $ git checkout master
 Switched to branch 'master'
 ```

![image](https://user-images.githubusercontent.com/78655692/142759075-90955a25-8110-47c7-a834-a75c08e38866.png)

### 4. master 브랜치에 feature/login 브랜치에서 작업한 결과물 병합

- 병합 이후에 login.txt 파일이 생김 

{: .notice--info}
**병합 규칙**: 병합하고자 하는 브랜치로 이동한 후 작업합니다.

```bash
$ git merge feature/login
Updating 9fe5f83..6302c25
Fast-forward
login.txt | 0
1 file changed, 0 insertions(+), 0 deletions(-)
create mode 100644 login.txt
```

![image](https://user-images.githubusercontent.com/78655692/142759137-c6b71f4c-69ea-4d46-9427-89c2a46962f0.png)

### 5. 로그 확인

- HEAD -> master가 위로 올라왔음!

```bash
# 병합 전
$ git log --oneline
# master 브랜치에서 feature/login 브랜치 생성 -> feature/login 브랜치에서 새로운 commit 생성
6302c25 (HEAD -> feature/login) login test 1
9fe5f83 (master) master test 1

# 병합 후 
$ git log --oneline
6302c25 (HEAD -> master, feature/login) login test 1
9fe5f83 master test 1
```

### 6. 브랜치 삭제

```bash
$ git branch -d feature/login
Deleted branch feature/login (was 6302c25).

# 확인
$ git branch
* master

$ git log --oneline
6302c25 (HEAD -> master) login test 1
9fe5f83 master test 1
```

<br>

## 2. Merge commit -> conflict x

![image-20210706135659337](https://user-images.githubusercontent.com/78655692/142759223-1d70547d-d5a0-4cb0-924a-808905f5a865.png)

> 다른 브랜치(feature/signup)가 생성된 이후에 **master 브랜치에 변경 사항이 있고 feature/signup 브랜치**에도 변경 사항이 존재하는 경우 -> **이때 충돌 상황이 발생하지 않는 경우** 

- 다른 파일의 변경 사항을 작성(수정) commit한 경우 

- `Merge commit` 이 발생함
  - 이 commit 내역은 우리가 직접 작성한 commit이 아닌 git이 자동으로 작성해준 commit message 
- 충돌이 발생하지 않는 이유는 다른 파일 (같은 파일이라도 다른 라인을 수정한 경우 포함)이기 때문에 단순하게 합치기만 하면 되기 때문!

<br>

### 1. signup 브랜치 생성 & 이동

- `git checkout -b 브랜치이름` : 이름명으로 생성하고 그 브랜치로 이동

```bash
$ git checkout -b feature/signup
Switched to a new branch 'feature/signup'
```

### 2. 특정한 작업을 진행하고 commit

```bash
$ touch signup.txt

# add, commit
$ git add .
$ git commit -m'signup test 1'
[feature/signup 586d298] signup test 1
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 signup.txt
   
# log
$ git log --oneline
586d298 (HEAD -> feature/signup) signup test 1  # feature/signup 브랜치의 최신 커밋 + 현재 내가 위치한 브랜치
6302c25 (master) login test 1 # master 브랜치의 최신 커밋
9fe5f83 master test 1
```

![image](https://user-images.githubusercontent.com/78655692/142759342-723b1a04-a098-4c1f-8a90-0c8643a9beb9.png)

### 3. master로 이동

- 이동하는 순간 signup.txt 파일이 사라짐 
- signup 브랜치에서 파일을 생성하고 commit 했기 때문!

```bash
$ git checkout master
Switched to branch 'master'

$ git log --oneline
6302c25 (HEAD -> master) login test 1
9fe5f83 master test 1
```

![image](https://user-images.githubusercontent.com/78655692/142759358-1f1b6d91-30fa-4853-8dbb-823e5b092810.png)

### 4. master 브랜치에서 추가 작업을 진행한 다음 commit

```bash
$ touch master.txt

# add, commit
$ git add .
$ git commit -m'master test 1'
[master 2c9f3c0] master test 1
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 master.txt
   
# log 
$ git log --oneline
2c9f3c0 (HEAD -> master) master test 1
6302c25 login test 1
9fe5f83 master test 1

# 브랜치 포함 모든 log를 확인할 때 
$ git log --all --oneline
2c9f3c0 (HEAD -> master) master test 1
586d298 (feature/signup) signup test 1
6302c25 login test 1
9fe5f83 master test 1
```

### 5. master 브랜치에 병합

- merge를 진행하고나서 확인해보니 signup.txt가 생기는 걸 확인할 수 있음

```bash
$ git merge feature/signup
Merge made by the 'recursive' strategy.
 signup.txt | 0
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 signup.txt

# log
$ git log --oneline
6e469f3 (HEAD -> master) Merge branch 'feature/signup' # 우리가 직접 입력한 commit x -> Merge commit
2c9f3c0 master test 1
586d298 (feature/signup) signup test 1
6302c25 login test 1
9fe5f83 master test 1
```

### 6. log 

- graph로 보고자 할 때

```bash
$ git log --all --graph --oneline
*   6e469f3 (HEAD -> master) Merge branch 'feature/signup'
|\
| * 586d298 (feature/signup) signup test 1
* | 2c9f3c0 master test 1
|/
* 6302c25 login test 1
* 9fe5f83 master test 1
```

### 7. branch 삭제

```bash
$ git branch -d feature/signup
Deleted branch feature/signup (was 586d298).

$ git log --all --graph --oneline
*   6e469f3 (HEAD -> master) Merge branch 'feature/signup'
|\
| * 586d298 signup test 1
* | 2c9f3c0 master test 1
|/
* 6302c25 login test 1
* 9fe5f83 master test 1
```

<br>

## 3. Merge commit -> conflict o

> 다른 브랜치(feature/signup)가 생성된 이후에 **master 브랜치에 변경 사항이 있고 feature/signup 브랜치**에도 변경 사항이 존재하는 경우 -> **이때 충돌 상황이 발생하는 경우** 

- 같은 파일의 같은 부분을 작성(수정)하여 commit한 경우

- `Merge commit` 이 발생함
  - 이 commit 내역은 우리가 직접 작성한 commit이 아닌 git이 자동으로 작성해준 commit message 
- 충돌이 발생하는 이유는 같은 파일의 같은 부분을 수정했기 때문에 어떤 버전으로 만들지 git은 알 수 없기 때문!
- 그래서 직접 우리가(==사람이) 수정해줘야 한다.

### 1. hotfix 브랜치 생성 후 이동

```bash
$ git checkout -b hotfix
Switched to a new branch 'hotfix'
```

### 2. 특정 작업 완료 후 & commit 진행

```bash
# hotfix branch의 test.txt
master test 1
이건 hotfix 브랜치에서 # 추가
수정했습니다.
```

![image](https://user-images.githubusercontent.com/78655692/142759706-f18c3511-d6b6-41ac-a001-4cbc5db38113.png)


```bash
$ git add .
$ git commit -m'hotfix test 1'
[hotfix 03ba33b] hotfix test 1
 1 file changed, 3 insertions(+), 1 deletion(-)
   
$ git log --oneline
03ba33b (HEAD -> hotfix) hotfix test 1
6e469f3 (master) Merge branch 'feature/signup'
2c9f3c0 master test 1
586d298 signup test 1
6302c25 login test 1
9fe5f83 master test 1
```

### 3. master로 이동

```bash
$ git checkout master
Switched to branch 'master'
```

### 4. 특정 작업 후 commit

- hotfix 브랜치에서 작업한 부분과 동일한 부분을 수정

```bash
# master branch의 test.txt
master test 1
이건 master 브랜치에서 # 추가
수정한 내용입니다.
```

![image](https://user-images.githubusercontent.com/78655692/142759757-821be6c0-f937-447b-ad1c-862e4ab3a7e7.png)

```bash
$ git add .
$ git commit -m'master test 1'
[master b74a431] master test 1
 1 file changed, 3 insertions(+), 1 deletion(-)

# log
$ git log --oneline
b74a431 (HEAD -> master) master test 1
6e469f3 Merge branch 'feature/signup'
2c9f3c0 master test 1
586d298 signup test 1
6302c25 login test 1
9fe5f83 master test 1
```

### 5. Merge

```bash
$ git merge hotfix 
Auto-merging test.txt
CONFLICT (content): Merge conflict in test.txt # 충돌.. -> merge 하는 과정에서 충돌이 발생함 -> test.txt

# 자동으로 병합하는 것 실패! -> 충돌을 해결하고 난 다음에 그 결과를 commit 하세요
Automatic merge failed; fix conflicts and then commit the result.
```

![image](https://user-images.githubusercontent.com/78655692/142759825-537a97e0-24d9-4d04-b435-7cfae9c4db8d.png)

- 같은 부분(라인)을 다른 브랜치에서 각각 수정하고 commit 했기 때문에 병합하는 과정에서 git은 어떤 부분을 합쳐야 하는지 알 수 없음 -> 그래서 우리가 직접 합치고 나서 merge commit을 발생시켜야 한다.

   ```bash
   master test 1
   <<<<<<< HEAD
   이건 master 브랜치에서 
   수정한 내용입니다.
   =======
   이건 hotfix 브랜치에서
   수정했습니다.
   >>>>>>> hotfix
   ```

![image](https://user-images.githubusercontent.com/78655692/142759869-1a80ea94-d9f8-465a-9fe4-0b9392dd08c2.png)

```bash
# 수정
master test 1
이건 master 브랜치에서 
수정한 내용입니다.
이건 hotfix 브랜치에서
수정했습니다.
```

```bash
# master | MERGING -> Merge commit을 남겨야 함
```

![image](https://user-images.githubusercontent.com/78655692/142759982-4fab52ca-d12a-4fb6-abe6-0860c250ed69.png)

```bash
$ git status
On branch master
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   test.txt # both modified

no changes added to commit (use "git add" and/or "git commit -a")

# add로 올리고 commit으로 Merge commit을 직접 남긴다.
$ git add .
$ git commit -m "충돌 해결!"
[master 03c4743] 충돌 해결!
```

### 6. log 확인

- 충돌이 발생하지 않은 경우에는 `6e469f3 (HEAD -> master) Merge branch 'feature/signup'` 이러한 commit을 git이 자동으로 만들어주지만 충돌을 직접 해결하는 경우 우리가 충돌을 해결했다는 의미의 커밋을 직접 남길 수 있다. 

```bash
$ git log --oneline
03c4743 (HEAD -> master) 충돌 해결!
b74a431 master test 1
03ba33b (hotfix) hotfix test 1
6e469f3 Merge branch 'feature/signup'
2c9f3c0 master test 1
586d298 signup test 1
6302c25 login test 1
9fe5f83 master test 1
```

### 7. branch 삭제

```bash
$ git branch -d hotfix
Deleted branch hotfix (was 03ba33b).

# log
$ git log --all --oneline --graph
*   03c4743 (HEAD -> master) 충돌 해결!
|\
| * 03ba33b hotfix test 1
* | b74a431 master test 1
|/
*   6e469f3 Merge branch 'feature/signup'
|\
| * 586d298 signup test 1
* | 2c9f3c0 master test 1
|/
* 6302c25 login test 1
* 9fe5f83 master test 1
```

<br>
<br>

## References 

- [https://github.com/edujustin-hphk](https://github.com/edujustin-hphk)
