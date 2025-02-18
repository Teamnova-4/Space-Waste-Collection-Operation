/**
 * 드론 슬롯 UI 관리 클래스
 * 드론 슬롯들의 시각적 표현을 담당
 */
export class DroneSlotView {
  /**
   * @param {HTMLElement} container - 드론 슬롯들이 표시될 컨테이너 요소
   */
  constructor(container) {
    this.container = container;
  }

  /**
   * 모든 드론 슬롯의 UI를 렌더링
   * @param {DroneSlot[]} slots - 표시할 드론 슬롯 배열
   * @param {Function} onSlotClick - 슬롯 클릭 시 실행할 콜백 함수
   * @param {Function} onSellClick - 판매 버튼 클릭 시 실행할 콜백 함수
   */
  renderSlots(slots, onSlotClick, onSellClick) {
    if (!this.container) {
      console.error("드론 슬롯 컨테이너를 찾을 수 없습니다.");
      return;
    }

    this.container.innerHTML = "";
    slots.forEach((slot, index) => {
      const slotElement = this.createSlotElement(slot, index);
      const slotClickArea = slotElement.querySelector(".drone-slot");

      if (slotClickArea) {
        slotClickArea.addEventListener("click", () => onSlotClick(index));
      }

      // 드론이 있는 경우에만 판매 버튼 이벤트 설정
      if (slot.isOccupied) {
        const sellButton = slotElement.querySelector(".sell-btn");
        if (sellButton) {
          sellButton.addEventListener("click", () => onSellClick(index));
        }
      }

      this.container.appendChild(slotElement);
    });
  }

  /**
   * 개별 드론 슬롯의 HTML 요소 생성
   * @param {DroneSlot} slot - 슬롯 정보
   * @param {number} index - 슬롯 인덱스
   * @returns {HTMLElement} 생성된 슬롯 요소
   */
  createSlotElement(slot, index) {
    const template = document.createElement("div");
    template.innerHTML = `
      <div class="drone-slot ${!slot.isOccupied ? "empty" : ""}">
        <div class="slot-content">
          ${
            slot.isOccupied
              ? `<img src="${slot.drone.imageSrc}" alt="${slot.drone.name}">
                 <p class="drone-name">${slot.drone.name}</p>
                 <p class="drone-speed">속도: ${slot.drone.speed.toFixed(2)}</p>
                 <p class="drone-capacity">적재량: ${slot.drone.capacity}</p>`
              : `<div class="empty-slot"></div>
                 <p class="slot-empty-text">비어있음</p>`
          }
        </div>
        ${
          slot.isOccupied
            ? `<button class="sell-btn" data-slot-index="${index}">판매</button>`
            : `<p class="slot-hint">클릭하여 드론 구매</p>`
        }
      </div>
    `;
    return template.firstElementChild;
  }
}
