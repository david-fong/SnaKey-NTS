import { JsUtils, BaseScreen } from "../BaseScreen";

/** */
export class LearningScreen extends BaseScreen<BaseScreen.Id.LEARNING> {

	/** @override */
	protected _abstractLazyLoad(): void {
		Object.freeze(this); //🧊
	}
}
Object.freeze(LearningScreen);
Object.freeze(LearningScreen.prototype);