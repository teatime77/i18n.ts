
namespace i18n_ts {
//

const $dic = new Map<string, HTMLElement>();

export function $(id : string) : HTMLElement {
    let ele = $dic.get(id);
    if(ele == undefined){
        ele = document.getElementById(id)!;
        $dic.set(id, ele);
    }

    return ele;
}

export function $div(id : string) : HTMLDivElement {
    return $(id) as HTMLDivElement;
}

export function $inp(id : string) : HTMLInputElement {
    return $(id) as HTMLInputElement;
}

export function $sel(id : string) : HTMLSelectElement {
    return $(id) as HTMLSelectElement;
}
        
export class MyError extends Error {
    constructor(text : string = ""){
        super(text);
    }
}

export function assert(b : boolean, msg : string = ""){
    if(!b){
        throw new MyError(msg);
    }
}    

export function msg(txt : string){
    console.log(txt);
}

export function range(n: number) : number[]{
    return [...Array(n).keys()];
}

export function last<T>(v : Array<T>) : T {
    return v[v.length - 1];
}

export function unique<T>(v : Array<T>) : T[] {
    let set = new Set<T>();
    const ret : T[] = [];
    for(const x of v){
        if(!set.has(x)){
            set.add(x);
            ret.push(x);
        }
    }
    return ret;
}

export function remove<T>(v : Array<T>, x : T){
    const idx = v.indexOf(x);
    assert(idx != undefined);
    v.splice(idx, 1);
}

export function sum(v : number[]) : number {
    return v.reduce((acc, cur) => acc + cur, 0);
}

export function list<T>(set : Set<T> | undefined) : T[] {
    if(set == undefined){
        return [];
    }
    else{

        return Array.from(set);
    }
}

export function intersection<T>(set1 : Set<T> | undefined, set2 : Set<T> | undefined) : T[] {
    if(set1 == undefined || set2 == undefined){
        return [];
    }

    return Array.from(set1.values()).filter(x => set2.has(x));
}

export function permutation<T>(v : T[]) : T[][] {
    if(v.length == 2){
        return [ [v[0], v[1]], [v[1], v[0]] ];
    }

    const vv : T[][] = [];
    for(const i of range(v.length)){
        const v1 = v.slice();
        const c = v1[i];
        v1.splice(i,  1);

        const vv1 = permutation(v1);
        for(const v2 of vv1){

            v2.unshift(c);
            vv.push(v2);
        }
    }

    return vv;
}

export function circularPermutation<T>(v : T[]) : T[][] {
    const vv = permutation(v.slice(1));
    vv.forEach(x => x.unshift(v[0]));

    return vv;
}

export function areSetsEqual<T>(A: T[], B: T[]): boolean {
    const setA = new Set<T>(A);
    const setB = new Set<T>(B);

    // Check if sizes are different
    if (setA.size !== setB.size) {
        return false;
    }

    // Check if all elements of setA are present in setB
    for (const element of setA) {
        if (!setB.has(element)) {
            return false;
        }
    }

    return true;
}

export function isSubSet<T>(A: T[], B: T[]): boolean {
    const setB = new Set<T>(B);

    return A.every(x => setB.has(x));
}

export function isIdentifierLetter(c : string) : boolean {
    return latinLetters.indexOf(c) != -1 || c == "_";
}

export async function fetchText(fileURL: string) {
    const response = await fetch(fileURL);
    const text = await response!.text();

    return text;
}

export function parseURL(): [string, string, Map<string, string>] {
    const url = document.location.href;
    const parser = new URL(url);
    // console.log(`href:${url} origin:${parser.origin} pathname:${parser.pathname} search:${parser.search}`)
    assert(parser.origin + parser.pathname + parser.search == url);

    const queryString = parser.search.substring(1);
    const queries = queryString.split("&");

    const params = new Map<string, string>();
    queries.forEach(query => {
        const [key, value] = query.split("=");
        params.set(decodeURIComponent(key), decodeURIComponent(value));
    });
    
    return [ parser.origin, parser.pathname, params];
}

}
