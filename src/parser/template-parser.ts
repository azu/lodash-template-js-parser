import {
    MicroTemplateExpressionEnd,
    MicroTemplateInterpolate,
    MicroTemplateExpressionStart,
    MicroTemplateEscape,
    MicroTemplateEvaluate
} from "../ast/micro-template-nodes";
import { SourceCodeStore } from "../service/SourceCodeStore";

/**
 * Get delimiters from the given text and inner text.
 *
 * @param {string} text The hit text.
 * @param {string} innerCode The hit inner text.
 * @returns {Array} The delimiters result.
 */
function getDelimitersFinalMeans(text: string, innerCode: string) {
    const codeStart = text.indexOf(innerCode);
    const codeEnd = codeStart + innerCode.length;
    return [text.slice(0, codeStart), text.slice(codeEnd)];
}

/**
 * Escape RegExp to given string
 * @param {string} string The base string
 * @returns {string} The escape string
 */
function escapeRegExp(string: string) {
    // $&はマッチした部分文字列全体を意味します
    return string.replace(/[.*+?^=!:${}()|[\]/\\]/gu, "\\$&");
}

/**
 * Delimiters setting to RegExp source
 *
 * @param {*} val The delimiter settings.
 * @param {Array} defaultDelimiters The default delimiters.
 * @returns {string} The delimiters RegExp source.
 */
function settingToRegExpInfo(val: string[] | undefined | RegExp, defaultDelimiters: string[]) {
    if (!val) {
        return {
            pattern: `${defaultDelimiters[0]}([\\s\\S]*?)${defaultDelimiters[1]}`,
            getDelimiters: () => defaultDelimiters
        };
    }
    if (Array.isArray(val)) {
        return {
            pattern: `${escapeRegExp(val[0])}([\\s\\S]*?)${escapeRegExp(val[1])}`,
            getDelimiters: () => val
        };
    }

    const source = val instanceof RegExp ? val.source : `${val}`;
    const pattern =
        source.indexOf("([\\s\\S]+?)") >= 0
            ? source.replace("([\\s\\S]+?)", "([\\s\\S]*?)")
            : source.indexOf("([\\S\\s]+?)") >= 0
            ? source.replace("([\\S\\s]+?)", "([\\s\\S]*?)")
            : source;

    let getDelimiters = undefined;
    const delmPattern = pattern.split("([\\s\\S]*?)");
    if (delmPattern.length === 2) {
        const re = new RegExp(delmPattern.map(s => `(${s})`).join("([\\s\\S]*?)"), "u");
        getDelimiters = (text: string, innerCode: string) => {
            const r = text.match(re);
            if (r) {
                return [r[1], r[3]];
            }
            return getDelimitersFinalMeans(text, innerCode);
        };
    } else {
        getDelimiters = getDelimitersFinalMeans;
    }
    return {
        pattern,
        getDelimiters
    };
}

/**
 * Generate micro template tokens iterator
 *
 * @param {string} code The template to parse.
 * @param {object} options The parser options.
 * @param {SourceCodeStore} sourceCodeStore The sourceCodeStore.
 * @returns {object} The parsing result.
 */
function* genMicroTemplateTokens(code: string, options: parseTemplateOptions, sourceCodeStore: SourceCodeStore): Generator<(MicroTemplateEvaluate | MicroTemplateInterpolate | MicroTemplateEscape)> {
    const templateSettings = options.templateSettings || {};
    const evaluateInfo = settingToRegExpInfo(templateSettings.evaluate, ["<%", "%>"]);
    const interpolateInfo = settingToRegExpInfo(templateSettings.interpolate, ["<%=", "%>"]);
    const escapeInfo = settingToRegExpInfo(templateSettings.escape, ["<%-", "%>"]);
    const typeGetDelimiters = {
        MicroTemplateEscape: escapeInfo.getDelimiters,
        MicroTemplateInterpolate: interpolateInfo.getDelimiters,
        MicroTemplateEvaluate: evaluateInfo.getDelimiters
    };

    const re = new RegExp([escapeInfo.pattern, interpolateInfo.pattern, evaluateInfo.pattern].join("|"), "gu");

    let r = undefined;
    while ((r = re.exec(code)) !== null) {
        const text = r[0];
        const innerCode = r[1] !== undefined ? r[1] : r[2] !== undefined ? r[2] : r[3];
        const start = r.index;
        const end = re.lastIndex;

        const Type =
            r[1] !== undefined
                ? MicroTemplateEscape
                : r[2] !== undefined
                ? MicroTemplateInterpolate
                : MicroTemplateEvaluate;
        const node = new Type(start, end, sourceCodeStore, {
            code: innerCode
        });

        // @ts-ignore
        const delimiters = typeGetDelimiters[node.type](text, innerCode);
        node.expressionStart = new MicroTemplateExpressionStart(start, start + delimiters[0].length, sourceCodeStore, {
            parent: node
        });
        node.expressionEnd = new MicroTemplateExpressionEnd(end - delimiters[1].length, end, sourceCodeStore, {
            parent: node
        });
        yield node;
    }
}

/**
 * Replace to whitespaces
 * @param {string} s string
 * @returns {string} whitespaces
 */
function replaceToWhitespace(s: string) {
    return s.replace(/[\S\u180E]/gu, " ");
}

export interface parseTemplateOptions {
    // lodash.template options
    templateSettings?: {
        // pair for parsing
        escape?: [string, string];
        evaluate?: [string, string];
        interpolate?: [string, string];
    };
}

/**
 * Parse the template and return { script, template } object.
 * @param code The template to parse.
 * @param parserOptions The parser options.
 * @returns The parsing result object.
 */
export function parseTemplate(code: string, parserOptions: parseTemplateOptions) {
    const sourceCodeStore = new SourceCodeStore(code);

    // 文字位置をそのままにしてscriptとhtmlを分解
    let script = "";
    let pre = 0;
    let template = "";
    const microTemplateTokens: (MicroTemplateEvaluate | MicroTemplateInterpolate | MicroTemplateEscape)[] = []; // TemplateTokens
    for (const token of genMicroTemplateTokens(code, parserOptions, sourceCodeStore)) {
        microTemplateTokens.push(token);
        const start = token.start;
        const end = token.end;

        const part = code.slice(pre, start);
        script += replaceToWhitespace(part);
        template += part;

        const scriptBeforeBase = token.expressionStart!.chars;
        const scriptAfterBase = token.expressionEnd!.chars;
        const scriptBefore = replaceToWhitespace(scriptBeforeBase);
        let scriptAfter = replaceToWhitespace(scriptAfterBase);
        if (token.type !== "MicroTemplateEvaluate") {
            scriptAfter = scriptAfter.replace(/ /u, ";");
        }
        script += `${scriptBefore}${token.code}${scriptAfter}`;
        template += replaceToWhitespace(code.slice(start, end));
        pre = end;
    }
    const part = code.slice(pre, code.length);
    script += replaceToWhitespace(part);
    template += part;
    return {
        tokens: microTemplateTokens,
        script: script,
        template: template
    };
}
