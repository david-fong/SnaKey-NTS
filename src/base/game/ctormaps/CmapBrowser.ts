import { VisibleGrid } from "floor/VisibleGrid";
import { Euclid2VisibleGrid } from "floor/impl/Euclid2";
import { BeehiveVisibleGrid } from "floor/impl/Beehive";

/**
 */
export default (): void => {
    // Visible Grid Implementation Registry:
    const VGr = VisibleGrid;
    // @ts-expect-error : RO=
    VGr._Constructors
    = Object.freeze<typeof VGr._Constructors>({
        [ "EUCLID2" ]: Euclid2VisibleGrid,
        [ "BEEHIVE" ]: BeehiveVisibleGrid,
    });
    Object.freeze(VGr);
    // This is just an interface. There is no instance prototype to freeze.
};