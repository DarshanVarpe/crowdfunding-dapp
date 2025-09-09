// client/src/app/dashboard/[walletAddress]/page.tsx

'use client';

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { MyCampaignCard } from "@/components/MyCampaignCard";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/constants";
import { useParams } from "next/navigation";

type Campaign = {
    campaignAddress: string;
    owner: string;
    name: string;
    creationTime: bigint;
};

export default function DashboardPage() {
    const { walletAddress } = useParams();
    const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchMyCampaigns = useCallback(async () => {
        if (!walletAddress || typeof window.ethereum === 'undefined') {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
            const campaignData = await contract.getUserCampaigns(walletAddress as string);
            
            const formattedCampaigns: Campaign[] = campaignData.map((campaign: any) => ({
                campaignAddress: campaign.campaignAddress,
                owner: campaign.owner,
                name: campaign.name,
                creationTime: campaign.creationTime,
            }));
            
            setMyCampaigns(formattedCampaigns);
        } catch (error) {
            console.error("Error fetching user campaigns:", error);
        } finally {
            setIsLoading(false);
        }
    }, [walletAddress]);

    useEffect(() => {
        fetchMyCampaigns();
        const handleFocus = () => {
            console.log('Tab focused, refetching dashboard data...');
            fetchMyCampaigns();
        };
        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [fetchMyCampaigns]);
    
    return (
        <div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
            <div className="flex flex-row justify-between items-center mb-8">
                <p className="text-4xl font-semibold">Dashboard</p>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    onClick={() => setIsModalOpen(true)}
                >Create Campaign</button>
            </div>
            <p className="text-2xl font-semibold mb-4">My Campaigns:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    <p>Loading your campaigns...</p>
                ) : myCampaigns.length > 0 ? (
                    myCampaigns.map((campaign, index) => (
                        <MyCampaignCard
                            key={index}
                            contractAddress={campaign.campaignAddress}
                        />
                    ))
                ) : (
                    <p>You have not created any campaigns yet.</p>
                )}
            </div>
            
            {isModalOpen && (
                <CreateCampaignModal
                    setIsModalOpen={setIsModalOpen}
                    refetchCampaigns={fetchMyCampaigns}
                />
            )}
        </div>
    )
}

type CreateCampaignModalProps = {
    setIsModalOpen: (value: boolean) => void;
    refetchCampaigns: () => void;
}

const CreateCampaignModal = ({ setIsModalOpen, refetchCampaigns }: CreateCampaignModalProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [goal, setGoal] = useState("0.1");
    const [duration, setDuration] = useState("7");

    const handleCreateCampaign = async () => {
        if (!name || !description || !goal || !duration) {
            alert("Please fill out all fields.");
            return;
        }
        setIsCreating(true);
        try {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const signer = await browserProvider.getSigner();
            const factoryContract = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

            const goalInWei = ethers.parseEther(goal);
            const durationInDays = BigInt(duration);

            const tx = await factoryContract.createCampaign(
                name,
                description,
                goalInWei,
                durationInDays
            );

            await tx.wait();
            alert("Campaign created successfully!");
            setIsModalOpen(false);
            refetchCampaigns();
        } catch (error: any) {
            console.error("Failed to create campaign:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-xl font-semibold text-gray-800">Create a New Campaign</p>
                    <button
                        className="text-gray-500 hover:text-gray-800"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Description:</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Goal (POL):</label>
                        <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Length (Days):</label>
                        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    </div>
                    <button
                        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                        onClick={handleCreateCampaign}
                        disabled={isCreating}
                    >
                        {isCreating ? "Creating Campaign..." : "Create Campaign"}
                    </button>
                </div>
            </div>
        </div>
    );
};