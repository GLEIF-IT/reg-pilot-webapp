import { strict as assert } from "assert";
import { getOrCreateClients } from "./utils/test-setup";
import { Cigar, HEADER_SIG_INPUT, HEADER_SIG_TIME, SaltyKeeper } from "signify-ts";
import { getGrantedCredential } from "./singlesig-vlei-issuance.test";

const ECR_SCHEMA_SAID = "EEy9PkikFcANV1l7EHukCeXqrzT1hNZjGlUk7wuMO5jw";

// This test assumes you have run a vlei test that sets up the glief, qvi, le, and
// role identifiers and Credentials.
test("vlei-server", async function run() {
  // these come from a previous test (ex. singlesig-vlei-issuance.test.ts)
  const bran = "Cqmi-2wL78XQl4_GNtLhP"; //taken from SIGNIFY_SECRETS output during singlesig-vlei-issuance.test.ts
  const aidName = "role";
  const [roleClient] = await getOrCreateClients(1, [bran]);
  try {
    let resp = await fetch("http://127.0.0.1:8000/ping", {
      method: "GET",
      body: null,
    });
    assert.equal(resp.status, 200);
    let pong = await resp.text();
    assert.equal(pong, "Pong");

    let ecrCreds = await roleClient.credentials().list();
    assert(ecrCreds.length > 0);
    let ecrCred = ecrCreds.find((cred: any) => cred.sad.s === ECR_SCHEMA_SAID);
    let ecrCredHolder = await getGrantedCredential(roleClient, ecrCred.sad.d);
    assert(ecrCred !== undefined);
    assert.equal(ecrCredHolder.sad.d, ecrCred.sad.d);
    assert.equal(ecrCredHolder.sad.s, ECR_SCHEMA_SAID);
    assert.equal(ecrCredHolder.status.s, "0");
    assert(ecrCredHolder.atc !== undefined);
    let ecrCredCesr = await roleClient.credentials().get(ecrCred.sad.d, true);

    let heads = new Headers();
    heads.set("Content-Type", "application/json");
    let reqInit1 = {
      headers: heads,
      method: "POST",
      body: JSON.stringify({ said: ecrCred.sad.d, vlei: ecrCredCesr }),
    };
    resp = await fetch("http://localhost:8000/login", reqInit1);
    assert.equal(resp.status, 202);

    let ecrAid = await roleClient.identifiers().get(aidName);
    heads = new Headers();
    heads.set("Content-Type", "application/json");
    let reqInit2 = { headers: heads, method: "GET", body: null };
    resp = await roleClient.signedFetch(
      aidName,
      "http://localhost:8000",
      `/checklogin/${ecrAid.prefix}`,
      reqInit2
    );
    assert.equal(200, resp.status);
    let body = await resp.json();
    assert.equal(body["aid"], `${ecrAid.prefix}`);
    assert.equal(body["said"], `${ecrCred.sad.d}`);

    heads = new Headers();
    heads.set("Content-Type", "application/json");
    let reqInit3 = { headers: heads, method: "GET", body: null };
    resp = await roleClient.signedFetch(
        aidName,
        `http://localhost:8000`,
        `/status/${ecrAid.prefix}`,
        reqInit3
    );
    assert.equal(200, resp.status);
    body = await resp.text();
    assert.equal(JSON.parse(body)[ecrAid.prefix].length, 0); // empty upload list

    // const keeper = roleClient.manager!.get(ecrAid) as SaltyKeeper;
    // const signer = keeper.signers[0];
    // const created = lastHeaders
    //     .get(HEADER_SIG_INPUT)
    //     ?.split(';created=')[1]
    //     .split(';keyid=')[0];
    // const data = `"@method": POST\n"@path": /test\n"signify-resource": ELUvZ8aJEHAQE-0nsevyYTP98rBbGJUrTj5an-pCmwrK\n"signify-timestamp": ${lastHeaders.get(
    //     HEADER_SIG_TIME
    // )}\n"@signature-params: (@method @path signify-resource signify-timestamp);created=${created};keyid=BPmhSfdhCPxr3EqjxzEtF8TVy0YX7ATo0Uc8oo2cnmY9;alg=ed25519"`;

    // if (data) {
    //     const raw = new TextEncoder().encode(data);
    //     const sig = signer.sign(raw, null) as Cigar;
    //     assert.equal(
    //         sig.qb64,
    //         lastHeaders
    //             .get('signature')
    //             ?.split('signify="')[1]
    //             .split('"')[0]
    //     );
    // } else {
    //     fail(`${HEADER_SIG_INPUT} is empty`);
    // }

  } catch (e) {
    console.log(e);
    fail(e);
  }
});
