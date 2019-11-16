import { Lang, LangCharSeqPair } from "src/Lang";
import { BalancingScheme } from "src/LangSeqTreeNode";
import { BarePos, Tile } from "src/base/Tile";
import { Grid } from "src/base/Grid";
import { Player, PlayerMovementEvent } from "src/base/Player";
import { ArtificialPlayer } from "src/base/ArtificialPlayer";

export { Grid } from "src/base/Grid";

/**
 * 
 * 
 * This class performs the majority of management over {@link Tile}
 * and {@link Player} objects. As a design choice, players can only join
 * a game before it starts, and actions such as changing the language or
 * difficulty require a restart. These actions that require a restart will
 * all be exposed to operators through a pre-game page. Other such actions
 * include: changing teams.
 * 
 * An overview of subclasses:
 * Both {@link ClientGame} and {@link OfflineGame} use {@link VisualTile}s
 * while {@link ServerGame} uses {@link ServerTile}s. {@link ClientGame}'s
 * record of the state of the game comes completely from {@link ServerGame}.
 * 
 * There are overlaps between what each implementation needs to do:
 * - Offline and Server games maintain and control the master-game-state.
 * - Offline and Client games display the game-state to an operator via browser and HTML.
 * - Client  and Server games use network operations to communicate.
 * 
 * @extends Grid
 */
export abstract class Game extends Grid {

    public lang: Lang;

    /**
     * Does not use the HumanPlayer type annotation. This is to
     * indicate that a `Game` does not explicitly care about the
     * unique properties of a {@link HumanPlayer} over a regular
     * {@link Player}.
     */
    private readonly allHumanPlayers: Array<Player>;

    private readonly allArtifPlayers: Array<ArtificialPlayer>;



    /**
     * TODO: change the player arrays to be constructor arguments. Not
     * sure about the aritifial players. But definitely the human ones.
     * 
     * Does not call reset.
     * 
     * @override
     */
    public constructor(dimensions: { height: number, width?: number, }) {
        super(dimensions);

        // TODO: set default language (must be done before call to reset):
        this.lang = null;

        // TODO: setup allHumanPlayers?
        this.allHumanPlayers = [];
        this.allArtifPlayers = [];
    }

    /**
     * TODO: update this doc as behaviour is added.
     * 
     * Reset the grid and players.
     * 
     * @override {@link Grid#reset}
     */
    public reset(): void {
        super.reset();

        // Reset hit-counters in the current language:
        // This must be done before shuffling so that the previous
        // history of shuffle-ins has no effects on the new pairs.
        this.lang.reset();

        // Shuffle everything:
        this.grid.forEach(row => row.forEach(tile => {
            this.shuffleLangCharSeqAt(tile); // TODO: don't call this. call what it calls?
        }, this), this);

        // TODO: reset and respawn players:
        this.allHumanPlayers.forEach(player => player.reset());
        this.allArtifPlayers.forEach(player => player.reset());

        // TODO: spawn targets:
        // While not necessary, this should be done after players have
        // spawned so targets do not spawn under players.
    }



    /**
     * Helper for {@link Game#processMoveRequest}. Does execute usage
     * of the returned values, which is expected to be done externally.
     * However, this method will nullify the existing values at `tile`.
     * 
     * @param tile - The {@link Tile} to shuffle their {@link LangChar}-
     *          {@link LangSeq} pair for.
     * @returns A {@link LangCharSeqPair} that can be used as a replacement
     *          for that currently being used by `tile`.
     */
    private shuffleLangCharSeqAt(tile: Tile): LangCharSeqPair {
        // Clear values for the target tile so its current (to-be-
        // previous) values don't get unnecessarily avoided.
        tile.setLangCharSeq({ char: null, seq: null, });
        return this.lang.getNonConflictingChar(
            this.getNeighbouringTiles(tile.pos)
                .map(tile => tile.langSeq)
                .filter(seq => seq), // no falsy values.
            this.langBalancingScheme,
        );
    }

