export class VolumeManager {
    constructor() {
        this.volume = 1.0; // 기본 볼륨 값 (0.0 ~ 1.0)
        this.loadVolume(); // 저장된 볼륨 값 로드
    }

    // 볼륨 값을 설정하는 메서드
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value)); // 0과 1 사이로 제한
        this.saveVolume(); // 볼륨 값 저장
        this.updateBGMVolume(); // BGM 볼륨 업데이트
    }

    // 저장된 볼륨 값을 로드하는 메서드
    loadVolume() {
        const savedVolume = localStorage.getItem('bgmVolume');
        if (savedVolume !== null) {
            this.volume = parseFloat(savedVolume);
        }
        this.updateBGMVolume(); // 초기 볼륨 설정
    }

    // 볼륨 값을 저장하는 메서드
    saveVolume() {
        localStorage.setItem('bgmVolume', this.volume);
    }

    // BGM 볼륨을 업데이트하는 메서드
    updateBGMVolume() {
        const backGroundMusic = document.querySelector('audio'); // BGM 오디오 요소 선택
        if (backGroundMusic) {
            backGroundMusic.volume = this.volume; // BGM 볼륨 설정
        }
    }
}
