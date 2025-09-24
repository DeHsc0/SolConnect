import {  useMemo, useState } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster as Sonner} from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Network, rpcUrls } from './lib/types'
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter} from '@solana/wallet-adapter-wallets';
import '@solana/wallet-adapter-react-ui/styles.css';
import { Radar } from 'lucide-react'
import FeaturesGrid from './components/FeaturesGrid'

function App() {

  const [network , setNetwork] = useState<Network>("mainnet")

  const wallets = useMemo(() => [ new PhantomWalletAdapter()] , [network])



  return (
   <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ConnectionProvider  endpoint={rpcUrls[network]}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
             <nav className='px-6 py-4 flex justify-between items-center border-b-2 text-zinc-700/70'>
                  <div className='flex items-center gap-2'>
                      <Radar className='text-white size-6' />
                      <h1 className='text-white text-2xl font-semibold font-manrope'>SolConnect</h1>
                  </div>
                  <div className="flex gap-4">
                    <WalletMultiButton/>
                  <WalletDisconnectButton/>
                  </div>
              </nav>
            <main className='mt-3 px-6 py-3 flex flex-col gap-6'>
                <div className='flex justify-between'>
                  <h1 className='font-semibold text-3xl text-white font-manrope'>
                    Dashboard
                  </h1>
                  <Select onValueChange={(value : Network) => setNetwork(value)} defaultValue={network}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a Network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Networks</SelectLabel>
                        <SelectItem value="mainnet">Mainnet</SelectItem>
                        <SelectItem value="testnet">Testnet</SelectItem>
                        <SelectItem value="devnet">Devnet</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <FeaturesGrid network={network}/>
            </main>
            <Sonner theme='dark'/>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  )
}

export default App
