
//유틸리티 함수 모음


export class Util {
    /**
     * 
     * @param {*[]} arr 
     * @returns 
     */
    static getRandomElement(arr) {
        return arr[Util.getRandomInt(0, arr.length)];
    }

    static getRandomFloat(start, range){
        return start + Math.random() * range;
    }

    /**
     * 
     * Math.random()은 0 이상 1 미만의 값을 반환하므로, start + Math.random() * range는
     *  start 이상 start + range 미만의 값을 반환합니다.
     *  즉, start 이상 start + range - 1 이하의 INT 값을 반환 한다.
     * 
     * @param {*} start 
     * @param {*} range 
     * @returns 
     */
    static getRandomInt(start, range){
        return start + Math.floor(Math.random() * range);
    }
}