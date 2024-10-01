export async function generateFileDigest(buffer: ArrayBuffer): Promise<string> {
  const algoBrowser = "SHA-256";
  const digest = await hash(buffer, algoBrowser);
  const algoServer = "sha256";
  const prefixDigest = `${algoServer}-${digest}`;
  return prefixDigest;
}

async function hash(data: ArrayBuffer, algo: string): Promise<string> {
  const hashBuffer = await window.crypto.subtle.digest(algo, data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
