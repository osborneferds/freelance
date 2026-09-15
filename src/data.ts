export const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
  { label: "Admin", href: "#/admin" },
];

export const SERVICES = [
  {
    n: "01",
    title: "Web Development",
    desc: "High-performance, SEO-ready websites and web apps — built with React, Next.js, and modern tooling. Fast, accessible, and handed over clean.",
    tags: ["React", "Next.js", "Headless CMS"],
  },
  {
    n: "02",
    title: "Custom Software",
    desc: "Tailored software systems that fit how your business actually works — internal tools, APIs, dashboards, automations, and integrations.",
    tags: ["Node.js", "APIs", "Automation"],
  },
  {
    n: "03",
    title: "AI-Powered Solutions",
    desc: "Intelligent features that give your product an edge — LLM integrations, chatbots, RAG systems, and workflow automation built on real use cases.",
    tags: ["LLMs", "Chatbots", "RAG"],
  },
  {
    n: "04",
    title: "Product Design & UX",
    desc: "End-to-end UX/UI for web and mobile — research, flows, prototypes, and design systems, so what you launch is what people love to use.",
    tags: ["UX research", "UI", "Design systems"],
  },
];

export type Project = {
  id: number;
  title: string;
  client: string;
  category: string;
  year: string;
  image: string;
  tone: string;
  size: "large" | "small";
  link: string;
  visible: number;
  sort: number;
  created_at: string;
};

const now = Date.now();
const day = 86400000;

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Halcyon Banking Redesign",
    client: "Halcyon",
    category: "Product",
    year: "2025",
    image:
      "https://images.pexels.com/photos/33797643/pexels-photo-33797643.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    tone: "from-violet-500/40",
    size: "large",
    link: "https://example.com/halcyon",
    visible: 1,
    sort: 0,
    created_at: new Date(now - 28 * day).toISOString(),
  },
  {
    id: 2,
    title: "Fieldnote Marketing Site",
    client: "Fieldnote",
    category: "Web",
    year: "2025",
    image:
      "https://images.pexels.com/photos/9999716/pexels-photo-9999716.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    tone: "from-amber-500/40",
    size: "small",
    link: "https://example.com/fieldnote",
    visible: 1,
    sort: 1,
    created_at: new Date(now - 21 * day).toISOString(),
  },
  {
    id: 3,
    title: "Kestrel Identity System",
    client: "Kestrel",
    category: "Brand",
    year: "2024",
    image:
      "https://images.pexels.com/photos/29450014/pexels-photo-29450014.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=700&w=1000",
    tone: "from-pink-500/40",
    size: "small",
    link: "https://example.com/kestrel",
    visible: 1,
    sort: 2,
    created_at: new Date(now - 14 * day).toISOString(),
  },
  {
    id: 4,
    title: "Orbital Analytics Dashboard",
    client: "Orbital",
    category: "Product",
    year: "2024",
    image:
      "https://images.pexels.com/photos/34939150/pexels-photo-34939150.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400",
    tone: "from-blue-500/40",
    size: "large",
    link: "https://example.com/orbital",
    visible: 1,
    sort: 3,
    created_at: new Date(now - 7 * day).toISOString(),
  },
];

export const STATS = [
  { value: "30+", label: "Years of Experience" },
  { value: "500+", label: "Projects Shipped" },
  { value: "150+", label: "Happy Clients" },
];

export const SKILLS = [
  "React.js",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express.js",
  "Python",
  "PostgreSQL",
  "Supabase",
  "Firebase",
  "REST APIs",
  "Docker",
  "Tailwind CSS",
  "AI & LLM Integration",
  "RAG & AI Agents",
  "Git & GitHub",
];

export const PROCESS = [
  {
    step: "01",
    title: "Discover",
    desc: "We start by understanding your idea, business goals, target users, technical requirements, and desired outcome. I turn your initial concept into a clear project direction.",
    duration: "1–3 days",
  },
  {
    step: "02",
    title: "Plan",
    desc: "I define the features, user flow, technology stack, project scope, and development roadmap. You get a clear understanding of what will be built, how it will work, and what to expect.",
    duration: "2–5 days",
  },
  {
    step: "03",
    title: "Build",
    desc: "Development begins — from responsive websites and custom software to AI integrations and intelligent automation. I build, test, refine, and keep you updated throughout the process.",
    duration: "1–4 weeks",
  },
  {
    step: "04",
    title: "Launch",
    desc: "Final testing, bug fixing, performance optimization, security checks, deployment, and configuration. Once everything is ready, your digital product goes live and is prepared for real-world use.",
    duration: "2–5 days",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Osborne took a vague brief and turned it into a product our customers actually love. Conversion on the new onboarding flow is up 38%.",
    name: "Daniel Okafor",
    role: "Co-founder, Halcyon",
    initials: "DO",
  },
  {
    quote:
      "Rare combination: an eye for detail and the engineering chops to ship it herself. The site loads instantly and looks incredible.",
    name: "Priya Raman",
    role: "Head of Marketing, Fieldnote",
    initials: "PR",
  },
  {
    quote:
      "Communication was flawless. Weekly updates, zero scope creep, delivered two days early. We've already booked her for phase two.",
    name: "Tom Lindqvist",
    role: "CEO, Kestrel",
    initials: "TL",
  },
];

export const PLANS = [
  {
    name: "Landing Page",
    price: "$3,500",
    period: "one-time",
    desc: "A single high-converting page designed and built from scratch.",
    features: [
      "Discovery & copy structure",
      "Custom design in Figma",
      "Responsive build (React/Next.js)",
      "Basic SEO & analytics setup",
      "2 rounds of revisions",
    ],
    highlight: false,
  },
  {
    name: "Full Website",
    price: "$9,800",
    period: "from",
    desc: "Multi-page marketing site with CMS so your team can publish freely.",
    features: [
      "Everything in Landing Page",
      "Up to 8 unique page templates",
      "Headless CMS integration",
      "Motion & micro-interactions",
      "Performance & accessibility audit",
      "30 days post-launch support",
    ],
    highlight: true,
  },
  {
    name: "Design Partner",
    price: "$6,000",
    period: "/ month",
    desc: "Ongoing design & dev capacity for product teams. Pause anytime.",
    features: [
      "Unlimited requests, one at a time",
      "Avg. 48h turnaround",
      "Product, brand & web work",
      "Async via Slack + Figma",
      "Weekly sync call",
    ],
    highlight: false,
  },
];

export const FAQS = [
  {
    q: "How do we get started?",
    a: "Send a message through the contact form with a bit about your project. I'll reply within one business day with a few questions and a link to book a free 30-minute intro call.",
  },
  {
    q: "What's your typical timeline?",
    a: "A landing page takes 2–3 weeks. A full website is usually 6–8 weeks from kickoff to launch. Product design engagements are scoped individually — most run 6–12 weeks.",
  },
  {
    q: "Do you work with agencies or only direct clients?",
    a: "Both. Around a third of my work is white-label design and front-end development for agencies that need extra senior capacity.",
  },
  {
    q: "What do you need from me?",
    a: "A clear point of contact, timely feedback on weekly reviews, and access to any existing brand assets or content. I'll handle the rest.",
  },
  {
    q: "Can you work with my existing developers?",
    a: "Absolutely. I deliver organised Figma files with a documented design system, and I'm happy to pair with your engineers during implementation.",
  },
];
