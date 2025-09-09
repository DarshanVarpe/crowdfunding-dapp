// client/src/components/Footer.tsx

import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-700/50 mt-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} CrowdFund. All rights reserved.
                    </p>

                    {/* --- UPDATE THESE LINKS --- */}
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-end">
                        <Link href="/terms" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/privacy" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/about" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                            About Us
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};



export default Footer;