/**
 * 드론 상점 시스템
 * 구매 가능한 드론의 종류와 정보를 관리
 */
export class DroneShop {
  constructor() {
    /**
     * 구매 가능한 드론 목록
     * @property {string} id - 드론 타입 식별자
     * @property {string} name - 드론 이름
     * @property {number} price - 구매 가격
     * @property {number} speed - 이동 속도
     * @property {number} capacity - 적재 용량
     * @property {string} imageSrc - 드론 이미지 경로
     */
    this.droneTypes = [
      {
        id: "basic",
        name: "기본 드론",
        price: 500,
        speed: 0.33,
        capacity: 1,
        imageSrc: "Resources/drone.png",
      },
      {
        id: "advanced",
        name: "고급 드론",
        price: 1000,
        speed: 0.5,
        capacity: 2,
        imageSrc: "Resources/advanced-drone.png",
      },
    ];
  }

  /**
   * 드론 타입 ID로 해당 드론의 정보를 찾아 반환
   * @param {string} typeId - 찾고자 하는 드론의 타입 ID
   * @returns {Object|undefined} 해당 드론의 정보 객체 또는 undefined
   */
  getDroneTemplate(typeId) {
    return this.droneTypes.find((type) => type.id === typeId);
  }
}
