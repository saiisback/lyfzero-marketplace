import { ConnectWallet, useContract, useActiveListings, MediaRenderer, useBuyNow } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { NFT_COLLECTION_ADDRESS, MARKETPLACE_ADDRESS } from "../const/addresses";
import { BigNumber } from "ethers";
import Link from "next/link";

const Home: NextPage = () => {
  const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace");
  const { data: listings, isLoading: isListingsLoading } = useActiveListings(marketplace);
  const { mutate: buyNow, isLoading: isBuyNowLoading } = useBuyNow(marketplace);

  async function buyNft(listingId: string) {
    try {
      await buyNow({ id: listingId, buyAmount: 1, type: 0 });
    } catch (error) {
      console.error(error);
      alert("Error buying NFT");
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Carbon Credit Marketplace
          </h1>

          <p className={styles.description}>
            Buy and sell carbon credit NFTs.
          </p>

          <div className={styles.connect}>
            <ConnectWallet />
            <Link href="/profile">Profile</Link>
          </div>
        </div>

        <div className={styles.grid}>
          {isListingsLoading ? (
            <p>Loading...</p>
          ) : (
            listings?.map((listing) => (
              <div className={styles.card} key={listing.id.toString()}>
                <MediaRenderer src={listing.asset.image} />
                <h2>{listing.asset.name}</h2>
                <p>{listing.asset.description}</p>
                <p>Price: {listing.buyoutCurrencyValuePerToken.displayValue} {listing.buyoutCurrencyValuePerToken.symbol}</p>
                <button onClick={() => buyNft(listing.id)} disabled={isBuyNowLoading}>
                  {isBuyNowLoading ? "Buying..." : "Buy Now"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;