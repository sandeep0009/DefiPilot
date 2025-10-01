import { Connection, PublicKey } from "@solana/web3.js";


export const connection=new Connection(process.env.SOLANA_RPC_URL!);

export const getBalance=async(publicKey:string):Promise<number|null>=>{
    try {
        const balance=connection.getBalance(new PublicKey(publicKey));
        return balance ;
    } catch (error) {
        console.log('error fetching balance',error);
        return null;
    }
}
