const test = require("node:test");
const assert = require("node:assert/strict");
const { db } = require("../src/config/firebase");

test("Firestore connectivity: write, read back, and delete a document", async () => {
  const ref = db.collection("_diagnostics").doc("connectivity-check");
  const payload = { checkedAt: new Date().toISOString(), ok: true };

  await ref.set(payload);

  const snap = await ref.get();
  assert.equal(snap.exists, true, "document should exist immediately after write");
  assert.equal(snap.data().ok, true);
  assert.equal(snap.data().checkedAt, payload.checkedAt);

  await ref.delete();

  const afterDelete = await ref.get();
  assert.equal(afterDelete.exists, false, "document should be gone after delete");
});
