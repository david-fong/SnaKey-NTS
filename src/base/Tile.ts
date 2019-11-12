import { LangSeq, LangChar, LangCharSeqPair } from "src/Lang";
import { Pos, BarePos } from "src/Pos";
export { Pos, BarePos } from "src/Pos";

/**
 * 
 * 
 * As an implementation choice, `Tile`s are dumb. That is, they have
 * no knowledge of their context. Their internals are all managed by
 * their host {@link Game} object through method calls.
 */
export abstract class Tile {

    readonly pos: Pos;

    /**
     * 
     * @param x - The horizontal coordinate of this `Tile` in its host {@link Grid}.
     * @param y - The   vertical coordinate of this `Tile` in its host {@link Grid}.
     * 
     * @throws `TypeError` if `x` or `y` are not integer values.
     */
    public constructor(x: number, y: number) {
        this.pos = new Pos(x, y);
        if (!(this.pos.equals(this.pos.round()))) {
            throw new TypeError("Tile position coordinates must be integers.");
        }
        this.reset();
    }

    public reset(): void {
        this.evictOccupant();
        this.scoreValue = 0;
        this.setLangCharSeq(new LangCharSeqPair(null, null));
    }



    /**
     * Called, for example, when a {@link Player} on this `Tile` provides
     * input that did not work to complete their {@link Player#seqBuffer}
     * against any neighbouring `Tile`s.
     */
    public visualBell(): void {
        // does nothing by default.
    }



    public isOccupied(): boolean {
        return this.occupantId === null;
    }

    public evictOccupant(): void {
        this.occupantId = null;
    }

    public abstract get occupantId(): number | null;

    public abstract set occupantId(occupantId: number | null);

    public abstract get scoreValue(): number;

    public abstract set scoreValue(score: number);

    public abstract setLangCharSeq(charSeqPair: LangCharSeqPair): void;

    public abstract get langChar(): LangChar;

    public abstract get langSeq(): LangSeq;

}
