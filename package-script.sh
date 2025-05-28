#!/bin/zsh

# Check if the 'fzf' command is available in the system
if ! command -v fzf &>/dev/null; then
	tput setaf 1
	echo "fzf is not installed. <https://github.com/junegunn/fzf>"
	tput sgr0
	exit 1
fi

local option_list=(
	"fastlane"
	" "
	"pnpm clean-install-modules"
	"pnpm outdated"
	"corepack upgrade"
)

local selected_option=$(printf "%s\n" "${option_list[@]}" | fzf --ansi --prompt="Select a job to execute > ")

case "$selected_option" in
"fastlane")
	bundle exec fastlane
	;;
"pnpm clean-install-modules")
	rm -rf node_modules && pnpm clean-install-modules && bundle install
	;;
pnpm*)
	eval $selected_option
	;;
"corepack upgrade")
	corepack use pnpm@latest
	;;
*)
	echo "Invalid option $selected_option" && exit 1
	;;
esac

exit 0
