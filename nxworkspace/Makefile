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
	nx generate @nrwl/angular:library --name=facade --style=none --directory=auth/data-access --importPath=@auth/data-access/facade --skipModule --no-strict --unitTestRunner=karma

newlib:
  npx nx generate @nrwl/angular:library api --style=none --directory=projects/data-access --importPath=@projects/data-access/api --skipModule --strict --no-interactive
