# This file is moved to the root directory before building the image

# base node image
FROM node:18-bookworm-slim as base

# set for base and all layer that inherit from it
ENV PNPM_HOME /pnpm
ENV PATH $PNPM_HOME:$PATH

# enable pnpm
RUN corepack enable pnpm

# Install openssl for Prisma
RUN apt-get update && apt-get install -y fuse3 openssl sqlite3 ca-certificates

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp

ADD package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install

# Remove .prisma folder from node_modules (it will be generated in build in the right place, we need to remove this one so it doesn't get used by default)
RUN find . -type d -name .prisma -exec rm -rv {} +

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD package.json pnpm-lock.yaml .npmrc ./
RUN pnpm prune --prod --no-optional

# Build the app
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD . .
RUN pnpm prisma generate
RUN pnpm run build

# Finally, build the production image with minimal footprint
FROM base

ENV FLY="true"
ENV LITEFS_DIR="/litefs/data"
ENV DATABASE_FILENAME="sqlite.db"
ENV DATABASE_PATH="$LITEFS_DIR/$DATABASE_FILENAME"
ENV DATABASE_URL="file:$DATABASE_PATH"
ENV CACHE_DATABASE_FILENAME="cache.db"
ENV CACHE_DATABASE_PATH="/$LITEFS_DIR/$CACHE_DATABASE_FILENAME"
ENV INTERNAL_PORT="8080"
ENV PORT="8081"
ENV NODE_ENV="production"

# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules

# The prisma client generated in build is added to the node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

COPY --from=build /myapp/server-build /myapp/server-build
COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/prisma /myapp/prisma
COPY --from=build /myapp/app/components/ui/icons /myapp/app/components/ui/icons

# prepare for litefs
COPY --from=flyio/litefs:0.5.4 /usr/local/bin/litefs /usr/local/bin/litefs
ADD other/litefs.yml /etc/litefs.yml
ADD other/sentry-create-release.js other/sentry-create-release.js
ADD other/setup-swap.js other/setup-swap.js
ADD index.js index.js
RUN mkdir -p /data ${LITEFS_DIR}

CMD ["litefs", "mount"]
