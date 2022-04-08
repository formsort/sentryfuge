// The following regex tries to match something like FLOW-FE-ABC
// while not matching something like [FLOW-FE-ABC](https://blah)
const SENTRY_ISSUE_PARSER = /(?<=\s+|^)([\w-]+)-\w+\b(?![)\]-])/gm;

const uriEscape = (str) => encodeURI(str).replace(/[()]/g, escape);
const uriComponentEscape = (str) =>
  encodeURIComponent(str).replace(/[()]/g, escape);

const linkifySentryRef = (issue, sentryBase, orgSlug) => {
  issue = uriComponentEscape(issue.toUpperCase());
  return `[${issue}](${uriEscape(sentryBase)}organizations/${uriComponentEscape(
    orgSlug,
  )}/issues/?query=${issue})`;
};

const linkifyText = (body, sentryBase, orgSlug, prefixes) => {
  SENTRY_ISSUE_PARSER.lastIndex = 0; // Reset the global matcher before each call
  return (
    body &&
    body.replace(SENTRY_ISSUE_PARSER, (match, slug) =>
      prefixes.has(slug.toUpperCase())
        ? linkifySentryRef(match, sentryBase, orgSlug)
        : match,
    )
  );
};

module.exports = {
  uriEscape,
  uriComponentEscape,
  linkifySentryRef,
  linkifyText,
};
