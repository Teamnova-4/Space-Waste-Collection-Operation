// 크레딧 값 설정하는 함수
function setCredits(value) {
    const creditElement = document.getElementById('credits');
    creditElement.textContent = value;
    toggleCreditDisplay(true);  // 크레딧이 변경되면 디스플레이를 보이게
}

// 크레딧 값 추가하는 함수
function addCredits(amount) {
    const creditElement = document.getElementById('credits');
    let currentCredits = parseInt(creditElement.textContent, 10);
    currentCredits += amount;
    creditElement.textContent = currentCredits;
    toggleCreditDisplay(true);  // 크레딧이 추가되면 디스플레이를 보이게
}

// 크레딧 값 표시/숨기기 함수
function toggleCreditDisplay(show) {
    const creditDisplay = document.getElementById('credit-display');
    if (show) {
        creditDisplay.style.display = 'block';
    } else {
        creditDisplay.style.display = 'none';
    }
}