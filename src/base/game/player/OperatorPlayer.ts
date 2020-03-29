import { Lang } from "lang/Lang";
import { Coord, Tile } from "floor/Tile";
import { VisibleTile } from "floor/VisibleTile";
import { Player } from "./Player";
import { Game } from "game/Game";


/**
 *
 * @extends Player
 */
export abstract class OperatorPlayer<S extends Coord.System> extends Player<S> {

    /**
     * @override
     */
    declare public readonly hostTile: VisibleTile<S>;

    /**
     * @override
     */
    declare public readonly status: OperatorPlayerStatus;

    /**
     * Invariant: always matches the prefix of the {@link LangSeq} of
     * an unoccupied neighbouring {@link Tile}.
     */
    #seqBuffer: Lang.Seq;


    public constructor(game: Game<any,S>, desc: Readonly<Player.CtorArgs>) {
        super(game, desc);
    }

    /**
     * @override {@link Player#reset}
     */
    public reset(spawnTile: Tile<S>): void {
        super.reset(spawnTile);
        this.hostTile.tileCellElem.appendChild(this.status.playerDivElem);
        this.#seqBuffer = "";
    }

    /**
     * @override
     */
    protected createStatusObj(): OperatorPlayerStatus {
        return new OperatorPlayerStatus();
    }


    /**
     * Callback function invoked when the Operator presses a key while
     * the game's html element has focus. Because of how JavaScript
     * and also Node.js run in a single thread, this is an atomic
     * operation (implementation must not intermediately schedule any
     * other task-relevant callbacks until all critical operations are
     * complete).
     *
     * @param event - The object describing the `KeyboardEvent`.
     */
    public processClientInput(event: KeyboardEvent): void {
        if (false) {
            ;
        } else if (!this.requestInFlight) {
            // Only process movement-type input if the last request got
            // acknowledged by the Game Manager and the game is not paused.
            // TODO: check if game is paused? This means we either need to
            // add an event to signal pauses to clients (I don't like this
            // because it means delay), or we change this to allow sending
            // requests to the Game Manager even if the game is paused, and
            // leave it up to the Game Manager to ignore the request.
            this.seqBufferAcceptKey(event.key);
        }
    }

    /**
     * Automatically makes a call to make a movement request if the
     * provided `key` completes the `LangSeq` of a UNT. Does not do
     * any checking regarding {@link OperatorPlayer#requestInFlight}.
     *
     * @param key
     * The pressed typeable key as a string. Pass `null` to trigger a
     * refresh of the {@link OperatorPlayer#_seqBuffer} to maintain its
     * invariant.
     */
    public seqBufferAcceptKey(key: string | null): void {
        const unts = this.tile.destsFrom().unoccupied.get;
        if (unts.length === 0) {
            // Every neighbouring `Tile` is occupied!
            // In this case, no movement is possible.
            return;
        }
        if (key) {
            key = this.lang.remapKey(key);
            if (!(Lang.Seq.REGEXP.test(key))) {
                throw new RangeError(`The implementation of input transformation`
                    + ` in the language \"${this.lang.name}\" did not follow the`
                    + ` rule of producing output matching the regular expression`
                    + ` \"${Lang.Seq.REGEXP.source}\".`
                );
            }
        } else {
            const possibleTarget = unts.find((tile) => tile.langSeq.startsWith(this.seqBuffer));
            if (!possibleTarget || possibleTarget.langSeq === this.seqBuffer) {
                this.#seqBuffer = "";
            }
            return;
        }

        for ( // loop through substring start offset of newSeqBuffer:
            let newSeqBuffer: Lang.Seq = this.seqBuffer + key;
            newSeqBuffer.length;
            newSeqBuffer = newSeqBuffer.substring(1)
        ) {
            // look for the longest suffixing substring of `newSeqBuffer`
            // that is a prefixing substring of any UNT's.
            const possibleTarget = unts.find((tile) => tile.langSeq.startsWith(newSeqBuffer));
            if (possibleTarget) {
                this.#seqBuffer = newSeqBuffer;
                if (possibleTarget.langSeq === newSeqBuffer) {
                    this.makeMovementRequest(possibleTarget);
                }
                return;
            }
        }
        // Operator's new `seqBuffer` didn't match anything.
        this.#seqBuffer = "";
        this.hostTile.visualBell();
    }

    /**
     * Automatically clears the {@link OperatorPlayer#seqBuffer}.
     *
     * @override
     */
    public moveTo(dest: Player<S>["hostTile"]): void {
        // Clear my `seqBuffer` first:
        this.#seqBuffer = "";
        super.moveTo(dest);
        this.hostTile.tileCellElem.appendChild(this.status.playerDivElem);
    }


    public get seqBuffer(): Lang.Seq {
        return this.#seqBuffer;
    }

    public get lang(): Lang {
        return this.game.lang;
    }

}



// TODO: make the overridden setters modify the HTML elements to
// visually indicate the changes.
class OperatorPlayerStatus extends PlayerStatus {

    public readonly playerDivElem: HTMLDivElement;

    public constructor() {
        {
            // TODO: create a spotlight mask using the below CSS properties:
            // https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode
            const pDiv: HTMLDivElement = new HTMLDivElement();
            pDiv.className = VisibleTile.ClassHooks.PLAYER;
            this.playerDivElem = pDiv;
        }
        // This must go after the HTML initialization since the setters
        // called in the super-constructor are overridden here to modify
        // the same DOM elements referenced by those fields.
        super();
    }


    public set score(newValue: number) {
        super.score = newValue;
    }

    public set stockpile(stockpile: number) {
        super.stockpile = stockpile;
    }


    public set isDowned(isDowned: boolean) {
        super.isDowned = isDowned;
    }

    public set isFrozen(isFrozen: boolean) {
        super.isFrozen = isFrozen;
    }

    public set isBubbling(isBubbling: boolean) {
        super.isBubbling = isBubbling;
    }

    public set percentBubbleCharge(bubbleCharge: number) {
        super.percentBubbleCharge = bubbleCharge;
    }

}
