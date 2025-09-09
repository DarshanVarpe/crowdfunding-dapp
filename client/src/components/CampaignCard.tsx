// client/src/components/CampaignCard.tsx

'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CROWDFUNDING_ABI } from "@/constants";

type CampaignCardProps = {
    campaignAddress: string;
};

// Helper function to get status styles
const getStatusInfo = (status: number) => {
    switch (status) {
        case 0: return { text: "Active", color: "text-green-600", bgColor: "bg-green-100" };
        case 1: return { text: "Successful", color: "text-blue-600", bgColor: "bg-blue-100" };
        case 2: return { text: "Failed", color: "text-red-600", bgColor: "bg-red-100" };
        default: return { text: "Unknown", color: "text-gray-600", bgColor: "bg-gray-100" };
    }
};

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaignAddress }) => {
    const [campaignName, setCampaignName] = useState<string>('');
    const [campaignDescription, setCampaignDescription] = useState<string>('');
    const [goal, setGoal] = useState<bigint>(BigInt(0));
    const [balance, setBalance] = useState<bigint>(BigInt(0));
    const [status, setStatus] = useState<number | null>(null); // State for campaign status
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCampaignData = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const contract = new ethers.Contract(campaignAddress, CROWDFUNDING_ABI, provider);

                    // Fetch all data, including the status
                    const [name, description, goalAmount, balanceAmount, campaignStatus] = await Promise.all([
                        contract.name(),
                        contract.description(),
                        contract.goal(),
                        contract.getContractBalance(),
                        contract.state()
                    ]);

                    setCampaignName(name);
                    setCampaignDescription(description);
                    setGoal(goalAmount);
                    setBalance(balanceAmount);
                    setStatus(Number(campaignStatus));
                } catch (error) {
                    console.error("Failed to fetch campaign data:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchCampaignData();
    }, [campaignAddress]);

    const goalNum = Number(ethers.formatEther(goal));
    const balanceNum = Number(ethers.formatEther(balance));
    let balancePercentage = 0;
    if (goalNum > 0) {
        balancePercentage = (balanceNum / goalNum) * 100;
    }
    if (balancePercentage > 100) {
        balancePercentage = 100;
    }

    if (isLoading) {
        // Loading skeleton UI
        return (
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-6 space-y-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded-full w-full mt-4"></div>
                <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-lg mt-4"></div>
            </div>
        );
    }
    
    const statusInfo = status !== null ? getStatusInfo(status) : getStatusInfo(3);

    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 line-clamp-2 pr-2">{campaignName}</h2>
                    {/* Display the campaign status badge */}
                    <span className={`flex-shrink-0 px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.bgColor} ${statusInfo.color}`}>
                        {statusInfo.text}
                    </span>
                </div>
                <p className="mb-4 font-normal text-gray-600 line-clamp-3">{campaignDescription}</p>
            </div>
            
            <div className="px-6 pb-6 mt-auto">
                <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${balancePercentage}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-sm font-semibold text-blue-700">{ethers.formatEther(balance)} POL Raised</span>
                        <span className="text-sm font-medium text-gray-500">Goal: {ethers.formatEther(goal)} POL</span>
                    </div>
                </div>
                
                <Link
                    href={`/campaign/${campaignAddress}`}
                    passHref={true}
                    className="inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
                >
                    View Campaign
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </Link>
            </div>
        </div>
    );
};