document.addEventListener('DOMContentLoaded', function() {
    // 오디오 요소
    const bgm = document.getElementById('bgm');
    const slotSound = document.getElementById('slotSound');
    const audioToggle = document.getElementById('audioToggle');
    let isMuted = false;

    // 브라우저에서 자동 재생 정책으로 인해 사용자 상호작용이 필요할 수 있습니다
    // 페이지 로드 시 배경 음악 재생 시도
    try {
        bgm.volume = 0.3; // 볼륨 조절
        
        // 사용자 상호작용 이벤트 발생 시 오디오 재생
        const playAudio = function() {
            bgm.play().catch(error => {
                console.log('자동 재생이 차단되었습니다:', error);
            });
            // 한 번 성공적으로 재생된 후에는 이벤트 리스너 제거
            document.removeEventListener('click', playAudio);
        };
        
        // 첫 클릭 시 오디오 재생
        document.addEventListener('click', playAudio);
        
        // 페이지 로드 시 자동 재생 시도
        bgm.play().catch(error => {
            console.log('자동 재생이 차단되었습니다. 사용자 상호작용이 필요합니다:', error);
        });
    } catch (error) {
        console.error('오디오 재생 중 오류 발생:', error);
    }

    // 음소거 토글 버튼
    audioToggle.addEventListener('click', function() {
        if (isMuted) {
            bgm.volume = 0.3;
            audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
            audioToggle.classList.remove('muted');
        } else {
            bgm.volume = 0;
            audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            audioToggle.classList.add('muted');
        }
        isMuted = !isMuted;
    });

    // 이미지 슬라이더 기능
    const slides = document.querySelectorAll('.image-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    let currentSlide = 0;

    // 슬라이드 전환 함수
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('current'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].classList.add('current');
        dots[currentSlide].classList.add('active');
    }

    // 이벤트 리스너 설정
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // 자동 슬라이드 (5초마다)
    setInterval(() => showSlide(currentSlide + 1), 5000);

    // 잭팟 머신 기능
    const jackpotHandle = document.querySelector('.jackpot-handle');
    const jackpotReels = document.querySelectorAll('.jackpot-reel');
    const downloadBtn = document.querySelector('.download-btn');
    const jackpotMessage = document.querySelector('.jackpot-message');
    let isSpinning = false;

    // 슬롯 머신 아이템 정의
    const reelItems = [
        {value: 'basketball', icon: '<i class="fas fa-basketball-ball"></i>'},
        {value: 'dice', icon: '<i class="fas fa-dice"></i>'},
        {value: 'heart', icon: '<i class="fas fa-heart"></i>'},
        {value: 'money', icon: '<i class="fas fa-money-bill-wave"></i>'}
    ];

    // 랜덤 아이템 생성 함수
    function getRandomItem() {
        return reelItems[Math.floor(Math.random() * reelItems.length)];
    }

    // 특정 아이템 생성 함수
    function getSpecificItem(value) {
        return reelItems.find(item => item.value === value);
    }

    // 슬롯 머신 회전 함수 (미리 결정된 결과를 위한 버전)
    function spinReel(reel, duration, finalValue, callback) {
        let spins = 0;
        const maxSpins = 20 + Math.floor(Math.random() * 10); // 20~30번 회전
        
        const spinInterval = setInterval(() => {
            // 마지막 스핀이 아니면 랜덤 아이템, 마지막 스핀이면 지정된 아이템 표시
            if (spins < maxSpins - 1) {
                const randomItem = getRandomItem();
                reel.innerHTML = `<div class="reel-item" data-value="${randomItem.value}">${randomItem.icon}</div>`;
            } else {
                const finalItem = getSpecificItem(finalValue);
                reel.innerHTML = `<div class="reel-item" data-value="${finalItem.value}">${finalItem.icon}</div>`;
            }
            
            spins++;
            if (spins >= maxSpins) {
                clearInterval(spinInterval);
                if (callback) callback();
            }
        }, duration / maxSpins);
    }

    // 슬롯 머신 레버 당기기 함수 - 오디오 재생 추가
    jackpotHandle.addEventListener('click', function() {
        if (isSpinning) return;
        
        isSpinning = true;
        jackpotMessage.textContent = '행운을 기다리는 중...';
        downloadBtn.style.display = 'none'; // 버튼 숨기기
        
        // 슬롯 효과음 재생
        slotSound.currentTime = 0; // 효과음 처음부터 재생
        slotSound.play().catch(error => {
            console.log('효과음 재생 실패:', error);
        });
        
        // 레버 애니메이션
        jackpotHandle.style.transform = 'translateY(15px)';
        setTimeout(() => {
            jackpotHandle.style.transform = 'translateY(0)';
        }, 300);

        // 결과 미리 결정 (90% 확률로 농구공 승리)
        const winChance = Math.random();
        let finalResults;
        
        if (winChance < 0.90) {
            // 승리: 농구공 3개
            finalResults = ['basketball', 'basketball', 'basketball'];
        } else {
            // 랜덤 조합 (확률적으로 같은 아이템이 3개 나올 수도 있음)
            const randomResults = [];
            for (let i = 0; i < 3; i++) {
                randomResults.push(getRandomItem().value);
            }
            finalResults = randomResults;
        }
        
        // 첫 번째 릴 회전 - 미리 정해진 결과 표시
        spinReel(jackpotReels[0], 1500, finalResults[0], () => {
            // 두 번째 릴 회전
            spinReel(jackpotReels[1], 2000, finalResults[1], () => {
                // 세 번째 릴 회전
                spinReel(jackpotReels[2], 2500, finalResults[2], () => {
                    // 결과 체크
                    checkResults(finalResults);
                });
            });
        });
    });

    // 결과 확인 함수
    function checkResults(results) {
        // 세 개 모두 같으면 승리
        if (results[0] === results[1] && results[1] === results[2]) {
            if (results[0] === 'basketball') {
                // 농구공 3개가 나오면 다운로드 버튼 표시
                jackpotMessage.textContent = '축하합니다! 농구공 잭팟!';
                showWinAnimation();
                downloadBtn.style.display = 'inline-block';
            } else {
                jackpotMessage.textContent = '축하합니다! 다시 한번 시도해보세요!';
                setTimeout(() => {
                    jackpotMessage.textContent = '애셔를 만나려면 레버를 당겨주세요';
                }, 3000);
            }
        } else {
            jackpotMessage.textContent = '아쉽네요. 다시 시도해보세요!';
            setTimeout(() => {
                jackpotMessage.textContent = '애셔를 만나려면 레버를 당겨주세요';
            }, 3000);
        }
        
        isSpinning = false;
    }

    // 승리 애니메이션
    function showWinAnimation() {
        const jackpotMachine = document.querySelector('.jackpot-machine');
        
        // 반짝임 효과
        jackpotMachine.classList.add('jackpot-win');
        
        // 불빛 깜빡거림 효과
        const lights = document.querySelectorAll('.jackpot-light');
        lights.forEach(light => {
            light.style.animation = 'blinkLight 0.2s infinite alternate';
        });
        
        // 환호 소리 효과 (실제 소리는 추가할 수 있지만 이 예제에선 생략)
    }

    // 스크롤 애니메이션 설정
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // 페이지 로드 시 글리치 효과 추가
    const glitchTitle = document.querySelector('.glitch');
    
    if (glitchTitle) {
        setInterval(() => {
            glitchTitle.classList.add('active');
            setTimeout(() => {
                glitchTitle.classList.remove('active');
            }, 200);
        }, 3000);
    }

    // 스크롤 시 헤더 스타일 변경
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 카드 및 이미지에 마우스 오버 효과
    const cards = document.querySelectorAll('.info-card, .quote-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // 잭팟 머신 승리 시 CSS 추가
    const styleSheet = document.createElement('style');
    styleSheet.innerHTML = `
        .jackpot-win {
            animation: jackpotWin 0.5s ease infinite;
        }
        
        @keyframes jackpotWin {
            0% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            100% { transform: translateX(-5px); }
        }
    `;
    document.head.appendChild(styleSheet);
});

// 페이지 로드 완료 시 로딩 화면 숨김
window.addEventListener('load', function() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}); 