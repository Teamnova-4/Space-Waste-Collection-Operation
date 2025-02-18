/**
 * 드론 슬롯 클래스
 * 각 슬롯의 상태와 보유 중인 드론 정보를 관리
 */
export class DroneSlot {
  /**
   * @param {number} index - 슬롯의 순번
   */
  constructor(index) {
    /** @property {number} index - 슬롯 식별 번호 */
    this.index = index;
    /** @property {Drone|null} drone - 현재 슬롯에 배치된 드론 객체 */
    this.drone = null;
    /** @property {boolean} isOccupied - 슬롯 점유 상태 */
    this.isOccupied = false;
  }

  /**
   * 슬롯에 드론을 배치
   * @param {Drone} drone - 배치할 드론 객체
   */
  setDrone(drone) {
    this.drone = drone;
    this.isOccupied = true;
  }

  /**
   * 슬롯에서 드론을 제거
   * @returns {Drone|null} 제거된 드론 객체
   */
  removeDrone() {
    const drone = this.drone;
    this.drone = null;
    this.isOccupied = false;
    return drone;
  }
}
