/**
 * 드론 상점 시스템
 * 구매 가능한 드론의 종류와 정보를 관리
 */
import { DroneShopView } from "./DroneShopView.js";


export class DroneShop {
    constructor() {
        /**
         * 구매 가능한 드론 목록
         * @property {string} name - 드론 이름
         * @property {number} price - 구매 가격
         * @property {number} speed - 이동 속도
         * @property {number} capacity - 적재 용량
         * @property {string} imageSrc - 드론 이미지 경로
         */
        this.droneTypes = [ 
            {
                typeId: "basic", 
                name: "기본 드론",
                price: 500,
                speed: 0.33,
                capacity: 1,
                imageSrc: "Resources/drone.png",
            },
            {
                typeId: "advanced", 
                name: "고급 드론",
                price: 1000,
                speed: 0.5,
                capacity: 2,
                imageSrc: "Resources/drone_2.png",
            },
        ];

        this.view = new DroneShopView(document.querySelector(".shop-container"));
    }

    /**
     * 드론 타입 ID로 해당 드론의 정보를 찾아 반환
     * @param {string} typeId - 찾고자 하는 드론의 타입 ID
     * @returns {Object|undefined} 해당 드론의 정보 객체 또는 undefined
     */
    getDroneTemplate(typeId) {
        return this.droneTypes[typeId];
    }

    // UI 렌더링을 DroneShopView에 위임
    // 구매 버튼 클릭 콜백
    renderShopItems(onBuyClick) {
        this.view.renderShopItems(this.droneTypes, onBuyClick);
    }

}
