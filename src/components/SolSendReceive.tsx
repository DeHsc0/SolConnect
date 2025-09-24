import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { toast } from "sonner"
import { QRCodeSVG } from 'qrcode.react';
import { Copy } from "lucide-react";


function SolSendReceive () {

    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    const [ recipientAddress , setRecipientAddress ] = useState<string>("")
    const [ amount , setAmount ] = useState<string>("")

    const sendSol = async () => {
        
        try {
            if(recipientAddress === "" || amount === ""){
                throw new Error("Missing Values")
                return
            }

            if(!publicKey){

                throw new Error("Please connect your wallet")
                
                return 
            }

            const recipientPubKey = new PublicKey(recipientAddress);
            const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: recipientPubKey,
                lamports: Number(amount) * LAMPORTS_PER_SOL, 
            })
            );

            const signature = await sendTransaction(transaction, connection);

            const status = await connection.getSignatureStatus(signature)

            if(!status.value){
                throw new Error("Transaction could not be confirmed. Check your network or try again later.")
                return 
            }

            setAmount("")
            setRecipientAddress("")

            toast("Transaction successfull")
            
        } catch(e) {
            if (e instanceof Error) {
                toast(e.message)
            } else {
                toast(String(e))
            }
        }
    };

    return (
        <Tabs defaultValue='send' className='w-full border-2 rounded-xl border-white/40 px-4 py-2.5 flex justify-between'>  
            <div className='flex justify-between'>
                <h1 className='text-2xl font-semibold text-white'>
                    Manage Your Solana
                </h1>
                <TabsList >
                    <TabsTrigger value="send">Send</TabsTrigger>
                    <TabsTrigger value="recieve">Recieve</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="send">
                <div className='flex flex-col gap-3'>
                    <div className='flex flex-col gap-3'>
                        <Label className='text-xl font-manrope font-semibold '>
                            Recipient's Address
                        </Label>
                        <Input value={recipientAddress} onChange={(e) => setRecipientAddress(e.currentTarget.value)
                        }  placeholder={`Recipient's Solana Devnet address`} />
                    </div>                                          
                    <div className='flex flex-col'>
                        <Label className='text-xl font-manrope font-semibold '>
                            Amount
                        </Label>
                        <div className="flex items-center rounded-lg p-2 space-x-3">
                            <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.currentTarget.value)
                            }
                            placeholder="0"
                            className="bg-transparent outline-none text-white flex-1 text-lg"
                            />
                            <span className="text-gray-400 font-semibold">SOL</span>
                        </div>
                    </div>  
                    <div className='flex justify-between px-4'>
                        <Button className="font-manrope" onClick={() => {
                            setAmount("")
                            setRecipientAddress("")
                        }} variant={"destructive"} size={"lg"}>
                            Cancel
                        </Button>
                        <Button onClick={sendSol} className="font-manrope" size={"lg"}>
                            Send 
                        </Button>
                    </div>                                        
                </div>                              
                </TabsContent>
                <TabsContent value="recieve">
                   {publicKey ?  <div className="h-full flex items-center justify-between gap-6">
                        <div className="bg-white w-fit p-2 rounded-2xl">
                            <QRCodeSVG  value={publicKey.toBase58()}/> 
                        </div>                 
                        <div className="border-2 rounded-2xl bg-neutral-800 p-3 flex flex-col gap-2.5">
                                <p className=" text-center break-all">
                                    {publicKey.toBase58()}
                                </p>
                                <div className="flex justify-center">
                                    <Button className="w-full" variant={"outline"}>
                                        <div className="flex items-center gap-2 ">
                                            <Copy/>
                                            <h1 className="font-manrope font-bold">Copy</h1>
                                        </div>
                                    </Button>
                                </div>
                        </div>
                    </div> : undefined}
                </TabsContent>
            </Tabs>
    )


}

export default SolSendReceive