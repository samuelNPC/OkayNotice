import { Metadata } from "next";
import Link from "next/link";
import { 
  Globe2, 
  TrendingUp, 
  Cpu, 
  BookOpen, 
  ShieldCheck, 
  Activity 
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Etomu News",
  description:
    "Learn more about Etomu News, your premier and trusted source for politics, sports, technology, business, education, and lifestyle updates from Uganda and beyond.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 md:p-14 rounded-3xl shadow-sm border border-slate-200">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            About Etomu News
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Delivering accurate, timely, and comprehensive journalism. From local Ugandan headlines to global shifts, we keep you informed, engaged, and ahead of the curve.
          </p>
        </div>

        <div className="space-y-12 text-lg text-slate-700 leading-relaxed border-t border-slate-100 pt-10">
          
          {/* Mission & Vision */}
          <section>
            <h2 className="text-3xl font-bold text-slate-900 mb-5">Our Mission</h2>
            <p className="mb-4">
              At <span className="font-semibold text-slate-900">Etomu News</span>, our mission is to break down the complexities of the modern world into accessible, high-quality reporting. We believe that access to accurate information is the foundation of a thriving society. 
            </p>
            <p>
              Whether we are covering high-stakes political developments, breaking down the weekend's biggest football matches, or analyzing the latest advancements in artificial intelligence, our goal remains the same: to empower our readers with truth, context, and actionable insights.
            </p>
          </section>

          {/* Detailed Categories */}
          <section>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">What We Cover</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="flex gap-4">
                <Globe2 className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 text-xl mb-2">Politics & Current Affairs</h3>
                  <p className="text-base text-slate-600">In-depth coverage of Ugandan local government, national policies, and international diplomacy. We provide unbiased reporting on the decisions that shape our communities.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Activity className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 text-xl mb-2">Sports & Football</h3>
                  <p className="text-base text-slate-600">From the passion of local grass-roots tournaments to the high-octane drama of the English Premier League and global athletics, we bring you match analyses, transfer news, and real-time updates.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Cpu className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 text-xl mb-2">Technology & AI</h3>
                  <p className="text-base text-slate-600">Deep dives into the digital frontier. We cover programming trends, software engineering frameworks, gadget reviews, and how Artificial Intelligence is rapidly transforming the modern workplace.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <TrendingUp className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 text-xl mb-2">Business, Finance & Real Estate</h3>
                  <p className="text-base text-slate-600">Expert market analysis tailored for entrepreneurs and investors. We track startup acquisitions, real estate developments, e-commerce strategies, and supply chain logistics.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <BookOpen className="w-8 h-8 text-blue-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-slate-900 text-xl mb-2">Education & Lifestyle</h3>
                  <p className="text-base text-slate-600">Resources for university students and lifelong learners, mixed with vibrant coverage of travel, health, environmental sustainability, and modern culture.</p>
                </div>
              </div>

            </div>
          </section>

          {/* The Etomu Ecosystem */}
          <section className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
              <ShieldCheck className="mr-3 text-blue-600" />
              Part of the Etomu Ecosystem
            </h2>
            <p className="mb-4 text-slate-600">
              Etomu News is more than just a media outlet; it is a vital pillar of the broader <strong>Etomu Ecosystem</strong>. We are deeply invested in building digital infrastructure that empowers individuals, students, and businesses across Uganda.
            </p>
            <p className="text-slate-600">
              Through our journalism, we seamlessly connect our readers to practical solutions—whether that means bridging the gap between buyers and sellers through robust e-commerce marketplaces, supporting academic excellence via educational SaaS platforms, or streamlining hardware and logistics networks. We don't just report on the future; we actively build the tools to help you navigate it.
            </p>
          </section>

          {/* Contact CTA */}
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Have a story to share?</h3>
            <p className="mb-6 text-slate-600">
              We are always looking to hear from our community. Whether you have a news tip, a business inquiry, or feedback on our coverage, our inbox is open.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm"
            >
              Contact Our Newsroom
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
