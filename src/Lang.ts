
/**
 * An atomic unit in a written language that constitutes a single
 * character.
 */
type LangChar = string;

/**
 * Should be typable on a generic keyboard, and should not contain any
 * white-space-type characters.
 */
type LangSeq = string;

/**
 * A key-value pair containing a `LangChar` and its corresponding
 * `LangSeq`.
 */
class LangCharSeqPair {
    public constructor(
        public readonly char: LangChar,
        public readonly seq:  LangSeq,
    ) {}
}



/**
 * A `Lang`(uage) is a map from a collection of unique characters to
 * corresponding key-sequences. the key-sequences may be non-unique.
 * (try searching up "Chinese riddle where each syllable is pronounced
 * 'shi'"). A character may have more than one corresponding sequence,
 * representing alternate "spellings" (ways of typing it).
 * 
 * In the use-case of this game, it is more helpful to think in the
 * reverse direction: As a map from typable-key-sequences to sets of
 * corresponding unique characters (no character is mapped by multiple
 * key-sequences). This game does not require support for retreiving
 * the `LangSeq` corresponding to a `LangChar`.
 */
class Lang {

    /**
     * The name of this language.
     */
    public readonly name: string;

    /**
     * A reverse map from `LangSeq`s to `LangChar`s.
     */
    private readonly dict: LangSeqTreeNode;

    protected constructor(name: string, forwardDict: Record<LangChar, LangSeq>) {
        this.dict = LangSeqTreeNode.CREATE_TREE_MAP(forwardDict);
        // Write JSON data to my `dict`:
    }

    public reset(): void {
        this.dict.reset();
    }



    /**
     * Return a random `LangChar` in this `Lang` whose corresponding
     * `LangSeq` is not a prefix of any `LangSeq` in `avoid`, and vice
     * versa. They may share a common prefix as long as they are both
     * longer in length than the shared prefix, and they are not equal
     * to one another.
     * 
     * This method is called to shuffle the `LangChar` / `LangSeq` pair
     * at some `Tile` `A`. `avoid` should contain the `LangSeq`s from
     * all `Tile`s reachable by a human `Player` occupying a `Tile` `B`
     * from which they can also reach `A`
     * 
     * In order for this `Lang` to satisfy these constraints, it must
     * be true that the number of leaf nodes in this tree-structure must
     * `avoid` argument.
     * 
     * In this implementation, a human `Player` can only reach a `Tile`
     * whose `pos` has an `infNorm` of `1` from that of the `Tile` they
     * are currently occupying. That is, `avoid` contains `LangSeq`s
     * from all `Tile`s with an `infNorm` <= `2` from the `Tile` to
     * shuffle (not including itself). This means that here, the size of
     * `avoid` is always bounded by `(2*2 + 1)^2 - 1 == 24`. Using the
     * English alphabet (26 typable-letters), this requirement is met
     * by a hair.
     * 
     * @param avoid A collection of `LangSeq`s to avoid conflicts with
     *          when choosing a `LangChar` to return.
     */
    public getNonConflictingChar(avoid: Array<LangSeq>): LangCharSeqPair {
        // first sort in ascending order of length:
        avoid = avoid.sort((seqA, seqB) => seqA.length - seqB.length);
        let node: LangSeqTreeNode = this.dict;
        const whitelist: Array<LangSeqTreeNode> = [];

        // Wording the spec closer to this implementation: We must find
        // characters from nodes that are not descendants or ancestors
        // of nodes for sequences to avoid.

        // Whitelist includes level-1 nodes (single keyboard-letter) that
        // are not the first letter of any sequences to avoid.

        node.incrementNumHits();
        return null;
    }

}
