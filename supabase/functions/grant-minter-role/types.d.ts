/// <reference types="https://deno.land/x/types/mod.d.ts" />

declare global {
  const Deno: {
    env: {
      get(key: string): string | undefined;
    };
  };
}

// Declare modules for external dependencies
declare module 'https://deno.land/std@0.168.0/http/server.ts' {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module 'https://esm.sh/@thirdweb-dev/sdk@4.0.99' {
  export class ThirdwebSDK {
    static fromPrivateKey(privateKey: string, chain: string): ThirdwebSDK;
    getContract(address: string): Promise<any>;
  }
}

export {};
