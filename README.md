# Epic Stack template project, with pnpm

Same as all the usual Epic Stack, but with pnpm instead of npm. Just use `pnpm`
instead of `npm` in the instructions.

[![The Epic Stack](https://github-production-user-asset-6210df.s3.amazonaws.com/1500684/246885449-1b00286c-aa3d-44b2-9ef2-04f694eb3592.png)](https://www.epicweb.dev/epic-stack)

[The Epic Stack](https://www.epicweb.dev/epic-stack)

<hr />

## Watch Kent's Introduction to The Epic Stack

[![screenshot of a YouTube video](https://github-production-user-asset-6210df.s3.amazonaws.com/1500684/242088051-6beafa78-41c6-47e1-b999-08d3d3e5cb57.png)](https://www.youtube.com/watch?v=yMK5SVRASxM)

["The Epic Stack" by Kent C. Dodds at #RemixConf 2023 💿](https://www.youtube.com/watch?v=yMK5SVRASxM)

## Getting Started

[Read the docs](https://github.com/epicweb-dev/epic-stack/blob/main/docs)
(please 🙏).

Make sure you are using node 18 and pnpm 8. You can check with `node -v` and
`pnpm -v`.

Create a new project using
`npx create-remix --template matt-winfield/epic-stack-pnpm`.

When prompted, say 'no' to installing the dependencies (otherwise it will try to
use npm).

Run `pnpm install` to install dependencies. Then run `pnpm run setup` to
configure the project for local development.

Run `pnpm dev` to start the development server.

Run `pnpm test` to run unit tests, and `pnpm test:e2e` to run end-to-end tests.

Run `pnpm prisma:studio` to open the Prisma Studio GUI.

Run `pnpm format` to format the code.

## Differences from the original Epic Stack

-   Uses pnpm instead of npm
    -   Dockerfile updated to work with pnpm
-   Prettier config changed to 4 spaces instead of 2, and semicolons
    -   (I know it's only an opinion, but it's the correct opinion 😉)
-   Add a Husky pre-commit hook to run `pnpm format` before committing, to avoid
    formatting issues early without much developer effort
-   Update the deployment workflow to fix incorrect caching of the database for
    the end-to-end tests (it would cache the db regardless of if the schema has
    changes, so any migrations would be ignored)
