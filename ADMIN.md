# Admin panel: setup and security

The admin panel lives at **`/admin`** inside the same Next.js app. It uses
**PostgreSQL + Prisma**, signed-in sessions stored in the database, and
page-level permissions.

## 1. First-time setup

```powershell
# 1. A database (pick one)
#    Local testing only: docker compose up -d   (docker-compose.yml, NOT for live)
#    Live: a managed / installed PostgreSQL; paste its connection string into .env

# 2. Environment
copy .env.example .env                     # then edit DATABASE_URL

# 3. Tables + Prisma client
pnpm install                               # also runs `prisma generate`
pnpm db:deploy                             # applies prisma/migrations
#   while changing the schema in development use:  pnpm db:migrate

# 4. Built-in roles + the FIRST super admin
$env:ADMIN_NAME="Site Owner"
$env:ADMIN_EMAIL="you@company.com"
$env:ADMIN_PASSWORD="a-long-strong-password-1!"
pnpm db:seed

# 5. Run
pnpm dev                                   # open http://localhost:3000/admin
```

The seeded super admin is asked to choose a new password at first sign in.
Everyone else is created from **Admin Users → Add admin**.

## 2. How access works

| Idea | Meaning |
| --- | --- |
| **Page / module** | `dashboard`, `pages`, `insights`, `reviews`, `careers`, `enquiries`, `users`, `roles`, `audit`, `settings` |
| **Permission** | `module:action`, e.g. `users:create`, `enquiries:edit` (actions: view, create, edit, delete) |
| **Role** | A named set of permissions (Admin, Editor, Support built in; make your own under *Roles & Access*) |
| **Extra access** | Tick pages for ONE person on top of their role (Admin Users → Manage) |
| **Super admin** | Bypasses checks. Keep it to the owner(s) |

Rules the server enforces (not just the UI):

- Nobody can give out access they do not have themselves.
- You cannot change your own role/access, deactivate or delete yourself.
- There is always at least one active super admin.
- Built-in roles cannot be renamed or deleted; a role in use cannot be deleted.

## 3. Sign-in security

- **No public sign-up.** Accounts are created only by `POST /api/admin/users`
  (needs `users:create`) or the seed script.
- **Strong passwords** (checked in the browser *and* on the server): 12+
  characters, upper + lower case, number, symbol, no spaces, not common, not
  containing the name or email. Hashed with **Argon2id**.
- **5 failed attempts lock the account for 15 minutes.** This also applies to
  unknown emails (so nobody can discover which emails exist) and there is an
  extra per-IP limit. An admin can press **Unlock** on the user.
- **Sessions**: random 256-bit token in an `HttpOnly`, `SameSite=Lax` cookie
  (`__Host-` + `Secure` in production). Only a SHA-256 hash is stored. A sign-in
  lasts **7 days**; while the panel is open it renews the token automatically
  (`POST /api/admin/auth/refresh`, the old token dies after 60 s). Hard stop
  after 30 days. Password change or deactivation signs the person out everywhere.
- **proxy.ts** blocks `/admin` and `/api/admin` without a session cookie and
  rejects cross-site writes; every page and API still checks the person's role.
- **CSRF**: every write must come from our own origin and be JSON.
- **Audit log**: sign-ins, failures, locks, and every user/role change.
- Admin responses are `no-store`, `noindex`, and cannot be framed.

## 4. API (all JSON, same-origin, cookie session)

| Method | Path | Needs |
| --- | --- | --- |
| POST | `/api/admin/auth/login` | – |
| POST | `/api/admin/auth/logout` | – |
| GET | `/api/admin/auth/me` | signed in |
| POST | `/api/admin/auth/password` | signed in |
| GET / POST | `/api/admin/users` | `users:view` / `users:create` |
| PATCH / DELETE | `/api/admin/users/:id` | `users:edit` / `users:delete` |
| GET / POST | `/api/admin/roles` | `roles:view` / `roles:create` |
| PATCH / DELETE | `/api/admin/roles/:id` | `roles:edit` / `roles:delete` |

`PATCH /api/admin/users/:id` accepts `name`, `roleId`, `extraPermissions`,
`isActive`, `isSuperAdmin`, `unlock`, `newPassword`.

## 5. Deploying (Hostinger or any Node host)

1. Use **HTTPS** (secure cookies need it) and set `NEXT_PUBLIC_SITE_URL` to the real domain.
2. Set `DATABASE_URL` (and optionally `DATABASE_POOL_MAX=5`) in the host's environment.
3. Build: `pnpm install && pnpm build`, then run `pnpm db:deploy` once per release.
4. Run `pnpm db:seed` once to create the first super admin, then remove `ADMIN_PASSWORD` from the environment.
5. Behind a proxy, forward `X-Forwarded-For`, `X-Forwarded-Proto` and `Host`.
6. Back up the database regularly (store backups outside the repo, encrypted).
7. **No Docker in production.** Docker (`docker-compose.yml`) is only for local
   testing. Live runs plain Node + a hosted PostgreSQL.
