"use client";

import Link from "next/link";
import {
  MapPin,
  Video,
  Award,
  ArrowRight,
  Globe,
  Users,
} from "lucide-react";
import { motion, useScroll, useTransform, useSpring, Variants } from "framer-motion";
import { Footer } from "@/components/Footer";
import dynamic from 'next/dynamic';
import { useRef } from "react";

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroRef = useRef(null);
  const { scrollY } = useScroll({ target: heroRef });
  const yHero = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white selection:bg-secondary selection:text-white">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-secondary z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden">

        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(29,52,97,0.15),_transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-[#050505] to-transparent z-10" />
        <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-[#050505] to-transparent z-10" />

        {/* 3D Scene */}
        <motion.div
          style={{ y: yHero, opacity: opacityHero }}
          className="absolute inset-0 z-0 scale-110 md:scale-100 pointer-events-none"
        >
          <Spline scene="/scene (3).splinecode" className="w-full h-full" />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md transition-colors hover:bg-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            <span className="text-xs uppercase tracking-widest font-semibold text-gray-300">Live Beta</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85] mix-blend-overlay opacity-90">
            SKATE<br />SPOT
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            The world is your park. Discover spots, battle for dominance, and build your legacy.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/map"
              className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-5px_rgba(255,255,255,0.3)] active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                Launch Map <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-lg rounded-full backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
            >
              Join the Crew
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Ticker */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem value="5,230+" label="Spots Mapped" delay={0} />
            <StatItem value="12k+" label="Active Skaters" delay={0.1} />
            <StatItem value="89" label="Cities" delay={0.2} />
            <StatItem value="24/7" label="Spot Traffic" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Features Grid (Bento Style) */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">BUILT FOR THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-orange-500">SESSION.</span></h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to find, skate, and share. No filler, just spots.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Large Card */}
            <BentoCard
              className="md:col-span-2 md:row-span-2 min-h-[500px]"
              title="Global Spot Map"
              description="Pins, photos, security info, and bust-factor ratings for thousands of spots worldwide."
              icon={<Globe className="w-10 h-10 text-accent" />}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
              <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 bg-repeat bg-[length:50px_50px]" />
              <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-accent/10 blur-[100px] rounded-full" />
            </BentoCard>

            {/* Side Cards */}
            <BentoCard
              title="Battle Mode"
              description="Challenge locals for King of the Spot."
              icon={<Award className="w-8 h-8 text-yellow-500" />}
            />
            <BentoCard
              title="Video Feed"
              description="Upload clips. Get hyped. No algorithm nonsense."
              icon={<Video className="w-8 h-8 text-secondary" />}
            />

            {/* Wide Bottom Card */}
            <BentoCard
              className="md:col-span-3 min-h-[300px] flex items-center justify-center"
              title="Community Driven"
              description="Verified by skaters like you. Spot updates happen in real-time."
              icon={<Users className="w-10 h-10 text-green-500" />}
              horizontal
            />
          </div>
        </div>
      </section>

      {/* Manifesto / Culture */}
      <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-sm font-bold tracking-[0.2em] text-secondary mb-8 uppercase">The Mission</h3>
            <p className="text-4xl md:text-6xl font-bold leading-tight tracking-tight text-white mb-12">
              "Skateboarding isn&apos;t just about tricks. It&apos;s about exploration. It&apos;s about looking at a piece of concrete and seeing <span className="text-gray-500 line-through decoration-secondary">architecture</span> <span className="text-white border-b-4 border-secondary">potential</span>."
            </p>
            <div className="flex items-center gap-6">
              <div className="h-px bg-white/20 flex-1" />
              <p className="text-gray-400 italic">Est. 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/10 to-transparent opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter hover:tracking-wide transition-all duration-700 text-white">
              GO SKATE.
            </h2>
            <Link href="/signup" className="inline-block px-12 py-6 bg-white text-black font-bold text-2xl rounded-full hover:scale-105 transition-transform hover:rotate-2 shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)]">
              Get Started Now
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatItem({ value, label, delay = 0 }: { value: string, label: string, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">{value}</span>
      <span className="text-sm text-gray-500 uppercase tracking-widest mt-2 font-medium">{label}</span>
    </motion.div>
  );
}

function BentoCard({ title, description, icon, className = "", children, horizontal = false }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`group relative overflow-hidden rounded-3xl bg-neutral-900/50 border border-white/5 backdrop-blur-sm p-8 transition-all hover:bg-neutral-900/80 hover:border-white/10 ${className}`}
    >
      <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-colors pointer-events-none" />
      {children}

      <div className={`relative z-10 flex ${horizontal ? 'flex-col md:flex-row md:items-center gap-8' : 'flex-col h-full justify-between'}`}>
        <div className="mb-4 p-4 rounded-2xl bg-white/5 w-fit text-white group-hover:scale-110 transition-transform duration-500 border border-white/5">
          {icon}
        </div>
        <div className={horizontal ? 'flex-1' : ''}>
          <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 leading-relaxed max-w-md">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
