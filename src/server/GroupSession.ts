import * as io from "socket.io";

import { Grid } from "src/base/Game";
import { ServerGame } from "src/server/ServerGame";
import { Player } from "src/base/player/Player";

export { ServerGame } from "src/server/ServerGame";


/**
 * Manages communication between the server, and clients who play in
 * the same game together.
 * 
 * There is no explicit linking back to the {@link Server}. The only
 * such linkage is from our {@link GroupSession#namespace} to its
 * `io.Server`.
 */
export class GroupSession {

    public readonly namespace: io.Namespace;
    protected currentGame: ServerGame | undefined;
    protected sessionHost: io.Socket;

    private readonly initialTtlTimeout: NodeJS.Timeout;
    private readonly deleteExternalRefs: VoidFunction;


    /**
     * 
     * @param namespace - 
     * @param deleteExternalRefs - A function that- when called- deletes
     *      all external references to this newly constructed object
     *      such that it can be garbage collected.
     * @param initialTtl - If no sockets connect to this `GameSession`
     *      in this many seconds, it will close and clean itself up.
     */
    public constructor(
        namespace: io.Namespace,
        deleteExternalRefs: VoidFunction,
        initialTtl: number,
    ) {
        this.namespace   = namespace;
        this.currentGame = undefined;
        this.sessionHost = undefined;

        this.initialTtlTimeout = setTimeout(() => {
            if (Object.entries(this.namespace.connected).length === 0) {
                // If nobody connects to this session in the specified
                // ammount of time, then close the session.
                this.terminate();
            }
        }, (initialTtl * 1000)).unref();
        this.deleteExternalRefs = deleteExternalRefs;

        // Call the connection-event handler:
        this.namespace.on("connection", this.onConnection);
    }

    /**
     * 
     * @param socket - 
     */
    protected onConnection(socket: io.Socket): void {
        console.log("A user has connected.");
        socket.join(GroupSession.RoomNames.MAIN);

        if (Object.entries(this.namespace.connected).length === 0) {
            // Nobody has connected yet.
            // The first socket becomes the session host.
            clearTimeout(this.initialTtlTimeout);
            this.sessionHost = socket;
        }

        socket.on("disconnect", (...args: any[]): void => {
            if (socket === this.sessionHost) {
                // If the host disconnects, end the session.
                // TODO: this seems like a bad decision. What about just broadcasting
                // that the host player has died, and choose another player to become
                // the host?
                this.terminate();
                this.sessionHost = null; // TODO: change this. host should never be null.
            }
        });
    }

    /**
     * - Disconnects each client.
     * - Removes all listeners from this namespace.
     * - Deletes the enclosed Socket.IO namespace from the Server.
     * - Deletes the only external reference so this can be garbage collected.
     */
    protected terminate(): void {
        // TODO: destroy the game?
        const namespace: io.Namespace = this.namespace;
        Object.values(namespace.connected).forEach((socket) => {
            socket.disconnect();
        });
        namespace.removeAllListeners();
        delete namespace.server.nsps[namespace.name];
        (this.deleteExternalRefs)();
    }



    /**
     * Captures the properties of each client player stored with each
     * {@link GroupSession.Socket} and repackages them for passing to
     * the Game constructor, which will in turn pass this information
     * to each client.
     * 
     * @param gridDimensions - 
     * @throws 
     */
    private createGameInstance(gridDimensions: Grid.DimensionDesc): void {
        this.currentGame = new ServerGame(this, {
            gridDimensions,
            operatorIndex: undefined,
            playerDescs: Object.values(this.sockets)
                .map<Player.ConstructorArguments>((socket) => {
                    return {
                        idNumber: undefined,
                        username: socket.username,
                        teamNumbers: Array.from(socket.teamNumbers),
                        socketId: socket.id,
                    };
                }),
        });
    }

    public get sockets(): Record<string, GroupSession.Socket> {
        return this.namespace.sockets;
    }

}



export namespace GroupSession {

    /**
     * An extension of {@link io.Socket}. It is very convenient to tack
     * these fields directly onto the socket objects.
     */
    export type Socket = io.Socket & Partial<{
        username: Player.Username;
        teamNumbers: Set<Player.TeamNumber>;
        updateId: number; // initial value = 0
    }>;

    /**
     * 
     */
    export namespace RoomNames {
        export const MAIN = "main";
    }


    export type SessionName = string;
    export namespace SessionName {
        /**
         * @see Player.Username.REGEXP
         */
        export const REGEXP = Player.Username.REGEXP;
    }


    /**
     * 
     */
    export class CreateEvent {

        public static EVENT_NAME = "group-session-create";

        public static DEFAULT_INITIAL_TTL = 60;

        /**
         * The client should set this to a string to use as a group
         * name. They should try to satisfy {@link SessionName.REGEXP},
         * although that is not manditory.
         * 
         * The Server should respond with this field set either to be
         * a Socket.IO namespace based off the client's request that
         * is open for connecting, or to the empty string to indicate
         * that the request was rejected.
         */
        public groupName: SessionName;

        /**
         * The Server should ignore any value set here by the client.
         * 
         * The Server should respond to the client setting this value
         * to an approximate number of _seconds_ before the created
         * {@link GroupSession} will decide it was abandoned at birth
         * and get cleaned up (if nobody connects to it in that time).
         * 
         * If the request was rejected, the client should ignore any
         * value set here by the Server.
         */
        public initialTtl: number;

        public constructor(
            initialTtl: number = CreateEvent.DEFAULT_INITIAL_TTL
        ) {
            this.initialTtl = initialTtl;
        }
    };

}
