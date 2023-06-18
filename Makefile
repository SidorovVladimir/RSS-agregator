install:
	npm ci
lint:
	npx eslint .
develop:
	NODE_ENV=development npx webpack-dev-server --mode development --open
build:
	NODE_ENV=production npx webpack --mode production
dev:
	NODE_ENV=development npx webpack --mode development