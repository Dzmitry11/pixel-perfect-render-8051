// Centralised, language-neutral site content. Translatable copy lives in src/i18n.
import dinliaImg from "@/assets/project-dinlia.jpg";
import aiImg from "@/assets/project-ai-assistant.jpg";
import webappImg from "@/assets/project-webapp.jpg";
import portraitAsset from "@/assets/dzmitry-nikalayeu.jpg.asset.json";

export const SITE_URL = "https://dzmitry-nikalayeu.lovable.app";

/** Real portrait photo, served from CDN storage (see src/assets/dzmitry-nikalayeu.jpg.asset.json). */
export const portrait = portraitAsset.url;

export const contact = {
  name: "Dzmitry Nikalayeu",
  email: "dzmitry.softdev@gmail.com",
  phones: [
    { label: "PL", display: "+48 735 420 883", tel: "+48735420883" },
    { label: "SE", display: "+46 761 573 328", tel: "+46761573328" },
  ],
  github: "https://github.com/Dzmitry11",
  linkedin: "https://www.linkedin.com/in/dzmitry-nikalayeu-51bab1130/",
};

export const navigation = [
  { to: "/", key: "home" },
  { to: "/about", key: "about" },
  { to: "/services", key: "services" },
  { to: "/portfolio", key: "portfolio" },
  { to: "/technologies", key: "technologies" },
  { to: "/cooperation", key: "cooperation" },
  { to: "/contact", key: "contact" },
] as const;

export const heroStack = ["AWS", "Python", "Java", "React", "TypeScript", "Docker", "Kubernetes", "Terraform", "PostgreSQL", "Cloudflare"];

export const rates = [
  { currency: "EUR", display: "€45" },
  { currency: "USD", display: "$53" },
  { currency: "SEK", display: "480 SEK" },
  { currency: "PLN", display: "185 PLN" },
];

export type ServiceKey = "web" | "backend" | "cloud" | "ai" | "consulting";
export const services: { key: ServiceKey; code: string; tech: string[] }[] = [
  { key: "web", code: "01", tech: ["React", "TypeScript", "JavaScript", "Vite", "Tailwind CSS", "Supabase", "PostgreSQL"] },
  { key: "backend", code: "02", tech: ["Java", "Spring Boot", "Python", "REST APIs", "PostgreSQL", "MongoDB", "Redis", "Kafka"] },
  { key: "cloud", code: "03", tech: ["AWS", "Terraform", "Docker", "Kubernetes", "Amazon EKS", "GitHub Actions", "GitLab CI/CD", "Cloudflare"] },
  { key: "ai", code: "04", tech: ["OpenAI", "Python", "RAG", "Vector databases", "LLM APIs", "AI assistants", "API integrations"] },
  { key: "consulting", code: "05", tech: ["Architecture", "AWS", "Infrastructure", "Migration", "Documentation"] },
];

export type ProjectFilter = "web" | "backend" | "cloud" | "ai" | "production";
export type ProjectKey = "dinlia" | "oriole" | "ipdiary" | "scania";
export type Project = {
  key: ProjectKey;
  name: string;
  image: string;
  status: "production" | "active" | "experience";
  filters: ProjectFilter[];
  tech: string[];
  highlights?: string[];
  url?: string | undefined; // leave undefined to show "Link coming soon"
  github?: string;
};

export const projects: Project[] = [
  {
    key: "dinlia",
    name: "DinLIA",
    image: dinliaImg,
    status: "production",
    filters: ["web", "backend", "cloud", "production"],
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "PostgreSQL", "AWS", "Amazon EKS", "Docker", "Terraform", "GitHub Actions", "Cloudflare"],
    highlights: ["OAuth", "Row Level Security", "Production infrastructure", "Database administration", "Cloud migration", "CI/CD"],
    url: "https://www.dinlia.se",
    github: "https://github.com/Dzmitry11/DINLIA-2.0",
  },
  {
    key: "scania",
    name: "Scania AI Assistant",
    image: aiImg,
    status: "experience",
    filters: ["ai", "cloud", "backend"],
    tech: ["Python", "React", "TypeScript", "AWS", "GitLab CI/CD", "Terraform", "OpenAI"],
    highlights: ["AI assistant", "Enterprise knowledge", "Developer onboarding", "AI-assisted workflows", "Prompt engineering", "Feedback / evaluation", "Cloud infrastructure", "Agile"],
  },
  {
    key: "oriole",
    name: "OriolePartner",
    image: webappImg,
    status: "production",
    filters: ["web"],
    tech: ["React", "TypeScript", "TanStack", "Vite", "Vercel"],
    highlights: ["Cloud deployment", "Typed routing", "CI deployments"],
    url: undefined,
    github: "https://github.com/Dzmitry11/oriolepartner",
  },
  {
    key: "ipdiary",
    name: "iPDiary",
    image: webappImg,
    status: "active",
    filters: ["web", "backend"],
    tech: ["React", "TypeScript", "PostgreSQL", "REST APIs"],
    highlights: ["Authentication", "Per-user data isolation", "Relational data model"],
    url: undefined,
  },
];

