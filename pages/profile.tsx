import { ConnectWallet, useContract, useOwnedNFTs, useCreateDirectListing, ThirdwebNftMedia, useAddress } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { NFT_COLLECTION_ADDRESS, MARKETPLACE_ADDRESS } from "../const/addresses";
import { FormEvent, useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";

const Profile: NextPage = () => {
    const router = useRouter();
    const address = useAddress();
    const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);
    const { contract: marketplace } = useContract(MARKETPLACE_ADDRESS, "marketplace");
    const { data: ownedNfts, isLoading: isOwnedNftsLoading } = useOwnedNFTs(nftCollection, router.query.address as string || address);
    const { mutate: createDirectListing, isLoading: isListingLoading } = useCreateDirectListing(marketplace);
    const [listingPrice, setListingPrice] = useState("0");

    async function handleListNft(e: FormEvent, tokenId: string) {
        e.preventDefault();
        try {
            await createDirectListing({ assetContractAddress: NFT_COLLECTION_ADDRESS, tokenId, buyoutPricePerToken: listingPrice, quantity: 1, currencyContractAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', startTimestamp: new Date(), listingDurationInSeconds: 60 * 60 * 24 * 7 });
            window.location.href = '/';
        } catch (error) {
            console.error(error);
            alert("Error listing NFT");
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        Your Profile
                    </h1>
                    <div className={styles.connect}>
                        <ConnectWallet />
                        <Link href="/">Home</Link>
                    </div>
                </div>

                <div className={styles.grid}>
                    {isOwnedNftsLoading ? (
                        <p>Loading...</p>
                    ) : (
                        ownedNfts?.map((nft) => (
                            <div className={styles.card} key={nft.metadata.id.toString()}>
                                <ThirdwebNftMedia metadata={nft.metadata} />
                                <h2>{nft.metadata.name}</h2>
                                <p>{nft.metadata.description}</p>
                                <form onSubmit={(e) => handleListNft(e, nft.metadata.id)}>
                                    <input type="text" name="price" value={listingPrice} onChange={(e) => setListingPrice(e.target.value)} />
                                    <button type="submit" disabled={isListingLoading}>
                                        {isListingLoading ? "Listing..." : "List for Sale"}
                                    </button>
                                </form>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
};

export default Profile;
