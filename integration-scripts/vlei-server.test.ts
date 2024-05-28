import { strict as assert } from "assert";
import { getOrCreateClients } from "./utils/test-setup";
import { getGrantedCredential } from "./singlesig-vlei-issuance.test";
import fs from 'fs';
import FormData from 'form-data';

const ECR_SCHEMA_SAID = "EEy9PkikFcANV1l7EHukCeXqrzT1hNZjGlUk7wuMO5jw";

// This test assumes you have run a vlei test that sets up the glief, qvi, le, and
// role identifiers and Credentials.
test("vlei-server", async function run() {
  // these come from a previous test (ex. singlesig-vlei-issuance.test.ts)
  //SIGNIFY_SECRETS="DhIHlQNue4aNzoCeRsNYe,Akfzi1vVCVDQOMk8RwGdQ,AJx9ZGQrD_U_pPIy5RMLY,Ap31Xt-FGcNXpkxmBYMQn"
  const bran = "Ap31Xt-FGcNXpkxmBYMQn"; //taken from SIGNIFY_SECRETS output during singlesig-vlei-issuance.test.ts
  const aidName = "role";
  const [roleClient] = await getOrCreateClients(1, [bran]);
  const url = "https://reg-api.rootsid.cloud"

    let resp1 = await fetch(`${url}/ping`, {
        method: "GET",
        body: null,
    });
    assert.equal(resp1.status, 200);
    let pong = await resp1.text();
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

    let heads2 = new Headers();
    heads2.set("Content-Type", "application/json");
    let reqInit2 = {
      headers: heads2,
      method: "POST",
      body: JSON.stringify({ said: ecrCred.sad.d, vlei: ecrCredCesr }),
    };
    let resp2 = await fetch(`${url}/login`, reqInit2);
    assert.equal(resp2.status, 202);

    let ecrAid = await roleClient.identifiers().get(aidName);
    let heads3 = new Headers();
    heads3.set("Content-Type", "application/json");
    let reqInit3 = { headers: heads3, method: "GET", body: null };
    let chreq = await roleClient.createSignedRequest(
      aidName,
      `${url}/checklogin/${ecrAid.prefix}`,
      reqInit3
    );
    let chres = await fetch(chreq);
    assert.equal(200, chres.status);
    let body = await chres.json();
    assert.equal(body["aid"], `${ecrAid.prefix}`);
    assert.equal(body["said"], `${ecrCred.sad.d}`);

    let heads4 = new Headers();
    heads4.set("Content-Type", "application/json");
    let reqInit4 = { headers: heads4, method: "GET", body: null };
    let sreq = await roleClient.createSignedRequest(
        aidName,
        `${url}/status/${ecrAid.prefix}`,
        reqInit4
    );
    let sres = await fetch(sreq);
    assert.equal(sres.status,200);
    let body4 = await sres.json();
    let parsedBody4 = body4[0];
    assert.equal('msg' in parsedBody4, true);

    // try uploading a report that is signed by an unknown aid
    let unknown_report_zip = fs.readFileSync('../data/report.zip');
    let formData = new FormData();
    formData.append('upload', unknown_report_zip, { filename: 'report.zip', contentType: 'application/zip' });
    let formBuffer = formData.getBuffer();
    let reqInit5: RequestInit = {
        method: 'POST',
        body: formBuffer,
        headers: {
            ...formData.getHeaders(),
            'Content-Length': formBuffer.length.toString()
        }
    };
    let ureq = await roleClient.createSignedRequest(
        aidName,
        `${url}/upload/${ecrAid.prefix}/${ecrCred.sad.d}`,
        reqInit5
    );
    let ures = await fetch(ureq);
    assert.equal(ures.status,202);
    let body5 = await ures.json();
    let parsedBody5 = body5;
    assert.equal('msg' in parsedBody5, true);
    assert.equal(parsedBody5['msg'], `Upload ${ecrCred.sad.d} received from ${ecrAid.prefix}`);
}, 100000);
