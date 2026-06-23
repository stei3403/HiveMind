const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

const VALID_STATUSES = new Set([
  "Just an Idea",
  "Researching",
  "Currently Building",
  "Built and Launched",
  "Iterating and Improving",
]);

const MAX_ITEMS = {
  industry: 12,
  features: 20,
  tags: 20,
  images: 3,
};

function usage() {
  console.log("Usage: npm run import:ideas -- <path-to-json> [--dry-run]");
  console.log("Requires Firebase Admin credentials via GOOGLE_APPLICATION_CREDENTIALS or application default credentials.");
}

function readJson(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}

function asTrimmedString(value, field, maxLength, required = false) {
  if (value == null || value === "") {
    if (required) throw new Error(`${field} is required`);
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`${field} must be a string`);
  }

  const trimmed = value.trim();
  if (required && trimmed.length === 0) {
    throw new Error(`${field} is required`);
  }

  if (trimmed.length > maxLength) {
    throw new Error(`${field} must be ${maxLength} characters or fewer`);
  }

  return trimmed || undefined;
}

function asStringList(value, field) {
  if (value == null) return undefined;
  if (!Array.isArray(value)) throw new Error(`${field} must be an array`);

  const list = value
    .map((item) => {
      if (typeof item !== "string") throw new Error(`${field} entries must be strings`);
      return item.trim();
    })
    .filter(Boolean);

  if (list.length > MAX_ITEMS[field]) {
    throw new Error(`${field} can contain at most ${MAX_ITEMS[field]} entries`);
  }

  return list.length ? [...new Set(list)] : undefined;
}

function validateIdea(rawIdea, index) {
  const status = rawIdea.status || "Just an Idea";
  if (!VALID_STATUSES.has(status)) {
    throw new Error(`Idea ${index + 1}: invalid status "${status}"`);
  }

  const idea = {
    title: asTrimmedString(rawIdea.title, "title", 120, true),
    problem: asTrimmedString(rawIdea.problem, "problem", 2000, true),
    solution: asTrimmedString(rawIdea.solution, "solution", 2000, true),
    status,
    authorName: asTrimmedString(rawIdea.authorName, "authorName", 120) || "HiveMind Admin",
    authorUid: asTrimmedString(rawIdea.authorUid, "authorUid", 128) || "admin-import",
    upvotes: 0,
    downvotes: 0,
    score: 0,
    adminScoreAdjustment: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const optionalStrings = {
    links: 1000,
    marketSize: 1000,
    businessModel: 2000,
    team: 1000,
    targetAudience: 1000,
    whyNow: 1000,
    featureImage: 2000,
  };

  for (const [field, maxLength] of Object.entries(optionalStrings)) {
    const value = asTrimmedString(rawIdea[field], field, maxLength);
    if (value) idea[field] = value;
  }

  for (const field of Object.keys(MAX_ITEMS)) {
    const value = asStringList(rawIdea[field], field);
    if (value) idea[field] = value;
  }

  return idea;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const filePath = args.find((arg) => !arg.startsWith("--"));

  if (!filePath) {
    usage();
    process.exitCode = 1;
    return;
  }

  const rawIdeas = readJson(filePath);
  if (!Array.isArray(rawIdeas)) {
    throw new Error("Import file must contain a JSON array of ideas");
  }

  const ideas = rawIdeas.map(validateIdea);
  console.log(`Validated ${ideas.length} idea(s).${dryRun ? " Dry run only." : ""}`);

  if (dryRun) return;

  if (!admin.apps.length) {
    admin.initializeApp();
  }

  const db = admin.firestore();
  const batch = db.batch();

  ideas.forEach((idea) => {
    const ref = db.collection("ideas").doc();
    batch.set(ref, idea);
  });

  await batch.commit();
  console.log(`Imported ${ideas.length} idea(s).`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
