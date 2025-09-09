// client/src/app/terms/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | CrowdFund",
  description: "Read the terms of service for our decentralized crowdfunding platform.",
};

export default function TermsPage() {
    return (
        <div className="bg-white px-6 py-12 lg:px-8">
            <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
                <p className="text-base font-semibold leading-7 text-blue-600">Last updated on September 9, 2025</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Terms of Service</h1>
                <div className="mt-10 max-w-2xl">
                    <p>Welcome to CrowdFund. By using our decentralized application (&quot;dApp&quot;), you agree to these terms. This dApp operates on the Polygon blockchain, and all transactions are final, irreversible, and managed by smart contracts.</p>
                    <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">1. Nature of the Platform</h2>
                    <p className="mt-4">Our platform is a decentralized venue that allows creators to launch crowdfunding campaigns and backers to support them. We are not a party to any agreement between creators and backers. All funds are held in the campaign&apos;s smart contract, not by us.</p>
                    <ul role="list" className="mt-6 max-w-xl space-y-4 text-gray-600">
                        <li className="flex gap-x-3">
                            <svg className="mt-1 h-5 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.06 0l4.25-5.85z" clipRule="evenodd" /></svg>
                            <span><strong className="font-semibold text-gray-900">No Guarantees.</strong> We do not guarantee that any campaign will reach its funding goal or that creators will deliver on their promises.</span>
                        </li>
                    </ul>
                    <p className="mt-6">These terms are for demonstration purposes for this portfolio project. No real legal agreement is implied.</p>
                </div>
            </div>
        </div>
    );
}