#!/bin/sh

echo "Adding pre-commit hook."
cp hooks/pre-commit.sh .git/hooks/pre-commit &&
chmod +x .git/hooks/pre-commit
# good to go even if we errored out (e.g. hooks directory is not available)
exit 0
