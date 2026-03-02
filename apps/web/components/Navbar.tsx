"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, MapPin, Video, LayoutDashboard, User, LogIn, LogOut, Bell, Swords, MessageCircle, Users, Calendar, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useFeed } from "@/context/FeedContext";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showNotifs, setShowNotifs] = useState(false);
    const { data: session } = useSession();
    const { notifications, markNotificationRead } = useFeed();

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-white font-bold">
                                S
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                                SkateSpot
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-1">
                        <NavLink href="/map" icon={<MapPin size={18} />}>Spots</NavLink>
                        <NavLink href="/feed" icon={<Video size={18} />}>Feed</NavLink>
                        <NavLink href="/battles" icon={<Swords size={18} />}>Battles</NavLink>
                        <NavLink href="/sessions" icon={<Calendar size={18} />}>Sessions</NavLink>
                        <NavLink href="/events" icon={<Trophy size={18} />}>Events</NavLink>
                        <NavLink href="/leaderboard" icon={<LayoutDashboard size={18} />}>Rankings</NavLink>

                        {session?.user ? (
                            <>
                                {/* Messages */}
                                <Link
                                    href="/messages"
                                    className="relative p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <MessageCircle size={18} />
                                </Link>

                                {/* Notification Bell */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowNotifs(!showNotifs)}
                                        className="relative p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <Bell size={18} />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                {unreadCount > 9 ? "9+" : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {showNotifs && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute right-0 top-full mt-2 w-80 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                                            >
                                                <div className="p-3 border-b border-white/10 flex items-center justify-between">
                                                    <h3 className="font-bold text-white text-sm">Notifications</h3>
                                                    {unreadCount > 0 && (
                                                        <button
                                                            onClick={() => notifications.forEach((n) => !n.read && markNotificationRead(n.id))}
                                                            className="text-xs text-accent hover:text-accent-light"
                                                        >
                                                            Mark all read
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="max-h-64 overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <div className="p-4 text-center text-neutral-500 text-sm">
                                                            No notifications yet
                                                        </div>
                                                    ) : (
                                                        notifications.slice(0, 10).map((n) => (
                                                            <div
                                                                key={n.id}
                                                                onClick={() => markNotificationRead(n.id)}
                                                                className={`p-3 border-b border-white/5 cursor-pointer hover:bg-white/5 ${!n.read ? "bg-accent/5" : ""}`}
                                                            >
                                                                <p className="text-sm text-neutral-300">
                                                                    {n.type === "like" && "Someone liked your clip"}
                                                                    {n.type === "comment" && "New comment on your clip"}
                                                                    {n.type === "follow" && "Someone started following you"}
                                                                    {n.type === "achievement" && "You earned an achievement!"}
                                                                    {n.type === "tutorial_helpful" && "Someone found your tutorial helpful"}
                                                                    {n.type === "session_invite" && "You've been invited to a session"}
                                                                    {n.type === "crew_battle_started" && "A crew battle has started!"}
                                                                    {n.type === "event_starting" && "An event you joined is starting soon"}
                                                                    {n.type === "event_invite" && "You've been invited to an event"}
                                                                    {!["like", "comment", "follow", "achievement", "tutorial_helpful", "session_invite", "crew_battle_started", "event_starting", "event_invite"].includes(n.type) && "You have a new notification"}
                                                                </p>
                                                                {!n.read && (
                                                                    <span className="inline-block w-1.5 h-1.5 bg-accent rounded-full ml-1" />
                                                                )}
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors ml-1"
                                >
                                    <div className="w-7 h-7 rounded-full overflow-hidden relative bg-neutral-800 border border-white/10">
                                        <Image
                                            src={session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.name}`}
                                            alt={session.user.name || "User"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-white hidden lg:block">
                                        {(session.user as any).username || session.user.name}
                                    </span>
                                </Link>

                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                    title="Sign out"
                                >
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 ml-2">
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <LogIn size={16} />
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 bg-secondary hover:bg-secondary-dark text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b border-white/10"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <MobileNavLink href="/map" icon={<MapPin size={18} />}>Spots</MobileNavLink>
                            <MobileNavLink href="/feed" icon={<Video size={18} />}>Feed</MobileNavLink>
                            <MobileNavLink href="/battles" icon={<Swords size={18} />}>Battles</MobileNavLink>
                            <MobileNavLink href="/sessions" icon={<Calendar size={18} />}>Sessions</MobileNavLink>
                            <MobileNavLink href="/events" icon={<Trophy size={18} />}>Events</MobileNavLink>
                            <MobileNavLink href="/leaderboard" icon={<LayoutDashboard size={18} />}>Rankings</MobileNavLink>
                            {session?.user ? (
                                <>
                                    <MobileNavLink href="/messages" icon={<MessageCircle size={18} />}>Messages</MobileNavLink>
                                    <MobileNavLink href="/crews" icon={<Users size={18} />}>Crews</MobileNavLink>
                                    <MobileNavLink href="/profile" icon={<User size={18} />}>Profile</MobileNavLink>
                                    <button
                                        onClick={() => signOut({ callbackUrl: "/" })}
                                        className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 w-full"
                                    >
                                        <LogOut size={18} />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <MobileNavLink href="/login" icon={<LogIn size={18} />}>Login</MobileNavLink>
                                    <MobileNavLink href="/signup" icon={<User size={18} />}>Sign Up</MobileNavLink>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
        >
            {icon}
            {children}
        </Link>
    );
}

function MobileNavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 block"
        >
            {icon}
            {children}
        </Link>
    );
}
