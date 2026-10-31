---
layout: single
title: "[에러 해결 방법] R package 설치 오류 : ~로 복사하는데 문제가 발생했습니다: Permission denied"
categories: error
tags: [error, package, R]
toc: true
sidebar_main: false

last_modified_at: 2026-10-09
---

## 원인 : file.copy(savedcopy, lib, recursive = TRUE)에서 ~ 로 복사하는데 문제가 발생했습니다: Permission denied

- 필요한 사용 권한을 사용자와 현재 R 라이브러리 폴더에 쓸 수 없는 경우, 이 오류가 발생한다.

## 해결 방법 
*1.* `.libPaths()`을 실행해 현재 라이브러리 위치를 파악한다.  
*2.* `.libPaths("C:/Rlib")`을 입력해 기본 라이브러리를 추가한다. 

![image](/assets/images/legacy/59802619eb.webp)

*3.* `C:\R\R-4.1.1\etc` 파일 위치로 가 `Rprofile.site` 파일을 메모장으로 실행한다.  

![image](/assets/images/legacy/1c469d3afe.webp)

*4.* 맨 밑에 `.libPaths("C:/Rlib")`을 추가해주면 영구적으로 기본경로가 저장된다.  

![image](/assets/images/legacy/6696403a2c.webp)

*5.* 설치가 잘된다.  

![image](/assets/images/legacy/a47f0c4cde.webp)


## References 
- [R 패키지를 설치 하는 일반적인 문제](https://support.microsoft.com/ko-kr/topic/r-%ED%8C%A8%ED%82%A4%EC%A7%80%EB%A5%BC-%EC%84%A4%EC%B9%98-%ED%95%98%EB%8A%94-%EC%9D%BC%EB%B0%98%EC%A0%81%EC%9D%B8-%EB%AC%B8%EC%A0%9C-0bf1f9ba-ead2-6335-46ec-190f6af75e44)
- [[R 공부하기] R 라이브러리 Package 설치 오류 (Error) - libPaths 설정하기](https://m.blog.naver.com/rickman2/221449799786)