// client/src/app/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { FACTORY_ADDRESS, FACTORY_ABI } from '@/constants';
import { CampaignCard } from '@/components/CampaignCard';

// Define a type for our campaign data to make our code type-safe
type Campaign = {
  campaignAddress: string;
  owner: string;
  name: string;
  creationTime: bigint;
};

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCampaigns = async () => {
      if (typeof window.ethereum === 'undefined') {
        console.error("Please install MetaMask.");
        setIsLoading(false);
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const factoryContract = new ethers.Contract(
          FACTORY_ADDRESS,
          FACTORY_ABI,
          provider
        );

        const campaignData = await factoryContract.getAllCampaigns();
        
        const formattedCampaigns: Campaign[] = campaignData.map((campaign: any) => ({
          campaignAddress: campaign.campaignAddress,
          owner: campaign.owner,
          name: campaign.name,
          creationTime: campaign.creationTime,
        }));

        setCampaigns(formattedCampaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getCampaigns();
  }, []);

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <h1 className="text-4xl font-bold mb-4">Campaigns:</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <p>Loading Campaigns...</p>
          ) : campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.campaignAddress}
                campaignAddress={campaign.campaignAddress}
              />
            ))
          ) : (
            <p>No Campaigns Found</p>
          )}
        </div>
      </div>
    </main>
  );
}