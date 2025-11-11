import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

// Styles converted to Tailwind CSS

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className="relative py-20 px-8 pb-32 overflow-hidden min-h-screen flex items-center bg-neutral-900">
      <div className="container">
        <div className="relative z-[2] max-w-[1400px] mx-auto w-full grid grid-cols-[1fr_1.2fr] gap-16 items-center">
          {/* Left side - Book Cover */}
          <div className="flex justify-center items-center relative">
            <img
              src="/img/book-cover-page.png"
              alt="AI Native Software Development Book Cover"
              className="max-w-[400px] w-full h-auto rounded-xl shadow-2xl"
            />
          </div>

          {/* Right side - Content */}
          <div className="text-left">
            <div className="inline-block px-4 py-1.5 bg-neutral-700/50 rounded-full text-xs font-medium tracking-wider uppercase mb-6 text-neutral-300 border border-neutral-600/50">
              EMBRACE THE FUTURE OF AI
            </div>
            <Heading
              as="h1"
              className="text-5xl font-extrabold leading-tight mb-4 tracking-tight text-white"
            >
              AI Native Software Development
            </Heading>
            <p className="text-xl text-neutral-300 leading-relaxed mb-8 max-w-[600px]">
              Co-Learning Agentic AI with Python and TypeScript – The AI & Spec
              Driven Way
            </p>

            <div className="flex gap-3 flex-wrap mb-10">
              <span className="inline-flex items-center px-4 py-2 bg-neutral-800/80 rounded-lg text-sm font-medium text-neutral-200 border border-neutral-700/50">
                Agentic AI
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-neutral-800/80 rounded-lg text-sm font-medium text-neutral-200 border border-neutral-700/50">
                Co-Learning & AI
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-neutral-800/80 rounded-lg text-sm font-medium text-neutral-200 border border-neutral-700/50">
                Spec Driven Development
              </span>
            </div>

            <div className="flex gap-4 flex-wrap">
              <Link
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-neutral-900 font-semibold rounded-xl transition-all hover:bg-neutral-100 hover:-translate-y-0.5 shadow-lg"
                to="/docs/preface-agent-native"
              >
                Start Reading
              </Link>
              <Link
                className="inline-flex items-center justify-center px-8 py-4 bg-neutral-800 text-white font-medium rounded-xl border border-neutral-600 transition-all hover:bg-neutral-700 hover:-translate-y-0.5"
                href="https://panaversity.org/flagship-program/courses"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore Possibilities
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Feature({
  title,
  description,
  icon,
  featured,
}: {
  title: string;
  description: string;
  icon: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`feature p-10 rounded-3xl bg-white border-2 border-polar-night-deep/8 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_4px_12px_rgba(17,17,17,0.06),0_2px_4px_rgba(17,17,17,0.04)] relative overflow-hidden hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_24px_48px_rgba(17,17,17,0.15),0_12px_24px_rgba(0,31,63,0.12)] hover:border-polar-night-deep/25 dark:bg-[rgba(30,58,95,0.4)] dark:border-white/8 dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_1px_2px_rgba(0,0,0,0.2)] dark:hover:bg-[rgba(30,58,95,0.6)] dark:hover:border-[rgba(123,164,196,0.25)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.3)] ${
        featured
          ? "feature-featured border-3 border-polar-night-deep bg-gradient-to-br from-polar-night-deep/[0.04] to-white shadow-[0_6px_16px_rgba(0,31,63,0.12),0_3px_8px_rgba(17,17,17,0.08)] dark:border-[rgba(170,170,170,0.4)] dark:from-polar-night-gray/[0.15] dark:to-[rgba(30,58,95,0.5)]"
          : ""
      }`}
    >
      {featured && (
        <div className="absolute top-6 right-6 px-5 py-2 bg-gradient-to-br from-polar-night-deep to-[#002952] text-white text-[0.6875rem] font-bold uppercase tracking-wider rounded-[20px] shadow-[0_4px_12px_rgba(0,31,63,0.4)] z-[2] dark:from-polar-night-gray dark:to-[#888888] dark:text-polar-night-charcoal">
          Most Popular
        </div>
      )}
      <div className="feature-icon-wrapper inline-flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br from-polar-night-deep/8 from-polar-night-charcoal/4 mb-6 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] relative border-2 border-polar-night-deep/10 hover:-rotate-[5deg] hover:scale-110 hover:from-polar-night-deep/12 hover:to-polar-night-charcoal/6 hover:border-polar-night-deep/20 dark:from-[rgba(123,164,196,0.15)] dark:to-[rgba(65,105,157,0.08)] dark:hover:from-[rgba(123,164,196,0.2)] dark:hover:to-[rgba(65,105,157,0.12)]">
        <div className="feature-icon text-[2.5rem] inline-block transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-bold mb-4 text-[#002147] tracking-[-0.02em] leading-[1.3] font-sans dark:text-white">
        {title}
      </h3>
      <p className="text-[#555555] leading-[1.7] m-0 mb-6 text-base font-normal dark:text-white/70">
        {description}
      </p>
      <div className="feature-accent w-[50px] h-1 bg-gradient-to-r from-polar-night-deep to-polar-night-gray rounded transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:w-20 dark:from-polar-night-gray dark:to-polar-night-light" />
    </div>
  );
}

