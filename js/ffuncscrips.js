$(document).ready(function() {
    var userNickname = localStorage.getItem('userNickname');

    // userNickname 값이 있을 경우
    if (userNickname) {
        $('.loginLink').each(function() {
            $(this).text(userNickname); // 모든 loginLink 텍스트를 userNickname으로 변경
            $(this).removeAttr('href'); // 모든 loginLink의 href 속성 제거
        });
        $('.loginLink').css('cursor', 'pointer'); // 마우스 오버 시 커서 변경

        $('.loginLink').click(function() {
            // localStorage.removeItem('userNickname'); // 로컬 스토리지에서 userNickname 삭제
            alert("로그아웃 되었습니다.");
            localStorage.clear();
            location.reload(); // 페이지 새로고침
        });
        $('#userNickname').text(userNickname).show(); // userNickname 스팬에 값 설정 후 보이게 변경
    } else {
        $('.loginLink').text('Login'); // 로그아웃 상태라면 로그인 링크 텍스트를 'Login'으로 변경
        $('.loginLink').attr('href', 'login.html'); // href 속성을 login.html로 설정
    }
});