# 개발환경

## Node 설치

테스트 웹서버와 js, css를 minify를 하기 위해 설치

### 1. node version manager

[https://github.com/creationix/nvm](https://github.com/creationix/nvm) 에서 해당 OS에 맞는 nvm을 설치 한다.아래는 Ubuntu에서 설치하는 예이다.

```
$> curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
```

### 2. node
node v6.9.1 LTS 설치

```
$> nvm install v6.9.1
```

## Bower 설치

웹에서 사용하는 다양한 javascript 라이버르를 관리해 주는 manager

### 1. bower

bower는 node가 설치 된 상태에서 설치

```
$> npm install --g bower
```

## node 와 bower 모듈 설치

통계에서 사용하는 node module과 bower 모듈 설치

### 1. node module
```
$> npm install
```
### 2. bower module
```
$> bower install
```

## node server 실행

아래의 코드를 실행 후 브라우저에서 http://localhost:8080 입력하여 실행
소스코드 수정 후 바로확인을 위해서는 http://localhost:8080/index_dev.html을 실행

```
$> npm start
```

## javascript source 빌드

로컬에서 개발을 진행하는 경우 src 아래폴더파일을 수정하거나 추가하면 된다. 
하지만 실제 production에 배포를 위해서는 아래와 같은 스크립트를 진행하여 javascript와 css를 minify와 난독화를 진행해야 한다.

```
$> npm run build
```

