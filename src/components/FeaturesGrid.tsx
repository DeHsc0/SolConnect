import { SolanaColorful } from "@ant-design/web3-icons";
import SolSendReceive from "./SolSendReceive";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ed25519 } from '@noble/curves/ed25519';
import { toast } from "sonner";
import bs58 from 'bs58';
import type { Network } from "@/lib/types";

function FeaturesGrid ( props : { network : Network }){

    const [bal , setBal] = useState<number>(0)
    const [ msg , setMsg] = useState<string>("")
    const [ airAmount  , setAirAmount ] = useState<string>("")

    const { publicKey , signMessage } = useWallet()
    const { connection } = useConnection()

    const handleAirdrop = async () => {
        
        try{
            if(props.network === "mainnet"){

                throw new Error("Please Check your network")
                return 
            }

            if(!publicKey || airAmount === "")return

            const lamports =  Number(airAmount) * LAMPORTS_PER_SOL

            const signature = await connection.requestAirdrop( publicKey  , lamports)

            const status = await connection.getSignatureStatus(signature)

            if(!status.value){
                throw new Error("Transaction could not be confirmed. Check your network or try again later.")
                return 
            }
            toast(`Airdrop successful! ${airAmount} SOL added to your wallet.`)
        }
        catch(e){
            if(e instanceof Error)toast(e.message)
            else { String(e) }
        }
    }

    const handleSignMessage = async () => {

        if(!signMessage || !publicKey)return 

        try{
            const encodedMessage = new TextEncoder().encode(msg)
            const signature = await signMessage(encodedMessage)
            if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) throw new Error('Message signature invalid!');
            toast(`Message signature: ${bs58.encode(signature)}`);
        }
        catch(e){
            if(e instanceof Error) toast(e.message)
            else { String(e) }
        }
    } 


    useEffect(() => {
        if(!publicKey)return 
        const fetchBalance = async () => {
            const h = await connection.getBalance(publicKey)
            setBal(() => h)
        }

        fetchBalance()

    } , [publicKey , connection])

    return (
        <div className='grid grid-cols-2 gap-4'>
            <div className="flex flex-col justify-between">
                <div className='px-4 border-2 space-y-3 rounded-xl py-2 border-white/40'>
                    <div className='flex justify-between'>
                        <h1 className='text-2xl font-manrope font-semibold text-white '>
                            Balance
                        </h1>
                    </div>
                    <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-4'>
                        <SolanaColorful className='text-4xl'/>
                        <div className='flex items-center flex-col '>
                            <h1 className='font-semibold text-white text-xl font-manrope'>
                                Solana
                            </h1>
                        </div>
                    </div>
                    <h1 className='text-white text-xl font-manrope font-semibold '>
                        {bal / LAMPORTS_PER_SOL} SOL
                    </h1>
                    </div>
                </div>
                <div className='px-4 border-2 space-y-2 rounded-xl py-2 border-white/40'>
                    <div className='flex justify-between'>
                        <h1 className='text-2xl font-manrope font-semibold text-white '>
                            Airdrop
                        </h1>
                    </div>
                    <p className="text-muted-foreground">
                        Enter the amount of airdrop you want 
                    </p>
                    <div className="flex items-center rounded-lg  space-x-3">
                            <Input
                            type="number"
                            onChange={(e) => {
                                setAirAmount(e.currentTarget.value)
                            }}
                            placeholder="0"
                            className="bg-transparent outline-none text-white flex-1 text-lg"
                            />
                            <span className="text-gray-400 font-semibold">SOL</span>
                    </div>
                    <div className="flex justify-between px-1">
                        <Button className="font-manrope " variant={"destructive"} onClick={
                            () => setAirAmount("")
                        }>
                            Cancel
                        </Button>
                        <Button disabled={!airAmount ? true : false} onClick={handleAirdrop} className="font-manrope" >
                            Get
                        </Button>
                    </div>
                </div>
            </div>
            <SolSendReceive/>
            <div className="col-span-2 border-2 px-4 py-3 rounded-2xl flex flex-col gap-3 border-white/40">
                <h1 className="font-semibold text-2xl font-manrope ">
                    Sign a Message
                </h1>
                <div className="flex gap-5 items-center">
                    <Input className="font-manrope" onChange={(e) => setMsg(e.currentTarget.value)} value={msg} placeholder="Enter a message you would like to sign.." />
                    <Button className="font-manrope" size={"lg"} onClick={handleSignMessage} >Sign</Button>
                </div>
            </div>
        </div>
    )

}

export default FeaturesGrid