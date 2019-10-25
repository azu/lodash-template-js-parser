"use strict";

import { SourceCodeStore } from "../service/SourceCodeStore";

/**
 * Objects which have their location.
 */
export class HasLocation {
    public start: number;
    public end: number;
    private range: number[];
    private _sourceCodeStore: SourceCodeStore;
    private _loc: { start: { line: number; column: number }; end: { line: number; column: number } };
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @returns {void}
     */
    constructor(startIndex: number, endIndex: number, sourceCodeStore: SourceCodeStore) {
        this.range = [startIndex, endIndex];
        this.start = startIndex;
        this.end = endIndex;
        this._sourceCodeStore = sourceCodeStore;
        this._loc = {
            start: sourceCodeStore.getLocFromIndex(startIndex),
            end: sourceCodeStore.getLocFromIndex(endIndex)
        };
    }

    /**
     * Get the source code store
     * @returns {SourceCodeStore} source code store
     */
    get sourceCodeStore() {
        return this._sourceCodeStore;
    }

    /**
     * Get the location info
     * @returns {object} The location info
     */
    get loc() {
        return this._loc;
    }

    /**
     * Get text of range.
     * @returns {string} The text of range.
     */
    getText() {
        return this.sourceCodeStore.text.slice(this.range[0], this.range[1]);
    }
}

module.exports.HasLocation = HasLocation;
