// client/src/app/about/page.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | CrowdFund",
  description: "Learn about the mission behind our decentralized crowdfunding platform.",
};

export default function AboutPage() {
    return (
        <div className="bg-white py-12 sm:py-16">
            <div className="container mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">Our Mission</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Empowering Creators with Decentralized Funding
                    </p>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        We believe in a world where creativity has no boundaries. Our platform leverages the power of blockchain technology to connect creators directly with their supporters, ensuring transparency, security, and a global reach for every great idea.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                                    </svg>
                                </div>
                                True Ownership
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">Creators maintain full ownership of their projects. Funds are held securely in a smart contract and released directly to you upon success, with no intermediaries.</dd>
                        </div>
                        <div className="relative pl-16">
                            <dt className="text-base font-semibold leading-7 text-gray-900">
                                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </div>
                                Unmatched Security
                            </dt>
                            <dd className="mt-2 text-base leading-7 text-gray-600">Every transaction is recorded on the blockchain. Backers can fund with confidence, knowing their contributions are protected by immutable smart contract rules.</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}