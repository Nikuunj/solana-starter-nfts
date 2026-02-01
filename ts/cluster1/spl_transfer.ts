import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "./wallet/wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("GgKSCgGXbWy55Ni9Z1Tbmh6RRLkQvBJUn3Tyx7f46dNW");

// Recipient address
const to = new PublicKey("2FvMsMY1DKpnJL3FUk4HBPVffzK4iF55rZHKPNgikef1");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const ataFrom = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        // Get the token account of the toWallet address, and if it does not exist, create it
        const ataTo = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to);
        // Transfer the new token to the "toTokenAccount" we just created

        const sign = await transfer(connection, keypair, ataFrom.address, ataTo.address, keypair.publicKey, 10 * 1e6);
        console.log("sign - ", sign);
        
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();