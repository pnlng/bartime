.PHONY: build
build:
	./node_modules/.bin/tsc -p tsconfig.json

.PHONY: demon
demon:
	./node_modules/.bin/nodemon dist/server.js

.PHONY: serve
serve:
	node dist/server.js