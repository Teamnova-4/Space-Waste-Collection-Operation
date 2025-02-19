
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

    static ErrorFormat(title, content, extra){
        let error = {title: title, content: content};
        if (extra !== null && extra !== undefined){
            Object.assign(error, extra);
        }
        return error;
    }

    /**
     * 
     * {1: ["a", "b"], 2: ["a", "c", "e"]}
     * 이런식의 사전에
     * 값을 자동으로 추가해주는 메서드
     * @param {*} dict 
     * @param {*} key 
     * @param {*} value 
     * @returns 
     */
    static autoAddToDictList(dict, key, value){
        if (!dict[key]){
            dict[key] = [];
        } 
        dict[key].push(value);
        return dict;
    }

    /**
     * 
     * value는 값 형태도 가능하고 [] 형태도 가능하다.
     * 
     * @param {*} dict 
     * @param {*} value 
     * @returns 
     */
    static autoRemoveInDictList(dict, value){
        Object.keys(dict).forEach(key => {
            if (value instanceof Array) {
                dict[key] = dict[key].filter(item => value.includes(item));
                if(dict[key].length === 0){
                    delete dict[key];
                }
            } else {
                dict[key] = dict[key].filter(item => item !== value);
                if(dict[key].length === 0){
                    delete dict[key];
                }
            }
        });

        return dict;
    }

    static mergeAndSortDictToList(dict){
        return Object.keys(dict)
        .sort((a,b)=> a - b)
        .reduce((acc, key)=>{
            return acc.concat(dict[key]);
        }, []);
    }

    static mergeDictToList(dict){
        return Object.keys(dict)
        .reduce((acc, key)=>{
            return acc.concat(dict[key]);
        }, []);
    }
}