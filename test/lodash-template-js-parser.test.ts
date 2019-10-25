import * as fs from "fs";
import * as path from "path";
import * as assert from "assert";
import { parseTemplate } from "../src";

const fixturesDir = path.join(__dirname, "fixtures");
describe("Snapshot testing", () => {
    fs.readdirSync(fixturesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(({ name }) => name)
        .filter(caseName => {
            // Ignore .dot directory
            return !caseName.startsWith(".");
        })
        .map(caseName => {
            const fixtureDir = path.join(fixturesDir, caseName);
            const normalizedTestName = caseName.replace(/-/g, " ");
            const actualFilePath = path.join(fixtureDir, "input.txt");
            const optionFilePath = path.join(fixtureDir, "options.js");
            const options = fs.existsSync(optionFilePath) ? require(optionFilePath) : {};
            const actualContent = fs.readFileSync(actualFilePath, "utf-8");
            const expectedFilePath = path.join(fixtureDir, "output.json");
            it(`Test ${normalizedTestName}`, async function() {
                try {
                    const results = parseTemplate(actualContent, options);
                    const normlizedResults = {
                        scripts_: results.script,
                        template: results.template
                    };
                    // Usage: update snapshots
                    // UPDATE_SNAPSHOT=1 npm test
                    if (!fs.existsSync(expectedFilePath) || process.env.UPDATE_SNAPSHOT) {
                        fs.writeFileSync(expectedFilePath, JSON.stringify(normlizedResults, null, 4));
                        return;
                    }
                    // compare input and output

                    const expectedContent = JSON.parse(fs.readFileSync(expectedFilePath, "utf-8"));
                    assert.deepStrictEqual(normlizedResults, expectedContent);
                } catch (error) {
                    if (error instanceof assert.AssertionError) {
                        throw error;
                    }
                    console.error(`Parse Error: ${error.message}
    at ${actualFilePath}:1:1
    at ${expectedFilePath}:1:1
    `);
                    throw error;
                }
            });
        });
});
