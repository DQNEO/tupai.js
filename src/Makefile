include ../common.mk
JS_NAME=tupai

JS_CONCAT=$(JS_PUB_DIR)/$(JS_NAME)-concat.js

WEB_JS_EXTRA_FILES= \
	../libs/package.js

all: clear $(JS_CONCAT)

force: clear all

$(JS_CONCAT): check $(JS_PUB_DIR)
	$(CAT) $(WEB_JS_EXTRA_FILES) > $@
	$(MERGE) --classPath "." --output "$@" --append --noLog --isTupaiCore

check:
	$(CHECK) --classPath "." --isTupaiCore

$(JS_PUB_DIR):
	$(MKDIR) -p $(JS_PUB_DIR)

clear:
	$(RM) $(JS_CONCAT)
