import { strict as assert } from 'assert';
import { getOrCreateClients } from './utils/test-setup';
import { Cigar, SignifyClient, b } from 'signify-ts';
import { getGrantedCredential } from './singlesig-vlei-issuance.test';

const ECR_SCHEMA_SAID = 'EEy9PkikFcANV1l7EHukCeXqrzT1hNZjGlUk7wuMO5jw';

// This test assumes you have run a vlei test that sets up the glief, qvi, le, and
// role identifiers and Credentials.
test('vlei-verification', async function run() {
    // these come from a previous test (ex. singlesig-vlei-issuance.test.ts)
    const bran = 'Cqmi-2wL78XQl4_GNtLhP'; //taken from SIGNIFY_SECRETS output during singlesig-vlei-issuance.test.ts
    const aidName = 'role';
    const [roleClient] = await getOrCreateClients(1, [bran]);
    try {
        // let resp = await roleClient.signedFetch(aidName,
        //     'http://127.0.0.1:7676',
        //     '/health',
        //     {method: 'GET',
        //     body: null,}
        // );
        // assert.equal(200,resp.status)

        let ecrCreds = await roleClient.credentials().list();
        assert(ecrCreds.length > 0);
        let ecrCred = ecrCreds.find(
            (cred: any) => cred.sad.s === ECR_SCHEMA_SAID
        );
        let ecrCredHolder = await getGrantedCredential(
            roleClient, 
            ecrCred.sad.d
        );
        assert(ecrCred !== undefined);
        assert.equal(ecrCredHolder.sad.d, ecrCred.sad.d);
        assert.equal(ecrCredHolder.sad.s, ECR_SCHEMA_SAID);
        assert.equal(ecrCredHolder.status.s, '0');
        assert(ecrCredHolder.atc !== undefined);
        let ecrCredCesr = await roleClient
            .credentials()
            .get(ecrCred.sad.d, true);

        let heads = new Headers();
        heads.set('Content-Type', 'application/json+cesr');
        let reqInit = { headers: heads, method: 'PUT', body: ecrCredCesr };
        // resp = await roleClient.signedFetch(
        //     aidName,
        //     'http://localhost:7676',
        //     `/presentations/${ecrCred.sad.d}`,
        //     reqInit
        // );
        // assert.equal(202, resp.status);

        let data = "\"@method\": null\n\"@path\": /request/verify/EP4kdoVrDh4Mpzh2QbocUYIv4IjLZLDU367UO0b40f6x\n\"signify-resource\": EP4kdoVrDh4Mpzh2QbocUYIv4IjLZLDU367UO0b40f6x\n\"signify-timestamp\": 2024-05-03T19:21:16.745000+00:00\n\"@signature-params: (@method @path signify-resource signify-timestamp);created=1714764449;keyid=BPoZo2b3r--lPBpURvEDyjyDkS65xBEpmpQhHQvrwlBE;alg=ed25519\"";
        // let raw = new TextEncoder().encode(data)
        let sig = "0BCQvbyYRY3sy_6XRWTVBNb4Ecyeuj3L6gW5xAgAIq4G6s1hO6B6LERdstaaTHCT2ZZn1ghvq-XReS0hLNFdn_sG"
        // let cig = new Cigar({ qb64: sig as string })
        let ecrAid = await roleClient.identifiers().get(aidName);
        // const keeper = this.manager!.get(ecrAid);
        // const signed_headers = authenticator.sign(
        //     new Headers(headers),
        //     headers.get('method')!,
        //     path.split('?')[0]
        // );

        // const authenticator = new Authenticater(
        //     keeper.signers[0],
        //     keeper.signers[0].verfer
        // );
        let params = new URLSearchParams({
            data: data,
            sig: sig
        }).toString();
        heads = new Headers();
        heads.set("method", "POST");
        reqInit = { headers: heads, method: "POST", body: null };
        // resp = await roleClient.signedFetch(aidName,
        //     'http://localhost:7676',
        //     `/request/verify/${ecrAid.prefix}?${params}`,
        //     {method: "POST",body: null}
            
        // );
        // assert.equal(resp.status, 401) //signature is from a different AID and should not pass

        heads = new Headers();
        heads.set('Content-Type', 'application/json');
        reqInit = { headers: heads, method: 'GET', body: null };
        let resp = await roleClient.signedFetch(aidName,
            'http://localhost:7676',
            `/authorizations/${ecrAid.prefix}`,
            {method: 'GET',
            body: null,}
        );
        assert.equal(200, resp.status);
        let body = await resp.json();
        assert.equal(body['aid'], `${ecrAid.prefix}`);
        assert.equal(body['said'], `${ecrCred.sad.d}`);
    } catch (e) {
        console.log(e);
        fail(e);
    }
});
