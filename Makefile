default: html deploy

syncThumbdrives:
	ls | grep UL- | while read screen; do \
		if [[ -d /Volumes/$$screen ]]; then \
			echo $$screen; \
			rsync -avz --delete $$screen/ /Volumes/$$screen; \
		fi; \
	done

html:
	ls | grep 'UL-\|LOWER-LOBBY' | while read screen; do \
		imageFiles=$$(gls -1v $$screen/ | grep '.jpg$$'); \
		images=$$(echo $$imageFiles | tr '\n' ' ' | sed 's/\s+$$//'); \
		[[ -f $$screen/index.md ]] && caption=$$(remark --use remark-html $$screen/index.md | tr -s '\n' ' '); \
		if ls $$screen/*.jpg | grep '_wp-' > /dev/null; then \
			caption=$$(cd $$screen; ls *.jpg | while read file; do \
				wpId=$$(echo $$file | sed 's/.*wp-\(.*\).jpg/\1/'); \
				curl --silent "http://new.artsmia.org/wp-json/wp/v2/exhibition/$$wpId?_embed" \
				| jq --arg file "$$file" '{($$file): {title: .title.rendered, location: .acf.location}}'; \
			done | jq -c -s 'add'); \
		fi; \
		gsed "s/__NAME__/$$screen/; s/__IMAGES__/$$images/; s#__CAPTION__#$$caption#" \
		< template/index.html \
		> $$screen/index.html; \
		cp template/manifest.mf $$screen/manifest.mf; \
		sed "s/^#Version.*/#Version `date "+%y.%m%d.%H%M"`/" $$screen/manifest.mf | sponge $$screen/manifest.mf; \
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

check-exhibition-dates:
	@find . -name '*exhibition:*' | while read file; do \
		id=$$(echo $$file | cut -d: -f2 | sed 's/.jpg//'); \
		runDates=$$(jq -r '.display_date' ~/tmp/collection/exhibitions/$$((id/1000))/$$id.json); \
		start=$$(echo $$runDates | cut -d- -f1 | xargs -I'{}' gdate --date='{}'); \
		end=$$(echo $$runDates | cut -d- -f2 | xargs -I'{}' gdate --date='{}'); \
		if [ $$(gdate --date="$$start" +%s) -ge $$(date +%s) ]; then \
		  echo exhibition has not started yet! -- $$id -- $$file; \
		fi; \
		if [ $$(date +%s) -ge $$(gdate --date="$$end" +%s) ]; then \
		  echo exhibition is over! -- $$id -- $$file; \
		fi; \
	done;

install:
	which gls >/dev/null || echo 'brew install coreutils'
	which sponge >/dev/null || echo 'brew install moreutils'
	which jq >/dev/null || echo 'brew install jq'
	npm --version >/dev/null || echo 'must install npm!'
	which remark >/dev/null || echo 'npm install --global remark remark-html for markdown processing'

watch:
	rewatch template/index.html Makefile -c "make html"
