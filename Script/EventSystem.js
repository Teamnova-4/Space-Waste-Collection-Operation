import AlertSystem from "./AlertSystem.js";
import { User } from "./Upgrade.js";
import { Util } from "./Util.js";

export class EventBase {

    /**
     * 이벤트 시스탬에서 발생한 이벤트
     * 실제 상속후 구현하기 위한 클래스
     */
    constructor(params) {
        this.eventName = params.eventName; // 이벤트 이름이자 알림창에 띄울 이름
        this.eventDescription = params.eventDescription; // 이벤트 설명이자 알림 창에 띄울 설명
    }

    StartEvent(){

    }

    UpdateEvent(){

    }

    StopEvent() {

    }
}

export class EventSystem {
    /**
     * 
     * 1 분마다 하나의 이벤트 총 9개 의 이벤트가 발생
     * 플레이어 에게 이로운 이밴트 일수도있고  부정적인 이벤트 일수도 있다.
     * 이벤트 발생시 이벤트 발생 알림창을 띄워준다.
     * 
     * @returns 
     */
    constructor() {
        if (EventSystem.instance) {
            return EventSystem.instance;
        }

        // 싱글톤 쓰레기 인스턴스 생성
        this.Initialize();
        EventSystem.instance = this;
    }

    /**
     * 싱클톤 인스턴스 반환 함수 
     */
    static Instance() {
        if (!EventSystem.instance) {
            EventSystem.instance = new EventSystem();
            EventSystem.instance.Initialize();
        }
        return EventSystem.instance;

    }

    /**
     * 싱클톤 초기화 함수
     */
    Initialize() {

        this.currentEvent = null; // 현재 실행중인 이벤트
        this.eventList = [];

        this.eventList.push(new AdditionalExpensesEvent()); // 이벤트 1 추가

    }

    /**
     * 이벤트 하나 뽑는 메서드
     */
    static SelectEvent() {
        const event = Util.getRandomElement(EventSystem.Instance().eventList);
        return event;
    }

    /**
     * 이벤트 실행 메서드
     */
    static PlayEvent(event){

        EventSystem.Instance().currentEvent = event;
        AlertSystem.AddAlert(event.eventName, event.eventDescription);
        EventSystem.Instance().currentEvent.StartEvent();
    }

    /**
     * 현제 실행 이벤트 중지 메서드
     */
    static StopEvent(){
        EventSystem.Instance().currentEvent.StopEvent();
        EventSystem.Instance().currentEvent = null;
    }

    /**
     * 업데이트 이벤트
     */
    UpdateEvent() {
        if (this.currentEvent !== null){
            this.currentEvent.UpdateEvent();
        }
    }
}


export class AdditionalExpensesEvent extends EventBase {
    constructor() {
        super({ 
            eventName: "추가 비용 발생", 
            eventDescription: "추가 비용이 발생하여 갑작스러운 지출이 발생합니다.",
        });

        this.additionalDebt = 100000; // 추가로 발생하는 빚
    }   

    StartEvent() {
        User.Instance().credits -= this.additionalDebt;
    }

    StopEvent() {

    }
}