# JWT Authentication SDK

JWT Authentication SDK는 계정 인증을 손쉽게 구현할 수 있는 개발 도구 입니다.

## Installation

계정 인증을 구현하고자 하는 웹 페이지에 자바스크립트 SDK 스크립트를를 삽입한 뒤,
인증 서버의  '내 어플리케이션' 메뉴에서 어플리케이션을 등록하여 생성된
어플리케이션 키로 SDK를 초기화합니다.
```html
<script type="text/javascript" src="https://YOUR SERVER DOMAIN.COM/static/js/sdk.js"></script>

<script>
    var auth  = new AUTH_SDK('YOUR_APPLICATION_KEY');
</script>
```

## Example

컨테이너 div 요소 안에 로그인 버튼을 생성하는 예제입니다.
```html
<div id="auth"></div> // 로그인 버튼을 삽입할 엘리먼트

<script type="text/javascript" src="https://YOUR SERVER DOMAIN.COM/static/js/sdk.js"></script>

<script>
    var auth = new AUTH_SDK('YOUR_APPLICATION_KEY');

    auth.createLoginButton({
        container: '#auth',
        success: function(authObject) {
            // 로그인 성공 후처리
        },
        fail: function(errorObject) {
            // 로그인 실패 후처리
        }
    });
</script>
```

특정 엘리먼트를 로그인 버튼으로 만드는 예제입니다.
```html
<button id="login-btn">로그인</button> // 로그인 버튼으로 만들 버튼

<script type="text/javascript" src="https://YOUR SERVER DOMAIN.COM/static/js/sdk.js"></script>

<script>
    var auth = new AUTH_SDK('YOUR_APPLICATION_KEY');

    auth.assignLoginButton({
        target: '#login-btn',
        success: function(authObject) {
            // 로그인 성공 후처리
        },
        fail: function(errorObject) {
            // 로그인 실패 후처리
        }
    });
</script>
```