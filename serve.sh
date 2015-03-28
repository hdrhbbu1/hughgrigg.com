rm -rf ./public/*
hugo version
hugo server --config=config.yaml --theme=2015 --buildDrafts -v -w
