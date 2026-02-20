---
layout: single
title: "에러 해결: R 패키지 설치 Permission denied 권한 문제 해결"
excerpt: "R 패키지 설치 시 Permission denied 오류 원인(라이브러리 경로/권한)과 수정 전략"
categories: error
tags: [error, package, R]
toc: true
sidebar_main: false

last_modified_at: 2021-11-13
redirect_from:
  - /error_collection/Permission_denied_R/
---

## 원인 : file.copy(savedcopy, lib, recursive = TRUE)에서 ~ 로 복사하는데 문제가 발생했습니다: Permission denied

- 필요한 사용 권한을 사용자와 현재 R 라이브러리 폴더에 쓸 수 없는 경우, 이 오류가 발생한다.

## 해결 방법 
*1.* `.libPaths()`을 실행해 현재 라이브러리 위치를 파악한다.  
*2.* `.libPaths("C:/Rlib")`을 입력해 기본 라이브러리를 추가한다. 

![image](https://user-images.githubusercontent.com/78655692/141605977-49101b0a-8932-407d-b7f3-faff14a8d4b4.png)

*3.* `C:\R\R-4.1.1\etc` 파일 위치로 가 `Rprofile.site` 파일을 메모장으로 실행한다.  

![image](https://user-images.githubusercontent.com/78655692/141606000-cb91698b-fa52-46e9-8459-11d90cc37dea.png)

*4.* 맨 밑에 `.libPaths("C:/Rlib")`을 추가해주면 영구적으로 기본경로가 저장된다.  

![image](https://user-images.githubusercontent.com/78655692/141606055-4b6b2f05-e645-4425-bc50-8be33bb52d3f.png)

*5.* 설치가 잘된다.  

![image](https://user-images.githubusercontent.com/78655692/141606078-b3d9487e-9ab8-49c2-82b9-3b9af6a50f59.png)


## References 
- [R 패키지를 설치 하는 일반적인 문제](https://support.microsoft.com/ko-kr/topic/r-%ED%8C%A8%ED%82%A4%EC%A7%80%EB%A5%BC-%EC%84%A4%EC%B9%98-%ED%95%98%EB%8A%94-%EC%9D%BC%EB%B0%98%EC%A0%81%EC%9D%B8-%EB%AC%B8%EC%A0%9C-0bf1f9ba-ead2-6335-46ec-190f6af75e44)
- [[R 공부하기] R 라이브러리 Package 설치 오류 (Error) - libPaths 설정하기](https://m.blog.naver.com/rickman2/221449799786)