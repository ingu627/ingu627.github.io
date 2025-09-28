---
layout: single
title: '컨테이너, 도커, 쿠버네티스 개념'
excerpt: "개발 환경 불일치 문제를 해결하는 컨테이너 기술부터 대규모 배포를 자동화하는 쿠버네티스까지, 현대 개발의 핵심 3요소를 쉽고 명확하게 설명한다."
categories: [docker]
tags : [컨테이너, 도커, 쿠버네티스, 가상화, 데브옵스, 도커 빌드, 파드, yaml, kubectl, 서버 환경, 개발 환경]
toc: true
toc_sticky: true
sidebar_main: true

date: 2025-09-21
last_modified_at: 2025-09-21
---

"제 컴퓨터에서는 잘 되는데요?" 이 지긋지긋한 악몽은 이제 끝이다. 이 글은 개발 환경의 차이로 발생하는 문제를 해결하는 컨테이너 기술의 기본 개념부터, 수많은 컨테이너를 효율적으로 관리하는 도커와 쿠버네티스까지, 현대 소프트웨어 개발의 핵심 3요소를 단계별로 정복하는 가이드다.
{:.notice--info}
<br>

## 1부: 컨테이너 혁명 — 코드를 화물처럼 운송하기

<img width="800" height="650" alt="image" src="https://gist.github.com/user-attachments/assets/c1f15a22-6b1e-4f59-8803-4bdc0260d987" />

### 컨테이너란 무엇인가?

- 개발자라면 누구나 "내 컴퓨터에서는 완벽하게 작동하던 애플리케이션이 다른 서버에서는 실패하는" 끔찍한 경험을 해봤을 것이다.[^1] 
- 이는 라이브러리 버전이나 OS 설정 같은 미세한 환경 차이 때문에 발생한다. 이 문제를 해결하기 위해 등장한 것이 바로 '컨테이너' 기술이다.
- 컨테이너는 해운업의 '선적 컨테이너'와 같다.[^2] 규격화된 선적 컨테이너 덕분에 내용물이 무엇이든 전 세계 어디서나 동일한 방식으로 운송할 수 있게 된 것처럼,[^2] IT의 컨테이너는 애플리케이션과 실행에 필요한 모든 환경(코드, 라이브러리, 도구 등)을 하나의 표준화된 '상자'에 담는다.[^4] 이 상자는 개발자 노트북, 테스트 서버, 클라우드 등 어디로 옮겨도 항상 동일하게 작동하여 '이식성'을 보장하고 "제 컴퓨터에서는 되는데요" 문제를 근본적으로 해결한다.[^4]
- 기술적으로 컨테이너는 호스트 OS의 커널을 공유하지만, 각 애플리케이션은 격리된 사용자 공간에서 실행되는 OS 수준 가상화 기술이다.[^9] 이 '커널 공유' 덕분에 컨테이너는 믿을 수 없을 만큼 가볍고 효율적이다.

<br>

### 컨테이너 vs. 가상 머신(VM)

- 컨테이너와 VM은 모두 격리된 환경을 제공하지만, 가상화하는 대상이 다르다. VM은 하드웨어를, 컨테이너는 운영체제를 가상화한다.[^7]

- **가상 머신(VM)**
  - 하이퍼바이저를 통해 물리 하드웨어를 에뮬레이션한다.[^9]
  - 각 VM마다 독립된 '게스트 OS'를 통째로 설치해야 하므로 리소스 소모가 크고 무겁다.[^9]
  - 크기는 기가바이트(GB) 단위이며, 부팅에 수 분이 걸린다.[^13]
- **컨테이너**
  - 호스트 OS의 커널을 공유하며, 게스트 OS가 필요 없다.[^8]
  - 프로세스 수준으로 격리되어 매우 가볍고 빠르다.[^15]
  - 크기는 메가바이트(MB) 단위이며, 시작하는 데 수 초밖에 걸리지 않는다.[^13]

- 이러한 효율성 덕분에 단일 서버에 훨씬 더 많은 컨테이너를 실행할 수 있어, 인프라 비용을 크게 절감할 수 있다.[^13]

<br>

## 2부: 도커 — 컨테이너 시대의 개막

### 도커란 무엇인가?

- 컨테이너와 유사한 기술은 이전에도 있었지만, 너무 복잡해서 널리 쓰이지 못했다.[^10] 2013년에 등장한 도커(Docker)는 간단한 명령어로 누구나 쉽게 컨테이너를 만들고, 배포하고, 실행할 수 있게 함으로써 컨테이너 기술을 대중화시킨 오픈소스 플랫폼이다.[^1]

