cert:
	./scripts/certs/create-crt-rsa-cert.ps1 ${domain}

dev:
	docker-compose -f docker-compose.dev.yml up ${args}

publish:
	./scripts/deployment/publish-and-push-docker-services.ps1

tree:
	treee  -o tree.txt --ignore 'node_modules/, design-app/, design-app-e2e/, web/, web-app-ssr/, storybook/, core-components/, ngrx-pull/, dist/' -l 10 -d


