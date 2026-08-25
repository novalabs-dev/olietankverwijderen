import { describe, it, expect, beforeEach, vi } from "vitest";

const h = vi.hoisted(() => {
  const sendLeadEmails = vi.fn(async () => undefined);
  const state: {
    existing: { id: string } | null;
    inserted: Record<string, unknown> | undefined;
    updated: Record<string, unknown> | undefined;
    updateId: string | undefined;
  } = { existing: null, inserted: undefined, updated: undefined, updateId: undefined };

  const makeClient = () => {
    const qb: Record<string, unknown> = {};
    qb.select = () => qb;
    qb.eq = (col: string, val: string) => { if (col === "id") state.updateId = val; return qb; };
    qb.gte = () => qb;
    qb.order = () => qb;
    qb.limit = () => qb;
    qb.maybeSingle = async () => ({ data: state.existing, error: null });
    qb.insert = (payload: Record<string, unknown>) => { state.inserted = payload; return qb; };
    qb.single = async () => ({ data: { id: "new-id" }, error: null });
    qb.update = (payload: Record<string, unknown>) => { state.updated = payload; return qb; };
    qb.then = (resolve: (v: { data: null; error: null }) => unknown) =>
      resolve({ data: null, error: null });
    return { from: () => qb };
  };
  return { sendLeadEmails, state, makeClient };
});

vi.mock("@/lib/email/send-lead-emails", () => ({ sendLeadEmails: h.sendLeadEmails }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: h.makeClient }));

import { POST } from "./route";

function makeReq(body: unknown) {
  return {
    json: async () => body,
    headers: { get: () => null },
  } as unknown as Parameters<typeof POST>[0];
}

const validLead = {
  naam: "Jan de Vries",
  email: "jan@example.nl",
  telefoon: "0612345678",
  postcode: "4873 LG",
  type_dienst: "verwijdering" as const,
};

beforeEach(() => {
  h.state.existing = null;
  h.state.inserted = undefined;
  h.state.updated = undefined;
  h.state.updateId = undefined;
  h.sendLeadEmails.mockClear();
});

describe("POST /api/leads — dedup", () => {
  it("slaat een nieuwe lead op en mailt", async () => {
    const res = await POST(makeReq(validLead));
    expect(res.status).toBe(201);
    expect(h.state.inserted).toBeTruthy();
    expect(h.sendLeadEmails).toHaveBeenCalledOnce();
  });

  it("dedupt een herhaalde inzending: werkt bij, geen insert, geen tweede mail", async () => {
    // 2026-06-26: dezelfde aanvrager diende binnen drie minuten twee keer in.
    // Er was geen dedup, dus dat werden twee losse leads voor een aanvraag.
    h.state.existing = { id: "bestaand-id" };
    const res = await POST(makeReq(validLead));
    expect(res.status).toBe(200);
    expect(h.state.inserted).toBeUndefined();
    expect(h.state.updated).toBeTruthy();
    expect(h.state.updateId).toBe("bestaand-id");
    expect(h.sendLeadEmails).not.toHaveBeenCalled();
  });

  it("dedup werkt ook als de tweede inzending anders geschreven is", async () => {
    h.state.existing = { id: "bestaand-id" };
    const res = await POST(makeReq({
      ...validLead, postcode: "4873lg", email: "JAN@example.nl",
    }));
    expect(res.status).toBe(200);
    expect(h.state.inserted).toBeUndefined();
  });

  it("een dedup-update mag de status niet terugzetten", async () => {
    // De pipeline kan de lead al aan het verwerken zijn.
    h.state.existing = { id: "bestaand-id" };
    await POST(makeReq(validLead));
    expect(h.state.updated).toBeTruthy();
    expect(h.state.updated).not.toHaveProperty("status");
    expect(h.state.updated).not.toHaveProperty("bron");
  });
});
