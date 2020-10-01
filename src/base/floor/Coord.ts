import type { Euclid2 } from "./impl/Euclid2";
import type { Beehive } from "./impl/Beehive";


/**
 * Done manually so that grid implementations can use their coordinate
 * implementation's non-standard methods safely on coordinates retrieved
 * from Grid tiles.
 */
export interface Coord {
    [Coord.System.EUCLID2]: Euclid2.Coord;
    [Coord.System.BEEHIVE]: Beehive.Coord;
}

/**
 *
 */
export namespace Coord {

    export const enum System {
        EUCLID2 = "EUCLID2",
        BEEHIVE = "BEEHIVE",
    }

    export interface Bare {
        [System.EUCLID2]: Euclid2.Coord.Bare /* & Coord[System.EUCLID2] */;
        [System.BEEHIVE]: Beehive.Coord.Bare /* & Coord[System.BEEHIVE] */;
    }

    // ==============================================================
    // Note: The below exports do not require any modifications with
    // the additions of new coordinate systems.
    // ==============================================================

    /**
     * Immutable. All `Coord` objects returned by operations are new objects.
     *
     * @template S - An enum identifying the unique implementation class.
     */
    export interface Abstract<S extends Coord.System> {
        /**
         * This does nothing. Subclass constructors should copy in the
         * fields specified by `desc` and end with a self-freezing call.
         *
         * @param desc - Untouched. Here as a reminder of what is needed.
         */
        // new(desc: Coord.Bare[S]): Abstract<S>;

        equals(other: Bare[Coord.System]): boolean;
    }

    export namespace Abstract {
        /**
         * As opposed, for example, to grid systems operating on the
         * basis of graph connections that cannot be represented by
         * lattices.
         */
        export interface Mathy<S extends Coord.System> extends Coord.Abstract<S> {
            /**
             * For discrete-coordinate-based systems, this is used to round
             * non-discrete coordinates to discrete ones.
             */
            round(): Coord[S];

            add(other: Bare[S]): Coord[S];
            sub(other: Bare[S]): Coord[S];
            mul(scalar: number): Coord[S];
        }
    }
    // Object.freeze(Abstract);
    // Object.freeze(Abstract.prototype);

}
Object.freeze(Coord);
// No prototype to freeze.