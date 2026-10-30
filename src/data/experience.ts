export interface Role {
  company: string;
  url?: string;
  logo?: string;
  role: string;
  dateRange: string;
  summary?: string;
  links?: { label: string; href: string; image?: string; alt?: string }[];
  projects?: string[];
  descriptions: string[];
}

export const roles: Role[] = [
  {
    company: "Sublime Security",
    url: "https://sublime.security",
    logo: "/images/logos/career-sublime.svg",
    role: "Staff Product Designer",
    dateRange: "2025–Now",
    summary: "Sublime makes agentic email security. I joined as its first individual contributor product designer, and my focus is its AI agents, which triage threats and write new detections. I also built Design Studio, the tool the product team uses to prototype.",
    projects: ["sublime-agents", "design-studio"],
    descriptions: [
      "Designed a multi-agent system pairing an analyst agent with a detection engineering agent — automating threat triage and continuously generating new detection rules in Sublime's custom DSL.",
      "Shipped security features for high-stakes scenarios: Email Bomb protection, vendor impersonation and compromise, and automated threat detection.",
      "Built an internal, agent-agnostic prototyping platform — sole designer and engineer. Now used daily by the full design team.",
    ],
  },
  {
    company: "JupiterOne",
    url: "https://www.jupiterone.com",
    logo: "/images/logos/career-jupiterone.svg",
    role: "Lead Product Designer",
    dateRange: "2022–2023",
    summary: "JupiterOne helps security teams see and search everything in their company's cloud. As lead designer, I made its query language approachable, cutting the time it took new customers to write and save their first custom query from 21 days to 1, and helped roll out a new design system across the product.",
    projects: ["query-language"],
    descriptions: [
      "Designed a query interface that reduced new user time-to-value from 21 days to 1 day.",
      "Drove creation and adoption of a new design system across enterprise security platform.",
      "Informed product roadmap through cross-functional collaboration and design leadership.",
    ],
  },
  {
    company: "Signal Sciences / Fastly",
    url: "https://www.fastly.com",
    logo: "/images/logos/career-sigsci.svg",
    role: "Senior Product Designer",
    dateRange: "2019–2021",
    summary: "Signal Sciences, bought by Fastly in 2020, protects websites and APIs from attacks. I designed how customers write firewall rules, set rate limits and stop bots.",
    projects: ["expansion", "vision"],
    descriptions: [
      "Designed features for enterprise firewall rules management, rate limiting, and bot defense.",
      "Facilitated strong design, dev, and PM collaboration via workshops, systems diagramming, storyboarding, prototyping, and presentations.",
    ],
  },
  {
    company: "Tenable",
    url: "https://www.tenable.com",
    logo: "/images/logos/career-tenable.svg",
    role: "Product Designer",
    dateRange: "2017–2018",
    summary: "Tenable helps companies measure their exposure to cyber attacks. I designed its reporting and data visualization: the dashboards and reports customers used to understand their risk.",
    descriptions: [
      "Designed enterprise SaaS features to improve Tenable's cyber risk platform: dashboard creation & management, data visualization templates, & team credential management.",
    ],
  },
  {
    company: "American Express",
    url: "https://www.americanexpress.com",
    logo: "/images/logos/career-amex.svg",
    role: "Design Engineer",
    dateRange: "2013–2016",
    summary: "At American Express, I worked on the Serve platform, which powered three products: Amex Serve, Walmart Bluebird and Target REDcard. I led prototyping in code as part of the design process and delivered the platform's front-end code.",
    descriptions: [
      "Built UI for a multi-brand platform used by Amex, Walmart, and Target.",
      "Led prototyping in code to design flexible and robust responsive web UX.",
    ],
  },
  {
    company: "Leo Burnett",
    url: "https://leoburnett.com",
    logo: "/images/logos/career-leoburnett.svg",
    role: "Brand Strategist",
    dateRange: "2012–2013",
    summary: "At the ad agency Leo Burnett, I wrote brand strategy for Allstate, MillerCoors and Sprint, grounded in consumer research. It's where I learned to start from the audience.",
    descriptions: [
      "Developed brand strategies using consumer research and cultural insights, creating high impact communications for clients like Allstate, MillerCoors, and Sprint.",
    ],
  },
];
