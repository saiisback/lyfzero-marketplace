import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

// Create the client with your clientId, or secretKey if in a server environment
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// Define the chain you want to work with
export const chain = defineChain(11155111); // Sepolia testnet, change as needed

// Helper function to get a contract
export function getThirdwebContract(contractAddress: string) {
  return getContract({
    client,
    chain,
    address: contractAddress,
  });
}