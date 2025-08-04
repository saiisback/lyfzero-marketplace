import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { ThirdwebSDK } from "https://esm.sh/@thirdweb-dev/sdk@4.0.99";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  sellerAddress: string;
  nftContractAddress: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const { sellerAddress, nftContractAddress } = (await req.json()) as RequestBody;

    if (!sellerAddress || !nftContractAddress) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: sellerAddress and nftContractAddress are required.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const adminPrivateKey = Deno.env.get("THIRDWEB_ADMIN_PRIVATE_KEY");
    if (!adminPrivateKey) {
      console.error("THIRDWEB_ADMIN_PRIVATE_KEY not set");
      return new Response(
        JSON.stringify({
          error: "Internal Server Error: Missing required environment variable.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    const sdk = ThirdwebSDK.fromPrivateKey(adminPrivateKey, "sepolia"); // Changed to sepolia for example

    const nftCollection = await sdk.getContract(nftContractAddress, "nft-collection");

    await nftCollection.roles.grant("minter", sellerAddress);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Minter role granted to ${sellerAddress}`,
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});