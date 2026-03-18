#!/usr/bin/env node
/**
 * Run pending migrations against the remote Supabase database.
 * Usage: node scripts/run-migrations.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

// Load .env.local
const envFile = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

// We need to use the pg client directly for DDL statements
// Since pg isn't installed, we'll use the Supabase Management API
// Actually, let's just print the SQL for the user to paste

const migrationsDir = "supabase/migrations";
const files = readdirSync(migrationsDir).filter(f => f.endsWith(".sql")).sort();

console.log("=== Migrations to run ===");
console.log("Paste the following SQL into your Supabase SQL Editor:\n");
console.log("-- ============================================");
console.log("-- Combined migrations 00002 through 00006");
console.log("-- ============================================\n");

for (const file of files) {
  if (file === "00001_initial_schema.sql") continue; // Skip initial (already applied)
  const sql = readFileSync(join(migrationsDir, file), "utf8");
  console.log(`-- === ${file} ===`);
  console.log(sql);
  console.log("");
}