function AISpectrumSection() {
  return (
    <section className="relative py-24 px-8 overflow-hidden bg-neutral-900">
      <div className="container">
        <div className="text-center max-w-[800px] mx-auto mb-16">
          <Heading
            as="h2"
            className="text-5xl font-bold mb-6 text-white leading-tight"
          >
            The AI Development Spectrum
          </Heading>
          <p className="text-xl text-neutral-300 leading-relaxed">
            Three distinct approaches to AI in software development. This book
            teaches you both AI-Driven and AI-Native development.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-12 max-w-[1400px] mx-auto">
          {/* AI Assisted */}
          <div className="relative bg-neutral-800 rounded-xl p-8 border border-neutral-700 flex flex-col">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🛠️</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                AI Assisted
              </h3>
            </div>
            <p className="text-base text-neutral-300 leading-relaxed mb-6">
              AI enhances the productivity of a code-centric developer by
              debugging code, writing documentation, and generating boilerplate.
            </p>
            <ul className="list-none p-0 m-0 mb-6 flex-grow space-y-2">
              <li className="text-sm text-neutral-400">Code generation</li>
              <li className="text-sm text-neutral-400">Test generation</li>
              <li className="text-sm text-neutral-400">Code refactoring</li>
              <li className="text-sm text-neutral-400">Code explanation</li>
              <li className="text-sm text-neutral-400">
                Documentation generation
              </li>
            </ul>
            <div className="p-4 bg-neutral-700/50 rounded-lg text-sm text-neutral-300 border-l-4 border-neutral-600 mt-auto">
              <strong className="text-white">Example:</strong> Write a script to
              build a 'Hello World' API.
            </div>
          </div>

          {/* AI Driven */}
          <div className="relative bg-neutral-800 rounded-xl p-8 border border-neutral-700 flex flex-col">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-2">AI Driven</h3>
            </div>
            <p className="text-base text-neutral-300 leading-relaxed mb-6">
              AI generates executable code from specifications. You are an
              architect, reviewer, and approver.
            </p>
            <ul className="list-none p-0 m-0 mb-6 flex-grow space-y-2">
              <li className="text-sm text-neutral-400">
                Code generation from specs
              </li>
              <li className="text-sm text-neutral-400">
                Test generation from specs
              </li>
              <li className="text-sm text-neutral-400">
                Automated testing & verification
              </li>
              <li className="text-sm text-neutral-400">
                Architecture from assessment
              </li>
            </ul>
            <div className="p-4 bg-neutral-700/50 rounded-lg text-sm text-neutral-300 border-l-4 border-neutral-600 mt-auto">
              <strong className="text-white">Example:</strong> Write a web app
              for a REST API, an API that's connected to a database.
            </div>
          </div>

          {/* AI Native */}
          <div className="relative bg-neutral-800 rounded-xl p-8 border border-neutral-700 flex flex-col">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-white mb-2">AI Native</h3>
            </div>
            <p className="text-base text-neutral-300 leading-relaxed mb-6">
              AI is the software. AI writes and executes code, and agents are
              core functional components.
            </p>
            <ul className="list-none p-0 m-0 mb-6 flex-grow space-y-2">
              <li className="text-sm text-neutral-400">
                Natural language interfaces
              </li>
              <li className="text-sm text-neutral-400">Self-healing systems</li>
              <li className="text-sm text-neutral-400">Agent orchestration</li>
            </ul>
            <div className="p-4 bg-neutral-700/50 rounded-lg text-sm text-neutral-300 border-l-4 border-neutral-600 mt-auto">
              <strong className="text-white">Example:</strong> Build a system to
              automate some of the business's daily tasks.
            </div>
          </div>
        </div>

        {/* Timeline visualization */}
        <div className="mt-16">
          <div className="flex justify-center items-center max-w-[1000px] mx-auto py-8 px-8 bg-neutral-800 rounded-xl border border-neutral-700">
            <div className="flex items-center gap-8 w-full">
              <div className="flex flex-col items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-neutral-700 border-2 border-neutral-600 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <div className="text-sm font-medium text-neutral-300 text-center">
                  AI Assisted
                </div>
              </div>
              <div className="flex-1 h-0.5 bg-neutral-700"></div>
              <div className="flex flex-col items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-neutral-700 border-2 border-neutral-600 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <div className="text-sm font-medium text-neutral-300 text-center">
                  AI Driven
                </div>
              </div>
              <div className="flex-1 h-0.5 bg-neutral-700"></div>
              <div className="flex flex-col items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-neutral-700 border-2 border-neutral-600 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <div className="text-sm font-medium text-neutral-300 text-center">
                  AI Native
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="features py-32 px-8 relative overflow-hidden bg-gradient-to-b from-[#f8f8f8] to-[#f0f0f0] dark:bg-polar-night-charcoal">
      <div className="container">
        {/* Section Header */}
        <div className="text-center max-w-[800px] mx-auto mb-24 relative z-[1] animate-fade-in-up">
          <div className="features-label inline-block px-6 py-2 bg-polar-night-deep/8 backdrop-blur-[20px] rounded-[30px] text-xs font-semibold tracking-[1.5px] uppercase mb-6 border border-polar-night-deep/15 text-polar-night-deep dark:bg-polar-night-gray/12 dark:border-polar-night-gray/20 dark:text-polar-night-light">
            Core Pillars
          </div>
          <Heading
            as="h2"
            className="text-5xl font-extrabold leading-tight mb-6 text-[#002147] tracking-[-0.03em] font-sans dark:text-white dark:bg-gradient-to-br dark:from-white dark:to-polar-night-light dark:bg-clip-text dark:text-transparent"
          >
            What Makes This Book Different
          </Heading>
          <p className="text-xl leading-[1.6] text-[rgba(0,33,71,0.7)] m-0 font-normal dark:text-white/70">
            A comprehensive, production-focused approach to co-learning with AI
            in the spec-driven way
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-8 max-w-[1200px] mx-auto mb-16 relative z-[1]">
          <Feature
            icon="🤝"
            title="Co-Learning Philosophy"
            description="Learn alongside AI agents. Not just using AI as a tool, but co-creating where both human and AI learn together."
            featured={true}
          />
          <Feature
            icon="🐍"
            title="Dual Language Mastery"
            description="Python for reasoning & intelligence, TypeScript for interaction & UI. Master the bilingual AI-native stack."
          />
          <Feature
            icon="📋"
            title="Spec-Driven Development"
            description="Write specifications that both humans and AI understand. Specs become executable blueprints for intelligent systems."
          />
          <Feature
            icon="🤖"
            title="Agentic AI Systems"
            description="Build with OpenAI Agents SDK and Google ADK. Create agents that reason, act, and collaborate autonomously."
          />
          <Feature
            icon="🏗️"
            title="Production-Ready Architecture"
            description="Cloud-native deployment with Docker, Kubernetes, Dapr, and Ray. Scalable, secure, fault-tolerant systems."
          />
          <Feature
            icon="🚀"
            title="Complete Learning Journey"
            description="46 comprehensive chapters from programming basics to deploying enterprise agentic AI systems in production."
            featured={true}
          />
        </div>
      </div>
    </section>
  );
}

