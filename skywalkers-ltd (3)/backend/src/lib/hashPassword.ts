import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run hash-password -- <your-new-admin-password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\nAdd this to backend/.env:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
