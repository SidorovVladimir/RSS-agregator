install:
	npm ci
lint:
	npx eslint .
develop:
	npx webpack-dev-server --mode development --open
build:
	npx webpack --mode production