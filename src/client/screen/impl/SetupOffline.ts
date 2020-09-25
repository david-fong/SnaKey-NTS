import { OmHooks, SkScreen } from "../SkScreen";
import { _SetupScreen } from "./Setup";


type SID = SkScreen.Id.SETUP_OFFLINE;

/**
 *
 */
export class SetupOfflineScreen extends _SetupScreen<SID> {

    protected _lazyLoad(): void {
        super._lazyLoad();

        this.nextBtn.onclick = (ev) => {
            // TODO.design create ctorArgs from user presets.
            const ctorArgs = Object.assign({}, _SetupScreen.DEFAULT_PRESET);
            (ctorArgs.langId as string) = this.langSel.confirmedOpt.desc.id;
            this.requestGoToScreen(SkScreen.Id.PLAY_OFFLINE, ctorArgs);
        };
    }

    protected _abstractOnBeforeEnter(args: SkScreen.CtorArgs<SID>): Promise<void> {
        return super._abstractOnBeforeEnter(args);
    }
}
export namespace SetupOfflineScreen {
}
Object.freeze(SetupOfflineScreen);
Object.freeze(SetupOfflineScreen.prototype);
