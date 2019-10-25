"use strict";

import { HasLocation } from "./locations";
import { SourceCodeStore } from "../service/SourceCodeStore";

/**
 * The node
 */
export class Node extends HasLocation {
    public type: string;
    public parent: any | undefined;

    /**
     * constructor.
     * @param  {string} type The token type.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(
        type: string,
        startIndex: number,
        endIndex: number,
        sourceCodeStore: SourceCodeStore,
        optProps: { parent?: any }
    ) {
        super(startIndex, endIndex, sourceCodeStore);
        this.type = type;
        this.parent = optProps && optProps.parent;
    }
}
