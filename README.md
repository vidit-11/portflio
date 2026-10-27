# Vidit Singh Chauhan: DevOps Portfolio

A clean, card-based personal portfolio for a DevOps engineer: profile and current role, key numbers, skills grouped by category, experience, education, certifications and projects. It has a light/dark theme, tag filtering on the projects page, and a contact form that sends email through Resend.

Started from [tedawf.com](https://github.com/tedawf/tedawf.com) by Ted (MIT).

## Features

- **View as YAML**: the `yaml` toggle in the header renders the home and projects pages as Kubernetes-style resources (`kubectl get engineer vidit-singh -o yaml`), with copy and download. Built from the same data files in `src/lib/resource.ts`.
- **Chaos button**: "inject failure" in the footer runs one of three incidents on a visible card: a node going NotReady (pod rescheduled, etcd keeps quorum), a failing liveness probe (kubelet restarts the container) or a stuck rollout (GitOps rollback with `git revert`). Each fires an alert and ends with a short postmortem. Wrap anything in `<ChaosTarget pod="name">` to make it a target.
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

| File                             | What it controls                                                                                                           |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `home.json`                      | Name, role, headline, about text, current role, domain, and `stats`: the numbers shown next to the profile (title + value) |
| `career.json` / `education.json` | Experience and education lists. Dates look like `Jan 2024`; omit `end` for a current role                                  |
| `stack.json`                     | Skills grouped by category                                                                                                 |
| `projects.json`                  | Project cards; `status` is `deployed`, `maintained`, `completed` or `archived`. The first 4 appear on the home page        |
| `certifications.json`            | Certification cards                                                                                                        |
| `socials.json`                   | LinkedIn / GitHub / email links                                                                                            |

Images to replace:

- `public/img/avatar.svg`: your photo. A `.jpg` works too; update `avatar` in `home.json`.
- `public/img/projects/`: project images, shown on `/projects` (architecture diagrams work well)
- `public/resume.pdf`

## Scripts

| Command             | Description      |
| ------------------- | ---------------- |
| `npm run dev`       | Dev server       |
| `npm run build`     | Production build |
| `npm run lint`      | ESLint           |
| `npm run typecheck` | `tsc --noEmit`   |

## Deployment

1. Push to GitHub. CI (`.github/workflows/ci.yml`) runs lint, typecheck and build on every push and PR.
2. Import the repo in [Vercel](https://vercel.com/new) and add the env vars above.
3. Vercel builds a preview URL for each PR and deploys `main` to production.
4. Optional: add a custom domain in Vercel and set `domain` in `src/data/home.json`. That value is used for metadata, the sitemap and robots.txt.

## License

MIT. See `LICENSE.txt`.
