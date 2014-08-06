BIN = ./node_modules/.bin

lint::
	$(BIN)/eslint $(shell find ./lib -name '*.js')
