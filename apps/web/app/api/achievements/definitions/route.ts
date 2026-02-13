import { jsonResponse } from "@/lib/api-helpers";
import { ACHIEVEMENT_DEFINITIONS } from "@skatespot/shared";

export async function GET() {
  // Filter out secret badges from public list (show name but mark as secret)
  const definitions = ACHIEVEMENT_DEFINITIONS.map((d) => ({
    ...d,
    description: d.secret ? "???" : d.description,
    requirement: d.secret ? "???" : d.requirement,
  }));

  return jsonResponse(definitions);
}
