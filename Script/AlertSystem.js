export default class AlertSystem{
    constructor() {
        if (AlertSystem.instance) {
            return AlertSystem.instance;
        }

        this.Initialize();
        AlertSystem.instance = this;
    }

    static Instance() {
        if (!AlertSystem.instance) {
            AlertSystem.instance = new AlertSystem();
        }
        return AlertSystem.instance;
    }

    Initialize() {
        this.isShowing = false;
        this.alertList = [];

        this.alertOverlay = document.getElementById('alertOverlay');
        this.alertBox = document.getElementById('alertBox');
        this.alertTitle = document.getElementById('alertTitle');
        this.alertMessage = document.getElementById('alertMessage');
        this.alertButton = document.getElementById('alertButton');

        this.alertButton.onclick = () => {this.CloseAlert()}
    }

    /**
     * 
     * @param {} alert 
     */
    static AddAlert(title, description) {
        // TODO 디버깅을 하기 위해 번거로운 알림은 모두 종료함 추후 주석 해제할 것
        AlertSystem.Instance().alertList.push({title: title, description: description});
        AlertSystem.Instance().ShowAlert();
    }

    ShowAlert(){
        if (!this.isShowing && this.alertList.length > 0) {
            this.isShowing = true;

            const alert = this.alertList.shift();
            console.log(`%c [Alert] title: ${alert.title} description: ${alert.description}`, "background: red; color:white; font-weight:bold");
            this.alertTitle.innerHTML = alert.title ?? "Alert";
            this.alertMessage.innerHTML = alert.description ?? "default alert";
            this.alertOverlay.style.display = "block";
        }
    }

    CloseAlert(){
        this.alertOverlay.style.display = "none";
        this.isShowing = false;
        if (this.alertList.length > 0) {
            this.ShowAlert()
        }
    }
}