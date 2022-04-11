# sentryfuge

[![build status](https://github.com/formsort/sentryfuge/workflows/build/badge.svg)](https://github.com/formsort/sentryfuge/actions/workflows/build.yml)

A GitHub Action that automatically links to referenced Sentry issues in issues and PRs

## Usage

```yml
name: Auto link Sentry issues

on:
  issues:
    types:
      - opened
      - edited
  pull_request:
    branches: [main]
    types:
      - opened
      - edited

jobs:
  linkify_sentry:
    runs-on: ubuntu-latest
    steps:
      - uses: formsort/sentryfuge@main
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          org_slug: formsort
          project_prefixes: |
            FLOW-FE
            FLOW-BE
            STUDIO-FE
            STUDIO-BE
```

Optionally use `sentry_base` if you have a [self-hosted](https://github.com/getsentry/self-hosted) Sentry instance.
