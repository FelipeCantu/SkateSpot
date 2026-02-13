import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-background border-t border-white/10 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-1">
                        <Link href="/" className="text-2xl font-black tracking-tighter text-foreground mb-4 block">
                            SkateSpot
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            The ultimate platform for skaters to discover spots, share clips, and compete specifically for the community.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4">Platform</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/map" className="hover:text-secondary transition-colors">Spots</Link></li>
                            <li><Link href="/feed" className="hover:text-secondary transition-colors">Feed</Link></li>
                            <li><Link href="/leaderboard" className="hover:text-secondary transition-colors">Leaderboards</Link></li>
                            <li><Link href="/profile" className="hover:text-secondary transition-colors">Profile</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4">Community</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-secondary transition-colors">Guidelines</Link></li>
                            <li><Link href="#" className="hover:text-secondary transition-colors">Safety</Link></li>
                            <li><Link href="#" className="hover:text-secondary transition-colors">Support</Link></li>
                            <li><Link href="#" className="hover:text-secondary transition-colors">Feedback</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-foreground mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-gray-400 hover:text-secondary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-secondary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-secondary transition-colors">
                                <Youtube className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-secondary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} SkateSpot. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
