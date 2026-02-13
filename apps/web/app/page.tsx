"use client";

import Link from "next/link";
import { MapPin, Video, Award, ChevronRight, Users, TrendingUp, Globe, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Footer } from "@/components/Footer";

import Spline from '@splinetool/react-spline/next';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 50]);

  const yGrid = useTransform(scrollY, [0, 1000], [0, 100]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Global Parallax Grid Background */}
      <motion.div
        style={{ y: yGrid }}
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
      >
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')]" />
      </motion.div>

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden">
        {/* Parallax Background Elements */}
        <div className="absolute inset-0 bg-[#0a111f] z-0">
          <motion.div style={{ y: y1 }} className="absolute inset-0 w-full h-full scale-125 pointer-events-none">
            <Spline scene="/scene (3).splinecode" className="w-full h-full" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a111f]/50 to-[#0a111f] pointer-events-none" />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 container mx-auto px-4 text-center mt-20"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-gray-300 font-medium text-sm tracking-wide uppercase">
              The Next Generation of Skateboarding
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter leading-[0.9]">
            SKATE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
              SPOT
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Map the world. Stack clips. Own the spot.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/map"
              className="group relative px-10 py-5 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]"
            >
              <div className="relative flex items-center gap-3">
                Find Spots
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              href="/feed"
              className="px-10 py-5 bg-transparent border border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/5 transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              Watch The Feed
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-600"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-gray-500 to-transparent" />
        </motion.div>
      </section>

      {/* Culture / Manifesto Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center md:text-left"
          >
            <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight text-white mb-12">
              The beauty of SkateSpot is it's building on <span className="text-secondary">real-world culture</span> and activity.
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="space-y-6 text-lg text-gray-400 leading-relaxed"
              >
                <p>
                  The strongest additions are the ones that get skaters <strong className="text-white">physically to spots</strong>, skating together, documenting progression, and preserving skate history.
                </p>
                <p>
                  It's not just about a map. It's about the session, the footage, and the community that builds around every ledge, rail, and stair set.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent opacity-20 blur-2xl rounded-full" />
                <div className="relative bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-white font-bold">Community First</div>
                      <div className="text-sm text-gray-500">Built by skaters, for skaters</div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-3/4" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Polished */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem number="5k+" label="Spots Mapped" delay={0} />
            <StatItem number="12k+" label="Active Skaters" delay={0.1} />
            <StatItem number="50+" label="Cities" delay={0.2} />
            <StatItem number="100k+" label="Clips" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Feature Grid - Dark & Sleek */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="w-6 h-6" />}
              title="Spot Discovery"
              description="Drop pins on street spots, parks, and DIYs. Share photos, security tips, and best times to skate."
              index={0}
            />
            <FeatureCard
              icon={<Video className="w-6 h-6" />}
              title="Content Sharing"
              description="Upload your battle clips. Get rated by the community. Build your trick resume."
              index={1}
            />
            <FeatureCard
              icon={<Award className="w-6 h-6" />}
              title="King of the Spot"
              description="Compete for the podium. Every spot has a leaderboard. Can you hold the crown?"
              index={2}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/5" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white">
              GO SKATE.
            </h2>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-12 py-6 bg-white text-black font-bold text-xl rounded-full hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-2xl"
            >
              Join SkateSpot
              <ArrowRight className="w-6 h-6" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatItem({ number, label, delay = 0 }: { number: string, label: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center text-center"
    >
      <span className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">{number}</span>
      <span className="text-sm text-gray-500 uppercase tracking-widest font-medium">{label}</span>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description, index = 0 }: { icon: React.ReactNode, title: string, description: string, index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors duration-300 group"
    >
      <div className="mb-6 w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-white">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
