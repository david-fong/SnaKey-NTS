import { JsUtils } from "defs/JsUtils";
import type { Lang as _Lang } from "defs/TypeDefs";
import { Game } from "game/Game";

import type { VisibleTile } from "floor/VisibleTile";
import type { VisiblePlayerStatus } from "./VisiblePlayerStatus";
import type { GamepartBase } from "game/gameparts/GamepartBase";
import { Coord } from "floor/Coord";
import type { Tile } from "floor/Tile";

import { Player } from "./Player";


/**
 * There is at least one in online-clientside and offline games.
 * There are none for online-serverside games.
 */
export class OperatorPlayer<S extends Coord.System> extends Player<S> {

	/**
	 * @override
	 */
	declare public readonly game: GamepartBase<(Game.Type.Browser),S>;

	/**
	 * @override
	 */
	// @ts-expect-error : Redeclaring accessor as property.
	declare public hostTile: VisibleTile<S>;

	/**
	 * @override
	 */
	declare public readonly status: VisiblePlayerStatus<S>;

	/**
	 * Invariant: always matches the prefix of the {@link LangSeq} of
	 * an unoccupied neighbouring {@link Tile}.
	 */
	#seqBuffer: _Lang.Seq;

	readonly #langRemappingFunc: {(input: string): string};

	private prevCoord: Coord[S];


	public constructor(game: GamepartBase<any,S>, desc: Player._CtorArgs<"HUMAN">) {
		super(game, desc);
		this.#langRemappingFunc = this.game.langFrontend.remapFunc;
	}

	public reset(spawnTile: Tile<S>): void {
		super.reset(spawnTile);
		this.prevCoord = spawnTile.coord;
		this.#seqBuffer = "";
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
	public processKeyboardInput(event: KeyboardEvent): void {
		if (this.game.status !== Game.Status.PLAYING) return;
		if (!this.requestInFlight) {
			// Only process movement-type input if the last request got
			// acknowledged by the Game Manager and the game is playing.
			if (event.key === " ") {
				if (!Coord.equals(this.coord, this.prevCoord)) {
					this.makeMovementRequest(
						this.game.grid.getUntAwayFrom(this.prevCoord, this.coord),
						Player.MoveType.BOOST,
					);
				}
			} else if (event.key.length === 1 && !event.repeat) {
				// TODO.design is the above condition okay? will any
				// languages require different behaviour?
				this.seqBufferAcceptKey(event.key);
			}
		}
	}

	/**
	 * Automatically makes a call to make a movement request if the
	 * provided `key` completes the `LangSeq` of a UNT. Does not do
	 * any checking regarding {@link OperatorPlayer#requestInFlight}.
	 *
	 * @param key
	 * The pressed typeable key as a string. Pass an empty string to
	 * trigger a refresh of the {@link OperatorPlayer#_seqBuffer} to
	 * maintain its invariant.
	 */
	public seqBufferAcceptKey(key: string | undefined): void {
		const unts = this.tile.destsFrom().unoccupied.get;
		if (unts.length === 0) {
			// Every neighbouring `Tile` is occupied!
			// In this case, no movement is possible.
			return;
		}
		if (key) {
			key = this.#langRemappingFunc(key);
		} else {
			const possibleTarget = unts.find((tile) => tile.langSeq.startsWith(this.seqBuffer));
			if (!possibleTarget) {
				// If the thing I was trying to get to is gone, clear the buffer.
				this.#seqBuffer = "";
			}
			return;
		}

		for ( // loop through substring start offset of newSeqBuffer:
			let newSeqBuffer: _Lang.Seq = this.seqBuffer + key;
			newSeqBuffer.length;
			newSeqBuffer = newSeqBuffer.substring(1)
		) {
			// look for the longest suffixing substring of `newSeqBuffer`
			// that is a prefixing substring of any UNT's.
			const possibleTarget = unts.find((tile) => tile.langSeq.startsWith(newSeqBuffer));
			if (possibleTarget) {
				this.#seqBuffer = newSeqBuffer;
				if (possibleTarget.langSeq === newSeqBuffer) {
					this.makeMovementRequest(possibleTarget, Player.MoveType.NORMAL);
				}
				return;
			}
		}
		// Operator's new `seqBuffer` didn't match anything.
		this.#seqBuffer = "";
		this.status.visualBell();
	}

	/**
	 * Automatically clears the {@link OperatorPlayer#seqBuffer}.
	 *
	 * @override
	 */
	public moveTo(dest: Tile<S>): void {
		// Clear my `seqBuffer` first:
		this.#seqBuffer = "";
		this.prevCoord = this.coord;
		super.moveTo(dest);
	}

	public _notifyWillBecomeCurrent(): void {
		this.status._notifyWillBecomeCurrent(this.game.grid.spotlightElems);
	}

	public get seqBuffer(): _Lang.Seq {
		return this.#seqBuffer;
	}
}
JsUtils.protoNoEnum(OperatorPlayer, ["_notifyWillBecomeCurrent"]);
Object.freeze(OperatorPlayer);
Object.freeze(OperatorPlayer.prototype);