(self.webpackChunksnakey3=self.webpackChunksnakey3||[]).push([[227],{3:(e,a,r)=>{"use strict";r.r(a),r.d(a,{Korean:()=>o});var o,m=r(115);!function(e){class a extends m.U{constructor(e){super("kore-dub",e)}static BUILD(){return t(((e,r,o)=>[e,r,o].flatMap((e=>e.atoms.split(""))).map((e=>a.DUB_KEYBOARD[e])).join("")))}}Object.defineProperty(a,"DUB_KEYBOARD",{enumerable:!0,configurable:!0,writable:!0,value:Object.freeze({"":"",ㅂ:"q",ㅈ:"w",ㄷ:"e",ㄱ:"r",ㅅ:"t",ㅛ:"y",ㅕ:"u",ㅑ:"i",ㅐ:"o",ㅔ:"p",ㅁ:"a",ㄴ:"s",ㅇ:"d",ㄹ:"f",ㅎ:"g",ㅗ:"h",ㅓ:"j",ㅏ:"k",ㅣ:"l",ㅋ:"z",ㅌ:"x",ㅊ:"c",ㅍ:"v",ㅠ:"b",ㅜ:"n",ㅡ:"m",ㅃ:"Q",ㅉ:"W",ㄸ:"E",ㄲ:"R",ㅆ:"T",ㅒ:"O",ㅖ:"P"})}),e.Dubeolsik=a,Object.freeze(a),Object.freeze(a.prototype);class r extends m.U{constructor(e){super("kore-sub",e)}static BUILD(){return t(((e,a,o)=>r.SEB_KEYBOARD.INITIALS[e.value]+r.SEB_KEYBOARD.MEDIALS[a.value]+r.SEB_KEYBOARD.FINALS[o.value]))}}Object.defineProperty(r,"SEB_KEYBOARD",{enumerable:!0,configurable:!0,writable:!0,value:Object.freeze({FINALS:{"":"",ㅎ:"1",ㅆ:"2",ㅂ:"3",ㅅ:"q",ㄹ:"w",ㅇ:"a",ㄴ:"s",ㅁ:"z",ㄱ:"x",ㄲ:"!",ㄺ:"@",ㅈ:"#",ㄿ:"$",ㄾ:"%",ㅍ:"Q",ㅌ:"W",ㄵ:"E",ㅀ:"R",ㄽ:"T",ㄷ:"A",ㄶ:"S",ㄼ:"D",ㄻ:"F",ㅊ:"Z",ㅄ:"X",ㅋ:"C",ㄳ:"V"},MEDIALS:{ㅛ:"4",ㅠ:"5",ㅑ:"6",ㅖ:"7",ㅢ:"8",ㅕ:"e",ㅐ:"r",ㅓ:"t",ㅣ:"d",ㅏ:"f",ㅡ:"g",ㅔ:"c",ㅗ:"v",ㅜ:"b",ㅒ:"G",ㅘ:"vf",ㅙ:"vr",ㅚ:"vd",ㅝ:"bt",ㅞ:"bc",ㅟ:"bd"},INITIALS:{ㅋ:"0",ㄹ:"y",ㄷ:"u",ㅁ:"i",ㅊ:"o",ㅍ:"p",ㄴ:"h",ㅇ:"j",ㄱ:"k",ㅈ:"l",ㅂ:";",ㅌ:"'",ㅅ:"n",ㅎ:"m",ㄲ:"!",ㄸ:"uu",ㅃ:";;",ㅆ:"nn",ㅉ:"l"}})}),e.Sebeolsik=r,Object.freeze(r),Object.freeze(r.prototype);class o extends m.U{constructor(e){super("kore-rom",e)}static BUILD(){return t(((e,a,r)=>e.roman+a.roman+r.roman))}}e.Romanization=o,Object.freeze(o),Object.freeze(o.prototype);const t=e=>{const a={};return n.forEach(((r,o)=>{s.forEach(((m,t)=>{u.forEach(((n,l)=>{let f=o;f=s.length*f+t,f=u.length*f+l;const v=String.fromCharCode(44032+f);a[v]={seq:e(r,m,n),weight:r.freq*m.freq*n.freq}}))}))})),a},n=Object.freeze([{value:"ㄱ",atoms:"ㄱ",roman:"g",freq:2.508206},{value:"ㄲ",atoms:"ㄱㄱ",roman:"kk",freq:.139215},{value:"ㄴ",atoms:"ㄴ",roman:"n",freq:1.278464},{value:"ㄷ",atoms:"ㄷ",roman:"d",freq:1.715174},{value:"ㄸ",atoms:"ㄷㄷ",roman:"tt",freq:.155508},{value:"ㄹ",atoms:"ㄹ",roman:"r",freq:1.30699},{value:"ㅁ",atoms:"ㅁ",roman:"m",freq:.920276},{value:"ㅂ",atoms:"ㅂ",roman:"b",freq:.768992},{value:"ㅃ",atoms:"ㅂㅂ",roman:"pp",freq:.034349},{value:"ㅅ",atoms:"ㅅ",roman:"s",freq:1.620272},{value:"ㅆ",atoms:"ㅅㅅ",roman:"ss",freq:.062508},{value:"ㅇ",atoms:"ㅇ",roman:"-",freq:4.509884},{value:"ㅈ",atoms:"ㅈ",roman:"j",freq:1.603205},{value:"ㅉ",atoms:"ㅈㅈ",roman:"jj",freq:.043767},{value:"ㅊ",atoms:"ㅊ",roman:"ch",freq:.428943},{value:"ㅋ",atoms:"ㅋ",roman:"k",freq:.103017},{value:"ㅌ",atoms:"ㅌ",roman:"t",freq:.228492},{value:"ㅍ",atoms:"ㅍ",roman:"p",freq:.212015},{value:"ㅎ",atoms:"ㅎ",roman:"h",freq:1.360725}]),s=Object.freeze([{value:"ㅏ",atoms:"ㅏ",roman:"a",freq:4.559484},{value:"ㅐ",atoms:"ㅐ",roman:"ae",freq:.970054},{value:"ㅑ",atoms:"ㅑ",roman:"ya",freq:.150865},{value:"ㅒ",atoms:"ㅒ",roman:"yae",freq:.008922},{value:"ㅓ",atoms:"ㅓ",roman:"eo",freq:2.231959},{value:"ㅔ",atoms:"ㅔ",roman:"e",freq:.932004},{value:"ㅕ",atoms:"ㅕ",roman:"yeo",freq:1.000171},{value:"ㅖ",atoms:"ㅖ",roman:"ye",freq:.105095},{value:"ㅗ",atoms:"ㅗ",roman:"o",freq:2.040807},{value:"ㅘ",atoms:"ㅗㅏ",roman:"wa",freq:.38506},{value:"ㅙ",atoms:"ㅗㅐ",roman:"wae",freq:.02655},{value:"ㅚ",atoms:"ㅗㅣ",roman:"oe",freq:.236245},{value:"ㅛ",atoms:"ㅛ",roman:"yo",freq:.223892},{value:"ㅜ",atoms:"ㅜ",roman:"u",freq:1.402448},{value:"ㅝ",atoms:"ㅜㅓ",roman:"wo",freq:.135821},{value:"ㅞ",atoms:"ㅜㅔ",roman:"we",freq:.004818},{value:"ㅟ",atoms:"ㅜㅣ",roman:"wi",freq:.112462},{value:"ㅠ",atoms:"ㅠ",roman:"yu",freq:.111584},{value:"ㅡ",atoms:"ㅡ",roman:"eu",freq:2.727101},{value:"ㅢ",atoms:"ㅡㅣ",roman:"ui",freq:.425688},{value:"ㅣ",atoms:"ㅣ",roman:"i",freq:3.208973}]),u=Object.freeze([{value:"",atoms:"",roman:"",freq:17.06119},{value:"ㄱ",atoms:"ㄱ",roman:"k",freq:1.109483},{value:"ㄲ",atoms:"ㄱㄱ",roman:"k",freq:.016359},{value:"ㄳ",atoms:"ㄱㅅ",roman:"kt",freq:962e-6},{value:"ㄴ",atoms:"ㄴ",roman:"n",freq:3.580456},{value:"ㄵ",atoms:"ㄴㅈ",roman:"nt",freq:.007522},{value:"ㄶ",atoms:"ㄴㅎ",roman:"nt",freq:.081892},{value:"ㄷ",atoms:"ㄷ",roman:"t",freq:.049969},{value:"ㄹ",atoms:"ㄹ",roman:"l",freq:2.094454},{value:"ㄺ",atoms:"ㄹㄱ",roman:"lk",freq:.019761},{value:"ㄻ",atoms:"ㄹㅁ",roman:"lm",freq:.011711},{value:"ㄼ",atoms:"ㄹㅂ",roman:"lp",freq:.005885},{value:"ㄽ",atoms:"ㄹㅅ",roman:"lt",freq:13e-6},{value:"ㄾ",atoms:"ㄹㅌ",roman:"lt",freq:353e-6},{value:"ㄿ",atoms:"ㄹㅍ",roman:"lp",freq:21e-5},{value:"ㅀ",atoms:"ㄹㅎ",roman:"lt",freq:.00815},{value:"ㅁ",atoms:"ㅁ",roman:"m",freq:.697015},{value:"ㅂ",atoms:"ㅂ",roman:"p",freq:.360526},{value:"ㅄ",atoms:"ㅂㅅ",roman:"pt",freq:.069739},{value:"ㅅ",atoms:"ㅅ",roman:"t",freq:.308934},{value:"ㅆ",atoms:"ㅅㅅ",roman:"t",freq:.590913},{value:"ㅇ",atoms:"ㅇ",roman:"ng",freq:1.66395},{value:"ㅈ",atoms:"ㅈ",roman:"t",freq:.046297},{value:"ㅊ",atoms:"ㅊ",roman:"t",freq:.026808},{value:"ㅋ",atoms:"ㅋ",roman:"k",freq:814e-6},{value:"ㅌ",atoms:"ㅌ",roman:"t",freq:.068318},{value:"ㅍ",atoms:"ㅍ",roman:"p",freq:.045664},{value:"ㅎ",atoms:"ㅎ",roman:"t",freq:.002595}])}(o||(o={})),Object.freeze(o)}}]);
//# sourceMappingURL=Korean-ts.js.map