const {
  uriEscape,
  uriComponentEscape,
  linkifyText,
  linkifySentryRef,
} = require("./sentry");
const fc = require("fast-check");

// const process = require("process");
// const cp = require("child_process");
// const path = require("path");

test.each([
  [
    "Fixes FLOW-FE-123",
    "Fixes [FLOW-FE-123](http://url-prefix.com/organizations/formsort/issues/?query=FLOW-FE-123)",
  ],
  [
    "FLOW-FE-12 and FLOW-FE-23",
    "[FLOW-FE-12](http://url-prefix.com/organizations/formsort/issues/?query=FLOW-FE-12) and [FLOW-FE-23](http://url-prefix.com/organizations/formsort/issues/?query=FLOW-FE-23)",
  ],
  [
    "fLoW-Fe-12 and FLOW-BE-12",
    "[FLOW-FE-12](http://url-prefix.com/organizations/formsort/issues/?query=FLOW-FE-12) and [FLOW-BE-12](http://url-prefix.com/organizations/formsort/issues/?query=FLOW-BE-12)",
  ],
  [
    // Typos and weird cAsiNg below is intentional
    "[fLoW-Fe-12](http://url-prefix.com/organizations/formsort/issues/?query=FlOW-FE-13) and FLOW-BE-12",
    "[fLoW-Fe-12](http://url-prefix.com/organizations/formsort/issues/?query=FlOW-FE-13) and [FLOW-BE-12](http://url-prefix.com/organizations/formsort/issues/?query=FLOW-BE-12)",
  ],
  // Invalid project slug
  ["Fixes STUDIO-FE-123", "Fixes STUDIO-FE-123"],
  ["", ""],
  [null, null],
])("linkifyText: %p -> %p", (body, linkified) => {
  expect(
    linkifyText(
      body,
      "http://url-prefix.com/",
      "formsort",
      new Set(["FLOW-FE", "FLOW-BE"]),
    ),
  ).toBe(linkified);
});

describe("linkifySentryRef ", () => {
  test("it should always contain sentryBase, orgSlug, and upper-case issue", () => {
    fc.assert(
      fc.property(
        fc.string(),
        fc.string(),
        fc.string(),
        (issue, sentryBase, orgSlug) => {
          const link = linkifySentryRef(issue, sentryBase, orgSlug);
          expect(link).toEqual(expect.stringContaining(uriEscape(sentryBase)));
          expect(link).toEqual(
            expect.stringContaining(uriComponentEscape(orgSlug)),
          );
          expect(link).toEqual(
            expect.stringContaining(uriComponentEscape(issue.toUpperCase())),
          );
        },
      ),
    );
  });

  test("it should be valid markdown link", () => {
    fc.assert(
      fc.property(
        fc.string({minLength: 1}),
        fc.string({minLength: 1}),
        fc.string({minLength: 1}),
        (issue, sentryBase, orgSlug) => {
          const link = linkifySentryRef(issue, sentryBase, orgSlug);
          expect(link).toEqual(expect.stringMatching(/\[[^]+\]\([^)]+\)/));
        },
      ),
    );
  });
});

// // shows how the runner will run a javascript action with env / stdout protocol
// test("test runs", () => {
//   process.env["INPUT_MILLISECONDS"] = 100;
//   const ip = path.join(__dirname, "index.js");
//   const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
//   console.log(result);
// });
