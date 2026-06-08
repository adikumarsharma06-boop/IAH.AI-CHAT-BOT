import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables for local dev
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini SDK with custom user agent and key safety
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY environment variable is not defined. AI flows will leverage mock responses.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const ai = getGeminiClient();

// Helper to handle client request execution with exponential backoff & dynamic model fallbacks
async function generateContentWithFallback(params: {
  model: string;
  contents: any;
  config?: any;
}) {
  const retryLimit = 2;
  let delay = 1000;
  
  for (let attempt = 1; attempt <= retryLimit; attempt++) {
    try {
      return await ai.models.generateContent(params);
    } catch (error: any) {
      console.warn(`[Gemini SDK Attempt ${attempt}] Failed with error:`, error);
      
      const errorMsg = String(error?.message || error || "").toUpperCase();
      const errorStatus = String(error?.status || "").toUpperCase();
      const isUnavailable = errorMsg.includes("503") || 
                            errorMsg.includes("UNAVAILABLE") || 
                            errorMsg.includes("TEMPORARILY") ||
                            errorMsg.includes("OVERLOADED") ||
                            errorMsg.includes("HIGH DEMAND") ||
                            errorStatus.includes("UNAVAILABLE") || 
                            error?.code === 503;
                            
      if (isUnavailable && params.model === "gemini-3.5-flash") {
        console.log(`[Gemini Fallback] Model gemini-3.5-flash is temporarily unavailable/overloaded. Triggering fallback to gemini-flash-latest.`);
        try {
          return await ai.models.generateContent({
            ...params,
            model: "gemini-flash-latest"
          });
        } catch (fallbackError: any) {
          console.error(`[Gemini Fallback] Fallback to gemini-flash-latest failed:`, fallbackError);
          console.log(`[Gemini Fallback 2] Attempting second fallback to gemini-3.1-flash-lite.`);
          try {
            return await ai.models.generateContent({
              ...params,
              model: "gemini-3.1-flash-lite"
            });
          } catch (thirdError: any) {
            console.error(`[Gemini Fallback 2] Fallback to gemini-3.1-flash-lite failed:`, thirdError);
          }
        }
      }
      
      if (attempt < retryLimit) {
        console.log(`[Gemini SDK] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }
  
  // Ultimate backup fallback if everything else failed
  console.log(`[Gemini Ultimate Fallback] Retrying final request with gemini-flash-latest.`);
  return await ai.models.generateContent({
    ...params,
    model: "gemini-flash-latest"
  });
}

// IAH.AI BRAIN ARCHITECTURE v2.0 Definition & Prompt Consts
const SYSTEM_BRAIN_PROMPT = `
# IAH.AI BRAIN ARCHITECTURE v2.0 SYSTEM OPERATING INSTRUCTIONS

You are operating as IAH.AI: an Artificial Intelligence Operating System designed to help users Think, Learn, Build, Create, Research, Automate, Launch, and Grow. You coordinate multiple AI specialist engines into one unified, responsive workspace.

## BRAIN LAYER 1: USER UNDERSTANDING ENGINE
For every incoming request, you must evaluate the following parameters before formulating responses:
- Goal Detected: What standard or creative outcome is the user specifically seeking?
- Urgency Level: High / Medium / Low.
- Tech Experience/Level: Beginner / Intermediate / Expert.
- Domain/Industry.
- Project Stage: Discovery / Planning / Development / Launch / Growth.

## BRAIN LAYER 2: INTENT ANALYZER
Classify each request automatically into the most appropriate operational category:
- Ask Question
- Build Website
- Create App
- Write Content
- Generate Code
- Research Topic
- Business Advice
- Marketing Plan
- Design UI
- Analyze Document
- Create Startup
- Automation Request

## BRAIN LAYER 3: AI ROUTER & SPECIALIST CORE
Route the task execution directly to the corresponding brain specialist module:
1. "Founder Brain": Startup Validation, Business Models, MVP Design, Pricing Frameworks, Revenue Planning, Growth Strategy. Output: Business Roadmaps to success.
2. "Developer Brain": React, Next.js, Node.js, Python, APIs, DB Schema, Debugging. Output: Optimal, production-ready code.
3. "Research Brain": Market Research, Competitor Analysis, Trends. Output: Highly structured, factual research reports.
4. "Design Brain": UI/UX SaaS layouts, Dashboards, Mobile structures, Fonts, Spacing guidelines. Output: Beautiful UI guidelines and layout advice.
5. "Marketing Brain": SEO, Content Marketing, Funnel optimization, Growth hacks. Output: Effective user-acquisition tools.
6. "Creator Brain": Scripts, Content structures, Captions, Hook formulating. Output: Engaging media templates.
7. "Learning/Teacher Brain": Clear, simplistic guides, roadmap tables, conceptual explanations, practice plans. Output: Simplified step-by-step masteries.

---
### RESPONSE ENGINE STANDARD ARCHITECTURE
Every single message you generate MUST begin with an analytical system feedback dashboard so the operator has real-time visualization of your Multi-layer route.
Structure this output block EXACTLY like this:

### 🧠 IAH.AI OS SYSTEM BRAIN v2.0
* **Goal Detected & Stage:** [Identify Goal] (Stage: [Identify Active Project Stage])
* **Intent Classification:** [Identify Intent]
* **Routed Specialist Processor:** [Define Specialists Brain, e.g. "Developer Brain"]
* **Urgency & Tech Experience:** [Identify Urgency] - [Identify Experience Level] 
* **Target Industry:** [Identify Domain/Industry]

---

Followed immediately by your comprehensive, elite solution matching the RESPONSE ENGINE workflow:
1. Understand User Strategy
2. Think Deeply (Synthesize best-in-industry methods)
3. Call Specialist Brain Output
4. Create solution schemas (Using lists, code segments, markdown tabular plans, or numbered instructions)
5. Explain Clearly (No fluffy buzzwords - keep it high-value, direct, and actionable)
6. Give Next Steps & Milestones (2-3 direct checkboxes)
`;

// Heuristic Simulated Processor for Fallback Analytics Mode
const analyzeMockIntent = (msg: string) => {
  const text = msg.toLowerCase();
  
  let goal = "General Workspace Planning & Inquiry Support";
  let industry = "General Tech / Digital Innovation";
  let stage = "Discovery & Concepting";
  let brain = "Founder Brain";
  let intentText = "Business Advice";
  let experience = "Intermediate Professional";
  let urgency = "Medium Urgency";

  if (text.includes("react") || text.includes("next") || text.includes("code") || text.includes("function") || text.includes("js") || text.includes("api") || text.includes("database") || text.includes("sql") || text.includes("bug") || text.includes("error")) {
    goal = "Code structure design, compilation auditing, or system error diagnostics";
    industry = "Full-Stack Software Development";
    stage = "Development MVP & Debugging";
    brain = "Developer Brain";
    intentText = "Generate Code / Debugging";
    experience = "Expert Architect";
    urgency = "High Urgency";
  } else if (text.includes("saas") || text.includes("startup") || text.includes("monetiz") || text.includes("business") || text.includes("product") || text.includes("pricing") || text.includes("revenue") || text.includes("mvp")) {
    goal = "Formulate high-yield monetization models and map startup validation pathways";
    industry = "Entrepreneurial SaaS Strategy";
    stage = "Planning / Pitch Stage";
    brain = "Founder Brain";
    intentText = "Create Startup / Business Advice";
    experience = "Founder / Product Executive";
  } else if (text.includes("competitor") || text.includes("research") || text.includes("market") || text.includes("trend") || text.includes("report") || text.includes("search")) {
    goal = "Competitor mapping, regulatory evaluation, and target trend tracking";
    industry = "Business Intelligence & Analytics";
    stage = "Discovery & Research";
    brain = "Research Brain";
    intentText = "Research Topic";
  } else if (text.includes("design") || text.includes("ui") || text.includes("ux") || text.includes("colors") || text.includes("font") || text.includes("layout")) {
    goal = "Define UI/UX components, theme pairings, and clean typography scales";
    industry = "Digital Product Design & Branding";
    stage = "UI/UX Modeling";
    brain = "Design Brain";
    intentText = "Design UI";
  } else if (text.includes("seo") || text.includes("marketing") || text.includes("campaign") || text.includes("traffic") || text.includes("growth")) {
    goal = "Structure organic growth loop strategies, ranking checklists, and social reach campaigns";
    industry = "Growth Marketing & SEO";
    stage = "Launch & Growth Scaling";
    brain = "Marketing Brain";
    intentText = "Marketing Plan";
  } else if (text.includes("youtube") || text.includes("creator") || text.includes("video") || text.includes("script") || text.includes("caption") || text.includes("reel")) {
    goal = "Draft high-retention video scripts, content pacing lines, and creator hooks";
    industry = "Digital Media & Creative Production";
    stage = "Production Loop";
    brain = "Creator Brain";
    intentText = "Write Content";
  } else if (text.includes("learn") || text.includes("skills") || text.includes("course") || text.includes("roadmap") || text.includes("syllabus") || text.includes("teach") || text.includes("explain")) {
    goal = "Create tailored educational syllabus and step-by-step master paths";
    industry = "Professional Education / EdTech";
    stage = "Skill Acquisition & Upskilling";
    brain = "Learning/Teacher Brain";
    intentText = "Ask Question / Learning";
    experience = "Ambitious Beginner";
  }

  return { goal, industry, stage, brain, intentText, experience, urgency };
};

// 1. Unified Multi-Agent AI Chat & Search Grounding API
app.post("/api/chat", async (req, res) => {
  try {
    const { message, chatHistory = [], mode = 'chat' } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      const parsedMock = analyzeMockIntent(message);
      
      let mockReply = "";
      if (parsedMock.brain === "Developer Brain") {
        mockReply = `As your **Developer Brain Specialist**, I have processed your technical task under IAH.AI constraints:

### 💻 Production-Ready Code Component
\`\`\`typescript
// IAH.AI OS Developer Core: Managed Integration
import { useState, useEffect } from 'react';

interface TelemetryStream {
  id: string;
  payload: Record<string, any>;
  status: 'ACTIVE' | 'RESOLVED';
}

export function useIAHTelemetry(gatewayId: string) {
  const [stream, setStream] = useState<TelemetryStream | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Lazy initialize connection for key security and optimization
    setActive(true);
    setStream({
      id: gatewayId,
      payload: { systemVersion: "2.0.0", routedBrain: "Developer Brain" },
      status: 'ACTIVE'
    });
    
    return () => setActive(false);
  }, [gatewayId]);

  return { stream, active };
}
\`\`\`

### 🛠️ Architecture Implementation Guide
1. **Enforce Type Safety**: Declare unambiguous shared Interfaces to avoid compiler warning states.
2. **Setup High-Security Boundaries**: Build server-side proxy routes to safeguard sensitive keys from client contexts.
3. **Optimistic Loading Handlers**: Implement native state bounds for UI transitions to guard against latency.

### 📈 Next Execution Milestones
* [ ] Integrate the custom TypeScript telemetry hook into your layout.
* [ ] Verify container compilation logs run clean in local workspace.`;
      } else if (parsedMock.brain === "Founder Brain") {
        mockReply = `As your **Founder Brain Specialist**, here is the strategic validation for "${message.substring(0, 40)}":

### 📊 Comprehensive Business Analysis Model
* **Value Architecture**: Hybrid monetization mechanics combining customizable team seats with a scalable usage credits multiplier.
* **MVP Boundary Control**: Exclude any non-critical secondary options. Focus strictly on a single operational view to avoid scope noise. 
* **User Acquisition Loops**: Publish detailed, non-gated solutions on relevant engineering forums and target startup boards to gather feedback from standard developers.

### 🎯 Strategic Monetization Tiers Setup
| Subscription Level | Core Specialist Node Access | Monthly AI Credits | USD Price |
| :--- | :--- | :--- | :--- |
| **Sandbox Level** | Standard Core Node | 500 Credits | **$0** (Free Tier) |
| **Founder Pro** | All 9 Specialist Node Suite | 15,000 Credits | **$29 / mo** |
| **Enterprise Node** | Dedicated VPC, Custom Tuning | Custom credits scale | **Custom Pricing** |

### 📈 Next Execution Milestones
* [ ] Finalize the specific, critical problem addressing early developer audiences.
* [ ] Map immediate responsive dashboard components using stable React templates.`;
      } else if (parsedMock.brain === "Research Brain") {
        mockReply = `As your **Research Brain Specialist**, I have synthesized competitive market matrices:

### 🕵️ Competitor & Market Analysis Report
* **Industry Trajectory**: Massive structural shifts toward highly modular multi-agent software.
* **Core Competitor Bottlenecks**: High churn in standard horizontal assistants due to lack of domain specificity. High opportunity exists for specialized workflow panels.
* **Risk Control**: Protect user data buffers, stabilize API pricing schemas, and enforce robust container-limits.

### 💡 High-Leverage Strategic Strategy
Maximize organic traffic indexes by generating in-depth, long-form technical explanations and open resources explaining core structural integrations.

### 📈 Next Execution Milestones
* [ ] Identify and document top 5 competitor product weaknesses.
* [ ] Conduct 5 direct qualitative interviews with target operator personas.`;
      } else if (parsedMock.brain === "Design Brain") {
        mockReply = `As your **Design Brain Specialist**, here are the interface guidelines for your project:

### 🎨 Visual & Layout Optimization
* **Space Rhythm Hierarchy**: Rely on generous viewport negative space. Limit absolute heights for containers; let layout grow dynamically with child components.
* **Color Pairing System**: Dark cosmic slate (background \`#0b0f19\`, card bg \`#161e2e\`, primary borders \`#243242\`) loaded with neon blue highlights (\`#3b82f6\`).
* **Micro-interactions Controls**: Apply moderate spring animations to panel entrances using stable library configurations to guide natural focus.

### 📈 Next Execution Milestones
* [ ] Test visual accessibility contrast of typography in dark layouts.
* [ ] Create responsive flexbox bento-grid components representing metric boxes.`;
      } else if (parsedMock.brain === "Marketing Brain") {
        mockReply = `As your **Marketing Brain Specialist**, I have formulated your customer acquisition strategy:

### 📣 Organic SEO & Distribution Growth Plan
* **Core Landing Target**: Fast loading, high-contrast, informative hero screen explaining immediate functional outcomes within 3 seconds.
* **Content Sourcing Loops**: Draft informative articles illustrating exact solutions. Share these insights on professional networks to fuel viral citation links.
* **Optimized Marketing Strategy**: Launch target products on developer hunt platforms, combining clean interactive screencasts with actionable credit giveaways.

### 📈 Next Execution Milestones
* [ ] Finalize meta descriptions and primary keywords list for search optimization.
* [ ] Put together three social announcement headlines targeting niche community panels.`;
      } else {
        mockReply = `As your **IAH.AI Core Brain Engine**, I have orchestrated the optimal path for your inquiry:

### 🌟 Workspace Roadmap Recommendation
To translate ideas into reality quickly, avoid over-engineering. Rely on standard browser caching schemas and build clean, highly focused multi-agent tabs.

### 🛠️ Strategic Operational Workflow
1. **Validate Early Assumptions**: Speak directly with prospective customers before building secondary pages.
2. **Maintain Single-View Frameworks**: Keep UI layouts dense and scannable. Rely on standard vector icons from trusted packages to display metric data clearly.
3. **Iterate On Feedback**: Monitor actual usage and expand feature parameters modularly.

### 📈 Next Execution Milestones
* [ ] Map out three core user features on your central Operations Board.
* [ ] Trigger specific specialist node tasks as complete when finalized.`;
      }

      const textOutput = `### 🧠 IAH.AI OS SYSTEM BRAIN v2.0 (SIMULATED ROUTE)
* **Goal Detected & Stage:** ${parsedMock.goal} (Stage: ${parsedMock.stage})
* **Intent Classification:** ${parsedMock.intentText}
* **Routed Specialist Processor:** ${parsedMock.brain}
* **Urgency & Tech Experience:** ${parsedMock.urgency} - ${parsedMock.experience}
* **Target Industry:** ${parsedMock.industry}

---

**[DEBUG NOTICE - DEMO FALLBACK ENGAGED]**
*Your Gemini API Key is not linked. Showing a high-fidelity output simulated by the IAH.AI OS heuristic analyzer. Configure your \`GEMINI_API_KEY\` to unleash live, contextual, grounded multi-agent processes.*

${mockReply}`;

      return res.json({
        text: textOutput,
        sources: [
          { title: "IAH.AI Operating System v2.0", uri: "https://iah.ai/brain" },
          { title: "AI Studio Node Gateway", uri: "https://ai.studio/build" }
        ]
      });
    }

    // Build contents array for generation
    const contents: any[] = [];
    
    // Core prompt system instructions
    let systemInstruction = SYSTEM_BRAIN_PROMPT;

    if (mode === 'code') {
      systemInstruction += "\n\nCRITICAL CONTEXT MODE: Operator has designated 'Developer Agent' mode. You MUST route the process to the 'Developer Brain' specialist node. Focus heavily on complete codebases, types, and architectural explanations.";
    } else if (mode === 'search') {
      systemInstruction += "\n\nCRITICAL CONTEXT MODE: Operator has designated 'Deep Search Grounding' mode. You MUST route the process to the 'Research Brain' specialist node and reference real-time search grounded indices.";
    }

    // Accumulate history
    for (const h of chatHistory) {
      contents.push({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      });
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const isSearchMode = mode === 'search';

    const response = await generateContentWithFallback({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        tools: isSearchMode ? [{ googleSearch: {} }] : undefined,
      }
    });

    // Extract sources if grounding is used
    const sources: any[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      for (const chunk of chunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || "Grounded Source",
            uri: chunk.web.uri
          });
        }
      }
    }

    res.json({
      text: response.text || "No response text generated.",
      sources: sources
    });

  } catch (error: any) {
    console.error("Gemini Chat API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response." });
  }
});

