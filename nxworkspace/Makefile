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
