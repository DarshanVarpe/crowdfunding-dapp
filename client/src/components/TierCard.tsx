// client/src/components/TierCard.tsx

'use client';

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CROWDFUNDING_ABI } from "@/constants";

type Tier = {
    name: string;
    amount: bigint;
    backers: bigint;
};

type TierCardProps = {
    tier: Tier;
    index: number;
    contractAddress: string;
    isEditing: boolean;
    campaignStatus: number;
    campaignOwner: string;
    onActionSuccess: () => void;
};

export const TierCard: React.FC<TierCardProps> = ({ tier, index, contractAddress, isEditing, campaignStatus, campaignOwner, onActionSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeAccount, setActiveAccount] = useState<string | null>(null);

    useEffect(() => {
        const getAccount = async () => {
            if(window.ethereum) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const accounts = await provider.listAccounts();
                    if (accounts.length > 0 && accounts[0]) {
                        setActiveAccount(accounts[0].address);
                    }
                } catch (error) {
                    console.error("Error fetching account:", error);
                }
            }
        };
        getAccount();
    }, []);

    const handleFund = async () => {
        if (!activeAccount) { alert("Please connect your wallet first."); return; }
        setIsLoading(true);
        try {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const signer = await browserProvider.getSigner();
            const contract = new ethers.Contract(contractAddress, CROWDFUNDING_ABI, signer);
            const tx = await contract.fund(index, { value: tier.amount });
            await tx.wait();
            alert("Funded successfully!");
            onActionSuccess();
        } catch (error) {
            console.error("Funding failed:", error);
            if ((error as any).code === 'CALL_EXCEPTION') {
                alert("Transaction failed. This could be because the campaign is no longer active, has met its goal, or you are the owner.");
            } else {
                alert(`Error: ${(error as Error).message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveTier = async () => {
        setIsLoading(true);
        try {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const signer = await browserProvider.getSigner();
            const contract = new ethers.Contract(contractAddress, CROWDFUNDING_ABI, signer);
            const tx = await contract.removeTier(index);
            await tx.wait();
            alert("Removed successfully!");
            onActionSuccess();
        } catch (error) {
            console.error("Removal failed:", error);
            alert(`Error: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const isOwner = activeAccount?.toLowerCase() === campaignOwner.toLowerCase();
    const isNotActive = campaignStatus !== 0;
    const canFund = !isOwner && !isNotActive;
    let disabledButtonText = 'Select';
    if (isNotActive) disabledButtonText = 'Campaign Ended';
    else if (isOwner) disabledButtonText = 'Owner Cannot Fund';

    return (
        <div className="w-full max-w-sm flex flex-col justify-between p-6 bg-white border border-gray-200 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="mb-5">
                <p className="text-xl font-bold text-gray-900">{tier.name}</p>
                <p className="text-3xl font-extrabold text-blue-600 mt-2">{ethers.formatEther(tier.amount)} <span className="text-lg font-medium text-gray-500">POL</span></p>
            </div>
            <div className="flex flex-col mt-auto space-y-3">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-600"><span className="font-bold text-gray-800">{tier.backers.toString()}</span> Backer(s)</p>
                    <button onClick={handleFund} disabled={isLoading || !canFund} className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" title={!canFund ? disabledButtonText : "Fund this tier"}>
                        {isLoading ? ( <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> ) : canFund ? ( 'Select' ) : ( disabledButtonText )}
                    </button>
                </div>
                {isEditing && (
                    <button onClick={handleRemoveTier} disabled={isLoading} className="w-full px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 disabled:bg-gray-400 transition-colors">
                        {isLoading ? 'Removing...' : 'Remove Tier'}
                    </button>
                )}
            </div>
        </div>
    );
};