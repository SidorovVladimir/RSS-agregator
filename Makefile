.PHONY: tag

tag:
	git tag -a $(TAG) -m "Release $(TAG)"
	git push origin $(TAG)

install:
	npm ci
lint:
	npx eslint .
develop:
	npx webpack serve
build:
	NODE_ENV=production npx webpack
deploy:
	ansible-playbook ansible/playbook/deploy.yml -vv --extra-vars "version=$(VERSION)" -K