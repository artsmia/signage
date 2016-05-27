default: html deploy

syncThumbdrives:
	ls | grep UL- | while read screen; do \
		if [[ -d /Volumes/$$screen ]]; then \
			echo $$screen; \
			rsync -avz --delete $$screen/ /Volumes/$$screen; \
		fi; \
	done

html:
	ls | grep UL- | while read screen; do \
		imageFiles=$$(gls -1v $$screen/ | grep '.jpg$$'); \
		images=$$(echo $$imageFiles | tr '\n' ' ' | sed 's/\s+$$//'); \
		< template/index.html \
		sed "s/__NAME__/$$screen/; s/__IMAGES__/$$images/" \
		> $$screen/index.html; \
		cp template/manifest.mf $$screen/manifest.mf; \
		echo $$imageFiles | tr ' ' '\n' >> $$screen/manifest.mf; \
	done;

.PHONY: html

deploy:
	rsync -avz --delete --exclude=".git" . dx:/apps/cdn/brightsign/

writeAutoruns:
	ls | grep UL- | while read screen; do \
    < template/autorun.brs \
		sed "s|\(cdn.dx.artsmia.org/brightsign/\)|\1$$screen/|" \
		> $$screen/autorun.brs; \
	done