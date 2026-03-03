_default:
    just --list

start:
    bun start

dev: start

ios:
    bun run ios

android:
    bun run android

fmt:
    bun prettier --write .

lint:
    bun run lint:fix

typecheck:
    bun tsc --noEmit

verify: fmt lint typecheck

install:
    bun install

db-generate:
    bun run db:generate

db-regenerate:
    rm -rf drizzle/
    bun run db:generate

db-studio:
    bun run db:studio

prebuild:
    bun run prebuild

clean:
    rm -rf .expo node_modules/.cache dist
