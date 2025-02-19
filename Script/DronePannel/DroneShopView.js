// DroneShopView.js

export class DroneShopView {
    /**
     * @param {HTMLElement} container - 드론 상점 아이템들이 표시될 컨테이너 요소
     */
    constructor(container) {
        this.container = container;
    }

    /**
     * 드론 상점 아이템들의 UI를 렌더링
     * @param {Object} droneTemplates - 드론 템플릿 객체 (DroneShop.droneTemplates)
     * @param {Function} onBuyClick - 구매 버튼 클릭 시 실행할 콜백 함수
     */
    renderShopItems(droneTemplates, onBuyClick) {
        if (!this.container) {
            console.error("드론 상점 컨테이너를 찾을 수 없습니다.");
            return;
        }

        // 기존 내용 초기화 및 slot-list-container, drone-slot-container 생성 및 추가
        this.container.innerHTML = `
            <div class="slot-list-container">
                <div class="drone-slot-container">
                    <!-- 드론 아이템들이 여기에 동적으로 추가될 예정 -->
                </div>
            </div>
        `;

        // 동적으로 생성된 drone-slot-container 요소를 가져옵니다.
        const droneSlotContainer = this.container.querySelector('.drone-slot-container');

        if (!droneSlotContainer) {
            console.error("drone-slot-container를 innerHTML로 생성하는 데 실패했습니다.");
            return;
        }

        for (const typeId in droneTemplates) {
            const template = droneTemplates[typeId];
            const itemElement = this.createShopItemElement(template, typeId, onBuyClick);
            droneSlotContainer.appendChild(itemElement); // drone-slot-container 에 추가
        }
    }

    
    /**
     * 개별 드론 상점 아이템의 HTML 요소 생성 (수정)
     * @param {Object} template - 드론 템플릿 정보
     * @param {string} typeId - 드론 타입 ID
     * @param {Function} onBuyClick - 구매 버튼 클릭 시 실행할 콜백 함수
     * @returns {HTMLElement} 생성된 상점 아이템 요소
     */
    createShopItemElement(template, typeId, onBuyClick) {
        const slotDiv = document.createElement("div"); // container div 생성

        slotDiv.innerHTML = `
            <div class="drone-slot">
                <div class="slot-content">
                    <img src="${template.imageSrc}" alt="${template.name}">
                    <p class="drone-name">${template.name}</p>
                    <p class="drone-speed">속도: ${template.speed.toFixed(2)}</p>
                    <p class="drone-capacity">금액: ${template.price}</p>
                </div>
                <button class="buy-btn" data-type="${typeId}">구매</button>
            </div>
        `;

        // 이벤트 리스너는 innerHTML로 생성된 후 별도로 연결해야 합니다.
        const buyButton = slotDiv.querySelector('.buy-btn');
        buyButton.addEventListener("click", (event) => {
            event.stopPropagation();
            onBuyClick(typeId);
        });

        return slotDiv.firstElementChild; // .drone-slot div 반환 (최상위 div가 아닌)
    }
}