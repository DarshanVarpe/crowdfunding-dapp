// client/src/app/campaign/[campaignAddress]/page.tsx

'use client';

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { TierCard } from "@/components/TierCard";
import { CROWDFUNDING_ABI } from "@/constants";

// Define TypeScript types for our data
type Tier = { name: string; amount: bigint; backers: bigint; };
type Comment = { author: string; timestamp: bigint; commentText: string; };
type CampaignDetails = {
    name: string;
    description: string;
    deadline: Date;
    goal: bigint;
    balance: bigint;
    owner: string;
    status: number;
    paused: boolean;
    tiers: Tier[];
    comments: Comment[];
};

export default function CampaignPage() {
    const { campaignAddress } = useParams();
    const [activeAccount, setActiveAccount] = useState<string | null>(null);
    const [details, setDetails] = useState<CampaignDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [hasContributed, setHasContributed] = useState(false);
    const [daysToAdd, setDaysToAdd] = useState<string>("7");

    // Central data fetching function
    const fetchCampaignDetails = useCallback(async () => {
        if (typeof window.ethereum !== 'undefined' && campaignAddress) {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.listAccounts();
                const currentAccount = (accounts.length > 0 && accounts[0]) ? accounts[0].address : null;
                setActiveAccount(currentAccount);

                const contract = new ethers.Contract(campaignAddress as string, CROWDFUNDING_ABI, provider);

                const [name, description, deadline, goal, balance, owner, status, tiers, contribution, comments, paused] = await Promise.all([
                    contract.name(), contract.description(), contract.deadline(),
                    contract.goal(), contract.getContractBalance(), contract.owner(),
                    contract.state(), contract.getTiers(),
                    currentAccount ? contract.backers(currentAccount) : Promise.resolve(BigInt(0)),
                    contract.getComments(),
                    contract.paused()
                ]);

                setDetails({
                    name, description, deadline: new Date(Number(deadline) * 1000),
                    goal, balance, owner, status: Number(status), tiers, comments, paused
                });
                setHasContributed(contribution > BigInt(0));
            } catch (error) {
                console.error("Failed to fetch campaign details:", error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [campaignAddress]);

    useEffect(() => {
        fetchCampaignDetails();
    }, [fetchCampaignDetails]);

    // Central transaction handler
    const handleTransaction = async (action: () => Promise<any>, successMessage: string) => {
        setIsProcessing(true);
        try {
            const tx = await action();
            await tx.wait();
            alert(successMessage);
            await fetchCampaignDetails();
        } catch (error: any) {
            console.error("Transaction failed:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    // Functions for all contract write calls
    const handleWithdraw = () => {
        const action = async () => {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const signer = await browserProvider.getSigner();
            const contract = new ethers.Contract(campaignAddress as string, CROWDFUNDING_ABI, signer);
            return contract.withdraw();
        };
        handleTransaction(action, "Funds withdrawn successfully!");
    };
    
    const handleRefund = () => {
        const action = async () => {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const signer = await browserProvider.getSigner();
            const contract = new ethers.Contract(campaignAddress as string, CROWDFUNDING_ABI, signer);
            return contract.refund();
        };
        handleTransaction(action, "Refund successful!");
    };

    const handleTogglePause = () => {
        const action = async () => {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const signer = await browserProvider.getSigner();
            const contract = new ethers.Contract(campaignAddress as string, CROWDFUNDING_ABI, signer);
            return contract.togglePause();
        };
        handleTransaction(action, `Campaign ${details?.paused ? 'unpaused' : 'paused'} successfully!`);
    };

    const handleExtendDeadline = () => {
        const action = async () => {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const signer = await browserProvider.getSigner();
            const contract = new ethers.Contract(campaignAddress as string, CROWDFUNDING_ABI, signer);
            return contract.extendDeadline(BigInt(daysToAdd));
        };
        handleTransaction(action, `Deadline extended by ${daysToAdd} days!`);
    };

    if (isLoading) return <div className="text-center mt-20"><p>Loading Campaign Details...</p></div>;
    if (!details) return <div className="text-center mt-20"><p>Campaign Not Found.</p></div>;

    const goalNum = Number(ethers.formatEther(details.goal));
    const balanceNum = Number(ethers.formatEther(details.balance));
    let balancePercentage = goalNum > 0 ? (balanceNum / goalNum) * 100 : 0;
    if (balancePercentage > 100) balancePercentage = 100;
    
    const getStatusInfo = (status: number) => {
        switch (status) {
            case 0: return { text: "Active", color: "bg-green-500" };
            case 1: return { text: "Successful", color: "bg-blue-500" };
            case 2: return { text: "Failed", color: "bg-red-500" };
            default: return { text: "Unknown", color: "bg-gray-500" };
        }
    };
    
    const statusInfo = getStatusInfo(details.status);
    const isOwner = details.owner.toLowerCase() === activeAccount?.toLowerCase();
    const canWithdraw = isOwner && details.status === 1 && details.balance > 0;
    const canRefund = hasContributed && details.status === 2;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight break-all bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {details.name}
                </h1>
                <div className="flex items-center gap-x-4">
                    {canRefund && ( <button onClick={handleRefund} disabled={isProcessing} className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 disabled:bg-gray-400 transition-colors">{isProcessing ? "Refunding..." : "Claim Refund"}</button> )}
                    {canWithdraw && ( <button onClick={handleWithdraw} disabled={isProcessing} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 transition-colors">{isProcessing ? "Withdrawing..." : "Withdraw Funds"}</button> )}
                    {isOwner && ( <button className="px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg shadow-md hover:bg-slate-800 transition-colors" onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Finish Editing" : "Edit Campaign"}</button> )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">About this Campaign</h2>
                        <p className="text-gray-600 leading-relaxed">{details.description}</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Funding Progress</h3>
                        <div className="mb-2">
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-lg font-bold text-blue-600">{ethers.formatEther(details.balance)} POL</span>
                                <span className="text-sm text-gray-500">raised of {ethers.formatEther(details.goal)} POL goal</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${balancePercentage}%` }}></div>
                            </div>
                        </div>
                    </div>
                    
                    {isOwner && isEditing && (
                        <div className="bg-white p-6 rounded-lg shadow-md mt-6 border-l-4 border-amber-500">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Admin Controls</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pause Campaign</label>
                                    <p className="text-xs text-gray-500 mb-2">Temporarily stop new contributions and comments.</p>
                                    <button onClick={handleTogglePause} disabled={isProcessing} className={`px-4 py-2 text-sm font-semibold text-white rounded-md shadow-sm transition-colors disabled:bg-gray-400 ${details.paused ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'}`}>
                                        {isProcessing ? 'Processing...' : (details.paused ? 'Unpause Campaign' : 'Pause Campaign')}
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Extend Deadline</label>
                                    <p className="text-xs text-gray-500 mb-2">Add more days to the campaign deadline.</p>
                                    <div className="flex items-center gap-x-2">
                                        <input type="number" value={daysToAdd} onChange={(e) => setDaysToAdd(e.target.value)} className="w-24 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                                        <button onClick={handleExtendDeadline} disabled={isProcessing || details.status !== 0} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed" title={details.status !== 0 ? "Can only extend active campaigns" : ""}>
                                            {isProcessing ? 'Extending...' : 'Extend'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                        <CommentsSection contractAddress={campaignAddress as string} comments={details.comments} onCommentPosted={fetchCampaignDetails} isPaused={details.paused} />
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Status</h3>
                            <span className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${statusInfo.color}`}>{statusInfo.text}</span>
                        </div>
                        <div>
                            <p className="text-gray-600 font-medium">Deadline</p>
                            <p className="font-bold text-gray-800">{details.deadline.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    
                    {details && (
                        <div>
                            <h3 className="text-2xl font-bold text-blue-600 mb-4 tracking-tight">Support this Campaign</h3>
                            <div className="space-y-4">
                                {details.tiers && details.tiers.length > 0 ? (
                                    details.tiers.map((tier, index) => ( <TierCard key={index} tier={tier} index={index} contractAddress={campaignAddress as string} isEditing={isEditing} campaignStatus={details.status} campaignOwner={details.owner} onActionSuccess={fetchCampaignDetails} /> ))
                                ) : ( !isEditing && <p className="text-gray-500">No reward tiers available.</p> )}
                                {isEditing && ( <button className="w-full flex justify-center items-center font-semibold p-6 bg-blue-50 text-blue-700 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-100 transition-colors" onClick={() => setIsModalOpen(true)}>+ Add New Tier</button> )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {isModalOpen && ( <AddTierModal setIsModalOpen={setIsModalOpen} contractAddress={campaignAddress as string} onTierAdded={fetchCampaignDetails} /> )}
        </div>
    );
}

const AddTierModal = ({ setIsModalOpen, contractAddress, onTierAdded }: { setIsModalOpen: (value: boolean) => void; contractAddress: string; onTierAdded: () => void; }) => {
    const [tierName, setTierName] = useState<string>("");
    const [tierAmount, setTierAmount] = useState<string>("0.1");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddTier = async () => {
        if (!tierName || !tierAmount) { alert("Please fill out all fields."); return; }
        setIsSubmitting(true);
        try {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const signer = await browserProvider.getSigner();
            const contract = new ethers.Contract(contractAddress, CROWDFUNDING_ABI, signer);
            const amountInWei = ethers.parseEther(tierAmount);
            const tx = await contract.addTier(tierName, amountInWei);
            await tx.wait();
            alert("Tier added successfully!");
            onTierAdded();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert(`Error adding tier: ${(error as Error).message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-xl">
                <div className="flex justify-between items-center mb-4"><p className="text-xl font-semibold text-gray-800">Add a New Tier</p><button className="text-gray-500 hover:text-gray-800" onClick={() => setIsModalOpen(false)}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>
                <div className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Tier Name:</label><input type="text" value={tierName} onChange={(e) => setTierName(e.target.value)} className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1">Cost (POL):</label><input type="number" value={tierAmount} onChange={(e) => setTierAmount(e.target.value)} className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/></div>
                    <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors" onClick={handleAddTier} disabled={isSubmitting}>{isSubmitting ? "Adding Tier..." : "Add Tier"}</button>
                </div>
            </div>
        </div>
    );
};

const CommentsSection = ({ contractAddress, comments, onCommentPosted, isPaused }: { contractAddress: string; comments: Comment[]; onCommentPosted: () => void; isPaused: boolean; }) => {
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePostComment = async () => {
        if (!newComment) return alert("Comment cannot be empty.");
        setIsSubmitting(true);
        try {
            const browserProvider = new ethers.BrowserProvider(window.ethereum);
            const signer = await browserProvider.getSigner();
            const contract = new ethers.Contract(contractAddress, CROWDFUNDING_ABI, signer);
            const tx = await contract.postComment(newComment);
            await tx.wait();
            setNewComment("");
            onCommentPosted();
        } catch (error) {
            console.error("Failed to post comment:", error);
            alert(`Error: ${(error as Error).message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments ({comments.length})</h3>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                {comments.length > 0 ? (
                    [...comments].reverse().map((comment, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200"><p className="text-sm text-gray-800 break-words">{comment.commentText}</p><p className="text-xs text-gray-500 mt-2">By: <span className="font-medium truncate">{comment.author}</span> on {new Date(Number(comment.timestamp) * 1000).toLocaleDateString()}</p></div>
                    ))
                ) : ( <p className="text-sm text-gray-500">No comments yet. Be the first to post!</p> )}
            </div>
            <div className="space-y-2">
                <textarea rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder={isPaused ? "Commenting is paused by the owner." : "Write a comment..."} className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" disabled={isPaused || isSubmitting}/>
                <button onClick={handlePostComment} disabled={isPaused || isSubmitting} className="px-5 py-2 text-sm font-semibold text-white bg-slate-700 rounded-md shadow-sm hover:bg-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed">{isSubmitting ? "Posting..." : "Post Comment"}</button>
            </div>
        </div>
    );
};