install:
	npm ci
lint:
	npx eslint .
develop:
	NODE_ENV=development npx webpack-dev-server --open
build:
	NODE_ENV=production npx webpack
dev:
	NODE_ENV=development npx webpack