.PHONY: build

install-ci:
	yarn --immutable

ts-check:
	yarn ts:check

eslint-check:
	yarn lint:check

prettier-check: 
	yarn prettier:check

code-quality-check:
	yarn code-quality:check

release-gh-pages:
	yarn deploy:gh-pages

