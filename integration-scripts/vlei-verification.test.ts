import { strict as assert } from "assert";
import { getOrCreateClients } from "./utils/test-setup";
import { Cigar, SaltyKeeper, SignifyClient, b } from "signify-ts";

const ECR_SCHEMA_SAID = "EEy9PkikFcANV1l7EHukCeXqrzT1hNZjGlUk7wuMO5jw";

// This test assumes you have run a vlei test that sets up the glief, qvi, le, and
// role identifiers and Credentials.
test("vlei-verification", async function run() {
  // these come from a previous test (ex. singlesig-vlei-issuance.test.ts)
  const bran = "CzbbO_ew6kZjwAJzztkca"; //taken from SIGNIFY_SECRETS
  const aidName = "role";
  const [roleClient] = await getOrCreateClients(1, [bran]);
  try {
    let hreq = await roleClient.createSignedRequest(
      aidName,
      "http://127.0.0.1:7676/health",
      { method: "GET", body: null }
    );
    let hres = await fetch(hreq);
    assert.equal(200, hres.status);

    let ecrCreds = await roleClient.credentials().list();
    let ecrCred = ecrCreds.find((cred: any) => cred.sad.s === ECR_SCHEMA_SAID);
    let ecrCredHolder = await getGrantedCredential(roleClient, ecrCred.sad.d);
    assert(ecrCred !== undefined);
    assert.equal(ecrCredHolder.sad.d, ecrCred.sad.d);
    assert.equal(ecrCredHolder.sad.s, ECR_SCHEMA_SAID);
    assert.equal(ecrCredHolder.status.s, "0");
    assert(ecrCredHolder.atc !== undefined);
    let ecrCredCesr = await roleClient.credentials().get(ecrCred.sad.d, true);

    let heads = new Headers();
    heads.set("Content-Type", "application/json+cesr");
    let reqInit = { headers: heads, method: "PUT", body: ecrCredCesr };
    let pres = await fetch(
      `http://localhost:7676/presentations/${ecrCred.sad.d}`,
      reqInit
    );
    assert.equal(202, pres.status);

    let data = "this is the raw data";
    let raw = new TextEncoder().encode(data);
    let ecrAid = await roleClient.identifiers().get(aidName);

    const keeper = roleClient.manager!.get(ecrAid) as SaltyKeeper;
    const signer = keeper.signers[0];
    const sig = signer.sign(raw, null) as Cigar;

    let params = new URLSearchParams({
      data: data,
      sig: sig.qb64,
    }).toString();
    heads = new Headers();
    heads.set("method", "POST");
    reqInit = { headers: heads, method: "POST", body: null };
    let vresp = await fetch(
      `http://localhost:7676/request/verify/${ecrAid.prefix}?${params}`,
      reqInit
    );
    assert.equal(202, vresp.status);

    heads.set("Content-Type", "application/json");
    reqInit = { headers: heads, method: "GET", body: null };
    let areq = await roleClient.createSignedRequest(
      aidName,
      `http://localhost:7676/authorizations/${ecrAid.prefix}`,
      reqInit
    );
    let aresp = await fetch(areq);
    assert.equal(200, aresp.status);
    let body = await aresp.json();
    assert.equal(body["aid"], `${ecrAid.prefix}`);
    assert.equal(body["said"], `${ecrCred.sad.d}`);
  } catch (e) {
    console.log(e);
    fail(e);
  }
});

export async function getGrantedCredential(
  client: SignifyClient,
  credId: string
): Promise<any> {
  const credentialList = await client.credentials().list({
    filter: { "-d": credId },
  });
  let credential: any;
  if (credentialList.length > 0) {
    assert.equal(credentialList.length, 1);
    credential = credentialList[0];
  }
  return credential;
}
