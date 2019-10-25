# lodash-template-js-parser [![Build Status](https://travis-ci.org/azu/lodash-template-js-parser.svg?branch=master)](https://travis-ci.org/azu/lodash-template-js-parser)

A JavaScript parser/splitter for [`lodash.template`](https://lodash.com/docs/#template)

## Features

- It separate JavaScript Code and Template String from `lodash.template` content
    - Preserve same position of JavaScript code as possible

> Lodash template -> JavaScript Code and Template Content.

It help to implement lint tools for JavaScript code in lodash template.

This idea and implementation is based on [ota-meshi/eslint-plugin-lodash-template](https://github.com/ota-meshi/eslint-plugin-lodash-template).

## Motivation

[ota-meshi/eslint-plugin-lodash-template](https://github.com/ota-meshi/eslint-plugin-lodash-template) focus on linting by ESLint, so It includes many features.

I want to get simple parser/splitter for lodash template.
`lodash-template-js-parser` just includes a parser for lodash template, So `lodash-template-js-parser` does not includes JavaScript Parser like espree, babel/parser.

## Install

Install with [npm](https://www.npmjs.com/):

    npm install lodash-template-js-parser

## Usage

```ts
export interface parseTemplateOptions {
    templateSettings?: {
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
export declare function parseTemplate(template: string, parserOptions: parseTemplateOptions): {
    script: string;
    template: string;
};
```

Example:

```js
import { parseTemplate } from "lodash-template-js-parser";
const content = `
const age = 18;
<% if (age < 18) { %>
    <li><%= name %> (age: <%= age %>)</li>
<% } else { %>
    <li>over the age limit!</li>
<% }%>
`;
const { script, template } = parseTemplate(content, {
    templateSettings: {
        interpolate: ["#{", "}"]
    }
});
assert.strictEqual(script, `
               
   if (age < 18) {   
            name ;            age ;   
   } else {   
                                
   }  
`);
assert.strictEqual(template, `
const age = 18;
                     
    <li>            (age:           )</li>
              
    <li>over the age limit!</li>
      
`);
```


## Changelog

See [Releases page](https://github.com/azu/lodash-template-js-parser/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/azu/lodash-template-js-parser/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu

This project is based on [eslint-plugin-lodash-template](https://github.com/ota-meshi/eslint-plugin-lodash-template).

```
MIT License
Copyright (c) 2018 Yosuke Ota
```