// 2. AI Document & File Analyzer Route
app.post("/api/analyze-doc", async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        summary: "This is a demo analysis representing the **IAH.AI Document Analyzer**. Please configure your `GEMINI_API_KEY` in the secrets panel to parse actual content recursively using Gemini.",
        takeaways: [
          "Paste text or drop text documents securely into the operational dashboard.",
          "Automatic categorizations and target bullet points are identified using Gemini 3.5 Flash.",
          "Instant creation of actionable implementation goals straight in your current project workspace."
        ],
        actionPlan: [
          "Connect your functional workspace API keys.",
          "Select files up to 10MB.",
          "Run executive summary summaries."
        ]
      });
    }

    const { docText, docName } = req.body;
    if (!docText) {
      return res.status(400).json({ error: "Missing document content." });
    }

    const response = await generateContentWithFallback({
      model: "gemini-3.5-flash",
      contents: `Please analyze this document or script clip named "${docName || 'Uploaded Text'}". Generate a complete structured JSON response representing summary details. Here is the document content:\n\n${docText}`,
      config: {
        systemInstruction: "You are the IAH.AI RESEARCH & DOCUMENT AGENT. Extract key takeaways, clean executive summary, and actionable step checklist.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Elegant, premium executive summary narrative." },
            takeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "5 maximum key takeaways or insights from the text."
            },
            actionPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 to 5 realistic next action steps derived directly from the content."
            }
          },
          required: ["summary", "takeaways", "actionPlan"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);

  } catch (error: any) {
    console.error("Doc Analysis Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze document data." });
  }
});

