import { Coord } from "floor/Tile";
import type { Player } from "game/player/Player";
import { Game } from "game/Game";

import { OmHooks, SkScreen } from "../SkScreen";
import { _SetupScreen } from "./Setup";


type SID = SkScreen.Id.SETUP_OFFLINE;

/**
 *
 */
export class SetupOfflineScreen extends _SetupScreen<SID> {

    protected _lazyLoad(): void {
        super._lazyLoad();

        this.nav.next.onclick = (ev) => {
            const args = this.parseArgsFromGui();
            this.requestGoToScreen(SkScreen.Id.PLAY_OFFLINE, args);
        };
    }

    protected _abstractOnBeforeEnter(navDir: SkScreen.NavDir, args: SkScreen.EntranceArgs[SID]): Promise<void> {
        return super._abstractOnBeforeEnter(navDir, args);
    }

    protected parseArgsFromGui(): Game.CtorArgs<Game.Type.OFFLINE,Coord.System> {
        type pArgs = Array<Player.CtorArgs.PreIdAssignment>;
        const args = super.parseArgsFromGui();
        // TODO.impl get rid of this placeholder once this screen has inputs for
        // the client to configure their own players.
        (args.playerDescs as pArgs).splice(args.playerDescs.length, 0, {
            isALocalOperator: true,
            familyId:   "HUMAN",
            teamId:     0,
            socketId:   undefined,
            username:   "hello1",
            avatar:     undefined,
            noCheckGameOver: false,
            familyArgs: { },
        }, {
            isALocalOperator: true,
            familyId:   "HUMAN",
            teamId:     1,
            socketId:   undefined,
            username:   "hello2",
            avatar:     undefined,
            noCheckGameOver: false,
            familyArgs: { },
        },);
        return args;
    }
}
export namespace SetupOfflineScreen {
}
Object.freeze(SetupOfflineScreen);
Object.freeze(SetupOfflineScreen.prototype);