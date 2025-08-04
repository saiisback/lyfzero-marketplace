import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { ThirdwebSDK } from '@thirdweb-dev/sdk';

serve(async (req) => {
  const { sellerAddress, nftContractAddress } = await req.json();

  const sdk = ThirdwebSDK.fromPrivateKey(
    Deno.env.get("THIRDWEB_ADMIN_PRIVATE_KEY")!,
    "ethereum"
  );

  const nftCollection = await sdk.getContract(nftContractAddress);

  try {
    await nftCollection.roles.grant("minter", sellerAddress);
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
