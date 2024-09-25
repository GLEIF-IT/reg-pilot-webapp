export async function generateFileDigest(buffer: ArrayBuffer): Promise<string> {
  const algo = "SHA-256";
  const digest = await hash(buffer, algo);
  const prefixeDigest = `${algo.toLowerCase()}-${digest}`;
  return prefixeDigest;
}

async function hash(data: ArrayBuffer, algo: string): Promise<string> {
  const hashBuffer = await window.crypto.subtle.digest(algo, data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
