#!/bin/sh

function setupGitHooks(){
    echo "Adding pre-commit hook."
    cp hooks/pre-commit.sh .git/hooks/pre-commit &&
    chmod +x .git/hooks/pre-commit
}

setupGitHooks
exit $?
