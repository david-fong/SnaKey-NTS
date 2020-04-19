import { OmHooks }          from "../browser/OmHooks";
import { Coord }            from "floor/Tile";
import { BalancingScheme }  from "lang/LangSeqTreeNode";
import { OfflineGame }      from "./OfflineGame";
import { PostInit }         from "game/PostInit";

PostInit();

// TODO.design override ctor args for each impl, and make it so they adapt input to pass to super ctor.
// TODO.build this has been set to `var` for testing purposes. It should be `const` in production.
export const game = new OfflineGame<Coord.System.EUCLID2>({
    coordSys: Coord.System.EUCLID2,
    gridDimensions: {
        height: 21,
        width:  21,
    },
    gridHtmlIdHook: OmHooks.Grid.Id.GRID,
    averageFreeHealthPerTile: 1.0 / 70.0,
    langBalancingScheme: BalancingScheme.WEIGHT,
    languageName: "engl-low",
    operatorIndex: 0,
    playerDescs: [
        {
            familyId: "HUMAN",
            teamId: 0,
            username: "hello world",
            socketId: "todo", // TODO.impl maybe make some static method to assign unique values based on operator class?
            noCheckGameOver: false,
        },
    ],
});
game.reset();

// Print some things:
console.log(game);
console.log(game.lang.simpleView());

game.statusBecomePlaying();

// window.onerror = (msg, url, lineNum) => {
//     alert(`Error message: ${msg}\nURL: ${url}\nLine Number: ${lineNum}`);
//     return true;
// }
