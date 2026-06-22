import { promises as fs } from "fs";
import path from "path";
import type { CallRecord } from "./types";

const DEFAULT_DATA_PATH = path.join(process.cwd(), "data", "calls.json");

function getDataFilePath(): string {
  return process.env.DATA_FILE_PATH ?? DEFAULT_DATA_PATH;
}

async function ensureDataFile(): Promise<void> {
  const filePath = getDataFilePath();
  const dir = path.dirname(filePath);

  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]", "utf-8");
  }
}

export async function readCalls(): Promise<CallRecord[]> {
  await ensureDataFile();
  const filePath = getDataFilePath();
  const raw = await fs.readFile(filePath, "utf-8");
  const parsed = JSON.parse(raw) as CallRecord[];

  return parsed.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

export async function appendCall(record: CallRecord): Promise<CallRecord> {
  await ensureDataFile();
  const filePath = getDataFilePath();
  const calls = await readCalls();

  const existingIndex = calls.findIndex((call) => call.run_id === record.run_id);
  if (existingIndex >= 0) {
    calls[existingIndex] = record;
  } else {
    calls.unshift(record);
  }

  await fs.writeFile(filePath, JSON.stringify(calls, null, 2), "utf-8");
  return record;
}
