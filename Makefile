BIN = ./node_modules/.bin

lint::
	$(BIN)/eslint $(shell find ./lib -name '*.js')


example::
	./bin/integrated-css.js \
		--input='example/*.js' \
		--output=example/build/ \
		--css=example/build/styling/lala.css