8. Set `APP_SECRET` (`openssl rand -hex 32`) so consent records store a hashed IP.
9. Schedule the retention job daily, e.g. cron `0 3 * * * cd /app && pnpm db:purge`.

## 5a. Personal data (DPDP Act, 2023)

- `/privacy-policy` and `/terms-and-conditions` are public; **fill in the
  placeholders in `lib/legal.ts`** (company name, address, Grievance Officer)
  and have a lawyer review the text. Bump `PRIVACY_VERSION` / `TERMS_VERSION`
  whenever the text changes.
- Every form (contact, partner, career, newsletter) has an unticked, required
  consent box linking to both pages, plus a separate optional updates box.
- Enquiries are stored in the `Lead` table with the consent record (time,
  policy versions, HMAC of the IP) and a `retainUntil` date.
- The Enquiries page shows masked emails; opening a record is written to the
  audit log (`lead.view`). `enquiries:delete` erases a person's data on request.
- `pnpm db:purge` deletes expired enquiries, old audit rows and sessions.

## 5c. Careers, images and Cloudflare R2

- **Careers** (admin) creates the jobs shown on `/career`. The site shows only
  jobs that are *Open*; with no jobs it shows a "no openings" message. Job
  descriptions use the reusable rich-text editor.
- **Rich-text editor**: `components/editor/rich-text-editor.tsx` (use it for any
  future page: `<RichTextEditor value onChange upload={{scope}} />`). Show saved
  HTML with `<RichContent html>`. Always run HTML through `sanitizeRich`
  (`lib/rich-text.ts`) on the server before saving. This is already done in
  the jobs API.
- **R2 keys** go only in `.env`: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`,
  `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_URL`. Without them image
  upload answers "not configured" and everything else keeps working.
- Uploads are checked by their real file signature (JPG/PNG/WebP/GIF, max 5 MB),
  require `careers:edit`, and are recorded in the `Asset` table.
- **Deleting** a job deletes its images from R2. Removing an image from the
  description and saving also deletes it. `pnpm db:purge` removes uploads that
  were never attached to a saved job.
- Applications are *not* file uploads: people paste a cover note or resume link,
  so no untrusted files are stored.

## 5b. Keeping GitHub safe

`.gitignore` excludes `.env*` (except `.env.example`), keys, backups, uploads,
build output, generated Prisma client and AI-tool folders (`.claude`, `.agents`,
`.windsurf`). Never commit real data; if a secret was ever pushed, rotate it.

## 6. Adding a new admin page

1. Add the module to `MODULES` in `lib/auth/permissions.ts`.
2. Add a sidebar entry in `lib/admin-nav.ts`.
3. Create `app/admin/(panel)/<name>/page.tsx` and start it with
   `await requirePagePermission("<name>:view")`; guard its API routes with
   `apiAuth(req, "<name>:edit")`.

## 7. Menus, service pages and icons

- **Menus & Pages** (`/admin/navigation`) edits the five header dropdowns
  (Startup, IP & Trademark, Compliance, Regulatory, Environmental) and the footer
  columns that follow them. A change goes live as soon as you press **Save menu**.
- Every link has **Page content**: heading, summary, picture, icon, eight sections
  (Overview ... Why Us; each section's heading and icon can be changed), FAQ,
  Google title/description and a Published switch. Images go to Cloudflare R2.
- Pages that still have the automatic starter text show a notice and are kept out of
  Google (noindex, not in the sitemap) until someone saves them from the admin panel.
- Deleting a page also removes its images from R2 and points its menu link to Contact Us.
  Renaming a draft page updates its menu link automatically.
- First data for a fresh database: `pnpm db:seed`. To re-apply the starter menus and
  pages safely (edited pages and menus are left alone): `pnpm exec tsx prisma/apply-startup.ts`.
- Set `NEXT_PUBLIC_SITE_URL` to the real https domain before going live: it is used
  for canonical links, the sitemap and structured data.
- Limits: 8 menus, 20 categories per menu, 150 links per category.

## Email notices (Brevo SMTP)

Every website form (contact, service page, partner, job application, newsletter) is saved to the database first, then a notice is emailed to `ADMIN_EMAIL` with nodemailer. Set `FROM_EMAIL` (a sender verified in Brevo), `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` and `ADMIN_EMAIL` in `.env`. If mail fails or is not configured, the enquiry is still saved and an error is logged. The "Reply" button in the mail goes to the person who filled the form.
