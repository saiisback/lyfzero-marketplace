# Supabase Edge Functions

This directory contains Supabase Edge Functions that run on Deno runtime.

## Functions

### grant-minter-role

Grants minter role to a seller address for a specific NFT contract.

**Endpoint:** POST `/functions/v1/grant-minter-role`

**Payload:**
```json
{
  "sellerAddress": "0x...",
  "nftContractAddress": "0x..."
}
```

**Environment Variables Required:**
- `THIRDWEB_ADMIN_PRIVATE_KEY`: Private key of the admin wallet that has permission to grant roles

## Development

These functions are written for Deno runtime and use HTTP imports. They are excluded from the main TypeScript configuration to avoid conflicts with Node.js dependencies.

To test locally:
```bash
supabase functions serve
```

To deploy:
```bash
supabase functions deploy grant-minter-role
```
