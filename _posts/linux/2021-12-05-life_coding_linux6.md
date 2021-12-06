---
layout: single
title: "Linux 기초 정리 (6) - 인터넷, 네트워크, 서버"
excerpt: "생활 코딩 강의 내용을 요약 및 정리한 글입니다. - 인터넷, 네트워크, 서버"
categories: linux
tag: [linux, basic, ubuntu, 인터넷, 네트워크, 서버]

toc: true
toc_sticky: true

last_modified_at: 2021-12-06

sidebar_main: true
---

본 글은 "생활 코딩 - Linux" 강의 내용을 요약 및 정리한 글입니다. <br> 개인공부 목적이므로 자세한 사항은 [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)로 참고하시길 바랍니다.
{: .notice--info}

## 인터넷

- request한 나의 컴퓨터가 client이고, request를 받아서 response 해주는 컴퓨터가 server이다.
  - cleint는 server에게 요청을 한다. server는 client에게 응답한다.
- `DNS`는 이 세상의 모든 domain이 각각 어떤 ip인지 아는 거대한 서버이다.
- `ip addr`를 치면 현재 자신의 ip를 알려준다. (이 컴퓨터의 실제 부여된 ip)

![image](https://user-images.githubusercontent.com/78655692/144783087-7692d136-4661-45f6-a7a6-922774a9d3b3.png)

- `curl ipinfo.io/ip`를 치면 ip를 알려준다. (온라인 입장에서 결과적인 ip가 뭔지 알려준다.)

### apache

- client로 사용하기 위해서는 web browser가 있어야한다.
- 주소란에 google.com/index.html 을 입력하면
google.com에 request를 보낸다. 이때 웹 서버는 요청이 들어오면 요청을 분석한다.
  - 웹 브라우저에 해당하는 제품 : firefox, ie, chrome 등
  - 웹 서버에 속하는 제품 : Apache, nginx, IIS 등

- apache 설치
  - `sudo apt-get update`
  - `sudo apt-get apache2`
- `sudo service apache2 start`를 통해 웹 서버를 켜 준다.
<br>
- `elinks`는 쉘에서 웹브라우징을 할 수 있게 도와주는 프로그램
  - elinks 설치 : `sudo apt-get install elinks`
- unix 계열에서의 설정에 대한 것은 /etc에 저장되어 있다.


## References

- [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)
- [생활코딩 linux 정리 - ddengkun](https://velog.io/@ddengkun/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-linux-%EC%A0%95%EB%A6%AC)
