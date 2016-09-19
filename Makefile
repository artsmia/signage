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
		[[ -f $$screen/index.md ]] && caption=$$(remark --use remark-html $$screen/index.md | tr -s '\n' ' '); \
		gsed "s/__NAME__/$$screen/; s/__IMAGES__/$$images/; s|__CAPTION__|$$caption|" \
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
