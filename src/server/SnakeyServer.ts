import os       = require("os");
import path     = require("path");
import http     = require("http");
import express  = require("express");
import io       = require("socket.io");
import type * as net from "net";

import { SnakeyServer as __SnakeyServer } from "defs/TypeDefs";
import { GroupSession } from "./GroupSession";


/**
 * Creates and performs management operations on {@link ServerGame}s.
 */
export class SnakeyServer extends __SnakeyServer {

    protected readonly http: http.Server;
    protected readonly app:  express.Application;
    protected readonly io:   io.Server;

    /**
     * This is only used to maintain object references so that they are
     * not garbage-collection eligible. Keys are Socket.IO namespace
     * names corresponding the the mapped value.
     */
    private readonly allGroupSessions: Map<string, GroupSession>;

    /**
     *
     * @param host - The hostname of the server. This may be an IP address.
     * @param port - The port number on which to host the Server.
     *          Defaults to {@link Defs.SERVER_PORT}.
     */
    public constructor(
        port: number = SnakeyServer.DEFAULT_PORT,
        host: string | undefined = undefined,
    ) {
        super();
        this.app    = express();
        this.http   = http.createServer({}, this.app);
        this.io     = io(this.http, {
            serveClient: false,
            // Do not server socket.io-client. It is bundled into a
            // client chunk on purpose so that a client can choose to
            // fetch all static page resources from another server,
            // namely, GitHub Pages, in order to reduce serving load
            // on a locally hosted SnakeyServer.
        });

        // At runtime, __dirname resolves to ":/dist/server/"
        const PROJECT_ROOT = path.resolve(__dirname, "../..");
        this.app.disable("x-powered-by");
        this.app.get("/", (req, res) => {
            res.sendFile(path.resolve(PROJECT_ROOT, "index.html"));
        });
        this.app.use("/dist",   express.static(path.resolve(PROJECT_ROOT, "dist")));
        this.app.use("/assets", express.static(path.resolve(PROJECT_ROOT, "assets")));

        this.http.listen(<net.ListenOptions>{ port, host, }, (): void => {
            const info = <net.AddressInfo>this.http.address();
            console.log(`Server mounted to: \`${info.family}${info.address}${info.port}\`.`);
        });

        this.io.of(SnakeyServer.Nsps.HOST_REGISTRATION)
            .on("connection", this.onHostsConnection.bind(this));
    }

    /**
     * All connections to the root are assumed to be for the purpose
     * of starting a new session for games.
     *
     * @param socket - The socket from the game host.
     */
    protected onHostsConnection(socket: io.Socket): void {
        socket.on(GroupSession.CtorArgs.EVENT_NAME, (desc: GroupSession.CtorArgs): void => {
            const groupNspsName = this.createUniqueSessionName(desc.groupName);
            if (!(groupNspsName)) {
                // The name was not accepted. Notify the client:
                socket.emit(
                    GroupSession.CtorArgs.EVENT_NAME,
                    new GroupSession.CtorArgs(""),
                );
                return;
            }
            // Create a new group session:
            desc.groupName = groupNspsName;
            this.allGroupSessions.set(
                groupNspsName,
                new GroupSession(
                    this.io.of(groupNspsName),
                    (): void => {
                        // Once this reference is deleted, the object
                        // is elegible for garbage-collection.
                        this.allGroupSessions.delete(groupNspsName);
                    },
                    desc.initialTtl,
                ),
            );

            // Notify the host of the namespace created for the
            // requested group session so they can connect to it:
            socket.emit(
                GroupSession.CtorArgs.EVENT_NAME,
                desc,
            );
        });
    }

    /**
     * @returns The Socket.IO namespace using the provided `groupName`.
     *
     * @param groupName - A name to give the group. `null` if rejected,
     *      which happens if `groupName` is already taken, or if it
     *      does not match the required regular expression.
     */
    protected createUniqueSessionName(groupName: GroupSession.SessionName): string | undefined {
        if (!(GroupSession.SessionName.REGEXP.test(groupName))) {
            return undefined;
        }
        const sessionName: string = `${SnakeyServer.Nsps.GROUP_PREFIX}/${groupName}`;
        if (this.allGroupSessions.has(sessionName)) {
            return undefined;
        }
        return sessionName;
    }
}
export namespace SnakeyServer {

    /**
     * @returns An array of non-internal IPv4 addresses from any of the
     * local hosts' network interfaces.
     *
     * TODO: change to return a map from each of "public" and "private" to a list of addresses
     * https://en.wikipedia.org/wiki/Private_network
     */
    export const chooseIPv4Address = (): TU.RoArr<string> => {
        return Object.values(os.networkInterfaces()).flat().filter((info) => {
            return !(info.internal) && info.family === "IPv4";
        }).map((info) => info.address);
    };
}
Object.freeze(SnakeyServer);
Object.freeze(SnakeyServer.prototype);
