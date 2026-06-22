import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth";
import { appendCall, readCalls } from "@/lib/storage";
import { callPayloadSchema, toCallRecord } from "@/lib/validation";

export async function GET() {
  try {
    const calls = await readCalls();
    return NextResponse.json({ calls, count: calls.length });
  } catch (error) {
    console.error("Failed to read calls:", error);
    return NextResponse.json({ error: "Failed to read calls" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = callPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }

  try {
    const record = toCallRecord(parsed.data);
    await appendCall(record);

    return NextResponse.json(
      {
        success: true,
        id: record.id,
        run_id: record.run_id,
        received_at: record.received_at,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to store call:", error);
    return NextResponse.json({ error: "Failed to store call" }, { status: 500 });
  }
}
