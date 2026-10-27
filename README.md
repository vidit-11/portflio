# Vidit Singh Chauhan: DevOps Portfolio

A clean, card-based personal portfolio for a DevOps engineer: profile and current role, key numbers, skills grouped by category, experience, education, certifications and projects. It has a light/dark theme, tag filtering on the projects page, and a contact form that sends email through Resend.

## Features

- **View as YAML**: the `yaml` toggle in the header renders the home and projects pages as Kubernetes-style resources (`kubectl get engineer vidit-singh -o yaml`), with copy and download. Built from the same data files in `src/lib/resource.ts`.
- **Chaos button**: "inject failure" in the header runs one of three incidents on a visible card: a node going NotReady (pod rescheduled, etcd keeps quorum), a failing liveness probe (kubelet restarts the container) or a stuck rollout (GitOps rollback with `git revert`). Each fires an alert and ends with a short postmortem. Wrap anything in `<ChaosTarget pod="name">` to make it a target.
- **Interactive architecture diagrams**: on `/projects`, hover or tap a component to see why it's there. Each project's `architecture` in `projects.json` has `nodes` (id, label, x/y on a 500×300 canvas, note) and `edges` (`[from, to]`). Projects without it fall back to `image`.
- **Deploy-me contact flow**: "Get in touch" runs a short fake pipeline, then opens the contact form with the message started.

All animations respect the visitor's reduced-motion setting.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui (Radix)
- next-themes, lucide-react
- Resend (contact form email)
- Vercel (hosting), GitHub Actions (CI)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the Resend values
npm run dev                  # http://localhost:3000
```

## Environment variables

| Name                 | Purpose                                                                          |
| -------------------- | -------------------------------------------------------------------------------- |
| `RESEND_API_KEY`     | Resend API key                                                                   |
| `CONTACT_FROM_EMAIL` | Sender address on a Resend-verified domain (`onboarding@resend.dev` for testing) |
| `CONTACT_TO_EMAIL`   | Inbox that receives contact form messages                                        |

The site builds and runs without these. Only the contact form needs them.

## Editing content

All content lives in `src/data/` and is validated by the zod schemas in `src/lib/schemas.ts`.

| File                             | What it controls                                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `home.json`                      | Name, role, headline, about text, current role, domain, and `stats`: the four numbers next to the profile (title, value, short note) |
| `career.json` / `education.json` | Experience and education lists. Dates look like `Jan 2024`; omit `end` for a current role                                            |
| `stack.json`                     | Skills grouped by category                                                                                                           |
| `projects.json`                  | Project cards; `status` is `deployed`, `maintained`, `completed` or `archived`. The first 4 appear on the home page                  |
| `certifications.json`            | Certification cards                                                                                                                  |
| `socials.json`                   | LinkedIn / GitHub / email links                                                                                                      |

Images to replace:

- `public/img/avatar.png`: profile photo (set by `avatar` in `home.json`)
- `public/img/projects/`: project images, shown on `/projects` (architecture diagrams work well)
- `public/resume.pdf`

## Scripts

| Command             | Description      |
| ------------------- | ---------------- |
| `npm run dev`       | Dev server       |
| `npm run build`     | Production build |
| `npm run lint`      | ESLint           |
| `npm run typecheck` | `tsc --noEmit`   |

## Deployment (CI/CD)

GitHub Actions builds and deploys the site to Vercel (`.github/workflows/ci-cd.yml`). Vercel's own Git deploys are turned off in `vercel.json`, so Actions is the only path to production.

| Event                    | Jobs                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| Pull request to `master` | Lint, typecheck, build, then a preview deploy. The preview URL is posted as a PR comment  |
| Push to `master`         | Lint, typecheck, build, then a production deploy, then a smoke test against the live site |

The smoke test checks that `/`, `/projects`, `/contact`, `/resume.pdf`, `/sitemap.xml` and `/robots.txt` return 200, that the home page has real content, and that unknown pages return 404.

### One-time setup

1. Create a token at <https://vercel.com/account/tokens>.
2. Get the org and project IDs: run `npx vercel link` in the repo, then read `orgId` and `projectId` from `.vercel/project.json` (it's gitignored).
3. In GitHub, go to **Settings → Secrets and variables → Actions** and add `VERCEL_TOKEN`, `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`.
4. Set the Resend env vars in the Vercel project settings. `vercel pull` brings them into each build.
5. Optional: protect `master` so the **Lint, typecheck, build** check has to pass before merging.

Set `domain` in `src/data/home.json` to the production domain. It's used for metadata, the sitemap and robots.txt.
