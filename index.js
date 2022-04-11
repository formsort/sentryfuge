const core = require("@actions/core");
const github = require("@actions/github");
const {linkifyText} = require("./sentry");

// most @actions toolkit packages have async methods
async function run() {
  try {
    const sentryBase = core.getInput("sentry_base");
    const orgSlug = core.getInput("org_slug");
    const projectSlugs = new Set(core.getMultilineInput("project_prefixes"));
    const octokit = github.getOctokit(core.getInput("github_token"));
    const {context} = github;
    const {owner, repo} = context.repo;

    const {body, number} =
      context.payload.pull_request || context.payload.issue;
    const newBody = linkifyText(body, sentryBase, orgSlug, projectSlugs);
    if (newBody != body) {
      const payload = {
        owner,
        repo,
        body: newBody,
      };

      if (context.eventName === "pull_request") {
        await octokit.rest.pulls.update({
          ...payload,
          pull_number: number,
        });
      } else {
        await octokit.rest.issues.update({
          ...payload,
          pull_number: number,
        });
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
