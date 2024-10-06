namespace i18n_ts {
//
let languageCode : string = "eng";

export let  upperLatinLetters : string;
export let  lowerLatinLetters : string;
export let  latinLetters : string;

export let  upperGreekLetters : string;
export let  lowerGreekLetters : string;


/**
Quotation mark
    https://en.wikipedia.org/wiki/Quotation_mark
 */
let quotationMarks = new Map<string, [string, string]>([
    [ "", ["", ""]],
]);

/*
List of ISO 639 language codes
    https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes

Arabic	ar	ara	ara
Bengali	bn	ben	ben
Burmese	my	mya	bur
Chinese	zh	zho	chi
Dutch	nl	nld	dut
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

let translation : Map<string, string> = new Map<string, string>();


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

    msg(upperLatinLetters);
    msg(lowerLatinLetters);
    msg(upperGreekLetters);
    msg(lowerGreekLetters);
}

export async function getAllTexts() {
    const k = document.location.href.lastIndexOf("/");
    const home_url = document.location.href.substring(0, k);
    msg(`home:${home_url}`);

    const names = [
        "parser",
        "plane",
        "firebase",
        "movie"
    ];

    const texts : string[] = [];

    for(const name of names){
        const url = `${home_url}/lib/${name}/${name}.js`;
        msg(`js url:${url}`);
        const text = await fetchText(url);

        for(const quote of [ "'", '"' ]){
            let start = 0;

            const T = `T(${quote}`;
            while(true){

                const k1 = text.indexOf(T, start);
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

export function T(text : string) : string {
    const target = translation.get(text);
    return target != undefined ? target : text;
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

export interface Readable {
    reading() : Reading;
}

export class Reading {
    text : string;
    args : Readable[];

    static setTranslation(translation_arg : Map<string, string>){
        translation = translation_arg;
    }

    constructor(text : string, args : Readable[]){
        this.text = text;
        this.args = args;
    }

    toString() : string {
        let text = this.text;

        if(translation != undefined && translation.has(this.text)){
            text = translation.get(text)!;
        }

        const marks = getQuotationMarks();
        for(const i of range(this.args.length)){
            const c = '"' + upperLatinLetters[i] + '"';
            const reading = marks[0] + this.args[i].reading().toString() + marks[1];
            text = text!.replace(c, reading);
        }

        return text;
    }
}

export async function initI18n(){
    initLetters();

    const texts = await getAllTexts();
    msg(`all texts:`);
    msg(texts.join("\n"));
    msg("");
}


}