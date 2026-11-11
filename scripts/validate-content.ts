import { contentBundle } from "../src/content/index";
import { validateContent } from "../src/content/validate";

const strict = process.argv.includes("--strict");
const report = validateContent(contentBundle);

const { stats } = report;

console.log("Content validation");
console.log("──────────────────");
console.log(
  `units ${stats.units} · lessons ${stats.lessons} (${stats.playableLessons} playable) · exercises ${stats.exercises}`,
);
console.log(`lexemes ${stats.lexemes} · grammar ${stats.grammarPoints}`);

if (report.warnings.length > 0) {
  console.log(`\nWarnings (${report.warnings.length})`);
  for (const warning of report.warnings) {
    console.log(`  ! ${warning.code}: ${warning.message}`);
  }
}

if (report.errors.length > 0) {
  console.error(`\nErrors (${report.errors.length})`);
  for (const error of report.errors) {
    console.error(`  x ${error.code}: ${error.message}`);
  }
  process.exit(1);
}

if (strict && report.warnings.length > 0) {
  console.error("\nStrict mode: warnings are treated as errors.");
  process.exit(1);
}

console.log("\nContent is structurally valid.");
