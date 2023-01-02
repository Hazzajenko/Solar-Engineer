create:
	image-edit --change-detection OnPush --skip-tests true --standalone true --style scss

gridlayout:
	nx generate @nrwl/angular:library grid-layout/${dir} --skipModule --importPath=@${dir}

auth:
	nx generate @nrwl/angular:library auth/${dir} --skipModule --importPath=@${dir}

shared:
	nx generate @nrwl/angular:library shared/${dir} --skipModule --importPath=@${dir}

component:
	nx generate @nrwl/angular:component ${dir} --project solarengineer --standalone --importPath=@${dir}

page:
	nx generate @nrwl/angular:component ${dir} --project=solarengineer --type=page --standalone --importPath=@${dir}

v2page:
	nx generate @nrwl/angular:component ${dir} --project=solarengineerv2 --type=page --standalone --importPath=@${dir}

v2component:
	nx generate @nrwl/angular:component ${dir} --project solarengineerv2 --standalone --importPath=@${dir}

comp:
	nx generate @nrwl/angular:library --name=${name} --style=none --directory=${dir} --skipModule

lib:
	nx generate @nrwl/angular:library --name=blocks --style=none --directory=project-id/feature --importPath=@project-id/feature/blocks --skipModule

newlib:
	npx nx generate @nrwl/angular:library api --style=none --directory=projects/data-access --importPath=@projects/data-access/api --skipModule --strict --no-interactive

ngrx:
	nx generate @nrwl/angular:ngrx --name=blocks --directory=libs/project-id/data-access/store/src/lib/blocks --barrels --facade --skipImport

graph:
	nx graph

docker-build:
	docker build -f ./apps/design/Dockerfile . -t design


docker-run:
	docker run --name design-container -it -p 8000:80 design

cmon:
	nx generate @nrwl/angular:library models --style=none --directory=project-id/shared --importPath=@project-id/shared/models --skipModule --tags=project-id:shared --no-interactive

newww:
	nx generate @nrwl/angular:library keymap --style=none --directory=grid-layout/feature --importPath=@grid-layout/feature/keymap --skipModule --tags=grid-layout:feature --no-interactive

cache:
	nx clear-cache