export type Level = "production" | "handsOn" | "working" | "dev";
export type TechCategory = "cloud" | "infra" | "cicd" | "backend" | "frontend" | "databases" | "messaging" | "ai" | "network" | "tools";
export type TechItem = { name: string; level: Level; note: string; enabled?: boolean };

// Notes are in English (authoritative); technology names stay untranslated.
export const technologies: { category: TechCategory; items: TechItem[] }[] = [
  { category: "cloud", items: [
    { name: "AWS", level: "production", note: "Primary cloud for production platforms." },
    { name: "Amazon EC2", level: "handsOn", note: "Compute for services and worker nodes." },
    { name: "S3", level: "production", note: "Object storage, static assets and backups." },
    { name: "RDS", level: "handsOn", note: "Managed PostgreSQL for application data." },
    { name: "Lambda", level: "handsOn", note: "Event-driven functions and automation." },
    { name: "IAM", level: "production", note: "Least-privilege roles and access policies." },
    { name: "VPC", level: "production", note: "Network isolation, subnets and routing." },
    { name: "CloudWatch", level: "handsOn", note: "Logs, metrics and alarms." },
    { name: "Route 53", level: "handsOn", note: "DNS and domain management." },
    { name: "Amazon EKS", level: "production", note: "Managed Kubernetes for DinLIA." },
  ]},
  { category: "infra", items: [
    { name: "Terraform", level: "production", note: "All cloud infrastructure defined as code." },
    { name: "AWS CDK", level: "working", note: "Infrastructure in TypeScript where it fits." },
    { name: "Docker", level: "production", note: "Containerised services and local parity." },
    { name: "Kubernetes", level: "production", note: "Deployments, services, ingress and scaling." },
  ]},
  { category: "cicd", items: [
    { name: "GitHub Actions", level: "production", note: "Build, test and deploy pipelines." },
    { name: "GitLab CI/CD", level: "handsOn", note: "Enterprise pipelines (Scania)." },
  ]},
  { category: "backend", items: [
    { name: "Java", level: "handsOn", note: "Backend services and APIs." },
    { name: "Spring Boot", level: "handsOn", note: "REST services with Spring." },
    { name: "Python", level: "production", note: "AI services, automation and tooling." },
    { name: "FastAPI", level: "handsOn", note: "Lightweight Python APIs." },
    { name: "REST APIs", level: "production", note: "Design and integration of HTTP APIs." },
  ]},
  { category: "frontend", items: [
    { name: "React", level: "production", note: "Product frontends and dashboards." },
    { name: "TypeScript", level: "production", note: "Typed code across front and back." },
    { name: "JavaScript", level: "production", note: "The web platform underneath." },
    { name: "Vite", level: "production", note: "Fast builds and dev tooling." },
    { name: "Tailwind CSS", level: "production", note: "Design systems and UI styling." },
  ]},
  { category: "databases", items: [
    { name: "PostgreSQL", level: "production", note: "Schema design, RLS and administration." },
    { name: "MongoDB", level: "handsOn", note: "Document storage for flexible data." },
    { name: "Redis", level: "working", note: "Caching and short-lived state." },
    { name: "Supabase", level: "production", note: "Auth, Postgres and storage for products." },
  ]},
  { category: "messaging", items: [
    { name: "Kafka", level: "working", note: "Event streaming between services." },
    { name: "NATS", level: "working", note: "Lightweight messaging.", enabled: false },
  ]},
  { category: "ai", items: [
    { name: "OpenAI", level: "handsOn", note: "LLM features and assistants." },
    { name: "LLM APIs", level: "handsOn", note: "Provider-agnostic model integration." },
    { name: "RAG", level: "handsOn", note: "Grounding answers in company knowledge." },
    { name: "Embeddings", level: "handsOn", note: "Semantic search and retrieval." },
    { name: "Vector databases", level: "working", note: "Storing and querying embeddings." },
  ]},
  { category: "network", items: [
    { name: "Cloudflare", level: "production", note: "DNS, CDN, WAF and edge caching." },
    { name: "DNS", level: "production", note: "Records, delegation and migrations." },
    { name: "CDN", level: "production", note: "Global delivery of static assets." },
    { name: "SSL/TLS", level: "production", note: "Certificates and secure transport." },
    { name: "Nginx", level: "handsOn", note: "Reverse proxy and ingress." },
  ]},
  { category: "tools", items: [
    { name: "Git", level: "production", note: "Version control for everything." },
    { name: "GitHub", level: "production", note: "Code, reviews and Actions." },
    { name: "GitLab", level: "handsOn", note: "Enterprise repos and pipelines." },
    { name: "Jira", level: "handsOn", note: "Agile planning and tracking." },
    { name: "Postman", level: "handsOn", note: "API testing and documentation." },
  ]},
];
