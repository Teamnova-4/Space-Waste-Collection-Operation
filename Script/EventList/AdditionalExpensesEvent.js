import { User } from "../Upgrade";

export class AdditionalExpensesEvent extends EventBase {
    constructor() {
        this.eventName = "추가 비용 발생";
        this.eventDescription = "추가 비용이 발생하여 갑작스러운 지출이 발생합니다.";
        this.additionalDebt = 1000; // 추가로 발생하는 빚
    }   

    StartEvent() {
        User.Instance().credits -= this.additionalDebt;
    }

    StopEvent() {

    }
}