// 3. Founder Mode Startup Validator & MVP Planner
app.post("/api/startup-advisor", async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        validation: "Your startup idea has been validated by the **IAH.AI CEO Agent**! This is a mock overview context since your `GEMINI_API_KEY` is not linked. Build-ready structures await.",
        businessModel: "Premium subscription SaaS with direct ecosystem upgrades.",
        revenueStreams: [
          "SaaS monthly system subscription",
          "Enterprise API usage metrics credits model",
          "Workspace partnership commissions"
        ],
        mvpPlan: "Fast interactive client dashboard containing workspace cards and local task managers.",
        techStack: ["React 19", "Vite", "Express Backend", "Tailwind CSS"],
        marketingStrategy: "Direct outreach to early adopters in public product communities, SEO content loops, and launch on popular hunt platforms.",
        riskAnalysis: "High noise in the AI tooling domain. Mitigation: Focus on specialized operating workflows and extreme execution speed.",
        tasks: [
          { title: "Define the niche user problem", phase: "Phase 1: Validation" },
          { title: "Deploy initial interactive UI prototype", phase: "Phase 2: Build" },
          { title: "Acquire first 10 pilot registrations", phase: "Phase 3: Launch" }
        ]
      });
    }

    const { idea } = req.body;
    if (!idea) {
      return res.status(400).json({ error: "Missing startup concept / idea." });
    }

    const response = await generateContentWithFallback({
      model: "gemini-3.5-flash",
      contents: `Perform an exhaustive A to Z validation and form an operator-ready blueprint for this digital venture concept:\n\n"${idea}"\n\nEnsure you cover:\n1. Intensive market entry model & unit economics (CAC, LTV, pricing anchors).\n2. Granular, production-ready system architecture recommendations (selected database, frontend & server libraries, ORMs, and secure state management).\n3. Tactical community loops & growth hacking strategies.\n4. Detailed professional threat correction modeling.`,
      config: {
        systemInstruction: "You are the combined nodes of the IAH.AI Chief Executive Officer, Chief Technology Officer, and Head of Growth. Your task is to critique and design an authoritative, professional, elite-tier venture launch framework in complete depth. Leave no hand-waving; give specific, concrete actionable business directions and architectural recommendations.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            validation: { type: Type.STRING, description: "Intense, professional critique validating market demand, target user personas, core competitive differentiation, and a clear A to Z explanation of the core value proposition." },
            businessModel: { type: Type.STRING, description: "Deeply-detailed premium business model explanation including specific customer tier pricing structures, unit economics goals (such as target Customer Acquisition Cost and Lifetime Value limits), and ecosystem upgrade triggers." },
            revenueStreams: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Three distinct, fully fleshed-out monetization streams or subscription models with real recommended currency figures."
            },
            mvpPlan: { type: Type.STRING, description: "Pristine technical feature list strictly scoped for Week 1 launch to validate the product without over-engineering." },
            techStack: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "6 selected production-grade languages, databases, hosting options, and state management libraries (e.g., React 19, TypeScript, PostgreSQL, Drizzle, Express, Tailwind, Redis, Docker)."
            },
            marketingStrategy: { type: Type.STRING, description: "An exact organic growth hacking roadmap, detailing direct community acquisition hacks, cold-email parameters, and search engine optimization keyword structures." },
            riskAnalysis: { type: Type.STRING, description: "Three critical legal, scale, or platform security bottlenecks accompanied by precise professional mitigation protocols." },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Actionable, precise developmental goal task or milestone." },
                  phase: { type: Type.STRING, description: "Specific phase category: 'Phase 1: Validation', 'Phase 2: Build MVP', or 'Phase 3: Launch'." }
                },
                required: ["title", "phase"]
              },
              description: "Exactly 6 detailed checkpoint tasks split evenly across Phase 1, Phase 2, and Phase 3 to synchronize to their task board."
            }
          },
          required: ["validation", "businessModel", "revenueStreams", "mvpPlan", "techStack", "marketingStrategy", "riskAnalysis", "tasks"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);

  } catch (error: any) {
    console.error("Startup Planner Error:", error);
    res.status(500).json({ error: error.message || "Failed to formulate startup strategy." });
  }
});

