const commitMsg = process.argv[2];

if (!/#[0-9]+/.test(commitMsg) && !commitMsg.includes("no issue")) {
  console.error(
    "Error: Commit message must include a reference to an issue (e.g., #123)."
  );
  process.exit(1);
}
