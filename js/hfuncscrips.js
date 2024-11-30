$(document).ready(function() {
    // localStorage에서 selectedLangValue 값 가져오기
    var selectedLangValue = localStorage.getItem('selectedLangValue');
    // 로컬 스토리지에서 사용자 닉네임 가져오기
    var userNickname = localStorage.getItem('userNickname');
    var auth = localStorage.getItem('auth');
    function isMobile() {
        return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    }
    if(!isMobile())
    {
        if(auth == 2) {
            $('#adminlink').css('display', 'block');
        }
    }
    if (selectedLangValue === null) {
        // localStorage에 값이 없으면 기본값을 KOR로 설정
        selectedLangValue = 0;
        localStorage.setItem('selectedLangValue', selectedLangValue);
    }
    // 페이지 로딩 시, 저장된 언어 설정에 따라 표시 업데이트
    $('#selectedLang').text(selectedLangValue == 0 ? "KOR" : "ENG");
    if (selectedLangValue != 0) {
        changeLanguage("ENG");
    }

    $("#menu").off("click").on("click", function() {
        $(this).toggleClass("add");
    });

    $(".lang_sel").off("click").on("click", function() {
        $(this).toggleClass("add");
    });

    $('.lang_choice').click(function(e) {
        e.preventDefault();

        var selectedLang = $(this).data('lang');
        $('#selectedLang').text(selectedLang);

        // 선택된 언어에 따라 selectedLangValue 값을 업데이트
        selectedLangValue = selectedLang === "KOR" ? 0 : 1;
        
        // localStorage에 selectedLangValue 저장
        localStorage.setItem('selectedLangValue', selectedLangValue);

        $('.lang_pop').hide();
        $('.lang_sel').removeClass('add');
    });

    $('.lang_select').click(function(e) {
        e.preventDefault();
        $('.lang_pop').toggle();
        $('.lang_sel').toggleClass('add');
    });

    if (userNickname) {
        // 사용자가 로그인한 경우, 'Login' 대신 사용자 닉네임으로 표시
        $('#loginLink').text(userNickname);
        // 로그인 링크 비활성화 또는 클릭 이벤트 변경을 원한다면 여기에 추가합니다.
        $('#loginLink').removeAttr('href'); // 로그인 링크 비활성화 예시
    } else {
        // 사용자가 로그인하지 않은 경우
        $('#loginLink').text('Login'); // 기본 텍스트로 복원
        $('#loginLink').attr('href', 'login.html'); // 링크 활성화
    }
});

function changeLanguage(lang) {
    // if (lang === 'KOR') {
    //     window.location.reload();  // 페이지를 새로고침하여 한글로 표시
    // } else if (lang === 'ENG') {
    //     document.querySelectorAll('[data-translate]').forEach(elem => {
    //         elem.textContent = elem.getAttribute('data-eng');  // 영어 텍스트로 변경
    //     });
    // }
    document.querySelectorAll('[data-translate]').forEach(function(elem) {
        if (lang === 'ENG') {
            elem.innerHTML = decodeHTML(elem.getAttribute('data-eng'));
        } else if (lang === 'KOR') {
            window.location.reload();  // 페이지를 새로고침하여 한글로 표시
        }
    });
}

function decodeHTML(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

$(document).ready(function() {
    $('#adminlink').click(function(e) {
        e.preventDefault(); // 기본 링크 동작 방지

        const token = localStorage.getItem('token'); // JWT 토큰 가져오기

        if (!token) {
            alert('로그인 정보가 없습니다. 로그인이 필요합니다.');
            return;
        }

        $.ajax({
            url: '/admin-auth',
            type: 'POST',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + token); // 요청 헤더에 토큰 추가
            },
            success: function(response) {
                document.open();
                document.write(response);
                document.close();
            },
            error: function(xhr) {
                // 서버로부터의 응답 메시지에 따라 조건 분기
                if (xhr.responseText === "Session expired. Please log in again.") {
                    alert('세션 만료. 다시 로그인 해주세요.');
                    // localStorage.removeItem('token'); // 로컬 스토리지의 토큰 삭제
                    localStorage.clear();
                    window.location.href = '/login.html'; // 로그인 페이지로 리다이렉트
                } else {
                    alert('관리자 페이지 접근 권한이 없습니다.');
                }
            }
        });
    });
});

function checkSession(){
    const token = localStorage.getItem('token');
    if (token) {
        fetch('/verify-token', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            if (response.ok) {
                console.log('Token verified successfully');
                // 토큰이 유효한 경우, 아무 것도 하지 않음
            } else {
                throw new Error('Unauthorized access');
            }
        }).catch(error => {
            alert('세션 만료. 다시 로그인 해주세요.');
            console.log(error);
            // localStorage.removeItem('token'); // 로컬 스토리지의 토큰 삭제
            localStorage.clear();
            window.location.href = '/login.html'; // 로그인 페이지로 리다이렉트
        });
    }
}

document.addEventListener('DOMContentLoaded', checkSession);