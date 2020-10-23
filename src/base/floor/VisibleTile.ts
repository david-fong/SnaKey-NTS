import { JsUtils } from "defs/JsUtils";
import { OmHooks } from "defs/OmHooks";
import type { Lang, Player } from "defs/TypeDefs";

import { Coord, Tile } from "./Tile";
export { Coord };


/**
 * Implicitly handles visuals with help from CSS.
 */
export class VisibleTile<S extends Coord.System> extends Tile<S> {

    readonly #baseElem:             HTMLDivElement;
    private readonly langCharElem:  HTMLDivElement;
    private readonly langSeqElem:   HTMLDivElement;

    public constructor(coordDesc: Tile<S>["coord"]) {
        super(coordDesc);
        {
            const base = this.#baseElem = JsUtils.mkEl("div", [
                OmHooks.General.Class.CENTER_CONTENTS,
                OmHooks.General.Class.STACK_CONTENTS,
                OmHooks.Tile.Class.BASE,
            ]);
            base.setAttribute("aria-label", "Tile");
        } {
            // Pointer hitbox element.
            // Must be the first child. See note in CSS class hook.
            const pthb = JsUtils.mkEl("div", [OmHooks.Tile.Class.POINTER_HB]);
            pthb.setAttribute("aria-hidden", "true");
            this.#baseElem.appendChild(pthb);
        } {
            const charWrap = JsUtils.mkEl("div", [OmHooks.Tile.Class.LANG_CHAR_WRAP]);
            charWrap.setAttribute("role", "presentation");
            const charElem = this.langCharElem = JsUtils.mkEl("div", []);
            charWrap.appendChild(charElem);
            this.#baseElem.appendChild(charWrap);
        } {
            const seqElem = this.langSeqElem = JsUtils.mkEl("div", [OmHooks.Tile.Class.LANG_SEQ]);
            seqElem.setAttribute("role", "tooltip");
            this.#baseElem.appendChild(seqElem);
        }
        JsUtils.propNoWrite(this as VisibleTile<S>, ["langCharElem", "langSeqElem",]);
    }

    public _addToDom(parent: HTMLElement): void {
        parent.appendChild(this.#baseElem);
    }

    /**
     * @override
     */
    public _setOccupant(
        playerId: Player.Id,
        immigrantInfo: Tile.VisibleImmigrantInfo,
    ): void {
        super._setOccupant(playerId, immigrantInfo);
        // It must go at least before the langChar element so that the
        // CSS can create a fading trail effect. It must go after the
        // hitbox so that it can be hidden to avoid covering the tooltip.
        this.langCharElem.parentElement!.insertAdjacentElement("beforebegin", immigrantInfo.playerElem);
        this.langSeqElem.textContent = immigrantInfo.username;
    }


    /**
     * @override
     */
    public evictOccupant(): void {
        super.evictOccupant();
        // Undo setting mouseover text to something player-related
        // (See `__setOccupant` for what we did and now need to undo):
        this.langSeqElem.textContent = this.langSeq;
    }

    /**
     * @override
     */
    public set freeHealth(newFreeHealth: Player.Health) {
        super.freeHealth = newFreeHealth;
        if (this.freeHealth > 0) {
            this.#baseElem.dataset[OmHooks.Tile.Dataset.HEALTH] = this.freeHealth.toString();
        } else {
            delete this.#baseElem.dataset[OmHooks.Tile.Dataset.HEALTH];
        }
    }

    /**
     * @override
     */
    // NOTE: For some reason, if we override the setter, the transpiled
    // code does not link to the super implementation... Or maybe this
    // is just a property of plain ECMA javascript??
    public get freeHealth(): Player.Health {
        return super.freeHealth;
    }

    /**
     * @override
     */
    public setLangCharSeqPair(charSeqPair: Lang.CharSeqPair): void {
        super.setLangCharSeqPair(charSeqPair);
        this.langCharElem.textContent = this.langChar;
        this.langSeqElem.textContent  = this.langSeq;
    }

}
// Assert that this extension's constructor has a compatible signature:
VisibleTile as Tile.ClassIf<Coord.System>;
JsUtils.protoNoEnum(VisibleTile, ["_addToDom"]);
Object.freeze(VisibleTile);
Object.freeze(VisibleTile.prototype);