function MaturityLevelsSection() {
  return (
    <section className="relative py-24 px-8 bg-gradient-to-b from-[#f8f9fa] via-white to-[#f8f9fa] dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="container">
        <div className="text-center max-w-[800px] mx-auto mb-16">
          <div className="inline-block text-xs font-semibold tracking-[1.5px] uppercase text-polar-night-deep bg-gradient-to-r from-polar-night-deep/8 to-polar-night-deep/12 px-5 py-2 rounded-full mb-6 dark:text-polar-night-gray dark:from-polar-night-gray/15 dark:to-polar-night-gray/10">
            Your AI Journey
          </div>
          <Heading
            as="h2"
            className="text-5xl font-bold mb-6 text-polar-night-deep leading-tight dark:text-white"
          >
            Organizational AI Maturity Levels
          </Heading>
          <p className="text-xl text-neutral-600 leading-[1.6] dark:text-polar-night-gray">
            Where does your organization stand? Understanding these levels helps
            you chart your path forward.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8 mb-12 max-w-[1600px] mx-auto">
          {/* Level 1 */}
          <div className="relative bg-white rounded-2xl p-8 pt-12 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 ease border border-polar-night-deep/8 flex flex-col min-h-[380px] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)] dark:bg-neutral-800 dark:border-polar-night-gray/10 dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.4)]">
            <div className="maturity-level-number w-15 h-15 bg-gradient-to-br from-polar-night-deep to-[#003366] text-white text-2xl font-bold rounded-full flex items-center justify-center mb-4 relative dark:from-polar-night-gray dark:to-[#888888] dark:text-polar-night-charcoal">
              1
            </div>
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-polar-night-deep mb-1 leading-[1.3] dark:text-white">
                  AI Awareness
                </h3>
                <div className="text-sm text-neutral-600 font-medium mb-0 dark:text-neutral-400">
                  Experimenting
                </div>
              </div>
              <div className="inline-block px-4 py-2 bg-polar-night-deep/8 text-polar-night-deep text-xs font-semibold rounded-full text-center whitespace-nowrap shrink-0 self-start border-[1.5px] border-polar-night-deep/20 dark:bg-polar-night-gray/12 dark:text-polar-night-light dark:border-polar-night-gray/25">
                10-20% productivity gains
              </div>
            </div>
            <p className="text-sm text-neutral-700 leading-[1.6] mb-auto flex-grow pb-4 dark:text-neutral-300">
              Individual developers experimenting with AI coding tools. Early AI
              Assisted Development.
            </p>
            <div className="px-4 py-3 bg-polar-night-deep/5 rounded-lg text-sm text-neutral-700 mb-3 mt-auto dark:bg-polar-night-gray/5 dark:text-polar-night-gray">
              <strong className="text-polar-night-deep dark:text-white">
                Approach:
              </strong>{" "}
              AI Assisted (Individual)
            </div>
          </div>

          {/* Level 2 */}
          <div className="relative bg-white rounded-2xl p-8 pt-12 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 ease border border-polar-night-deep/8 flex flex-col min-h-[380px] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)] dark:bg-neutral-800 dark:border-polar-night-gray/10 dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.4)]">
            <div className="maturity-level-number w-15 h-15 bg-gradient-to-br from-polar-night-deep to-[#003366] text-white text-2xl font-bold rounded-full flex items-center justify-center mb-4 relative dark:from-polar-night-gray dark:to-[#888888] dark:text-polar-night-charcoal">
              2
            </div>
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-polar-night-deep mb-1 leading-[1.3] dark:text-white">
                  AI Adoption
                </h3>
                <div className="text-sm text-neutral-600 font-medium mb-0 dark:text-neutral-400">
                  Standardizing
                </div>
              </div>
              <div className="inline-block px-4 py-2 bg-polar-night-deep/8 text-polar-night-deep text-xs font-semibold rounded-full text-center whitespace-nowrap shrink-0 self-start border-[1.5px] border-polar-night-deep/20 dark:bg-polar-night-gray/12 dark:text-polar-night-light dark:border-polar-night-gray/25">
                30-40% productivity boost
              </div>
            </div>
            <p className="text-sm text-neutral-700 leading-[1.6] mb-auto flex-grow pb-4 dark:text-neutral-300">
              Organization-wide adoption with governance. Established guidelines
              and security policies.
            </p>
            <div className="px-4 py-3 bg-polar-night-deep/5 rounded-lg text-sm text-neutral-700 mb-3 mt-auto dark:bg-polar-night-gray/5 dark:text-polar-night-gray">
              <strong className="text-polar-night-deep dark:text-white">
                Approach:
              </strong>{" "}
              AI Assisted (Team)
            </div>
          </div>

          {/* Level 3 */}
          <div className="relative bg-white rounded-2xl p-8 pt-12 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 ease border-2 border-polar-night-deep flex flex-col min-h-[380px] bg-gradient-to-br from-white to-[#f8f9fa] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)] dark:bg-gradient-to-br dark:from-neutral-700 dark:to-neutral-800 dark:border-polar-night-gray dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.4)]">
            <div className="maturity-badge absolute -top-3 right-6 bg-gradient-to-br from-polar-night-deep to-[#003366] text-white text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,31,63,0.3)] dark:from-polar-night-gray dark:to-[#888888] dark:text-polar-night-charcoal">
              BOOK FOCUS
            </div>
            <div className="maturity-level-number w-15 h-15 bg-gradient-to-br from-polar-night-deep to-[#003366] text-white text-2xl font-bold rounded-full flex items-center justify-center mb-4 relative dark:from-polar-night-gray dark:to-[#888888] dark:text-polar-night-charcoal">
              3
            </div>
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-polar-night-deep mb-1 leading-[1.3] dark:text-white">
                  AI Integration
                </h3>
                <div className="text-sm text-neutral-600 font-medium mb-0 dark:text-neutral-400">
                  Transforming Workflows
                </div>
              </div>
              <div className="inline-block px-4 py-2 bg-polar-night-deep/8 text-polar-night-deep text-xs font-semibold rounded-full text-center whitespace-nowrap shrink-0 self-start border-[1.5px] border-polar-night-deep/20 dark:bg-polar-night-gray/12 dark:text-polar-night-light dark:border-polar-night-gray/25">
                2-3x faster development
              </div>
            </div>
            <p className="text-sm text-neutral-700 leading-[1.6] mb-auto flex-grow pb-4 dark:text-neutral-300">
              AI-Driven Development practices. Specs become living
              documentation. Workflows redesigned around AI collaboration.
            </p>
            <div className="px-4 py-3 bg-polar-night-deep/5 rounded-lg text-sm text-neutral-700 mb-3 mt-auto dark:bg-polar-night-gray/5 dark:text-polar-night-gray">
              <strong className="text-polar-night-deep dark:text-white">
                Approach:
              </strong>{" "}
              AI Driven (Workflow)
            </div>
          </div>

          {/* Level 4 */}
          <div className="relative bg-white rounded-2xl p-8 pt-12 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 ease border-2 border-polar-night-deep flex flex-col min-h-[380px] bg-gradient-to-br from-white to-[#f8f9fa] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)] dark:bg-gradient-to-br dark:from-neutral-700 dark:to-neutral-800 dark:border-polar-night-gray dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.4)]">
            <div className="maturity-badge absolute -top-3 right-6 bg-gradient-to-br from-polar-night-deep to-[#003366] text-white text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,31,63,0.3)] dark:from-polar-night-gray dark:to-[#888888] dark:text-polar-night-charcoal">
              BOOK FOCUS
            </div>
            <div className="maturity-level-number w-15 h-15 bg-gradient-to-br from-polar-night-deep to-[#003366] text-white text-2xl font-bold rounded-full flex items-center justify-center mb-4 relative dark:from-polar-night-gray dark:to-[#888888] dark:text-polar-night-charcoal">
              4
            </div>
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-polar-night-deep mb-1 leading-[1.3] dark:text-white">
                  AI-Native Products
                </h3>
                <div className="text-sm text-neutral-600 font-medium mb-0 dark:text-neutral-400">
                  Building Intelligence
                </div>
              </div>
              <div className="inline-block px-4 py-2 bg-polar-night-deep/8 text-polar-night-deep text-xs font-semibold rounded-full text-center whitespace-nowrap shrink-0 self-start border-[1.5px] border-polar-night-deep/20 dark:bg-polar-night-gray/12 dark:text-polar-night-light dark:border-polar-night-gray/25">
                New capabilities unlocked
              </div>
            </div>
            <p className="text-sm text-neutral-700 leading-[1.6] mb-auto flex-grow pb-4 dark:text-neutral-300">
              Products where AI/LLMs are core components. Agent orchestration,
              natural language interfaces, intelligent systems.
            </p>
            <div className="px-4 py-3 bg-polar-night-deep/5 rounded-lg text-sm text-neutral-700 mb-3 mt-auto dark:bg-polar-night-gray/5 dark:text-polar-night-gray">
              <strong className="text-polar-night-deep dark:text-white">
                Approach:
              </strong>{" "}
              AI Native (Product)
            </div>
          </div>

          {/* Level 5 */}
          <div className="relative bg-white rounded-2xl p-8 pt-12 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 ease border border-polar-night-deep/8 flex flex-col min-h-[380px] hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.06)] dark:bg-neutral-800 dark:border-polar-night-gray/10 dark:shadow-[0_2px_8px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.4)]">
            <div className="maturity-level-number w-15 h-15 bg-gradient-to-br from-polar-night-deep to-[#003366] text-white text-2xl font-bold rounded-full flex items-center justify-center mb-4 relative dark:from-polar-night-gray dark:to-[#888888] dark:text-polar-night-charcoal">
              5
            </div>
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h3 className="text-xl font-bold text-polar-night-deep mb-1 leading-[1.3] dark:text-white">
                  AI-First Enterprise
                </h3>
                <div className="text-sm text-neutral-600 font-medium mb-0 dark:text-neutral-400">
                  Living in the Future
                </div>
              </div>
              <div className="inline-block px-4 py-2 bg-polar-night-deep/8 text-polar-night-deep text-xs font-semibold rounded-full text-center whitespace-nowrap shrink-0 self-start border-[1.5px] border-polar-night-deep/20 dark:bg-polar-night-gray/12 dark:text-polar-night-light dark:border-polar-night-gray/25">
                10x productivity
              </div>
            </div>
            <p className="text-sm text-neutral-700 leading-[1.6] mb-auto flex-grow pb-4 dark:text-neutral-300">
              Entire organization AI-native. Custom models, self-improving
              systems, AI embedded in every aspect.
            </p>
            <div className="px-4 py-3 bg-polar-night-deep/5 rounded-lg text-sm text-neutral-700 mb-3 mt-auto dark:bg-polar-night-gray/5 dark:text-polar-night-gray">
              <strong className="text-polar-night-deep dark:text-white">
                Approach:
              </strong>{" "}
              AI Native (Enterprise)
            </div>
          </div>
        </div>

        <div className="text-center p-8 bg-gradient-to-br from-polar-night-deep to-[#003366] rounded-2xl text-white dark:from-neutral-800 dark:to-neutral-900 dark:border dark:border-polar-night-gray/20">
          <p className="text-xl leading-[1.6] dark:text-white">
            <strong className="font-bold">
              This book prepares you for Levels 3-4:
            </strong>{" "}
            Master AI-Driven workflows and build AI-Native products
          </p>
        </div>
      </div>
    </section>
  );
}

