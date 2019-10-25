"use strict";

import { SourceCodeStore } from "../service/SourceCodeStore";

import { HasLocation } from "./locations";

/**
 * The token
 */
export class Token extends HasLocation {
    type: string;
    parent: any | undefined;
    value: string;

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
        this.value = this.getText();
    }
}
