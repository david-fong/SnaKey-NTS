import { TopLevel } from "client/TopLevel";
import { Group, JoinerEv, GameEv } from "defs/OnlineDefs";

import { JsUtils, OmHooks, BaseScreen, StorageHooks } from "../../BaseScreen";
type SID = BaseScreen.Id.GROUP_JOINER;
import style from "./style.m.css";

/** */
export class GroupJoinerScreen extends BaseScreen<SID> {

	#state: GroupJoinerScreen.State;
	private readonly in: Readonly<{
		serverUrl:  HTMLInputElement;
		groupName:  HTMLInputElement;
		passphrase: HTMLInputElement;
	}>;
	private readonly groupNameDataList = JsUtils.html("datalist", [], { id: OmHooks.ID.CURRENT_HOST_GROUPS });
	#isInGroup: boolean = false;
	#isHost: boolean = false; public get isHost(): boolean { return this.#isHost; }

	/** Throws an error if called before this screen is lazy-loaded. */
	public get loginInfo(): Readonly<{ name?: Group.Name, passphrase?: Group.Passphrase }> {
		return Object.freeze({
			name: this.in.groupName.value,
			pwd: this.in.passphrase.value,
		});
	}
	readonly #wsMessageCb: (ev: MessageEvent<string>) => void;
	private get ws(): WebSocket {
		return this.top.webSocket!;
	}

	/** @override */
	protected _lazyLoad(): void {
		this.baseElem.classList.add(
			OmHooks.General.Class.CENTER_CONTENTS,
			style["this"],
		);
		const contentWrapper = this._initFormContents();
		this.baseElem.appendChild(this.groupNameDataList);

		this.nav.prev.classList.add(OmHooks.General.Class.INPUT_GROUP_ITEM);
		this.nav.next.classList.add(OmHooks.General.Class.INPUT_GROUP_ITEM);
		contentWrapper.appendChild(this.nav.prev);
		contentWrapper.appendChild(this.nav.next);

		// @ts-expect-error : RO=
		this.#wsMessageCb = (ev: MessageEvent<string>) => {
			const [evName, ...args] = JSON.parse(ev.data) as [string, ...any[]];
			switch (evName) {
				case  JoinerEv.Create.NAME: this._onCreateResponse(args[0]); break;
				case   JoinerEv.Exist.NAME: this._onNotifyGroupExist(args[0]); break;
				case JoinerEv.TryJoin.NAME: this._setFormState(State.IN_GROUP); break;
				default: break;
			}
		};
		const huiSubmit = this._initServerUrlCbs();
		this._initGroupNameCbs(huiSubmit);
		this._initPassphraseCbs();
		Object.seal(this); //🧊