function ParadigmShift() {
  return (
    <section className="paradigm-section py-32 px-8 bg-white relative overflow-hidden dark:bg-[#0d1f2d]">
      <div className="container">
        <div className="max-w-[1400px] mx-auto relative z-[1]">
          {/* Section Header */}
          <div className="text-center max-w-[900px] mx-auto mb-24 animate-fade-in-up">
            <div className="inline-block px-6 py-2 bg-red-600/8 backdrop-blur-[20px] rounded-[30px] text-xs font-semibold tracking-[1.5px] uppercase mb-6 border border-red-600/20 text-red-600 dark:bg-red-400/15 dark:border-red-400/25 dark:text-red-300">
              The Great Shift
            </div>
            <Heading
              as="h2"
              className="text-5xl font-extrabold leading-tight mb-6 text-[#002147] tracking-[-0.03em] font-sans dark:text-white"
            >
              From Automation to Intelligence
              <br />
              <span className="inline-block bg-gradient-to-br from-red-600 to-red-800 bg-clip-text text-transparent dark:from-red-300 dark:to-red-500">
                From Coding to Co-Creating
              </span>
            </Heading>
            <p className="text-xl leading-[1.6] text-[rgba(0,33,71,0.7)] m-0 font-normal dark:text-white/70">
              AI-native development is not about replacing developers—it's about
              amplifying intelligence. Learn to collaborate with reasoning
              entities that learn with you.
            </p>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-8 max-w-[1400px] mx-auto mb-16 items-start md:grid-cols-1">
            {/* Traditional Card */}
            <div className="comparison-card p-12 rounded-[28px] bg-white/90 backdrop-blur-[20px] border border-[rgba(0,33,71,0.1)] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_4px_16px_rgba(0,0,0,0.04),0_2px_4px_rgba(0,0,0,0.02)] relative overflow-visible hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,33,71,0.12),0_8px_16px_rgba(0,0,0,0.08)] dark:bg-[rgba(30,58,95,0.5)] dark:border-white/10 dark:shadow-[0_4px_16px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.2)] dark:hover:bg-[rgba(30,58,95,0.7)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.3)]">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br from-[rgba(0,77,153,0.08)] to-[rgba(102,153,204,0.05)] mb-6 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-110 hover:-rotate-[5deg] dark:from-[rgba(123,164,196,0.15)] dark:to-[rgba(65,105,157,0.08)]">
                <div className="text-[2.5rem]">📚</div>
              </div>
              <div className="text-sm font-bold mb-3 text-[#002147] uppercase tracking-[1.2px] dark:text-white">
                Traditional Development
              </div>
              <div className="text-base text-[rgba(0,33,71,0.6)] mb-8 font-medium dark:text-white/60">
                The automation era
              </div>
              <ul className="comparison-list list-none p-0 m-0">
                <li className="py-5 pl-8 relative text-[rgba(0,33,71,0.85)] leading-[1.6] text-[0.9375rem] border-b border-[rgba(0,33,71,0.06)] transition-all duration-300 ease hover:pl-10 hover:text-[rgba(0,33,71,1)] dark:text-white/80 dark:border-b-white/8 dark:hover:text-white">
                  <span className="block font-bold text-[#002147] mb-1 text-base dark:text-white">
                    Instruction-Based
                  </span>
                  Tell computers exactly what to do with precise syntax
                </li>
                <li className="py-5 pl-8 relative text-[rgba(0,33,71,0.85)] leading-[1.6] text-[0.9375rem] border-b border-[rgba(0,33,71,0.06)] transition-all duration-300 ease hover:pl-10 hover:text-[rgba(0,33,71,1)] dark:text-white/80 dark:border-b-white/8 dark:hover:text-white">
                  <span className="block font-bold text-[#002147] mb-1 text-base dark:text-white">
                    Solo Coding
                  </span>
                  Developer writes every line manually
                </li>
                <li className="py-5 pl-8 relative text-[rgba(0,33,71,0.85)] leading-[1.6] text-[0.9375rem] border-b border-[rgba(0,33,71,0.06)] transition-all duration-300 ease hover:pl-10 hover:text-[rgba(0,33,71,1)] dark:text-white/80 dark:border-b-white/8 dark:hover:text-white">
                  <span className="block font-bold text-[#002147] mb-1 text-base dark:text-white">
                    Documentation as Afterthought
                  </span>
                  Specs are static contracts written post-facto
                </li>
                <li className="py-5 pl-8 relative text-[rgba(0,33,71,0.85)] leading-[1.6] text-[0.9375rem] border-b border-[rgba(0,33,71,0.06)] transition-all duration-300 ease hover:pl-10 hover:text-[rgba(0,33,71,1)] dark:text-white/80 dark:border-b-white/8 dark:hover:text-white">
                  <span className="block font-bold text-[#002147] mb-1 text-base dark:text-white">
                    Linear Learning
                  </span>
                  Learn syntax → Build simple projects → Slowly scale
                </li>
                <li className="py-5 pl-8 relative text-[rgba(0,33,71,0.85)] leading-[1.6] text-[0.9375rem] transition-all duration-300 ease hover:pl-10 hover:text-[rgba(0,33,71,1)] dark:text-white/80 dark:hover:text-white">
                  <span className="block font-bold text-[#002147] mb-1 text-base dark:text-white">
                    Code-First
                  </span>
                  Focus on implementation details from day one
                </li>
              </ul>
            </div>

            {/* VS Divider */}
            <div className="comparison-divider flex flex-col items-center justify-center gap-4 p-8 px-4 md:flex-row md:p-0">
              <div className="comparison-vs flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#004d99] to-[#003366] text-white text-2xl font-extrabold tracking-wider shadow-[0_8px_24px_rgba(0,77,153,0.3),0_0_0_4px_rgba(255,255,255,0.9),0_0_0_6px_rgba(0,77,153,0.2)] animate-pulse dark:from-[#7ba4c4] dark:to-[#5b7d9a] dark:shadow-[0_8px_24px_rgba(123,164,196,0.4),0_0_0_4px_rgba(30,58,95,0.9),0_0_0_6px_rgba(123,164,196,0.3)]">
                VS
              </div>
              <div className="comparison-arrow text-3xl text-[#004d99] font-bold animate-bounce dark:text-[#7ba4c4] md:rotate-90">
                →
              </div>
            </div>

            {/* AI-Native Card */}
            <div className="comparison-card comparison-card-highlight p-12 rounded-[28px] bg-white/90 backdrop-blur-[20px] border-2 border-[rgba(0,77,153,0.4)] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_8px_24px_rgba(0,77,153,0.08),0_4px_8px_rgba(0,0,0,0.04)] relative overflow-visible bg-gradient-to-br from-[rgba(0,77,153,0.05)] to-white/95 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,33,71,0.12),0_8px_16px_rgba(0,0,0,0.08)] dark:bg-gradient-to-br dark:from-[rgba(123,164,196,0.15)] dark:to-[rgba(30,58,95,0.6)] dark:border-[rgba(123,164,196,0.5)] dark:shadow-[0_8px_24px_rgba(123,164,196,0.12),0_4px_8px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.3)]">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br from-[rgba(0,77,153,0.08)] to-[rgba(102,153,204,0.05)] mb-6 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-110 hover:-rotate-[5deg] dark:from-[rgba(123,164,196,0.15)] dark:to-[rgba(65,105,157,0.08)]">
                <div className="text-[2.5rem]">🤖</div>
              </div>
              <div className="text-sm font-bold mb-3 text-[#002147] uppercase tracking-[1.2px] dark:text-white">
                AI-Native Way
              </div>
              <div className="text-base text-[rgba(0,33,71,0.6)] mb-8 font-medium dark:text-white/60">
                The intelligence era
              </div>
              <ul className="comparison-list list-none p-0 m-0">
                <li className="py-5 pl-8 relative text-[rgba(0,33,71,0.85)] leading-[1.6] text-[0.9375rem] border-b border-[rgba(0,33,71,0.06)] transition-all duration-300 ease hover:pl-10 hover:text-[rgba(0,33,71,1)] dark:text-white/80 dark:border-b-white/8 dark:hover:text-white">
                  <span className="block font-bold text-[#002147] mb-1 text-base dark:text-white">
                    Intent-Based
                  </span>
                  Describe what you want; AI reasons how to build it
                </li>
                <li className="py-5 pl-8 relative text-[rgba(0,33,71,0.85)] leading-[1.6] text-[0.9375rem] border-b border-[rgba(0,33,71,0.06)] transition-all duration-300 ease hover:pl-10 hover:text-[rgba(0,33,71,1)] dark:text-white/80 dark:border-b-white/8 dark:hover:text-white">
                  <span className="block font-bold text-[#002147] mb-1 text-base dark:text-white">
                    Co-Learning Partnership
                  </span>
                  You and AI teach each other through iteration
                </li>
                <li className="py-5 pl-8 relative text-[rgba(0,33,71,0.85)] leading-[1.6] text-[0.9375rem] border-b border-[rgba(0,33,71,0.06)] transition-all duration-300 ease hover:pl-10 hover:text-[rgba(0,33,71,1)] dark:text-white/80 dark:border-b-white/8 dark:hover:text-white">
                  <span className="block font-bold text-[#002147] mb-1 text-base dark:text-white">
                    Specs as Living Blueprints
                  </span>
                  Specifications drive code, tests, and documentation
                </li>
                <li className="py-5 pl-8 relative text-[rgba(0,33,71,0.85)] leading-[1.6] text-[0.9375rem] border-b border-[rgba(0,33,71,0.06)] transition-all duration-300 ease hover:pl-10 hover:text-[rgba(0,33,71,1)] dark:text-white/80 dark:border-b-white/8 dark:hover:text-white">
                  <span className="block font-bold text-[#002147] mb-1 text-base dark:text-white">
                    Production-First Learning
                  </span>
                  Build real agentic systems from day one
                </li>
                <li className="py-5 pl-8 relative text-[rgba(0,33,71,0.85)] leading-[1.6] text-[0.9375rem] transition-all duration-300 ease hover:pl-10 hover:text-[rgba(0,33,71,1)] dark:text-white/80 dark:hover:text-white">
                  <span className="block font-bold text-[#002147] mb-1 text-base dark:text-white">
                    Architecture-First
                  </span>
                  Design intelligent collaborations, not just code
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom CTA */}
          <div
            className="mt-16 animate-fade-in-up"
            style={{ animationDelay: "0.6s", animationFillMode: "both" }}
          >
            <div className="flex items-center justify-between gap-8 max-w-[1000px] mx-auto p-10 px-12 bg-gradient-to-br from-[rgba(0,77,153,0.08)] to-[rgba(102,153,204,0.05)] backdrop-blur-[20px] rounded-3xl border-2 border-[rgba(0,77,153,0.15)] shadow-[0_8px_32px_rgba(0,77,153,0.1)] md:flex-col md:text-center md:p-8">
              <div className="text-5xl shrink-0">🌱</div>
              <div className="flex-1">
                <h3 className="text-[1.75rem] font-bold m-0 mb-2 text-[#002147] tracking-[-0.02em] dark:text-white">
                  Ready to Co-Learn with AI?
                </h3>
                <p className="m-0 text-base text-[rgba(0,33,71,0.7)] leading-[1.6] dark:text-white/70">
                  Join the revolution where coding becomes conversation and
                  software becomes alive
                </p>
              </div>
              <Link
                className="button button--primary button--lg shrink-0 bg-[#004d99] border-none px-10 py-4 text-[1.0625rem] font-semibold whitespace-nowrap shadow-[0_4px_16px_rgba(0,77,153,0.3)] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-[#003d7a] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,77,153,0.4)] dark:bg-[#7ba4c4] dark:text-[#002147] dark:hover:bg-[#6699cc] md:w-full md:max-w-[300px]"
                to="/docs/preface-agent-native"
              >
                Begin Your Journey
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="AI Native Software Development"
      description="Colearning Agentic AI with Python and TypeScript – The AI & Spec Driven Way. Build production-ready intelligent systems."
    >
      <HomepageHeader />
      <AISpectrumSection />
      <FeaturesSection />
      <MaturityLevelsSection />
      <ParadigmShift />
    </Layout>
  );
}
