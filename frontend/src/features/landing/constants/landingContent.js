export const NavLinks = [
  { label: 'AI Assistant', href: '#ai-assistant' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
];

export const HeroContent = {
  headline: 'Elevate Your Academic Potential',
  subheadline: 'The ultimate AI-powered collaboration platform for students, researchers, and educators.',
  description: 'Unleash the power of AI to analyze papers, generate notes, collaborate in real-time, and accelerate your learning journey.',
  primaryCTA: 'Get Started for Free',
  secondaryCTA: 'Explore Features',
};

export const FeaturesData = [
  {
    title: 'AI Study Assistant',
    description: 'Interact with an intelligent assistant to explain complex concepts, summarize texts, and guide your research.',
    highlights: [
      'Ask questions in natural language',
      'Get step-by-step explanations',
      'Generate practice questions instantly',
    ],
    icon: 'BrainCircuit',
  },
  {
    title: 'Smart Notes Generator',
    description: 'Automatically generate comprehensive notes and summaries from your uploaded documents and lectures.',
    highlights: [
      'Key points + definitions',
      'Topic-wise summaries',
      'Export-ready study notes',
    ],
    icon: 'FileText',
  },
  {
    title: 'Question Paper Generator',
    description: 'Instantly create customized practice tests and quizzes based on your study materials to prep for exams.',
    highlights: [
      'Bloom-level difficulty control',
      'Unit-wise question sets',
      'Answer keys (optional)',
    ],
    icon: 'ScrollText',
  },
  {
    title: 'Real-time Collaboration',
    description: 'Work together with peers on projects, share insights, and edit documents concurrently without friction.',
    highlights: [
      'Live updates for teams',
      'Share notes and materials securely',
      'Faster group assignments',
    ],
    icon: 'Users',
  },
  {
    title: 'Role-based Dashboards',
    description: 'Dedicated workflows for students, teachers, and department coordinators to keep everyone aligned.',
    highlights: [
      'Student productivity tools',
      'Teacher content management',
      'HOD analytics & oversight',
    ],
    icon: 'LayoutDashboard',
  },
];

export const HowItWorksSteps = [
  {
    step: '01',
    title: 'Upload Materials',
    description: 'Securely upload your PDFs, lecture recordings, and research papers for AI-assisted study workflows.',
  },
  {
    step: '02',
    title: 'AI Processes Content',
    description: 'Our advanced RAG-based AI analyzes and indexes your content, making everything instantly searchable and comprehensible.',
  },
  {
    step: '03',
    title: 'Generate Insights',
    description: 'Chat with your documents, generate smart notes, and extract key findings in seconds.',
  },
  {
    step: '04',
    title: 'Take Tests',
    description: 'Evaluate your understanding with AI-generated question papers tailored to your specific curriculum.',
  },
];

export const AIHighlightContent = {
  headline: 'Powered by Advanced RAG Technology',
  description: 'Our system doesn\'t just guess. It uses Retrieval-Augmented Generation to ground every answer in your specific course materials, ensuring citing accuracy and eliminating hallucinations.',
  bullets: [
    'Answers grounded in your PDFs and notes',
    'Better accuracy for syllabus-specific questions',
    'Faster summarization and revision workflows',
  ],
  chatPreview: [
    { sender: 'user', message: 'Can you summarize the main findings of the uploaded paper on Quantum Entanglement?' },
    { sender: 'ai', message: 'Based on Section 3, the paper concludes that macroscopic entanglement is viable at room temperature under specific magnetic constraints. Would you like me to elaborate on the constraints?' }
  ]
};

export const PricingPlans = [
  {
    name: 'Free',
    price: '₹0',
    period: '/month',
    description: 'Great for trying ACAD-Assist and light study sessions.',
    features: [
      'Limited AI chat sessions per day',
      'Basic notes generation',
      'Up to 50MB uploads',
      'Community support',
    ],
    ctaText: 'Get Started',
    ctaHref: '/register',
  },
  {
    name: 'Pro',
    price: '₹199',
    period: '/month',
    badge: 'Most Popular',
    description: 'For serious learners who want faster workflows and deeper insights.',
    features: [
      'Higher AI usage limits',
      'RAG-based answers grounded in your uploads',
      'Smart notes + summaries (PDFs & docs)',
      'Question paper generator',
      'Priority processing queue',
    ],
    ctaText: 'Upgrade to Pro',
    ctaHref: '/register',
    popular: true,
    note: 'Ideal for individual students',
  },
  {
    name: 'Teams',
    price: '₹499',
    period: '/month',
    description: 'For project groups and labs collaborating on shared materials.',
    features: [
      'Shared study materials',
      'Real-time collaboration tools',
      'Team roles & permissions',
      'Higher upload and storage limits',
      'Email support',
    ],
    ctaText: 'Start Team Plan',
    ctaHref: '/register',
    note: 'Best for 3–10 members',
  },
];

export const CTAContent = {
  headline: 'Start Learning Smarter with AI',
  description: 'Join thousands of forward-thinking students and researchers supercharging their productivity.',
  buttonText: 'Join Now',
};

export const FooterLinks = {
  product: [
    { label: 'AI Assistant', href: '#ai-assistant' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Changelog', href: '#' },
    { label: 'Integrations', href: '#' },
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  resources: [
    { label: 'Community', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'API Documentation', href: '#' },
    { label: 'Status', href: '#' },
  ],
  social: [
    { label: 'Twitter', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ]
};
