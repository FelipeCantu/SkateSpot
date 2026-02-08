"use client";

import Link from "next/link";
import { MapPin, Video, Award, ChevronRight, Users, TrendingUp, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";

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
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-background">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px]"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 container mx-auto px-4 text-center"
        >
          <motion.div variants={itemVariants} className="inline-block mb-6 px-4 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 backdrop-blur-sm">
            <span className="text-secondary-light font-semibold text-sm tracking-wide uppercase">
              The Ultimate Skate App
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-tight">
            Find Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
              Next Spot.
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover hidden gems, stack clips, and climb the leaderboards.
            The world is your skatepark.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/map"
              className="group relative px-8 py-4 bg-foreground text-background font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-secondary/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-2 group-hover:text-white transition-colors">
                Find Spots Near Me
                <MapPin className="w-5 h-5" />
              </div>
            </Link>

            <Link
              href="/feed"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-lg rounded-full hover:bg-white/10 transition-all hover:scale-105 active:scale-95 backdrop-blur-md"
            >
              Watch Clips
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500"
        >
          <ChevronRight className="w-8 h-8 rotate-90" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem number="5,000+" label="Spots Added" icon={<MapPin className="w-5 h-5 text-secondary" />} />
            <StatItem number="12k+" label="Skaters" icon={<Users className="w-5 h-5 text-accent" />} />
            <StatItem number="50+" label="Cities" icon={<Globe className="w-5 h-5 text-green-500" />} />
            <StatItem number="100k+" label="Clips Uploaded" icon={<Video className="w-5 h-5 text-purple-500" />} />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              SkateSpot makes it easy to connect with the scene.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <HowItWorksStep
              number="01"
              title="Discover"
              description="Use the interactive map to find filtered spots ranging from famous plazas to hidden DIYs."
              icon={<MapPin className="w-10 h-10 text-secondary" />}
            />
            <HowItWorksStep
              number="02"
              title="Skate & Film"
              description="Go out, shred the spot, and capture your best tricks. Log your session."
              icon={<Video className="w-10 h-10 text-accent" />}
            />
            <HowItWorksStep
              number="03"
              title="Share & Compete"
              description="Upload clips to the spot's feed. Earn points, climb the leaderboard, and own the spot."
              icon={<Award className="w-10 h-10 text-yellow-500" />}
            />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full py-24 bg-white/5 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Everything You Need</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Built by skaters, for skaters.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MapPin className="w-8 h-8 text-secondary" />}
              title="Spot Discovery"
              description="Drop pins on street spots, parks, and DIYs. Share photos, security tips, and best times to skate."
            />
            <FeatureCard
              icon={<Video className="w-8 h-8 text-accent" />}
              title="Content Sharing"
              description="Upload your battle clips. Get rated by the community. Build your trick resume."
            />
            <FeatureCard
              icon={<Award className="w-8 h-8 text-yellow-500" />}
              title="King of the Spot"
              description="Compete for the podium. Every spot has a leaderboard. Can you hold the crown?"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-blue-500" />}
              title="Community"
              description="Connect with locals. Organize sessions. Make new friends to shred with."
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8 text-green-500" />}
              title="Progression"
              description="Track your consistency. Watch your style evolve over time with your clip archive."
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8 text-purple-500" />}
              title="Global Feed"
              description="See what's going down across the world. Get inspired by skaters everywhere."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary/10 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
            Ready to <span className="text-secondary">Shred?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of skaters who are already mapping the world.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-5 bg-foreground text-background font-bold text-xl rounded-full hover:bg-secondary hover:text-white transition-all transform hover:scale-105 shadow-2xl"
          >
            Join SkateSpot Free
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatItem({ number, label, icon }: { number: string, label: string, icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="mb-3 p-3 bg-white/5 rounded-full">
        {icon}
      </div>
      <span className="text-3xl md:text-4xl font-black text-foreground mb-1">{number}</span>
      <span className="text-sm text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function HowItWorksStep({ number, title, description, icon }: { number: string, title: string, description: string, icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center group">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 group-hover:border-secondary/50 group-hover:scale-110 transition-all duration-300 shadow-xl">
          {icon}
        </div>
        <div className="absolute -top-4 -right-4 w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold border-4 border-background">
          {number}
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed max-w-xs">{description}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-background border border-white/5 hover:border-secondary/30 transition-all duration-300 group cursor-default hover:bg-white/[0.02] shadow-sm hover:shadow-secondary/5">
      <div className="mb-6 p-4 rounded-xl bg-white/5 inline-block group-hover:scale-110 group-hover:bg-secondary/10 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-secondary transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
