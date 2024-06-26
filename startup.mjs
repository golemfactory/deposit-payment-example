#!/usr/bin/env zx

let increaseOpenFileLimit = "";
const openFileLimit = argv.oflimit;

const defaultOpenFileLimitOverwrite = 1024;

if (openFileLimit === true) {
  increaseOpenFileLimit = `ulimit -n ${defaultOpenFileLimitOverwrite} &&`;
}

if (openFileLimit === "number") {
  increaseOpenFileLimit = `ulimit -n ${argv.oflimit} &&`;
}

// //kill previous and recreate session
try {
  await $`tmux kill-session -t "deposit-example"`;
} catch (err) {
  console.log("Nothing to kill");
}

await $`tmux new-session -d -s "deposit-example"`;

//create panes for services

//backend
await $`tmux new-window -n "backend"`;
await $`tmux send-keys -t backend "cd backend && pnpm run dev" C-m`;

//frontend

await $`tmux new-window -n "frontend"`;
await $`tmux send-keys -t frontend "cd frontend && pnpm run dev" C-m`;

//sdk in dev mode

await $`tmux new-window -n "sdk"`;
await $`tmux send-keys -t sdk "cd golem-js && pnpm run dev" C-m`;

//separated instance of yagna if ine is running it is always better to run
//separated instance just for the dapp purpose

await $`tmux new-window -n yagna`;
await $`tmux send-keys -t yagna "cd yagna && cargo run -- service run" C-m`;

await $`tmux attach-session -d`;
