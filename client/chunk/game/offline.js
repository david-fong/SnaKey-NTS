(self.webpackChunkcapswalk=self.webpackChunkcapswalk||[]).push([[755],{208:(e,t,s)=>{"use strict";s.d(t,{U:()=>c});var r,i=s(164),o=s(139),a=(e,t,s)=>{if(!t.has(e))throw TypeError("Cannot "+s)},n=(e,t,s)=>(a(e,t,"read from private field"),s?s.call(e):t.get(e));!function(e){var t;const s=class{constructor(e,s="",r){var i,o,n;t.set(this,[]),this.carryHits=0,Object.defineProperty(this,"parent",{enumerable:!0,value:e}),Object.defineProperty(this,"seq",{enumerable:!0,value:s}),Object.defineProperty(this,"children",{enumerable:!0,value:[]}),i=this,o=t,n=Object.freeze(r),a(i,o,"write to private field"),o.set(i,n),Object.seal(this)}get ownHits(){var e,t;return this.carryHits-(null!=(t=null==(e=this.parent)?void 0:e.carryHits)?t:0)}reset(){this.carryHits=0;for(const e of this.children)e.reset();for(const e of n(this,t))e.reset(),this.incrHits(e,Math.random()*o.Uo.CHAR_HIT_COUNT_SEED_CEILING)}getLeaves(){const e=[];return this._rGetLeaves(e),e.freeze()}_rGetLeaves(e){if(this.children.length)for(const t of this.children)t._rGetLeaves(e);else e.push(this)}chooseOnePair(){let e=n(this,t)[0];for(const s of n(this,t))s.hits<e.hits&&(e=s);const s={char:e.char,seq:this.seq};return this.incrHits(e),s}incrHits(e,t=1){e._incrementNumHits(),this._rIncrHits(e.weightInv*t)}_rIncrHits(e){this.carryHits+=e;for(const t of this.children)t._rIncrHits(e)}static CREATE_TREE_MAP(t,r){const i=e.GET_SCALE_WEIGHT_FUNC(r,t),o=new Map;Object.entries(t).freeze().forEach((([e,{seq:t,weight:s}])=>{const r=new h(e,i(s)),a=o.get(t);void 0!==a?a.push(r):o.set(t,[r])}));const a=[];let n;for(const[e,t]of Array.from(o).seal().sort((([e],[t])=>e<t?-1:1)).freeze()){for(;void 0!==n&&!e.startsWith(n.seq);)n=n.parent;const r=new s(n,e,t);void 0!==n?n.children.push(r):a.push(r),n=r}return a.freeze()}};let r=s;function c(e,t){if(0===e)return()=>1;if(1===e)return e=>e;const s=Object.values(t),r=s.reduce(((e,t)=>e+t.weight),0)/s.length;return t=>Math.pow(t/r,e)}t=new WeakMap,r.LEAF_CMP=(e,t)=>e.carryHits-t.carryHits,e.Node=r,i.R.protoNoEnum(r,"_rGetLeaves","_rIncrHits"),Object.freeze(r),Object.freeze(r.prototype),e.GET_SCALE_WEIGHT_FUNC=c,Object.freeze(c)}(r||(r={})),Object.freeze(r);class h{constructor(e,t){this.char=e,this.hits=0,this.char=e,Object.defineProperty(this,"weightInv",{enumerable:!0,value:1/t}),Object.seal(this)}reset(){this.hits=0}_incrementNumHits(){this.hits+=this.weightInv}}Object.freeze(h),Object.freeze(h.prototype);class c extends o.Uo{constructor(e,t){super(),this.frontendDesc=c.GET_FRONTEND_DESC_BY_ID(e),this.treeRoots=r.Node.CREATE_TREE_MAP(Object.getPrototypeOf(this).constructor.BUILD(),t);const s=this.treeRoots.map((e=>e.getLeaves()));this.leafNodes=s.flat(),this.isolatedMinOpts=s.map((e=>e.length)).sort().slice(0,-1).reduce(((e,t)=>e+t),0),i.R.propNoWrite(this,"frontendDesc","treeRoots","leafNodes","isolatedMinOpts"),Object.seal(this)}reset(){for(const e of this.treeRoots)e.reset()}getNonConflictingChar(e){this.leafNodes.sort(r.Node.LEAF_CMP);e:for(const t of this.leafNodes){let s=t;for(let r=t;void 0!==r;r=r.parent){const t=e.find((e=>e.startsWith(r.seq)));if(t){if(t.length>r.seq.length)break;continue e}r.ownHits<s.ownHits&&(s=r)}return s.chooseOnePair()}throw new Error("never")}}!function(e){let t;(t=e.BuildUtils||(e.BuildUtils={})).WORD_FOR_WORD=function(e){return Object.entries(e).freeze().reduce(((e,[t,s])=>(e[t]={seq:t,weight:s},e)),{})}}(c||(c={})),Object.freeze(c),Object.freeze(c.prototype)},303:(e,t,s)=>{"use strict";s.r(t),s.d(t,{OfflineGame:()=>I});var r,i=s(61),o=s(52),a=s(46),n=s(783),h=s(164),c=s(208),d=s(892),l=(e,t,s)=>{if(!t.has(e))throw TypeError("Cannot "+s)},p=(e,t,s)=>(l(e,t,"read from private field"),s?s.call(e):t.get(e)),u=(e,t,s,r)=>(l(e,t,"write to private field"),r?r.call(e,s):t.set(e,s),s);class f{constructor(e,t){r.set(this,0),this.tiles=new Map;const s=d.l.K._HEALTH_COST_OF_BOOST(e.averageHealthPerTile,t.getLatticePatchDiameter);this.K=Object.freeze({avg:e.averageHealthPerTile*t.getArea(e.gridDimensions),avgPerTile:e.averageHealthPerTile,costOfBoost:e=>s/e.seq.length}),h.R.propNoWrite(this,"K"),Object.seal(this)}get currentAmount(){return p(this,r)}reset(){u(this,r,0),this.tiles.clear()}add(e){u(this,r,p(this,r)+e)}}r=new WeakMap,Object.freeze(f),Object.freeze(f.prototype);class g{constructor(e){const t=[];for(const s of e)t[s]=new g.Entry;this.entries=t,h.R.propNoWrite(this,"entries"),Object.seal(this)}reset(){for(const e of this.entries)e.reset()}}!function(e){class t{constructor(){this.moveCounts={}}reset(){this.totalHealthPickedUp=0,Object.getOwnPropertyNames(n.J.MoveType).forEach((e=>{this.moveCounts[e]=0}))}}e.Entry=t,Object.freeze(t),Object.freeze(t.prototype)}(g||(g={})),Object.freeze(g),Object.freeze(g.prototype);var m=s(810),v=s(702),y=s(33),b=s(216),O=(e,t,s)=>(((e,t,s)=>{if(!t.has(e))throw TypeError("Cannot read from private field")})(e,t),s?s.call(e):t.get(e));class _ extends n.J{constructor(e,t){super(e,t),this._nextMovementTimerMultiplier=void 0,this._scheduledMovementCallbackId=void 0}onGamePlaying(){super.onGamePlaying(),this._delayedMovementContinue()}onGamePaused(){this.game.cancelTimeout(this._scheduledMovementCallbackId),this._scheduledMovementCallbackId=void 0}onGameOver(){this.game.cancelTimeout(this._scheduledMovementCallbackId),this._scheduledMovementCallbackId=void 0}_movementContinue(){const e=this.computeDesiredDest();this._nextMovementTimerMultiplier=this.game.grid.tileAt(e).seq.length,this.makeMovementRequest(this.game.grid.getUntToward(e,this.coord).coord,this.getNextMoveType()),this._delayedMovementContinue()}_delayedMovementContinue(){this._scheduledMovementCallbackId=this.game.setTimeout(this._movementContinue.bind(this),this.computeNextMovementTimer()*this._nextMovementTimerMultiplier)}}!function(e){var t;e._Constructors={CHASER:void 0},e.of=(t,s)=>{const r=s.familyId;return new e._Constructors[r](t,s)};class s extends e{constructor(){super(...arguments),t.set(this,{which:0,reuses:0,target:void 0})}reset(e){super.reset(e),O(this,t).which=0,O(this,t).reuses=0,O(this,t).target=void 0}computeDesiredDest(){const e=O(this,t);if(void 0!==e.target&&e.reuses<=d.l.K._ROBOT_PRIORITY_MAX_REUSES){const t=this._behaviours[e.which].call(this,e.target);if(void 0!==t)return e.reuses++,t.dest}e.reuses=0;for(let t=0;t<this._behaviours.length;t++){const s=this._behaviours[t].call(this);if(void 0!==s)return e.which=t,e.target=s.target,s.dest}throw new Error("never")}}t=new WeakMap,e.Decisive=s,Object.freeze(s),Object.freeze(s.prototype)}(_||(_={})),h.R.protoNoEnum(_,"_movementContinue"),Object.seal(_),Object.freeze(_.prototype);class E extends _.Decisive{constructor(e,t){super(e,t),this.pred=[],this.prey=[],this.params=Object.freeze(Object.assign({},E.Behaviour.DEFAULT,t.familyArgs)),this.grid=this.game.grid,Object.seal(this),h.R.propNoWrite(this,"params","grid"),this.prey[Symbol.iterator],this.pred.keys}onTeamsBootstrapped(){super.onTeamsBootstrapped(),this.pred=this.game.teams.filter((e=>e.id!==this.teamId)).flatMap((e=>e.members)).seal(),this.prey=[...this.pred].seal(),h.R.propNoWrite(this,"pred","prey")}_bhvrEvadePred(e){if(void 0!==e)return{dest:this.grid.getUntAwayFrom(this.game.players[e].coord,this.coord).coord};this.pred.sort(((e,t)=>this.grid.dist(e.coord,this.coord)-this.grid.dist(t.coord,this.coord)));for(const e of this.pred){if(this.grid.dist(e.coord,this.coord)>this.params.fearDistance)break;if(!e.isDowned&&e.health>this.health)return{dest:this.grid.getUntAwayFrom(e.coord,this.coord).coord,target:e.playerId}}}_bhvrChasePrey(e){if(void 0!==e)return{dest:this.game.players[e].coord};if(this.prey.sort(((e,t)=>this.grid.dist(this.coord,e.coord)-this.grid.dist(this.coord,t.coord))),this.isDowned)for(const e of this.prey){if(this.grid.dist(this.coord,e.coord)>this.params.bloodThirstDistance)break;if(e.health<this.health-this.params.healthReserve)return{dest:e.coord,target:e.playerId}}}_bhvrGotoHealthElseWander(e){if(void 0!==e&&this.game.health.tiles.has(e))return{dest:e};if(0===this.game.health.tiles.size){if(Math.random()<this.params.wanderingAimlessness)return{dest:this.grid.getRandomCoordAround(this.coord,3)};{const e=this.grid.getUntAwayFrom.bind(this.grid,this.prevCoord);return{dest:this.grid.getRandomCoordAround(e(e(this.coord).coord).coord,1)}}}let t,s=1/0;for(const e of this.game.health.tiles.values()){const r=this.grid.dist(this.coord,e.coord);r<s&&(t=e,s=r)}return{dest:t.coord,target:t.coord}}getNextMoveType(){return n.J.MoveType.NORMAL}computeNextMovementTimer(){return 1e3/this.params.keyPressesPerSecond}}!function(e){let t;(t=e.Behaviour||(e.Behaviour={})).DEFAULT=Object.freeze({fearDistance:5,bloodThirstDistance:7,healthReserve:3,keyPressesPerSecond:2,wanderingAimlessness:.2})}(E||(E={})),E.prototype._behaviours=Object.freeze([E.prototype._bhvrEvadePred,E.prototype._bhvrChasePrey,E.prototype._bhvrGotoHealthElseWander]),h.R.protoNoEnum(E,"onTeamsBootstrapped"),Object.freeze(E),Object.freeze(E.prototype);var C,T=Object.assign,w=(e,t,s)=>{if(!t.has(e))throw TypeError("Cannot "+s)};(()=>{Object.freeze(Object.assign(m.r._Constructors,{W_EUCLID2:y.K.Grid,BEEHIVE:b.v.Grid})),Object.freeze(m.r);{const e=_;Object.freeze(Object.assign(e._Constructors,{CHASER:E})),Object.freeze(e)}})();class j extends v.S{constructor(e){var t,r,i;super(e),this.lang=void 0,C.set(this,void 0),this.health=new f(e.desc,this.grid.static),this.scoreInfo=new g(this.players.map((e=>e.playerId))),h.R.propNoWrite(this,"health","scoreInfo"),t=this,r=C,i=s(59)(`./${this.langFrontend.module}.ts`).then((t=>{const s=this.langFrontend.export.split(".").reduce(((e,t)=>e[t]),t[this.langFrontend.module]);return this.lang=new s(e.desc.langWeightExaggeration),h.R.propNoWrite(this,"lang"),this.lang})),w(t,r,"write to private field"),r.set(t,i)}async reset(){super.reset();const e=Object.freeze({playerCoords:[],csps:[]});var t,s;this.health.reset(),await(t=this,s=C,w(t,s,"read from private field"),s.get(t)),this.lang.reset(),this.grid.forEachShuffled(((t,s)=>{const r=this.dryRunShuffleLangCspAt(t.coord,!0);this.grid.write(t.coord,r),e.csps[s]=r})),this.teams.forEach((e=>e.reset()));const r=this.grid.static.getSpawnCoords(this.teams.map((e=>e.members.length)),this.grid.dimensions);return this.teams.forEach(((t,s)=>{t.members.forEach(((t,i)=>{const o=r[s][i];t.reset(o),e.playerCoords[t.playerId]=o}))})),this.scoreInfo.reset(),e}dryRunShuffleLangCspAt(e,t=!1){this.grid.write(e,c.U.CharSeqPair.NULL);let s=this.grid.getAllAltDestsThan(e).map((e=>e.seq)).freeze();if(t){const e=c.U.CharSeqPair.NULL.seq;s=s.filter((t=>t!==e)).freeze()}return this.lang.getNonConflictingChar(s)}dryRunSpawnHealth(e){var t;let s=this.health.K.avg-this.health.currentAmount;if(s<=0)return e;for(;s>0;){let r;do{r=this.grid.tileAt(this.grid.getRandomCoord())}while(r.occId!==n.J.Id.NULL);const i=d.l.K.AVERAGE_HEALTH_TO_SPAWN_ON_TILE;if(Math.random()<d.l.K._HEALTH_UPDATE_CHANCE){let s=e[r.coord];void 0!==s?s.health=(null!=(t=s.health)?t:0)+i:e[r.coord]={health:r.health+i}}s-=i}return e}processMoveRequest(e,t){const s=this.players[e.initiator];if(e.lastRejectId!==s.reqBuffer.lastRejectId)return;const r=this.grid.tileAt(e.moveDest);if(this.status!==d.l.Status.PLAYING||r.occId!==n.J.Id.NULL)return void this.commitStateChange({rejectId:s.reqBuffer.getNextRejectId(),initiator:e.initiator},t);const i=e.moveType===n.J.MoveType.BOOST,o=s.health+r.health*(s.isDowned?d.l.K.HEALTH_EFFECT_FOR_DOWNED_PLAYER:1)-(i?this.health.K.costOfBoost(r):0);if(i&&o<0)return void this.commitStateChange({rejectId:s.reqBuffer.getNextRejectId(),initiator:e.initiator},t);const a=this.scoreInfo.entries[s.playerId];a.totalHealthPickedUp+=r.health,a.moveCounts[e.moveType]+=1,this.commitStateChange({initiator:e.initiator,moveType:e.moveType,players:{[s.playerId]:{health:o,coord:r.coord}},tiles:this.dryRunSpawnHealth({[e.moveDest]:T({health:0},this.dryRunShuffleLangCspAt(r.coord))})},t)}commitTileMods(e,t,s=!0){const r=this.grid.tileAt(e);void 0!==t.health&&(this.health.add(t.health-r.health),t.health<=0?this.health.tiles.delete(e):this.health.tiles.set(e,r)),super.commitTileMods(e,t,s)}}C=new WeakMap,(j||(j={})).CHECK_VALID_CTOR_ARGS=function(e){const t=[],s=Object.freeze({coordSys:0,gridDimensions:0,averageHealthPerTile:0,langId:0,langWeightExaggeration:0,players:0}),r=[];for(const t in s){null==e[t]&&r.push(t)}r.length&&t.push("Missing the following arguments: "+r);const i=c.U.GET_FRONTEND_DESC_BY_ID(e.langId),o=m.r._Constructors[e.coordSys];return void 0===i?t.push(`No language with the ID \`${e.langId}\` exists.`):void 0===o?t.push(`No grid with the system ID \`${e.coordSys}\` exists.`):i.isolatedMinOpts<o.ambiguityThreshold&&t.push("The provided language does not have enough sequences\nto ensure that a shuffling operation will always succeed when\npaired with the provided grid system."),NaN===parseInt(e.langWeightExaggeration)?t.push(`Language Weight Exaggeration expected a number, but\`${e.langWeightExaggeration}\` is not a number.`):e.langWeightExaggeration=Math.max(0,parseFloat(e.langWeightExaggeration)),t},Object.freeze(j),Object.freeze(j.prototype),(0,i.Z)();class I extends j{constructor(e,t){super({impl:{gridClassLookup:o.T.getImplementation,OperatorPlayer:a.i,RobotPlayer:(e,t)=>_.of(e,t),onGameBecomeOver:e},desc:(n.J.CtorArgs.finalize(t),t),operatorIds:t.players.filter((e=>"HUMAN"===e.familyId)).map((e=>e.playerId))}),Object.seal(this)}setTimeout(e,t,...s){return setTimeout(e,t,s)}cancelTimeout(e){clearTimeout(e)}}Object.freeze(I),Object.freeze(I.prototype)},59:(e,t,s)=>{var r={"./Chinese.ts":[83,7,330],"./Emote.ts":[985,9,858],"./English.ts":[825,9,184],"./Japanese.ts":[885,9,410],"./Korean.ts":[969,9,227],"./Ngrams.ts":[755,9,273],"./Numpad.ts":[444,9,683],"./Shell.ts":[25,9,159],"./defs/Chinese.ts":[711,7,704],"./defs/English100.ts":[589,9,885]};function i(e){if(!s.o(r,e))return Promise.resolve().then((()=>{var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=r[e],i=t[0];return s.e(t[2]).then((()=>s.t(i,16|t[1])))}i.keys=()=>Object.keys(r),i.id=59,e.exports=i}}]);
//# sourceMappingURL=offline.js.map