(self.webpackChunksnakey3=self.webpackChunksnakey3||[]).push([[184],{891:(t,e,n)=>{"use strict";n.r(e),n.d(e,{English:()=>r});var r,c=n(115);!function(t){class e extends c.U{constructor(t){super("engl-low",t)}static BUILD(){return c.U.BuildUtils.WORD_FOR_WORD(t.LETTER_FREQUENCY)}}t.Lowercase=e,Object.freeze(e),Object.freeze(e.prototype);class n extends c.U{constructor(t){super("engl-mix",t)}static BUILD(){let e={};const n=n=>{e=Object.entries(t.LETTER_FREQUENCY).reduce(((t,[e,r])=>{const c=n(e);return t[c]={seq:c,weight:r},t}),e)};return n((t=>t.toLowerCase())),n((t=>t.toUpperCase())),e}}let r,s;t.MixedCase=n,Object.freeze(n),Object.freeze(n.prototype),function(e){class n extends c.U{constructor(t){super("engl-cell-enc",t)}static BUILD(){return Object.entries(t.LETTER_FREQUENCY).reduce(((t,[e,n],c)=>(t[e]={seq:r[c],weight:n},t)),{})}}e.Encode=n,Object.freeze(n),Object.freeze(n.prototype);const r=Object.freeze([3,3,3,3,3,4,3,4].flatMap(((t,e)=>{const n=[],r=(1+e).toString();for(let e=r;e.length<=t;e+=r)n.push(e);return n})))}(r=t.OldCellphone||(t.OldCellphone={})),Object.freeze(r),t.LETTER_FREQUENCY=Object.freeze(JSON.parse('{\n\t\t"a": 8.167, "b": 1.492, "c": 2.202, "d": 4.253,\n\t\t"e":12.702, "f": 2.228, "g": 2.015, "h": 6.094,\n\t\t"i": 6.966, "j": 0.153, "k": 1.292, "l": 4.025,\n\t\t"m": 2.406, "n": 6.749, "o": 7.507, "p": 1.929,\n\t\t"q": 0.095, "r": 5.987, "s": 6.327, "t": 9.356,\n\t\t"u": 2.758, "v": 0.978, "w": 2.560, "x": 0.150,\n\t\t"y": 1.994, "z": 0.077\n\t}')),t.LETTER_FREQUENCY_EXT=Object.freeze(Object.assign((()=>{const t={".":65.3,",":61.3,'"':26.7,"'":24.3,"-":15.3,"?":5.6,":":3.4,"!":3.3,";":3.2};for(let e=0;e<10;e++)t[e.toString()]=10;let e=0;for(const n in t)e+=t[n];for(const n in t)t[n]*=8/e;return t})(),t.LETTER_FREQUENCY)),function(e){class n extends c.U{constructor(t){super("mors-enc",t)}static BUILD(){const n={};for(const[r,c]of Object.entries(e.Dict))n[r]={seq:c,weight:t.LETTER_FREQUENCY_EXT[r]};return n}}e.Encode=n,Object.freeze(n),Object.freeze(n.prototype);class r extends c.U{constructor(t){super("mors-dec",t)}static BUILD(){const n={};for(const[r,c]of Object.entries(e.Dict))n[c.replace(/\./g,"•").replace(/\-/g,"−")]={seq:r,weight:t.LETTER_FREQUENCY_EXT[r]};return n}}e.Decode=r,Object.freeze(r),Object.freeze(r.prototype),e.Dict=Object.freeze(JSON.parse('{\n\t\t\t"0": "-----", "5": ".....",\n\t\t\t"1": ".----", "6": "-....",\n\t\t\t"2": "..---", "7": "--...",\n\t\t\t"3": "...--", "8": "---..",\n\t\t\t"4": "....-", "9": "----.",\n\n\t\t\t"a": ".-"   , "n": "-."   ,\n\t\t\t"b": "-..." , "o": "---"  ,\n\t\t\t"c": "-.-." , "p": ".--." ,\n\t\t\t"d": "-.."  , "q": "--.-" ,\n\t\t\t"e": "."    , "r": ".-."  ,\n\t\t\t"f": "..-." , "s": "..."  ,\n\t\t\t"g": "--."  , "t": "-"    ,\n\t\t\t"h": "...." , "u": "..-"  ,\n\t\t\t"i": ".."   , "v": "...-" ,\n\t\t\t"j": ".---" , "w": ".--"  ,\n\t\t\t"k": "-.-"  , "x": "-..-" ,\n\t\t\t"l": ".-.." , "y": "-.--" ,\n\t\t\t"m": "--"   , "z": "--.." ,\n\n\t\t\t".": ".-.-.-",\n\t\t\t",": "--..--",\n\t\t\t"?": "..--..",\n\t\t\t"!": "-.-.--",\n\t\t\t"-": "-....-"\n\t\t}'))}(s=t.Morse||(t.Morse={})),Object.freeze(s)}(r||(r={})),Object.freeze(r)}}]);
//# sourceMappingURL=English-ts.js.map