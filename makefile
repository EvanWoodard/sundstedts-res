gen-build-tools:
	cd build && go build -o _build && cp -a _build ../_build

build:
	./_build

deploy: 
	./_build && gcloud app deploy -q