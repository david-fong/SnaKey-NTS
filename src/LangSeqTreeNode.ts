import { LangChar, LangSeq } from "src/Lang";

/**
 * Shape that must be passed in to the static tree producer. The
 * `Record` type enforces the invariant that {@link LangChar}s are
 * unique in a {@link Lang}. "CSP" is short for {@link LangCharSeqPair}
 */
export type WeightedCspForwardMap = Record<LangChar, {seq: LangSeq, weight: number,}>;

type WeightedLangChar = {
    char: LangChar,
    weight: number,
};

/**
 * No `LangSeqTreeNode`s mapped in the `children` field have an empty
 * `characters` collection (with the exception of the root node). The
 * root node should have a `null` parent, and the empty string as its
 * `sequence` field, with a correspondingly empty `characters` collection.
 * 
 * All non-root nodes have a `sequence` that is prefixed by their parent's
 * `sequence`, and a non-empty `characters` collection.
 * 
 * The enclosing {@link Lang} object has no concept of `LangChar` weights.
 * All it has is the interfaces provided by the hit-count getter methods.
 * TODO: make those getters accomodate char weights.
 */
export class LangSeqTreeNode {

    public readonly sequence:   LangSeq;
    public readonly characters: ReadonlyArray<WeightedLangChar>;

    public readonly parent:     LangSeqTreeNode | null; // `null` for root node.
    public readonly children:   Array<LangSeqTreeNode>; // Empty for leaf nodes.

    public readonly totalWeight: number; // The sum of constituent weights.
    private _numHits: number;

    /**
     * @param forwardDict - 
     * @returns The root node of a new tree map.
     */
    public static CREATE_TREE_MAP(forwardDict: WeightedCspForwardMap): LangSeqTreeNode {
        // Reverse the map:
        const reverseDict: Map<LangSeq, Array<WeightedLangChar>> = new Map();
        for (const char in forwardDict) {
            const seq: LangSeq = forwardDict[char][0];
            const weightedChar: WeightedLangChar = {
                char: char,
                weight: forwardDict[char][1],
            };
            if (reverseDict.has(seq)) {
                reverseDict.get(seq).push(weightedChar);
            } else {
                reverseDict.set(seq, [weightedChar,]);
            }
        }
        // Add mappings in ascending order of sequence length:
        // (this is so that no merging of branches needs to be done)
        const reverseSortedDict: ReadonlyArray<[LangSeq, Array<WeightedLangChar>,]> = Array
            .from(reverseDict)
          //.sort((mappingA, mappingB) => mappingA[0].localeCompare(mappingB[0]))
            .sort((mappingA, mappingB) => mappingA[0].length - mappingB[0].length);

        const rootNode: LangSeqTreeNode = new LangSeqTreeNode(null, "", []);
        for (const mapping of reverseSortedDict) {
            rootNode.addCharMapping(...mapping);
        }
        rootNode.finalize();
        // reset will be called automatically by `Lang`.
        //rootNode.reset();
        return rootNode;
    }

    private constructor(
        parent: LangSeqTreeNode,
        sequence: LangSeq,
        characters: ReadonlyArray<WeightedLangChar>,
    ) {
        this.sequence   = sequence;
        this.parent     = parent;
        this.characters = characters;
        this.children   = [];
    }

    private finalize(): void {
        if (this.parent === null) {
            if (this.sequence.length > 0) {
                throw new Error("Root node's sequence must be the empty string.");
            }
        } else {
            if (!(this.sequence.startsWith(this.parent.sequence))) {
                throw new Error("Child node's sequence must start with that of its parent.");
            }
        }
        Object.freeze(this.characters);
        Object.freeze(this.children);
        this.children.forEach(child => child.finalize());
    }

    public reset(): void {
        this._numHits = 0;
        this.children.forEach(child => child.reset());
    }



    /**
     * 
     * @param seq The typable sequence corrensponding to entries of `chars`.
     * @param chars A collection of unique characters in a written language.
     */
    private addCharMapping(seq: LangSeq, chars: Array<WeightedLangChar>): void {
        if (seq.length === 0) {
            throw new Error("Mapping sequence must not be the empty string.");
        } else if (chars.length === 0) {
            throw new Error("Must not make mapping without written characters.");
        }
        let node: LangSeqTreeNode;
        let childNode: LangSeqTreeNode = this;
        while (childNode !== undefined) {
            node = childNode;
            childNode = node.children.find(child => seq.startsWith(child.sequence));
        }
        if (node.sequence === seq) {
            throw new Error(`Mappings for all written-characters with a common`
                + `corresponding typable-sequence should be registered together,`
                + `but an existing mapping for the sequence \"${seq}\" was found.`
            );
        }
        node.children.push(new LangSeqTreeNode(node, seq, chars));
    }



    /**
     * Incrementing the hit-count makes this node less likely to be
     * used for a shuffle-in. Shuffle-in option searching is easy to
     * taking the viewpoint of leaf-nodes, so this implementation is
     * geared toward indicating hit-count through leaf-nodes, hence
     * the bubble-down of hit-count incrementation.
     */
    public incrementNumHits(): void {
        if (this.parent === null) {
            throw new Error("Should never hit on the root.");
        }
        // TODO: calculate number based on LangChar instance weight?
        const amount: number = 1;
        this.recursiveIncrementNumHits(amount);
    }

    private recursiveIncrementNumHits(amount: number): void {
        this._numHits += amount;
        this.children.forEach(child => child.recursiveIncrementNumHits(amount));
    }

    public get tricklingHitCount(): number {
        return this._numHits;
    }

    /**
     * Do not call this on a root node.
     * 
     * @returns How many hits were made on this node since the last reset.
     */
    public get personalHitCount(): number {
        return this._numHits - this.parent._numHits;
    }

    public andNonRootParents(): Array<LangSeqTreeNode> {
        const upstreamNodes: Array<LangSeqTreeNode> = [];

        let node: LangSeqTreeNode = this;
        while (node.parent !== null) {
            upstreamNodes.push(node);
            node = node.parent;
        }
        return upstreamNodes;
    }

    public getLeafNodes(): Array<LangSeqTreeNode> {
        const leafNodes: Array<LangSeqTreeNode> = [];
        this.recursiveGetLeafNodes(leafNodes);
        return leafNodes;
    }
    private recursiveGetLeafNodes(leafNodes: Array<LangSeqTreeNode>): void {
        if (this.children.length === 0) {
            leafNodes.push(this);
        } else {
            this.children.forEach(child => child.recursiveGetLeafNodes(leafNodes));
        }
    }

}
