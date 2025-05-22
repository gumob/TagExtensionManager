#!/bin/zsh

# Check if the 'fzf' command is available in the system
if ! command -v fzf &>/dev/null; then
	tput setaf 1
	echo "fzf is not installed. <https://github.com/junegunn/fzf>"
	tput sgr0
	exit 1
fi

local option_list=(
	"dev"
	"build"
	" "
	"pnpm format-check"
	"pnpm format-fix"
	"pnpm eslint-check"
	"pnpm eslint-fix"
	"pnpm stylelint-fix"
	" "
	"pnpm clean-install-modules"
	"pnpm outdated"
	"corepack upgrade"
	" "
	"convert icon svg to png"
)

local selected_option=$(printf "%s\n" "${option_list[@]}" | fzf --ansi --prompt="Select a job to execute > ")

case "$selected_option" in
"build")
	pnpm build
	;;
"dev")
	pnpm dev
	;;
"pnpm clean-install-modules")
	rm -rf node_modules && pnpm clean-install-modules
	;;
pnpm*)
	eval $selected_option
	;;
"corepack upgrade")
	corepack use pnpm@latest
	;;
"convert icon svg to png")
	rsvg-convert -w 16 -h 16 public/icons/icon.svg >public/icons/icon16.png && rsvg-convert -w 48 -h 48 public/icons/icon.svg >public/icons/icon48.png && rsvg-convert -w 128 -h 128 public/icons/icon.svg >public/icons/icon128.png
	;;
*)
	echo "Invalid option $selected_option" && exit 1
	;;
esac

exit 0
