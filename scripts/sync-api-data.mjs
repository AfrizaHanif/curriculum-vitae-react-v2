import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL otomatis mendeteksi jika API_ENDPOINT dioper dari workflow lama
const rawEndpoint = process.env.API_ENDPOINT || "";
const API_BASE_URL =
  process.env.API_BASE_URL ||
  (rawEndpoint ? rawEndpoint.replace(/\/profiles\/?$/, "") : "https://api.afrizahanif.com/api");

const FAIL_ON_ERROR = process.env.FAIL_ON_SYNC_ERROR !== "false";
const API_SECRET_TOKEN = process.env.API_SECRET_TOKEN || "";
const JSON_DIR = path.resolve(__dirname, "../src/data/jsons");

// Daftar 18 endpoint API dan target berkas JSON lokal yang disinkronkan
const SYNC_RESOURCES = [
  { endpoint: "profiles", file: "profiles.json", allowEmpty: false },
  { endpoint: "socials", file: "socials.json", allowEmpty: false },
  { endpoint: "setups?all=true", file: "setups.json", allowEmpty: false },
  { endpoint: "skills?all=true", file: "skills.json", allowEmpty: false },
  { endpoint: "educations?all=true", file: "educations.json", allowEmpty: false },
  { endpoint: "experiences?all=true", file: "experiences.json", allowEmpty: false },
  { endpoint: "certificates?all=true", file: "certificates.json", allowEmpty: false },
  { endpoint: "portfolios?all=true", file: "portfolios.json", allowEmpty: false },
  { endpoint: "projects?all=true", file: "projects.json", allowEmpty: false },
  { endpoint: "features?all=true", file: "features.json", allowEmpty: false },
  { endpoint: "feature-projects?all=true", file: "feature-projects.json", allowEmpty: false },
  { endpoint: "case-studies?all=true", file: "case-studies.json", allowEmpty: false },
  { endpoint: "diagrams?all=true", file: "diagrams.json", allowEmpty: false },
  { endpoint: "solutions?all=true", file: "solutions.json", allowEmpty: false },
  { endpoint: "repositories?all=true", file: "repositories.json", allowEmpty: false },
  { endpoint: "testimonies?all=true", file: "testimonials.json", allowEmpty: true }, // array kosong [] diperbolehkan
  { endpoint: "hobbies?all=true", file: "hobbies.json", allowEmpty: false },
  { endpoint: "expertises?all=true", file: "expertises.json", allowEmpty: false },
];

async function syncAllData() {
  console.log(`[Sync-Data] 🚀 Memulai sinkronisasi ${SYNC_RESOURCES.length} dataset dari: ${API_BASE_URL}`);

  let successCount = 0;
  let failedCount = 0;
  const errors = [];

  const headers = {
    Accept: "application/json",
    "User-Agent": "GitHub-Actions-CI-Build-Sync",
  };

  if (API_SECRET_TOKEN) {
    headers["Authorization"] = `Bearer ${API_SECRET_TOKEN}`;
  }

  for (const resource of SYNC_RESOURCES) {
    const url = `${API_BASE_URL.replace(/\/+$/, "")}/${resource.endpoint.replace(/^\/+/, "")}`;
    const targetPath = path.join(JSON_DIR, resource.file);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const payload = await response.json();

      if (!payload || typeof payload !== "object" || payload.data === undefined) {
        throw new Error("Invalid payload: properti 'data' tidak ditemukan");
      }

      if (!resource.allowEmpty && Array.isArray(payload.data) && payload.data.length === 0) {
        throw new Error("Payload 'data' kosong padahal endpoint diharapkan berisi data");
      }

      const formattedJson = JSON.stringify(payload.data, null, 2) + "\n";
      await fs.writeFile(targetPath, formattedJson, "utf-8");

      const count = Array.isArray(payload.data) ? `${payload.data.length} item` : "1 objek";
      console.log(`[Sync-Data] ✅ ${resource.file.padEnd(22)}: ${count} tersinkronisasi`);
      successCount++;
    } catch (err) {
      console.error(`[Sync-Data] ❌ ${resource.file.padEnd(22)}: Gagal (${err.message})`);
      failedCount++;
      errors.push({ resource: resource.file, message: err.message });
    }
  }

  console.log(`\n[Sync-Data] 📊 Ringkasan: ${successCount} berhasil, ${failedCount} gagal dari ${SYNC_RESOURCES.length} dataset.`);

  if (failedCount > 0) {
    if (FAIL_ON_ERROR) {
      console.error("[Sync-Data] 🚫 Gagal sinkronisasi beberapa dataset dan FAIL_ON_SYNC_ERROR bernilai true. Membatalkan proses...");
      process.exit(1);
    } else {
      console.warn("[Sync-Data] ⚠️ Menggunakan data fallback lokal yang ada karena FAIL_ON_SYNC_ERROR bernilai false.");
    }
  } else {
    console.log("[Sync-Data] ✨ Seluruh dataset berhasil disinkronkan secara mutakhir!");
  }
}

syncAllData();