    /**
     * Call for a {@link HumanPlayer} whose {@link HumanPlayer#seqBuffer}
     * should be that of the {@link Tile} at `dest`. Reject the request
     * by short-ciruiting if `dest` is occupied.
     * 
     * Should never be called by {@link ClientGame}.
     * 
     * Short-circuits if the player specified by the given id does not
     * exist, or if the requester has not yet received updates for the
     * destination they requested to move to.
     * 
     * @param desc - A descriptor of the request, with fields indicating
     *      the requester's views of critical parts of the game-state
     *      from their copy of the game-state at the time of the request.
     * @returns A descriptor of changes to be made, or `null` if the
     *      request is rejected.
     */
    public processMoveRequest(desc: PlayerMovementEvent): PlayerMovementEvent | null {
        const player = this.getPlayerById(desc.playerId);
        if (player === null) {
            // specified player does not exist.
            return null;
        }
        const dest: Tile = this.getBenchableTileAt(desc.destPos, desc.playerId);
        if (dest.isOccupied() /*|| dest.numTimesOccupied !== desc.destNumTimesOccupied*/) {
            // TODO: we actually need to check the occupancy counter. See Player#moveTo.
            // add docs explaining the reason / adversarial scenaio from Player#moveTo.
            // explain why this may be _slightly_ unfavorable for performance / user experience.
            return null;
        }

        // We are all go. Do it.
        desc.playerNewScore = player.score + dest.scoreValue;
        desc.destNumTimesOccupied = dest.numTimesOccupied + 1,
        desc.newCharSeqPair = this.shuffleLangCharSeqAt(dest);
        this.processMoveExecute(desc);
        return desc;
    }

    /**
     * Update the {@link Game#grid}. Call either at the end of
     * {@link Game#processMoveRequest} if I am a {@link ServerGame} or
     * {@link OfflineGame}, or as an event callback if I am a
     * {@link ClientGame}.
     * 
     * It is essential that for these implementations, this method is
     * not scheduled for later since it is the "write" stage of that
     * critical operation. If I am a {@link ServerGame}, also notify
     * all clients of the movement event.
     * 
     * Updates that are received after others that are more recent and
     * concern the same {@link Tile} are ignored. This is okay since
     * the only thing that matters about a {@link Tile} to the outside
     * world is its last known state.
     * 
     * @param desc - A descriptor for all changes mandated by the
     *      player-movement event.
     */
    public processMoveExecute(desc: PlayerMovementEvent): void {
        const dest: Tile = this.getBenchableTileAt(desc.destPos, desc.playerId);
        this.getPlayerById(desc.playerId).score = desc.playerNewScore;
        if (dest.numTimesOccupied > desc.destNumTimesOccupied) {
            // We have received even more recent updates already.
            // This update arrived out of order. We can ignore it.
            return;
        }
        // The order of these operations is not important.
        this.getPlayerById(desc.playerId).moveTo(dest);
        dest.numTimesOccupied = desc.destNumTimesOccupied;
        dest.setLangCharSeq(desc.newCharSeqPair);
    }



    public getBenchableTileAt(dest: BarePos, playerId: number): Tile {
        return ((Player.BENCH_POS.equals(dest))
            ? this.getPlayerById(playerId).benchTile
            : this.getTileAt(dest)
        );
    }

    // TODO: use new PlayerId type here:
    protected getPlayerById(playerId: number): Player | null {
        const player: Player = ((playerId < 0)
            ? this.allArtifPlayers[(-playerId) - 1]
            : this.allHumanPlayers[( playerId)] // TODO: - 1
        );
        return (player) ? player : null;
    }

    protected get langBalancingScheme(): BalancingScheme {
        return this.settings.langBalancingScheme.selectedValue;
    }

}



/**
 * 
 */
export class GameStateDump {

    public constructor(game: Game) {
        ;
    }
}
