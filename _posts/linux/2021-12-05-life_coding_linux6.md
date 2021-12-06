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
  - `cd /etc/apache2` 로 경로 변경 (여기에 아파치에 대한 설정 파일이 있다.)
- 그 중 apache2.conf를 확인하면 `IncludeOptional sites-enabled/\*.conf`가 있는데 `sites-enabled`라는 디렉토리 안의 모든 .conf 파일을 읽고 사용한다는 것이다.
- `/var/www/html` 을 사용하는 이유는 `/etc/apache2/sites-enabled/000-default.conf` 에 설정이 `/var/www/html`로 되어있기 때문이다.
  - 어떤 서버를 설치하건 /etc 밑에 설정 파일이 있고 <u>그 곳의 설정 파일을 바꾸면 동작하는 방식이 달라진다.</u>

- `/etc/apache2/sites-enabled/000-default.conf` 를 확인하면

```linux
ErrorLog ${APACHE\_LOG\_DIR}/error.log
CustomLog ${APACHE\_LOG\_DIR}/access.log combined
```

- `${APACHE\_LOG\_DIR}` 는 아파치 웹 서버가 동작할 때 로그를 확인하기 위해 특정 디렉토리 아래의 error.log 파일과 access.log 파일에 기록하겠다 라는 것이다.
`${APACHE\_LOG\_DIR}` 는 /var/log/apache2/ 이다.
해당 디렉토리를 보면 access.log와 error.log가 존재한다.
- 누군가 웹 서버에 접속할 때 마다 끝에 접속한 사람의 정보가 추가가 된다.
- 실시간으로 확인하기 위해서는 tail을 사용한다.
  - `tail -f /var/log/apache2/access.log` : 실시간으로 이 파일의 끝에 있는 정보가 나타난다.
- elinks를 통해 들어가면 위의 tail이 작동해 access 로그가 찍힌다.
curl 역시 마찬가지로 접속해도 새로운 access 로그가 찍힌다. (200)
- 없는 파일에 접속하면 접속은 확인이 되지만 상태(404)도 같이 나타난다.
이것이 로그를 찾는 것이다. 대부분의 서버 프로그램이 가지는 동작이다.
서버의 로그가 어디에 있을까에 대해 알아야한다.

## SSH

- 원격제어는 원격에 있는 컴퓨터를 내 앞에 있는 것처럼 다룰 수 있다.
- `sudo apt-get install openssh-server` : 다른 컴퓨터가 내 컴퓨터에 접속할 때 사용
- `sudo aptget install openssh-client` : 다른 컴퓨터로 원격 접속 할 때 사용
- `ssh poeun@172.29.229.202` : 원격 접속할 시
- 다른 컴퓨터임에도 불구하고 원격으로 다른 컴퓨터에 접속할 수 있다.
이 컴퓨터로 명령을 내리면 ssh로 접속한 컴퓨터를 대상으로 실행되게 된다.


<br>
<br>

## References

- [생활코딩 - Linux](https://www.inflearn.com/course/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-%EA%B0%95%EC%A2%8C#curriculum)
- [생활코딩 linux 정리 - ddengkun](https://velog.io/@ddengkun/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-linux-%EC%A0%95%EB%A6%AC)
