import { ThirdwebAuth } from "@thirdweb-dev/auth-nextjs";
import { PrivateKeyWallet } from "@thirdweb-dev/auth-nextjs/evm";
import { supabase } from "@/lib/supabase";

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  wallet: new PrivateKeyWallet(process.env.THIRDWEB_AUTH_PRIVATE_KEY || ""),
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
  callbacks: {
    onLogin: async (address) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', address)
        .single();

      if (!data) {
        await supabase.from('users').insert({ wallet_address: address, role: 'user' });
      }

      return { role: data?.role || 'user' };
    },
    onUser: async (user) => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', user.address)
        .single();

      return {
        ...user,
        role: data?.role || 'user',
      };
    },
  },
});

export { ThirdwebAuthHandler as GET, ThirdwebAuthHandler as POST };
