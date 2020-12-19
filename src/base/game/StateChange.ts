import type { Tile } from "floor/Tile";
import type { Player } from "game/player/Player";

// This helps the IDE synchronize renaming.
type HasEventId = {
	eventId?: number | undefined;
};

/**
 */
export namespace StateChange {
	/**
	 * This is the agreed upon value that both the server and client
	 * copies of a game should set as the initial value for request id
	 * counters. Remember that a request ID is a property of a player,
	 * whereas an event ID is a property tied to a game.
	 */
	export const INITIAL_PLAYER_REQUEST_ID = 0;

	/**
	 * An immutable Request DTO 📦
	 */
	export interface Req extends HasEventId {
		/**
		 * The requester does not need to set this field. It is only
		 * here for typing purposes to differentiate between rejected
		 * and accepted requests when executing responses.
		 */
		readonly eventId?: undefined;

		readonly playerId: Player.Id;

		/**
		 * ### Client Request
		 *
		 * The ID of the last request made by this player that the server
		 * _accepted_. A requester cannot send a new request to
		 * the Game Manager until it has received the Game Manager's
		 * response to the last request it made.
		 *
		 * ### Server Response
		 *
		 * If the server accepts the request, it must broadcast a response
		 * with this field set to the incremented value.
		 *
		 * If it rejects this request, it must directly acknowledge its
		 * receipt of the request (no need to broadcast to all clients)
		 * with this field unchanged.
		 *
		 * ### Things that should never happen
		 *
		 * If the Game Manager receives a request with a value in
		 * this field lower than the one it set in its last response to the
		 * requester, this would mean that the requester didn't wait for a
		 * response to its previous request, which it is not supposed to do.
		 *
		 * **Note:** If the above requirement is ever changed to allow request
		 * pipelining, this field's spec must change to require _all_ server
		 * responses to have this field set to an incremented value, including
		 * rejects.
		 *
		 * The server should never receive a request with a value higher
		 * than the one it provided in its last response to this requester.
		 */
		readonly playerNow: number;

		readonly moveType: Player.MoveType;

		/**
		 * Where the player wants to move to.
		 */
		readonly dest: Tile.Changes;
	}

	/**
	 * An immutable Response DTO 📦
	 */
	export interface Res extends Readonly<TU.Omit<Req,"eventId">>, HasEventId {
		/**
		 * A positive, unique, integer-valued identifier for an event.
		 */
		readonly eventId: number;

		/**
		 * Tiles other than the tile that the initiating player is moving to.
		 */
		readonly tiles: TU.RoArr<Tile.Changes>;

		/**
		 * Health changes to players.
		 */
		readonly playersHealth: Readonly<Record<Player.Id, Player.Health>>;
	}
}
Object.freeze(StateChange);