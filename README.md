# IdeaBench

A studio monorepo. One domain. Independent ideas.

## Structure

| Path | Purpose | URL |
|------|---------|-----|
| `platform/` | Main site, the bench | https://ideabench.ai |
| `ideas/writeboost/` | WriteBoost | https://writeboost.ideabench.ai |
| `ideas/brandkit/` | BrandKit | https://brandkit.ideabench.ai |

## Rules

- No shared packages. No workspace tooling. Git is the only shared layer.
- Each idea owns its stack, dependencies, and deploy pipeline.
- Each idea deploys to its own subdomain via a separate Vercel project.

## Adding a New Idea

1. Create `ideas/<name>/` with any stack
2. Add `vercel.json` inside the folder declaring the framework
3. Create a new Vercel project, set root directory to `ideas/<name>/`
4. Assign subdomain `<name>.ideabench.ai`
5. Add a row to the table above

## Domain

Wildcard `*.ideabench.ai` is configured once in Vercel. Each new idea just needs a Vercel project pointed at its folder.
