"use strict";

import { Token } from "./token";
import { Node } from "./node";
import { SourceCodeStore } from "../service/SourceCodeStore";

export interface MicroTemplateEvaluateOptions {
    parent?: any;
    expressionStart?: MicroTemplateExpressionStart;
    expressionEnd?: MicroTemplateExpressionEnd;
    code?: string;
}

/**
 * The template tag that is evaluated as script.
 */
export class MicroTemplateEvaluate extends Node {
    expressionStart: MicroTemplateExpressionStart | undefined;
    expressionEnd: MicroTemplateExpressionEnd | undefined;
    code: string | undefined;
    type = "MicroTemplateEvaluate";

    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(
        startIndex: number,
        endIndex: number,
        sourceCodeStore: SourceCodeStore,
        optProps: MicroTemplateEvaluateOptions
    ) {
        super("MicroTemplateEvaluate", startIndex, endIndex, sourceCodeStore, optProps);
        this.expressionStart = optProps && optProps.expressionStart;
        this.expressionEnd = optProps && optProps.expressionEnd;
        this.code = optProps && optProps.code;
    }

    // expressionStart: MicroTemplateExpressionStart
    // expressionEnd: MicroTemplateExpressionEnd
}

export interface MicroTemplateInterpolateOptions extends MicroTemplateEvaluateOptions {}

/**
 * The template tag that is interpolate as template.
 */
export class MicroTemplateInterpolate extends Node {
    expressionStart: MicroTemplateExpressionStart | undefined;
    expressionEnd: MicroTemplateExpressionEnd | undefined;
    code: any | undefined;
    type = "MicroTemplateInterpolate";

    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(
        startIndex: number,
        endIndex: number,
        sourceCodeStore: SourceCodeStore,
        optProps: MicroTemplateInterpolateOptions
    ) {
        super("MicroTemplateInterpolate", startIndex, endIndex, sourceCodeStore, optProps);
        this.expressionStart = optProps && optProps.expressionStart;
        this.expressionEnd = optProps && optProps.expressionEnd;
        this.code = optProps && optProps.code;
    }

    // expressionStart: MicroTemplateExpressionStart
    // expressionEnd: MicroTemplateExpressionEnd
}

export interface MicroTemplateEscapeOptions extends MicroTemplateEvaluateOptions {}

/**
 * The template tag that is escapes to interpolate as template.
 */
export class MicroTemplateEscape extends Node {
    expressionStart: MicroTemplateExpressionStart | undefined;
    expressionEnd: MicroTemplateExpressionEnd | undefined;
    code: string | undefined;
    type = "MicroTemplateEscape";

    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(
        startIndex: number,
        endIndex: number,
        sourceCodeStore: SourceCodeStore,
        optProps: MicroTemplateEscapeOptions
    ) {
        super("MicroTemplateEscape", startIndex, endIndex, sourceCodeStore, optProps);
        this.expressionStart = optProps && optProps.expressionStart;
        this.expressionEnd = optProps && optProps.expressionEnd;
        this.code = optProps && optProps.code;
    }

    // expressionStart: MicroTemplateExpressionStart
    // expressionEnd: MicroTemplateExpressionEnd
}

/**
 * The start tag of the template tag.
 */
export class MicroTemplateExpressionStart extends Token {
    chars: string;

    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex: number, endIndex: number, sourceCodeStore: SourceCodeStore, optProps: object) {
        super("MicroTemplateExpressionStart", startIndex, endIndex, sourceCodeStore, optProps);
        this.chars = this.value;
    }
}

/**
 * The end tag of the template tag.
 */
export class MicroTemplateExpressionEnd extends Token {
    chars: string;

    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(startIndex: number, endIndex: number, sourceCodeStore: SourceCodeStore, optProps: object) {
        super("MicroTemplateExpressionEnd", startIndex, endIndex, sourceCodeStore, optProps);
        this.chars = this.value;
    }
}
