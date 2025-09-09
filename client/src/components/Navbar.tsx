// client/src/components/Navbar.tsx

'use client';

import Link from "next/link";
import Image from 'next/image'; // Make sure Image is imported from 'next/image'
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Navbar = () => {
    const [account, setAccount] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                setAccount(accounts[0]);
            } catch (error) {
                console.error("Error connecting to wallet:", error);
            }
        } else {
            alert("Please install MetaMask to use this dApp.");
        }
    };

    useEffect(() => {
        const checkIfWalletIsConnected = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const accounts = await provider.listAccounts();
                    if (accounts.length > 0 && accounts[0]) {
                        setAccount(accounts[0].address);
                    }
                } catch (error) {
                    console.error("Error checking for connected wallet:", error);
                }
            }
        };
        // Listen for account changes
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    setAccount(null);
                }
            });
        }
        checkIfWalletIsConnected();
    }, []);

    const truncateAddress = (address: string) => {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    return (
        // Increased height from h-16 to h-20 for a bigger logo
        <header className="bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 w-full border-b border-gray-700/50">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8 h-20">
                {/* Left Section: Logo and Links */}
                <div className="flex items-center gap-x-12">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">CrowdFund</span>
                        {/* --- THIS IS THE UPDATED LOGO --- */}
                        <Image
                            // The src path starts from the 'public' folder
                            src="/my-logo.png" 
                            alt="CrowdFund Logo"
                            // Adjust width and height to your logo's aspect ratio
                            width={160} // Increased width for a bigger logo
                            height={40} // Increased height
                            className="h-10 w-auto" // Tailwind classes to control the displayed size
                        />
                    </Link>
                    <div className="hidden lg:flex lg:gap-x-8">
                        <Link href="/" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors">
                            Campaigns
                        </Link>
                        {isMounted && account && (
                            <Link href={`/dashboard/${account}`} className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors">
                                Dashboard
                            </Link>
                        )}
                    </div>
                </div>

                {/* Right Section: Connect Button */}
                <div className="flex items-center">
                    {!isMounted ? (
                        <div className="h-10 w-36 bg-gray-700/50 rounded-lg animate-pulse"></div>
                    ) : account ? (
                        <div className="bg-gray-800/70 border border-gray-700 rounded-full px-4 py-2 text-sm font-medium text-gray-200">
                            <p>{truncateAddress(account)}</p>
                        </div>
                    ) : (
                        <button 
                            onClick={connectWallet}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all"
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;