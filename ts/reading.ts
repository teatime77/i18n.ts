namespace i18n_ts {

let urlOrigin : string;
let urlParams : Map<string, string>;

export const fgColor = "white";

export let languageCode : string = "eng";

export let  upperLatinLetters : string;
export let  lowerLatinLetters : string;
export let  latinLetters : string;

export let  upperGreekLetters : string;
export let  lowerGreekLetters : string;

let TextToId : Map<string, number>;

const languages : ([string, string, [string,string]])[] = [
    [ "اَلْعَرَبِيَّةُ", "ara", ['"', '"']],
    [ "汉语", "chi", ['“', '”']],
    [ "English", "eng", ['"', '"']],
    [ "français", "fre", ['« ', ' »']],
    [ "Deutsch", "ger", ['„', '“']],
    [ "हिन्दी", "hin", ['"', '"']],
    [ "Indonesia", "ind", ['"', '"']],
    [ "日本語", "jpn", ['「', '」']],
    [ "한국어", "kor", ['"', '"']],
    [ "Русский", "rus", ['«', '»']],
    [ "español", "spa", ['"', '"']],
    [ "português", "por", ['"', '"']],
];

const engTexts : string[] = [];

const engMap : Map<string, number> = new Map<string, number>();

/**
Quotation mark
    https://en.wikipedia.org/wiki/Quotation_mark
 */
let quotationMarks = new Map<string, [string, string]>([
]);

/*
List of ISO 639 language codes
    https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes

Arabic	ar	ara	ara
Bengali	bn	ben	ben
Burmese	my	mya	bur
Chinese	zh	zho	chi
Dutch	nl	nld	dut
English	en	eng	eng
French	    fr	fra	fre
German	    de	deu	ger
Greek	    el	ell	gre
Hebrew	    he	heb	heb
Hindi	hi	hin	hin
Indonesian	id	ind	ind
Italian	    it	ita	ita
Japanese    ja	jpn	jpn
Javanese	jv	jav	jav
Khmer	km	khm	khm
Korean	ko	kor	kor
Mongolian	mn	mon	mon
Nepali	ne	nep	nep
Persian	fa	fas	per
Polish	pl	pol	pol
Punjabi	pa	pan	pan
Portuguese	pt	por	por
Russian	ru	rus	rus
Spanish	es	spa	spa
Tagalog	tl	tgl	tgl
Tamil	ta	tam	tam
Thai	th	tha	tha
Turkish	tr	tur	tur
Urdu	ur	urd	urd
Vietnamese	vi	vie	vie


Internet users by language
    https://en.wikipedia.org/wiki/Languages_used_on_the_Internet

1	English	1,186,451,052	25.9%
2	Chinese	888,453,068	19.4%
3	Spanish	363,684,593	  7.9%
4	Arabic	237,418,349	  5.2%
5	Indonesian	198,029,815	  4.3%
6	Portuguese	171,750,818	  3.7%
7	French	144,695,288	  3.3 %
8	Japanese	118,626,672	  2.6%
9	Russian	116,353,942	  2.5%
10	German	92,525,427	  2.0%
1–10	Top 10 languages	3,525,027,347	  76.9%

*/

let translationMap : Map<string, string> = new Map<string, string>();


function initLetters(){
    const A = "A".charCodeAt(0);
    const a = "a".charCodeAt(0);

    const Alpha = "Α".charCodeAt(0);
    const alpha = "α".charCodeAt(0);


    upperLatinLetters = range(26).map(i => String.fromCharCode(A + i)).join("");
    lowerLatinLetters = range(26).map(i => String.fromCharCode(a + i)).join("");
    latinLetters = upperLatinLetters + lowerLatinLetters;

    upperGreekLetters = range(24).filter(i => i != 17).map(i => String.fromCharCode(Alpha + i)).join("");
    lowerGreekLetters = range(24).filter(i => i != 17).map(i => String.fromCharCode(alpha + i)).join("");

    // msg(upperLatinLetters);
    // msg(lowerLatinLetters);
    // msg(upperGreekLetters);
    // msg(lowerGreekLetters);
}

export async function getAllTexts() {
    const [ origin, , ] = i18n_ts.parseURL();

    const names = [
        "parser",
        "plane",
        "firebase",
        "movie"
    ];

    const texts : string[] = [];

    for(const name of names){
        const url = `${origin}/lib/${name}/${name}.js`;
        msg(`js url:${url}`);
        const text = await fetchText(url);

        for(const quote of [ "'", '"' ]){
            let start = 0;

            const TT_quote = `TT(${quote}`;
            while(true){

                const k1 = text.indexOf(TT_quote, start);
                if(k1 == -1){
                    break;
                }

                if(0 < k1 && isIdentifierLetter(text.charAt(k1 - 1))){
                    start = k1 + 3;
                    continue;
                }

                const k2 = text.indexOf(quote, k1 + 3);
                assert(k2 != -1);
                const s = text.substring(k1 + 3, k2);
                texts.push(s);
                start = k2 + 1;
            }
        }
    }

    return texts;
}

export function TT(text : string) : string {
    text = text.trim();

    for(let line of text.split("\n")){
        line = line.trim();
        if(line != ""){

            let id = engMap.get(line);
            if(id == undefined){
                id = engTexts.length;
                engTexts.push(line);
                engMap.set(line, id);
            }
        }
    }

    if(languageCode == "eng"){
        return text;
    }

    const target = translationMap.get(text);
    if(target == undefined){
        // msg(`src:[${text.trim()}]`);
        for(const t of translationMap.keys()){
            // msg(`src:[${t.trim()}]`);
        }
    }
    return target != undefined ? target.trim() : text;
}

export function getEngTexts() : string[] {
    return engTexts;
}

export function TTs(text : string) : string[] {
    const lines = text.split("\n").map(x => x.trim()).filter(x => x != "");
    return lines.map(x => TT(x));
}

export function getIdFromText(text : string) : number | undefined {
    return TextToId.get(text);
}


function getQuotationMarks() : [string, string]{
    const marks = quotationMarks.get(languageCode);
    if(marks == undefined){
        return ['"', '"'];
    }
    else{
        return marks;
    }
}

export function token(text : string) : string {
    if(languageCode == "ara"){
        switch("ABCDE".indexOf(text)){
        case 0: return "أ";
        case 1: return "ب";
        case 2: return "ج";
        case 3: return "د";
        case 4: return "هـ";
        }

        throw new MyError();
    }

    const [start_mark, end_mark] = getQuotationMarks();
    return start_mark + text + end_mark;
}

export abstract class  AbstractSpeech {    
    static one : AbstractSpeech;

    prevCharIndex = 0;
    speaking : boolean = false;

    callback : ((idx:number)=>void) | undefined;
    abstract speak(text : string) : void;
    abstract waitEnd() : Promise<void>;
    abstract speak_waitEnd(text : string) : Promise<void>;
}

export interface Readable {
    reading() : Reading;
    highlight(on : boolean) : void;
}

export class Reading {
    readable : Readable;
    text : string;
    args : Readable[];
    children : Reading[];
    phrases : (string | Reading)[] = [];
    start : number = NaN;
    end   : number = NaN;

    constructor(readable : Readable, text : string, args : Readable[]){
        this.readable = readable;

        this.text = text;

        this.args = args;
        this.children = args.map(x => x.reading());
    }

    setPhrases(){
        if(this.children.length == 0){

            this.phrases = [ this.text ];
        }
        else{
            const quotes = range(this.children.length).map(i => token( upperLatinLetters.charAt(i) ));
            const positions = quotes.map(x => this.text.indexOf(x));
            assert(positions.every(i => i != -1));
    
            const index_positions = Array.from(positions.entries());
            index_positions.sort((a, b)=> a[1] - b[1]);

            let pos = 0;
            for(const [index, position] of index_positions){

                if(pos < position){
                    this.phrases.push(this.text.substring(pos, position));
                }

                this.phrases.push(this.children[index]);
    
                pos = position + quotes[index].length;
            }
    
            if(pos < this.text.length){
                this.phrases.push(this.text.substring(pos));
            }
        }
    }

    setStartEnd(start : number) {
        if(this.children.length == 0){
            this.start = start;
            this.end   = start + this.text.length;
        }
        else{
            let pos = start;
            for(const phrase of this.phrases){
                if(typeof phrase == "string"){

                    pos += phrase.length;
                }
                else{

                    phrase.setStartEnd(pos);
                    pos = phrase.end;
                }
            }
        }
    }

    getAllTexts(texts: string[]){
        if(this.children.length == 0){
            texts.push(this.text);
        }
        else{
            for(const phrase of this.phrases){
                if(typeof phrase == "string"){

                    texts.push(phrase);
                }
                else{

                    phrase.getAllTexts(texts);
                }
            }
        }
    }

    prepareReading() : string {
        this.setPhrases();
        this.setStartEnd(0);

        const texts : string[] = [];
        this.getAllTexts(texts);

        const all_text = texts.join("");

        return all_text;
    }

    getAllReadingsSub(readings: Reading[]){
        readings.push(this);
        this.children.forEach(x => x.getAllReadingsSub(readings));
    }

    getAllReadings() : Reading[] {
        const readings: Reading[] = [];
        this.getAllReadingsSub(readings);

        return readings;
    }

}

async function getTranslationMap(lang_code : string) : Promise<[Map<number, string>, Map<string, number>]> {
    const url = `${urlOrigin}/lib/i18n/translation/${lang_code}.txt?ver=${Date.now()}`;
    let texts = await fetchText(url);

    // for chinese text.
    texts = texts.replaceAll("：", ":");

    const id_to_text = new Map<number, string>();
    const text_to_id = new Map<string, number>();

    for(let line of texts.split("\n")){
        line = line.trim();
        if(line == ""){
            continue;
        }
        const k3 = line.indexOf(":");
        assert(k3 != -1);
        const id = parseInt( line.substring(0, k3) );
        const text = line.substring(k3 + 1);
        // msg(`${id}>${text}`);
        id_to_text.set(id, text);
        text_to_id.set(text, id);
    }

    return [id_to_text, text_to_id];
}

export async function initI18n(){
    initLetters();

    for(const [name, code, quotes] of languages){
        quotationMarks.set(code, quotes);
    }

    [ urlOrigin, , urlParams] = i18n_ts.parseURL();

    const lang_code = urlParams.get("lang");
    if(lang_code == undefined){
        return;
    }

    if(quotationMarks.has(lang_code)){
        languageCode = lang_code;
        msg(`lang code:${lang_code}`);

        const [id_to_text1, text_to_id1] = await getTranslationMap("eng");

        if(languageCode == "eng"){
            TextToId = text_to_id1;
            return;
        }

        const [id_to_text2, text_to_id2] = await getTranslationMap(lang_code);
        TextToId = text_to_id2;

        for(const [id, text2] of id_to_text2.entries()){
            const text1 = id_to_text1.get(id);
            if(text1 != undefined){
                translationMap.set(text1.trim(), text2.trim());
            }
        }
    }
    else{
        msg(`illegal lang code:${lang_code}`);
    }

}

export function initLanguageBar(span : HTMLElement, doc_id? : number){
    span.innerHTML = "";

    const [ origin, pathname, params] = i18n_ts.parseURL();

    if(doc_id != undefined){
        params.set("id", `${doc_id}`);
    }

    let mode_ver_id = "";
    for(const key of [ "mode", "ver", "id" ]){
        const value = params.get(key);
        if(value != undefined){
            mode_ver_id += `&${key}=${value}`;
        }
    }

    for(const [name, code, quotes] of languages){
        const anchor = document.createElement("a");
        anchor.style.marginLeft = "5px";
        anchor.style.marginRight = "5px";
        anchor.style.color = fgColor;

        anchor.innerText = name;
        anchor.href = `${origin}${pathname}?lang=${code}${mode_ver_id}`;
        span.append(anchor);
    }
}

export async function bodyOnLoad(){
    await initI18n();

    const texts = await getAllTexts();
    const text = Array.from(texts.entries()).map(x=>(x[0] + ":" + x[1])).join("\n");
    msg(`all texts:`);
    msg(text);
    msg("");

    $inp("all-texts").value = text;

}

}