- **Dockerfile**: 모든 것의 시작점이다. Dockerfile은 도커 이미지를 빌드하기 위한 단계별 지침이 담긴 간단한 텍스트 파일이다. 요리 레시피나 조립 설명서라고 생각할 수 있다. 이 파일에는 기반이 될 OS, 복사할 코드, 설치할 종속성, 그리고 컨테이너가 시작될 때 실행할 명령 등이 명시된다.[^19]
- **이미지(Image)**: Dockerfile을 빌드한 결과물이다. 이미지는 애플리케이션과 그 모든 종속성을 포함하는 읽기 전용 템플릿 또는 청사진이다. 이미지는 여러 개의 '레이어(Layer)'로 구성되는데, Dockerfile의 각 명령어는 새로운 레이어를 생성한다. 이 레이어 구조 덕분에 변경되지 않은 레이어는 캐시에서 재사용될 수 있어 빌드 효율성이 매우 높다. 이미지는 도커 허브(Docker Hub)와 같은 공개 레지스트리나 사설 레지스트리에 저장된다.[^5]
- **컨테이너(Container)**: 이미지의 살아있는, 실행 중인 인스턴스다. 이미지가 레시피라면, 컨테이너는 그 레시피로 구운 케이크다. 사용자는 컨테이너를 생성, 시작, 중지, 이동, 삭제할 수 있다. 각 컨테이너는 격리된 환경이지만, 불변의 이미지를 기반으로 한다. 하나의 이미지로부터 수많은 컨테이너를 실행할 수 있다.[^8]

### 실습: 나만의 Nginx 웹 서버 컨테이너 만들기

- 이제 간단한 Nginx 웹 서버를 컨테이너로 직접 만들어보자.
- 새 폴더를 하나 만들고, 그 안에 Dockerfile과 index.html이라는 두 개의 파일을 생성한다.

[1] index.html 파일 생성

- 원하는 폴더에 환영 메시지를 담은 index.html 파일을 만든다.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Welcome to Docker!</title>
</head>
<body>
  <h1>Hello from my first Nginx Container!</h1>
  <p>This page is being served by Nginx running inside a Docker container.</p>
</body>
</html>
```

<br>

[2] Dockerfile 생성[^23]

- 같은 폴더에 Dockerfile을 만들고 아래 내용을 작성한다.

```dockerfile
# 1단계: 빌드의 기반이 될 베이스 이미지를 지정한다.
# 도커 허브의 공식 Nginx 이미지를 사용한다.
FROM nginx:latest

