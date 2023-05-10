create:
	image-edit --change-detection OnPush --skip-tests true --standalone true --style scss

gridlayout:
	nx generate @nx/angular:library grid-layout/${dir} --skipModule --importPath=@${dir}

auth:
	nx generate @nx/angular:library auth/${dir} --skipModule --importPath=@${dir}

shared:
	nx generate @nx/angular:library shared/${dir} --skipModule --importPath=@${dir}

component:
	nx generate @nx/angular:component ${dir} --project solarengineer --standalone --importPath=@${dir}

page:
	nx generate @nx/angular:component ${dir} --project=solarengineer --type=page --standalone --importPath=@${dir}

v2page:
	nx generate @nx/angular:component ${dir} --project=solarengineerv2 --type=page --standalone --importPath=@${dir}

v2component:
	nx generate @nx/angular:component ${dir} --project solarengineerv2 --standalone --importPath=@${dir}

comp:
	nx generate @nx/angular:library --name=${name} --style=none --directory=${dir} --skipModule

lib:
	nx generate @nx/angular:library --name=blocks --style=none --directory=project-id/feature --importPath=@project-id/feature/blocks --skipModule

newlib:
	npx nx generate @nx/angular:library api --style=none --directory=projects/data-access --importPath=@projects/data-access/api --skipModule --strict --no-interactive

#ngrx:
#	nx generate @nx/angular:ngrx --name=blocks --directory=libs/project-id/data-access/store/src/lib/blocks --barrels --facade --skipImport



graph:
	nx graph

docker-build:
	docker build -f ./apps/design/Dockerfile . -t design


docker-run:
	docker run --name design-container -it -p 8000:80 design

cmon:
	nx generate @nx/angular:library models --style=none --directory=project-id/shared --importPath=@project-id/shared/models --skipModule --tags=project-id:shared --no-interactive

newww:
	nx generate @nx/angular:library show-hide --style=none --directory=shared/ui --importPath=@shared/ui/show-hide --skipModule --tags=shared:ui --no-interactive

storybook:
	nx g @nx/storybook/angular --project=design

story:
	npx nx generate @nx/angular:stories design --no-interactive

cache:
	nx clear-cache

docker-build-client:
	docker build . -t angularclient:1.0.0

build-nocache:
	docker build . -t angularclient:1.0.0  --no-cache --pull


tag:
	docker image tag angularclient:1.0.0 hazzajenko/angularclient:1.0.0

push:
	docker image push hazzajenko/angularclient:1.0.0

ne11w:
	nx generate @nx/angular:library friends --style=none --directory=app/data-access --importPath=@app/data-access/friends --skipModule --tags=app:data-access --no-interactive

g:
	nx generate @nx/angular:library ${name} --style=none --directory=${dir} --importPath=@${dir}/${name} --skipModule --tags=${tags} --no-interactive

#ngrx:
#	nx g @nx/angular:ngrx free-panels --parent=libs/no-grid-layout/feature/src/lib/lib.routes.ts --route=''


remove:
	nx generate @nx/workspace:remove --project project-id-utils --forceRemove

rm:
	nx generate @nx/workspace:remove --project ${name} --forceRemove

build-nocache2:
	docker build . -t angularclient:1.0.1  --no-cache --pull

docker-build-client2:
	docker build . -t angularclient:1.0.1

plugin:
	nx g @nx/plugin:plugin ${name}

generator:
	nx generate @nx/plugin:generator ${name} --project=${project}

move:
	nx generate @nx/workspace:move --projectName=${project} --destination=${destination}

move-deprecated:
	nx generate @nx/workspace:move --projectName=${project} --destination=${destination}



xstate:
	xstate typegen "libs/design-app/feature-design-canvas/src/lib/services/canvas-client-state/+xstate/client.machine.ts"  --watch
	xstate typegen "libs/design-app/feature-design-canvas/src/lib/components/design-canvas/menus/canvas-graphics-menu/+xstate/graphics-settings.machine.ts" --watch

xstate-client:
	xstate typegen "libs/design-app/feature-design-canvas/src/lib/services/canvas-client-state/+xstate/client.machine.ts"  --watch

xstate-graphics:
	xstate typegen "libs/design-app/feature-design-canvas/src/lib/components/design-canvas/menus/canvas-graphics-menu/+xstate/graphics-settings.machine.ts" --watch

xstate-selected:
	xstate typegen "libs/design-app/data-access/src/lib/selected/selected-state.machine.ts" --watch

run-plugin:
	nx generate ngrx-pull:ngrx-entity mylib

run-plugin-none:
	nx generate ngrx-pull:ngrx-entity

run-plugin-dry:
	nx generate ngrx-pull:ngrx-entity mylib --dry-run

#install-storybook:
	#nx g @nx/angular:storybook-configuration --storybook7Configuration --storybook7UiFramework=@storybook/angular --uiFramework=@storybook/angular --generateStories
	#nx g @nx/angular:storybook-configuration --storybook7Configuration --storybook7UiFramework=@storybook/angular --uiFramework=@storybook/angular --configureCypress --generateStories --generateCypressSpecs --linter=eslint --cypressDirectory=.cypress --cypressProject=design-app-e2e --cypressBaseUrl=http://localhost:4200 --cypressSpecs=apps/design-app-e2e/src/integration/**/*.spec.ts --cypressPluginsFile=cypress/plugins/index.js --cypressSupportFile=cypress/support/index.ts --cypressTestFiles=apps/design-app-e2e/src/integration/**/*.spec.ts --cypressComponentTesting=true --cypressCodeCoverage=true --cypressWatch=false --cypressVideo=false --cypressViewportHeight=900 --cypressViewportWidth=1440 --cypressChromeWebSecurity=false --cypressChromeArgs=--disable-dev-shm-usage,--no-sandbox,--disable-setuid-sandbox,--disable-gpu,--disable-software-rasterizer,--disable-dev-shm-usage,--no-sandbox,--disable-setuid-sandbox,--disable-gpu,--disable-software-rasterizer --cypressEnv=CI=true --cypressEnv=STORYBOOK_BASE_HREF=/iframe.html --cypressEnv=STORYBOOK

migrate-ngrx-next:
	nx migrate @ngrx/data@next @ngrx/effects@next @ngrx/entity@next @ngrx/schematics@next @ngrx/store@next @ngrx/store-devtools@next

pnpm-update:
	pnpm update -L -i

migrate-ngrx-latest:
	nx migrate @ngrx/data@latest @ngrx/effects@latest @ngrx/entity@latest @ngrx/schematics@latest @ngrx/store@latest @ngrx/store-devtools@latest