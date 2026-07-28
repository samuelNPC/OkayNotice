import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about Etomu News, your trusted source for technology, business, AI, programming, and innovation news from Uganda and beyond.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">
          About Etomu News
        </h1>

        <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
          <p>
            Welcome to{" "}
            <span className="font-semibold text-slate-900">Etomu News</span>,
            your trusted destination for technology, business, AI,
            entrepreneurship, programming, education, and innovation news from
            Uganda and around the world.
          </p>

          <p>
            Our mission is to inform, educate, and inspire readers by publishing
            accurate, practical, and engaging content that helps individuals,
            students, entrepreneurs, and businesses stay ahead in an increasingly
            digital world. From emerging technologies and startup stories to web
            development tutorials and digital trends, we aim to make complex
            topics easy to understand and useful in everyday life.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
            Part of the Etomu Ecosystem
          </h2>

          <p>
            Etomu News is part of the growing <strong>Etomu</strong> ecosystem,
            which is focused on building digital products and services that
            empower individuals and businesses. Through our content, we connect
            readers with useful platforms, innovative solutions, and
            opportunities that support digital growth across Uganda and beyond.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">
            What We Cover
          </h2>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Technology News:</strong> The latest developments in
              technology, gadgets, software, and digital innovation.
            </li>
            <li>
              <strong>Artificial Intelligence:</strong> AI tools, trends,
              tutorials, and practical applications.
            </li>
            <li>
              <strong>Business & Startups:</strong> Entrepreneurship, startup
              stories, digital business, and online opportunities.
            </li>
            <li>
              <strong>Programming & Web Development:</strong> Guides, tutorials,
              and developer resources.
            </li>
            <li>
              <strong>Education:</strong> Learning resources, career advice, and
              digital skills for students and professionals.
            </li>
          </ul>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <p>
              Want to get in touch?{" "}
              <Link
                href="/contact"
                className="text-blue-600 hover:underline font-medium"
              >
                Reach out to us here
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}