# 2단계: 우리가 만든 맞춤형 index.html 파일을 이미지 안으로 복사한다.
# 이 파일은 Nginx의 기본 환영 페이지를 덮어쓰게 된다.
# 대상 경로는 Nginx가 기본적으로 파일을 서비스하는 위치다.
COPY ./index.html /usr/share/nginx/html/index.html
```

<br>

[3] 이미지 빌드[^25]

- 터미널을 열고 프로젝트 폴더로 이동한 뒤, docker build 명령어를 실행한다.
- **명령어:** docker build -t my-nginx-server .
- **설명:**
  - `docker build`: Dockerfile로부터 이미지를 빌드하는 명령어다. 
  - `-t my-nginx-server`: -t 플래그는 이미지에 사람이 읽기 쉬운 이름(my-nginx-server)으로 "태그"를 지정한다. 
  - `.`: 현재 디렉터리에서 Dockerfile을 찾으라는 의미다.

[4] 컨테이너 실행[^25]

- 이제 이미지가 준비되었으니, docker run 명령어를 사용해 컨테이너로 실행해 보자.
- **명령어**: `docker run -d -p 8080:80 --name my-first-container my-nginx-server`
- **설명**:
  - `docker run`: 이미지로부터 컨테이너를 생성하고 시작하는 명령어다. 
  - `-d`: "분리 모드(Detached mode)"를 의미한다. 컨테이너를 백그라운드에서 실행하여 터미널을 계속 사용할 수 있게 한다. 
  - `-p 8080:80`: "포트 매핑"이다. 이는 매우 중요하다. 이 설정은 여러분의 컴퓨터(호스트)의 8080번 포트를 컨테이너 내부의 80번 포트(Nginx가 기본으로 사용하는 포트)에 연결한다. 이를 통해 브라우저에서 웹 서버에 접속할 수 있다. 
  - `--name my-first-container`: 실행 중인 컨테이너에 기억하기 쉬운 이름을 부여한다. 
  - `my-nginx-server`: 실행하고자 하는 이미지의 이름이다.

<br>

[5] 확인

- 웹 브라우저에서 http://localhost:8080 으로 접속해 직접 만든 환영 페이지가 뜨는지 확인한다.

<br>

## 3부: 쿠버네티스 — 컨테이너 함대의 지휘자

### 왜 쿠버네티스가 필요한가?

- 컨테이너 하나를 실행하는 것은 간단하다. 하지만 수십, 수백 개의 마이크로서비스로 구성된 실제 애플리케이션은 어떨까? 각 서비스가 자체 컨테이너에서 실행될 때, 이를 수동으로 관리하는 것은 재앙에 가깝다. 다음과 같은 문제들에 직면하게 된다.
- **배포**: 어떻게 서비스 중단 없이 모든 컨테이너에 업데이트를 적용할 수 있을까? 
- **확장**: 트래픽이 급증할 때 어떻게 컨테이너 수를 늘리고, 잠잠해지면 다시 줄일 수 있을까? 
- **네트워킹**: IP 주소가 계속 바뀌는 컨테이너들이 어떻게 서로를 찾아 통신할 수 있을까? 
- **복원력**: 서버 하나가 다운되면 그 위에서 실행되던 컨테이너들을 어떻게 자동으로 재시작할 수 있을까? 
- 이러한 복잡성을 해결하기 위해서는 전문적인 도구, 즉 **컨테이너 오케스트레이터(Container Orchestrator)**가 필요하다.

<br>

### 쿠버네티스란 무엇인가?

- **쿠버네티스(Kubernetes, K8s)**는 컨테이너화된 애플리케이션의 배포, 확장, 관리를 자동화하는 오픈소스 플랫폼으로, 사실상의 표준이다.[^32] 
- 쿠버네티스는 오케스트라의 '지휘자'와 같다. 각 컨테이너(연주자)를 직접 다루는 대신, 전체 시스템이 사용자가 원하는 '바람직한 상태(desired state)'를 유지하도록 지휘한다.[^31]
- 사용자는 YAML 파일에 "Nginx 복제본 3개를 항상 실행시켜줘"라고 선언하기만 하면, 쿠버네티스는 현재 상태를 지속적으로 모니터링하며 만약 컨테이너 하나가 죽으면 즉시 새로 생성해 3개를 유지한다. 이 '자가 치유(self-healing)' 기능이 쿠버네티스의 핵심이다.[^31]

- **클러스터(Cluster)**: 쿠버네티스가 관리하는 노드(서버)들의 전체 집합.[^33]
- **노드(Node)**: 컨테이너가 실제로 실행되는 개별 서버 (VM 또는 물리 머신).[^^38]
- **파드(Pod)**: 쿠버네티스에서 배포할 수 있는 가장 작은 단위. 하나 이상의 컨테이너 그룹으로 구성된다.[^41]
- **디플로이먼트(Deployment)**: 파드의 복제본 수를 관리하고, 무중단 업데이트를 가능하게 하는 컨트롤러.[^43]
- **서비스(Service)**: 여러 파드에 대한 안정적인 단일 진입점(고정 IP, DNS)을 제공하고, 요청을 분산하는 로드 밸런서 역할을 한다.[^46]

<br>

### 실습: 쿠버네티스에 Nginx 앱 배포하기

- 앞서 만든 도커 이미지를 쿠버네티스에 배포해보자. (Minikube 등 로컬 클러스터 환경 필요)

[1] deployment.yaml 파일 생성[^43]

- 이 매니페스트는 쿠버네티스에게 무엇을 실행할지 알려준다. 
- my-nginx-server 이미지로 파드 3개를 실행하라고 정의한다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: my-nginx-server
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
```

> 참고: imagePullPolicy: IfNotPresent는 쿠버네티스가 이미지를 원격 레지스트리에서 가져오기 전에 로컬에 이미지가 있는지 먼저 확인하도록 한다. <br> 
> 로컬에서 빌드한 이미지를 사용할 때 유용하다.

<br>

[2] service.yaml 파일 생성[^45]

- 외부에서 디플로이먼트에 접근할 수 있도록 NodePort 타입의 서비스를 정의한다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx # 이 셀렉터는 'app: nginx' 레이블을 가진 파드와 서비스를 연결한다.
  ports:
    - protocol: TCP
      port: 80 # 서비스가 클러스터 내부에서 사용할 포트
      targetPort: 80 # 트래픽을 전달할 파드 내부의 포트
  type: NodePort # 각 노드의 IP에 고정된 포트로 서비스를 노출한다.
