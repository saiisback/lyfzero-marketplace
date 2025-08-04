/// <reference path="./types.d.ts" />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { ThirdwebSDK } from 'https://esm.sh/@thirdweb-dev/sdk@4.0.99'; // Use esm.sh for Deno compatibility

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { sellerAddress, nftContractAddress } = await req.json();

  if (typeof sellerAddress !== 'string' || typeof nftContractAddress !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid request body: sellerAddress and nftContractAddress must be strings.' }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const adminPrivateKey = Deno.env.get("THIRDWEB_ADMIN_PRIVATE_KEY");
  if (!adminPrivateKey) {
    return new Response(JSON.stringify({ error: 'THIRDWEB_ADMIN_PRIVATE_KEY not set in environment variables.' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sdk = ThirdwebSDK.fromPrivateKey(
    adminPrivateKey,
    "ethereum" // Or your desired chain, e.g., "sepolia"
  );

  try {
    const nftCollection = await sdk.getContract(nftContractAddress);
    await nftCollection.roles.grant("minter", sellerAddress);

    return new Response(JSON.stringify({ success: true, message: `Minter role granted to ${sellerAddress}` }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});