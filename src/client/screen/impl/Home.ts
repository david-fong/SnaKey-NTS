import { OmHooks } from "defs/OmHooks";

import { SkScreen } from "../SkScreen";


/**
 *
 */
export class HomeScreen extends SkScreen<SkScreen.Id.HOME> {

    private readonly navElem: HTMLElement;

    protected __lazyLoad(): void {
        const OMHC = OmHooks.Screen.Impl.Home.Class;
        type  OMHC = typeof OMHC;
        this.baseElem.classList.add(
            OmHooks.General.Class.CENTER_CONTENTS,
            OMHC.SCREEN,
        );
        this.baseElem.setAttribute("aria-label", "Home Page Screen");

        const nav
            = (this.navElem as HTMLElement)
            = document.createElement("div");
        nav.classList.add(OMHC.NAV);
        nav.setAttribute("role", "navigation");
        nav.addEventListener("pointerleave", () => {
            if (document.activeElement?.parentElement === nav) {
                (document.activeElement as HTMLElement).blur();
            }
        });

        // NOTE: Define array entries in order that their
        // buttons should be tabbed through via keyboard.
        (<const>[{
            text:    "Play Offline", // TODO.impl this should go to the game setup screen.
            cssClass: OMHC.NAV_PLAY_OFFLINE,
            screenId: SkScreen.Id.PLAY_OFFLINE,
        },{
            text:    "Join an Online Game",
            cssClass: OMHC.NAV_JOIN_ONLINE,
            screenId: SkScreen.Id.SESH_JOINER,
        },{
            text:    "Host an Online Game",
            cssClass: OMHC.NAV_HOST_ONLINE,
            screenId: SkScreen.Id.HOW_TO_HOST,
        },{
            text:    "Tutorial",
            cssClass: OMHC.NAV_TUTORIAL,
            screenId: SkScreen.Id.HOW_TO_PLAY,
        },{
            text:    "Colour Schemes",
            cssClass: OMHC.NAV_COLOURS,
            screenId: SkScreen.Id.COLOUR_CTRL,
        },])
        .map<Readonly<{
            text: string;
            cssClass: OMHC[keyof OMHC];
            screenId: SkScreen.Id;
        }>>((desc) => Object.freeze(desc))
        .forEach((desc) => {
            const button = document.createElement("button");
            button.onclick = () => {
                // TODO.impl play a health-up sound.
                this.requestGoToScreen(desc.screenId, {});
            };
            addToNav(button, desc);
        });

        (<const>[{
            text:    "Visit Repo",
            cssClass: OMHC.NAV_VIEW_REPO,
            href:     new window.URL("https://github.com/david-fong/SnaKey-NTS"),
        },{
            text:    "Report Issue",
            cssClass: OMHC.NAV_RPT_ISSUE,
            href:     new window.URL("https://github.com/david-fong/SnaKey-NTS/issues"),
        },])
        .map<Readonly<{
            text: string;
            cssClass: OMHC[keyof OMHC];
            href: URL;
        }>>((desc) => Object.freeze(desc))
        .forEach((desc) => {
            const a = document.createElement("a");
            a.href = (desc.href).toString();
            a.referrerPolicy = "strict-origin-when-cross-origin";
            a.target = "_blank";
            addToNav(a, desc);
        });
        function addToNav(elem: HTMLElement, desc: { text: string, cssClass: string; }): void {
            elem.classList.add(
                OmHooks.General.Class.CENTER_CONTENTS,
                desc.cssClass,
            );
            elem.innerText = desc.text;
            elem.addEventListener("pointerenter", () => {
                elem.focus();
                // TODO.impl play a keyboard click sound.
            });
            nav.appendChild(elem);
        }
        this.baseElem.appendChild(nav);
    }
}
Object.freeze(HomeScreen);
Object.freeze(HomeScreen.prototype);