		this.nav.next.onclick = (ev) => {
			// No validation needed. The next button is only enabled if inputs are valid.
			this.requestGoToScreen(BaseScreen.Id.GROUP_LOBBY, {});
		};
		this._setFormState(State.CHOOSING_SERVER);
		this.baseElem.appendChild(contentWrapper);
	}

	/** @override */
	public getRecommendedFocusElem(): HTMLElement {
		if (this.ws === undefined) {
			return this.in.serverUrl;
		} else {
			return this.in.groupName;
		}
	}

	public get state(): State {
		return this.#state;
	}
	/** Doesn't touch sockets. */
	private _setFormState(newState: State): void {
		if (this.state === newState) return; //⚡ (No other short circuits here please)

		this.in.passphrase.disabled = true;
		if (newState === State.IN_GROUP) {
			if (this.state !== State.CHOOSING_GROUP) {
				throw new Error("never"); // Illegal state transition.
			}
			this.nav.next.disabled = false;
			this.nav.next.focus();

		} else {
			this.nav.next.disabled = true;
			this.in.passphrase.value = "";

			if (newState === State.CHOOSING_SERVER) {
				this.in.groupName.disabled  = true;
				this.in.groupName.value     = "";
				// Fun fact on an alternative for clearing children: https://stackoverflow.com/a/22966637/11107541
				this.groupNameDataList.textContent = "";
				this.in.serverUrl.focus();

			} else if (newState === State.CHOOSING_GROUP) {
				this.in.groupName.disabled  = false;
				this.in.passphrase.disabled = false;
				this.#isHost = false;
				this.in.groupName.focus();
			}
		}
		this.#state = newState;
	}

	/** */
	private _initServerUrlCbs(): VoidFunction {
		const top = this.top;
		const input = this.in.serverUrl;
		const submitInput = (): void => {
			if (!input.value || !input.validity.valid) return; //⚡

			// Minor cleaning: default the protocol and only use the origin:
			// if (!input.value.startsWith(SkServer.PROTOCOL)) {
			//     input.value = new window.URL(SkServer.PROTOCOL + input.value).origin;
			// }

			// Short-circuit when no change has occurred:
			const gameServerUrl = new window.URL(input.value);
			if (this.ws !== undefined && new URL(this.ws.url).hostname === gameServerUrl.hostname) {
				if (this.#isInGroup) {
					this._setFormState(State.CHOOSING_GROUP);
				} else {
					// Impatient client is spamming.
				}
				return;
			}
			this.top.setWebSocket(new WebSocket(input.value));
			this.ws.addEventListener("open", (ev) => {
				this._setFormState(State.CHOOSING_GROUP);
			});
			this.ws.addEventListener("message", this.#wsMessageCb);
			this.ws.addEventListener("close", (ev) => {
				this.top.setWebSocket(undefined);
				this._setFormState(State.CHOOSING_SERVER);
				top.toast("You disconnected you from the server.");
				if (this.top.currentScreen !== this) {
					// TODO.impl ^ a more specific condition.
					this.requestGoToScreen(BaseScreen.Id.GROUP_JOINER, {});
				}
			}, { once: true });
		};
		// Link handler to events:
		input.addEventListener("input", (ev) => this._setFormState(State.CHOOSING_SERVER));
		input.addEventListener("keydown", (ev) => { if (ev.isTrusted && ev.key === "Enter") {
			submitInput();
		}});
		input.addEventListener("paste", (ev) => {
			if (ev.isTrusted) window.setTimeout(() => submitInput(), 0);
		});
		input.addEventListener("change", (ev) => {
			if (ev.isTrusted) submitInput();
		});
		return submitInput;
	}
	/** */
	private _onCreateResponse(accepted: JoinerEv.Create.Res): void {
		if (accepted) {
			this.top.toast(`server accepted request to create new group \"${this.in.groupName.value}\".`);
			this.top.toast("connecting to new group...");
			this._attemptToJoinExistingGroup();
			return;
		} else {
			this.#isInGroup = true;
			this.top.toast(`The server rejected your request to`
			+ ` create a new group \"${this.in.groupName.value}\".`);
			return;
		}
	}
	/** */
	private _onNotifyGroupExist(changes: JoinerEv.Exist.Sse): void {
		type OptEl = HTMLOptionElement;
		const mkOpt = (groupName: Group.Name): OptEl => {
			// If we didn't know about this group yet, create a new
			// option for it (Insert into list in alphabetical order):
			const newOpt = JsUtils.html("option", [], { value: groupName });
			for (const otherOpt of dataListArr) {
				if (newOpt.value.localeCompare(otherOpt.value) < 0) {
					this.groupNameDataList.insertBefore(newOpt, otherOpt);
					break;
				}
			}
			if (!newOpt.parentElement) {
				this.groupNameDataList.appendChild(newOpt);
			}
			return newOpt;
		};
		const dataListArr = Array.from(this.groupNameDataList.children) as OptEl[];
		Object.freeze(Object.entries(changes)).forEach(([groupName, status]) => {
			const opt = dataListArr.find((opt: OptEl) => opt.value === groupName) ?? mkOpt(groupName);
			switch (status) {
				case JoinerEv.Exist.Status.IN_LOBBY: opt.textContent = "In Lobby"; break;
				case JoinerEv.Exist.Status.IN_GAME:  opt.textContent = "In Game"; break;
				case JoinerEv.Exist.Status.DELETE:   opt.remove(); break;
			}
		});
	}

	/** */
	private _initGroupNameCbs(serverUrlInputSubmit: VoidFunction): void {
		const input = this.in.groupName;
		const submitInput = (): void => {
			if (!input.value || !input.validity.valid) return;
			if (this.state === State.IN_GROUP) {
				this.nav.next.focus();
			} else {
				this.in.passphrase.focus();
			}
		};
		this.in.groupName.addEventListener("input", async (ev) => {
			if (!ev.isTrusted) return;
			if (this.state === State.IN_GROUP) {
				serverUrlInputSubmit();
				// ^This will take us back to the state `CHOOSING_GROUP`.
			}
			this.in.passphrase.value = "";
			this.#isHost = false;
		});
		input.addEventListener("keydown", (ev) => {
			if (ev.isTrusted && ev.key === "Enter") { submitInput(); }
		});
		input.addEventListener("change", (ev) => {
			if (ev.isTrusted) { submitInput(); }
		});
	}

	/** */
	private _initPassphraseCbs(): void {
		const submitInput = async (): Promise<void> => {
			if (!this.in.passphrase.validity.valid) return;
			// Short-circuit when no change has occurred:
			if (this.#isInGroup) {
				this._setFormState(State.IN_GROUP);
			}

			const groupName = this.in.groupName.value;
			const groupExists = (Array.from(this.groupNameDataList.children) as HTMLOptionElement[])
				.some((opt) => opt.value === groupName);
			if (groupExists) {
				this.#isHost = false;
				this._attemptToJoinExistingGroup();
			} else {
				this.#isHost = true;
				this.ws.send(JSON.stringify([
					JoinerEv.Create.NAME,
					<JoinerEv.Create.Req>this.loginInfo,
				]));
			}
		};
		this.in.passphrase.addEventListener("keydown", (ev) => { if (ev.isTrusted && ev.key === "Enter") {
			submitInput();
		}});
	}

	/** */
	private _attemptToJoinExistingGroup(): void {
		const userInfo = StorageHooks.getLastUserInfo();
		this.ws.send(JSON.stringify([JoinerEv.TryJoin.NAME, <JoinerEv.TryJoin.Req>{
			groupName: this.in.groupName.value,
			passphrase: this.in.passphrase.value,
			userInfo,
		}]));
	}

	/** A helper for `_lazyLoad`. Does not hook up event processors. */
	private _initFormContents(): HTMLElement {
		const contentWrapper = JsUtils.html("div"/*"form"*/, [
			OmHooks.General.Class.INPUT_GROUP,
			style["content-wrapper"],
		], {});
		function _mkInput(labelText: string, classStr: string): HTMLInputElement {
			const input = JsUtils.html("input", [OmHooks.General.Class.INPUT_GROUP_ITEM, classStr], {
				type: "text",
				autocomplete: "off",
				spellcheck: false,
			});
			// Label:
			const label = JsUtils.html("label", [], { textContent: labelText });
			label.appendChild(input);
			contentWrapper.appendChild(label);
			return input;
		}
		type InArgs = Partial<HTMLInputElement>;
		// @ts-expect-error : RO=
		this.in = Object.freeze({
			"serverUrl": Object.assign(_mkInput("Server URL", style["server-url"]), <InArgs>{
				type: "url",
				maxLength: 128,
				autocomplete: "on",
				required: true,
			}),
			"groupName": Object.assign(_mkInput("Group Name", style["group-name"]), <InArgs>{
				pattern: Group.Name.REGEXP.source,
				minLength: 1,
				maxLength: Group.Name.MaxLength,
				autocomplete: "on",
				required: true,
			}),
			"passphrase": Object.assign(_mkInput("Group Passphrase", style["passphrase"]), <InArgs>{
				pattern: Group.Passphrase.REGEXP.source,
				maxLength: Group.Passphrase.MaxLength,
			}),
		});
		this.in.groupName.setAttribute("list", OmHooks.ID.CURRENT_HOST_GROUPS);

		{
			this.in.serverUrl.setAttribute("list", OmHooks.ID.PUBLIC_GAME_SERVER_URLS);
			const suggest = TopLevel.SiteServerTypeSuggestedGameServer[this.top.siteServerType];
			if (suggest) {
				const suggestOpt = JsUtils.html("option", [], {
					value: suggest.value,
					textContent: suggest.description,
				});
				const datalist = document.getElementById(OmHooks.ID.PUBLIC_GAME_SERVER_URLS)!;
				datalist.insertAdjacentElement("afterbegin", suggestOpt);
				this.in.serverUrl.value = suggestOpt.value;
			}
		}

		JsUtils.propNoWrite(this as GroupJoinerScreen, "in", "groupNameDataList");
		return contentWrapper;
	}
}
export namespace GroupJoinerScreen {
	export enum State {
		CHOOSING_SERVER = "choosing-server",
		CHOOSING_GROUP  = "choosing-group",
		IN_GROUP        = "in-group",
	};
}
const State = GroupJoinerScreen.State;
type  State = GroupJoinerScreen.State;
Object.freeze(GroupJoinerScreen);
Object.freeze(GroupJoinerScreen.prototype);