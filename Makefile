lib: $(shell find src -name \*.ts) 
	rm -R lib || true
	cp -R src $@
	./node_modules/.bin/tsc --project $@

.PHONY: clean
clean:
	rm -R lib || true

.PHONY: docs
docs: 
	./node_modules/.bin/typedoc \
	--mode modules \
	--out $@ \
	--excludeExternals \
	--excludeNotExported \
	--excludePrivate \
	--tsconfig lib/tsconfig.json \
	--theme minimal && \
	echo 'DO NOT DELETE!' > docs/.nojekyll 

