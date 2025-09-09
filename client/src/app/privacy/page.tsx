// client/src/app/privacy/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CrowdFund",
  description: "Read the privacy policy for our decentralized crowdfunding platform.",
};

export default function PrivacyPage() {
    return (
        <div className="bg-white px-6 py-12 lg:px-8">
            <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                <p className="text-base font-semibold leading-7 text-blue-600">Last updated on September 9, 2025</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Privacy Policy</h1>
                <div className="mt-10 max-w-2xl">
                    <p>Your privacy is important to us. As a decentralized application, our approach to data is fundamentally different from traditional websites.</p>
                    <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">1. Data We Do Not Collect</h2>
                    <p className="mt-4">We do not use cookies, tracking scripts, or analytics services. We do not collect any personal information such as your name, email address, or IP address. You interact with our dApp directly from your own wallet.</p>
                    <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">2. Public Blockchain Data</h2>
                    <p className="mt-4">All interactions with our smart contracts, including creating campaigns, funding tiers, and posting comments, are public transactions recorded on the Polygon blockchain. Your wallet address, transaction amounts, and comment content are publicly visible to anyone using a block explorer.</p>
                    <ul role="list" className="mt-6 max-w-xl space-y-4 text-gray-600">
                        <li className="flex gap-x-3">
                            <svg className="mt-1 h-5 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.06 0l4.25-5.85z" clipRule="evenodd" /></svg>
                            <span><strong className="font-semibold text-gray-900">On-Chain Identity.</strong> Your on-chain identity is your wallet address. Do not post private information in comments, as it will be permanently stored on the blockchain.</span>
                        </li>
                    </ul>
                    <p className="mt-6">This policy is for demonstration purposes for this portfolio project.</p>
                </div>
            </div>
        </div>
    );
}