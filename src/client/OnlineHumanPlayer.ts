import { Tile } from "src/base/Tile";
import { ClientGame } from "src/client/ClientGame";
import { Player } from "src/base/player/Player";
import { HumanPlayer } from "src/base/player/HumanPlayer";
import { PlayerMovementEvent } from "src/events/PlayerMovementEvent";


/**
 * 
 * @extends HumanPlayer
 */
export class OnlineHumanPlayer extends HumanPlayer {

    /**
     * @override
     */
    public readonly game: ClientGame;



    public constructor(
        game: ClientGame,
        desc: Player.ConstructorArguments,
    ) {
        super(game, desc);
    }



    /**
     * @override
     */
    public abstractMakeMovementRequest(dest: Tile): void {
        // ServerGame handles with processMoveRequest.
        // Arguments must follow that function signature.
        this.game.socket.emit(
            PlayerMovementEvent.EVENT_NAME,
            new PlayerMovementEvent(
                this.idNumber,
                this.lastAcceptedRequestId,
                dest,
            ),
        );
    }

}