```

<br>

[3] 클러스터에 적용

- kubectl apply 명령어를 사용해 이 매니페스트들을 쿠버네티스 클러스터에 제출한다.

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

<br>

[4] 확인 및 접속

- 생성된 리소스들의 상태를 확인한다. 
  - `kubectl get deployment`: nginx-deployment가 3/3개의 복제본으로 준비된 것을 볼 수 있다. 
  - `kubectl get pods`: nginx-deployment-xxxxx 형태의 파드 3개가 실행 중인 것을 볼 수 있다. 
  - `kubectl get service`: nginx-service에 NodePort가 할당된 것을 볼 수 있다 (예: 80:31234/TCP). 31234가 외부에서 접속할 포트다.

<br>

[5] 애플리케이션 접속

- Minikube를 사용 중이라면 minikube service nginx-service 명령을 실행하여 브라우저에서 바로 확인할 수 있다. 
- 다른 환경에서는 클러스터 노드의 IP 주소와 위에서 확인한 NodePort를 조합하여 브라우저에 입력한다 (예: http://<노드_IP>:<NodePort>). 
- 이제 여러분의 맞춤형 Nginx 페이지가 확장 가능하고 안정적으로 관리되는 쿠버네티스 배포 환경 위에서 서비스되는 것을 확인할 수 있다.

<br>

## 결론

- 우리는 "제 컴퓨터에서는 되는데요"라는 근본적인 문제에서 출발하여 강력하고 확장 가능한 솔루션에 이르는 여정을 함께했다. 
- **컨테이너**는 우리 코드에 일관성과 이식성을 보장하는 표준화된 "상자"를 제공했다. 
- **도커**는 이 개별 상자들을 쉽게 만들고, 옮기고, 실행할 수 있는 도구를 제공했다. 
- **쿠버네티스**는 수천 개의 상자로 이루어진 "함대"를 지휘하여 우리 애플리케이션이 복원력 있고, 확장 가능하며, 항상 사용 가능하도록 보장하는 관리 시스템을 제공했다.
- 이 세 가지 기술은 단순한 도구가 아니라 패러다임의 전환을 의미한다. 이들은 데브옵스 문화, 마이크로서비스 아키텍처, 그리고 클라우드 인프라의 효율적인 사용을 가능하게 하는 현대 소프트웨어 개발의 기반이다.

<br>
<br>

## References 

[^1]: [Red Hat — What is a Linux container?](https://www.redhat.com/ko/topics/containers/what-is-a-linux-container)
[^2]: [AWS — Containers](https://aws.amazon.com/ko/containers/)
[^3]: [Docker — What is a container](https://www.docker.com/resources/what-container/)
[^4]: [Google Cloud — What are containers?](https://cloud.google.com/learn/what-are-containers?hl=ko)
[^5]: [OPENMARU — 하이브리드 클라우드 컨테이너 기술](https://www.openmaru.io/%ED%95%98%EC%9D%B4%EB%B8%8C%EB%A6%AC%EB%93%9C-%ED%81%B4%EB%9D%BC%EC%9A%B0%EB%93%9C%EB%A5%BC-%EC%9C%84%ED%95%9C-%EC%B0%A8%EC%84%B8%EB%8C%80-%EA%B0%80%EC%83%81%ED%99%94-%EA%B8%B0%EC%88%A0-%EC%BB%A8/)
[^6]: [Red Hat — What is containerization](https://www.redhat.com/ko/topics/cloud-native-apps/what-is-containerization)
[^7]: [OPENMARU — 컨테이너 기술의 개념 쉽게 이해하기](https://www.openmaru.io/%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%EA%B8%B0%EC%88%A0%EC%9D%98-%EA%B0%9C%EB%85%90-%EC%89%BD%EA%B2%8C-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0/)
[^8]: [AWS — Docker](https://aws.amazon.com/ko/docker/)
[^9]: [Red Hat — Containers vs VMs](https://www.redhat.com/ko/topics/containers/containers-vs-vms)
[^10]: [Watch & Learn — 컨테이너 기술과 도커 개념 이해](https://watch-n-learn.tistory.com/4)
[^11]: [IBM — What are containers](https://www.ibm.com/kr-ko/cloud/learn/containers)
[^12]: [Google Cloud — Containers vs VMs](https://cloud.google.com/discover/containers-vs-vms?hl=ko)
[^13]: [IBM — Containerization](https://www.ibm.com/kr-ko/think/topics/containerization)
[^14]: [Atlassian — Containers vs VMs](https://www.atlassian.com/ko/microservices/cloud-computing/containers-vs-vms)
[^15]: [태어난김에 개발자 — 컨테이너 vs 가상머신](https://born-dev.tistory.com/39)
[^16]: [집주변이 최고야 — 컨테이너가 뭐에요?](https://nearhome.tistory.com/83)
[^17]: [Red Hat — What is container orchestration](https://www.redhat.com/ko/topics/containers/what-is-container-orchestration)
[^18]: [Kubernetes — 개요](https://kubernetes.io/ko/docs/concepts/overview/)
[^19]: [Velog — 컨테이너 및 도커 개념정리](https://velog.io/@geunwoobaek/%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88-%EB%B0%8F-%EB%8F%84%EC%BB%A4-%EA%B0%9C%EB%85%90%EC%A0%95%EB%A6%AC)
[^20]: [CIO — What are containers and why do you need them](https://www.cio.com/article/227835/what-are-containers-and-why-do-you-need-them.html)
[^21]: [Docker — Get started](https://www.docker.com/get-started/)
[^22]: [Docker Docs — Getting started overview](https://docs.docker.com/get-started/overview/)
[^23]: [티스토리 — Dockerfile로 이미지 만들기](https://developer-jinnie.tistory.com/57)
[^24]: [Docker Docs — Dockerfile reference](https://docs.docker.com/engine/reference/builder/)
[^25]: [AWS — Docker 개요](https://aws.amazon.com/ko/docker/?nc1=h_ls)
[^26]: [티스토리 — Nginx 컨테이너 + 이미지 생성](https://bill1224.tistory.com/359)
[^27]: [Contributor9 — Dockerfile 이해 및 Nginx 구성](https://adjh54.tistory.com/414)
[^28]: [Docker Docs — docker build](https://docs.docker.com/engine/reference/commandline/build/)
[^29]: [티스토리 — Dockerfile 작성하고 Docker 실행하기](https://sewcode.tistory.com/2)
[^30]: [Docker Docs — docker run](https://docs.docker.com/engine/reference/commandline/run/)
[^31]: [Red Hat — What is Kubernetes](https://www.redhat.com/ko/topics/cloud-native-apps/what-is-kubernetes)
[^32]: [IBM — Learn Kubernetes](https://www.ibm.com/kr-ko/cloud/learn/kubernetes)
[^33]: [VMware — Kubernetes 용어](https://www.vmware.com/kr/topics/glossary/content/kubernetes.html)
[^34]: [Microsoft Azure — AKS](https://azure.microsoft.com/ko-kr/products/kubernetes-service)
[^35]: [Google Cloud — GKE 소개](https://cloud.google.com/kubernetes-engine/what-is-kubernetes?hl=ko)
[^36]: [F5 — Kubernetes란?](https://www.f5.com/ko_kr/glossary/kubernetes)
[^37]: [이랜서 — Kubernetes(쿠버네티스)란?](https://www.elancer.co.kr/blog/detail/835)
[^38]: [Red Hat — Kubernetes 아키텍처](https://www.redhat.com/ko/topics/containers/kubernetes-architecture)
[^39]: [Kubernetes — 클러스터 아키텍처](https://kubernetes.io/ko/docs/concepts/architecture/)
[^40]: [seongjin.me — Kubernetes Cluster Components](https://seongjin.me/kubernetes-cluster-components/)
[^41]: [Kubernetes — Pods](https://kubernetes.io/ko/docs/concepts/workloads/pods/)
[^42]: [Red Hat — What is a Kubernetes pod](https://www.redhat.com/ko/topics/containers/what-is-a-kubernetes-pod)
[^43]: [Kubernetes — Deployments](https://kubernetes.io/ko/docs/concepts/workloads/controllers/deployment/)
[^44]: [Kubernetes — Stateless app Deployment](https://kubernetes.io/ko/docs/tasks/run-application/run-stateless-application-deployment/)
[^45]: [Spacelift — Kubernetes Deployment YAML](https://spacelift.io/blog/kubernetes-deployment-yaml)
[^46]: [Kubernetes — Service](https://kubernetes.io/ko/docs/concepts/services-networking/service/)
[^47]: [NGINX — Kubernetes glossary](https://www.nginx.com/resources/glossary/kubernetes/)
[^48]: [Docker Docs — Compose](https://docs.docker.com/compose/)
[^49]: [Docker — Docker Compose](https://www.docker.com/products/docker-compose/)
[^50]: [Kubernetes — Ingress](https://kubernetes.io/ko/docs/concepts/services-networking/ingress/)
[^51]: [Kubernetes — Persistent Volumes](https://kubernetes.io/ko/docs/concepts/storage/persistent-volumes/)
