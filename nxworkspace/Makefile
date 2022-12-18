create:
	image-edit --change-detection OnPush --skip-tests true --standalone true --style scss

gridlayout:
	nx generate @nrwl/angular:library grid-layout/${dir} --skipModule

auth:
	nx generate @nrwl/angular:library auth/${dir} --skipModule

shared:
	nx generate @nrwl/angular:library shared/${dir} --skipModule

component:
	nx generate @nrwl/angular:component ${dir} --project solarengineer --standalone

page:
	nx generate @nrwl/angular:component ${dir} --project=solarengineer --type=page --standalone