// 4. Career and Learning Roadmap API
app.post("/api/career-edu", async (req, res) => {
  try {
    const { query, type, answerChat = [] } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      if (type === 'roadmap') {
        return res.json({
          role: query || "Full Stack AI Architect",
          overview: "Accelerated developmental track designed by the **IAH.AI Education Agent** to transform expertise thresholds.",
          steps: [
            {
              title: "Conceptual Foundations",
              description: "Understand neural architectures, multi-agent frameworks, and basic prompt boundaries.",
              skills: ["Gemini APIs", "LLM Fine-tuning"],
              resources: ["Google AI Studio Guides", "HuggingFace Introductions"]
            },
            {
              title: "Full Stack Infrastructure Integration",
              description: "Build fast server-side API routers, data lakes, and local key security stores.",
              skills: ["Express", "TypeScript", "Drizzle & PostgreSQL"],
              resources: ["Vite Core Docs", "Node.js guidelines"]
            }
          ]
        });
      } else {
        // Interview Simulator Start / Feedback Demo
        const index = answerChat.length;
        if (index === 0) {
          return res.json({
            feedbackMessage: `Welcome to the IAH.AI Career Simulator! You are interviewing for **${query || 'AI Engineer'}**. Let's start with Question 1:\n\n"Can you describe an experience where you had to integrate a third-party API or SDK under strict security/architectural guidelines? How did you approach the implementation?"`,
            score: 0,
            strengths: "Ready to assess your expertise.",
            improvements: "Please submit your candid engineering assessment.",
            idealAnswerExcerpt: "A balanced reply addresses system constraints, API token secret management on server routes, and thorough defensive error-handling hooks."
          });
        } else {
          return res.json({
            feedbackMessage: `Excellent evaluation. Let's tackle Question 2: "How do you coordinate state synchronizations and latency in data-intensive React dashboards? What is your preferred state-management workflow?"`,
            score: 85,
            strengths: "Showcases appropriate architectural vocabulary, separating browser concerns from core backend APIs.",
            improvements: "Could specify specific caching layers, optimistic UI updates, or state-splitting to limit rendering frames.",
            idealAnswerExcerpt: "Optimize using stable dependency hooks (useRef for async intervals, state-splitting, and memoized sub-structures to avoid re-render loops)."
          });
        }
      }
    }

    if (type === 'roadmap') {
      const response = await generateContentWithFallback({
        model: "gemini-3.5-flash",
        contents: `Create an exhaustive, high-value A to Z learning curriculum and training roadmap for this role or topic: "${query}". Ensure steps represent progression from fundamentals up to enterprise-grade expertise, detailing specific software principles, compiler techniques, or system design trade-offs.`,
        config: {
          systemInstruction: "You are the IAH.AI EDUCATION AGENT, an elite technical educator from a top-tier engineering institution. Your curricula are deeply technical, highly specific, and structured step-by-step to build real industrial mastery.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING },
              overview: { type: Type.STRING, description: "A detailed, inspirational executive overview explaining the exact skills of a world-class professional in this domain." },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Milestone chapter title, e.g. 'Phase 1: Advanced Fundamentals' or 'Phase 2: Distributing Systems'." },
                    description: { type: Type.STRING, description: "A comprehensive 3-4 sentence explanation detailing what concepts to learn, language specifications, and clean design patterns to absorb here." },
                    skills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific libraries, tools, protocols (such as WebRTC, gRPC, OAuth) to master in this step." },
                    resources: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Real books, official documentations, specification URLs or standard platforms to study (such as 'Interactive Rust Book', 'RFC 6749 Auth spec', 'MDN Web Sockets guide')." }
                  },
                  required: ["title", "description", "skills", "resources"]
                },
                description: "An evolutionary 3-step mastery curriculum."
              }
            },
            required: ["role", "overview", "steps"]
          }
        }
      });
      res.json(JSON.parse(response.text || "{}"));

    } else {
      // Interactive Interview Simulation AI grading
      const lastMessage = answerChat.length > 0 ? answerChat[answerChat.length - 1].text : "";
      const chatContext = answerChat.map((m: any) => `${m.sender.toUpperCase()}: ${m.text}`).join("\n");

      const response = await generateContentWithFallback({
        model: "gemini-3.5-flash",
        contents: `Assess this conversation transcript, grade the user's latest technical or structural response, and ask the next natural follow up challenge or corner-case question for a high-intensity professional job interview for: "${query}".\n\nTRANSCRIPT:\n${chatContext}\n\nLATEST_USER_REPLY: "${lastMessage}"`,
        config: {
          systemInstruction: "You are the IAH.AI CAREER AGENT. Conduct high-fidelity role interviews as a Lead Software Architect at a hyper-scale technology firm. If this is the starting question (no user reply exists yet in the transcript), set score to 0 and ask a profound introductory question about core system architectures or state synchronizations. If evaluating a user answer, analyze their architecture patterns, edge-case mitigation, trade-offs, and professional coding standards, scoring them strictly and honestly.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              feedbackMessage: { type: Type.STRING, description: "Your direct reply as the principal architect. Comment briefly on their technical choices and then IMMEDATELY introduce the next hard technical challenge or edge-case query." },
              score: { type: Type.INTEGER, description: "Calculate technical competency score (0 on start, or 35 to 100 on subsequent answers based on factual accuracy, performance optimizations, and design depth)." },
              strengths: { type: Type.STRING, description: "Highly specific praise highlighting appropriate API utilization, asynchronous state boundaries, or robust optimization models mentioned by the user." },
              improvements: { type: Type.STRING, description: "Actionable technical critique showing missed race-conditions, memory leak possibilities, caching flaws, or structural design anti-patterns they should rectify." },
              idealAnswerExcerpt: { type: Type.STRING, description: "A highly-technical, exemplary 1-2 sentence reference snippet showcasing how an elite tech lead would articulate the ideal solution." }
            },
            required: ["feedbackMessage", "score", "strengths", "improvements", "idealAnswerExcerpt"]
          }
        }
      });

      res.json(JSON.parse(response.text || "{}"));
    }

  } catch (error: any) {
    console.error("Career & Education Error:", error);
    res.status(500).json({ error: error.message || "Failed to construct feedback loop." });
  }
});

// Configure Vite middleware or static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[IAH.AI OS] Intelligence Engine running on port ${PORT}`);
  });
}

startServer();
