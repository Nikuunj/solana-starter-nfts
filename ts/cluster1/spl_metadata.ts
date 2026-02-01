    import wallet from "./wallet/wallet.json"
    import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
    import { 
        createMetadataAccountV3, 
        CreateMetadataAccountV3InstructionAccounts, 
        CreateMetadataAccountV3InstructionArgs,
        DataV2Args,
        findMetadataPda
    } from "@metaplex-foundation/mpl-token-metadata";
    import { createSignerFromKeypair, signerIdentity, publicKey, some } from "@metaplex-foundation/umi";
    import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

    // Define our Mint address
    const mint = publicKey("GgKSCgGXbWy55Ni9Z1Tbmh6RRLkQvBJUn3Tyx7f46dNW")

    // Create a UMI connection
    const umi = createUmi('https://api.devnet.solana.com');
    const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
    const signer = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

    (async () => {
        try {
            // Start here
            const metadataPda = findMetadataPda(umi, {mint});
            let accounts: CreateMetadataAccountV3InstructionAccounts = {
                metadata: metadataPda,
                mint,
                mintAuthority: signer,
                payer: signer,
                updateAuthority: signer.publicKey,
            }

            let data: DataV2Args = {
                name: "N Turbin3",
                symbol: "NT33",
                uri: "",
                creators: some([
                    {
                        address: signer.publicKey,
                        verified: true,
                        share: 100,
                    }
                ]),
                sellerFeeBasisPoints: 0,
                collection: null,
                uses: null
            }

            let args: CreateMetadataAccountV3InstructionArgs = {
                data, 
                isMutable: true, 
                collectionDetails: null
            }

            let tx = createMetadataAccountV3(
                umi,
                {
                    ...accounts,
                    ...args
                }
            )

            let result = await tx.sendAndConfirm(umi);
            console.log(bs58.encode(result.signature));
        } catch(e) {
            console.error(`Oops, something went wrong: ${e}`)
        }
    })();
