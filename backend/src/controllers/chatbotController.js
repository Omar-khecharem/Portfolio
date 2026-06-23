const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Certification = require('../models/Certification');
const ChatConfig = require('../models/ChatConfig');

const buildCVContext = async () => {
  const profile = await Profile.findOne();
  if (!profile) return {};
  const projects = await Project.find().sort({ order: 1 }).lean();
  const certifications = await Certification.find().sort({ order: 1 }).lean();
  return {
    name: profile.name,
    title: profile.title,
    bio: profile.bio || profile.shortBio,
    location: profile.location,
    email: profile.email,
    social: profile.social,
    available: profile.available,
    skills: profile.skills,
    experience: profile.experience,
    education: profile.education,
    languages: profile.languages,
    services: profile.services,
    projects,
    certifications,
  };
};

const buildSystemPrompt = (cv, config) => {
  const p = cv || {};
  const c = config || {};

  const sections = [];
  sections.push(`You are Omar Assistant — the official AI assistant of Omar KHECHAREM.\n`);

  sections.push(`ROLE:\n${c.role || 'You represent a freelance Full-Stack Developer portfolio.'}\n`);

  if (c.personality) {
    sections.push(`PERSONALITY:\n${c.personality}\n`);
  }

  const allRules = [...(c.defaultRules || []), ...(c.rules || [])];
  if (allRules.length > 0) {
    sections.push(`RULES:\n${allRules.map(r => `- ${r}`).join('\n')}\n`);
  }

  sections.push(`OMAR'S PROFILE DATA:
Name: ${p.name || 'Omar KHECHAREM'}
Title: ${p.title || 'Full-Stack Developer (MERN) | AI Enthusiast | Engineering Student'}
Location: ${p.location || 'Ariana, Tunisia'}
Email: ${p.email || 'omar.khecharem@isimg.tn'}
GitHub: ${(p.social && p.social.github) || 'https://github.com/Omar-khecharem'}
LinkedIn: ${(p.social && p.social.linkedin) || 'https://linkedin.com/in/omar-khecharem-373b16241'}
Available: ${p.available !== false ? 'Yes – open for freelance and internships' : 'Currently unavailable'}`);

  if (c.showSkills !== false) {
    const skillsText = (p.skills || []).map(s => `- ${s.name} (${s.category}, ${s.level}%)`).join('\n');
    sections.push(`\nSKILLS:\n${skillsText || 'No skills data provided.'}`);
  }
  if (c.showExperience !== false) {
    const experienceText = (p.experience || []).map(e => `- ${e.role} @ ${e.company} (${e.period}): ${e.description || ''}`).join('\n');
    sections.push(`\nEXPERIENCE:\n${experienceText || 'No experience data provided.'}`);
  }
  if (c.showProjects !== false) {
    const projectsList = (p.projects || []).slice(0, c.maxContextProjects || 6).map(pr => `- ${pr.title}: ${pr.description} [${(pr.technologies || []).join(', ')}]`).join('\n');
    sections.push(`\nPROJECTS:\n${projectsList || 'No projects data provided.'}`);
  }
  if (c.showEducation !== false) {
    const educationText = (p.education || []).map(ed => `- ${ed.degree}, ${ed.institution} (${ed.period})`).join('\n');
    sections.push(`\nEDUCATION:\n${educationText || 'No education data provided.'}`);
  }
  if (c.showCertifications !== false) {
    const certsText = (p.certifications || []).map(cert => `- ${cert.name} (${cert.issuer}, ${cert.date || 'N/A'})`).join('\n');
    sections.push(`\nCERTIFICATIONS:\n${certsText || 'No certifications data provided.'}`);
  }
  if (c.showLanguages !== false) {
    const languagesText = (p.languages || []).map(l => `- ${l.name}: ${l.level}`).join('\n');
    sections.push(`\nLANGUAGES:\n${languagesText || 'No languages data provided.'}`);
  }
  if (c.showServices !== false) {
    const servicesText = (p.services || []).map(s => `- ${s.title}: ${s.description}`).join('\n');
    sections.push(`\nSERVICES:\n${servicesText || 'No services data provided.'}`);
  }

  let result = sections.join('\n');
  if (c.briefMode !== false) {
    result += '\n\nIMPORTANT: Be brief. 2-3 sentences max. No markdown.';
  }
  result += `\n\nAVAILABLE PAGES ON OMAR'S PORTFOLIO:
- Home page (skills, experience, certifications): /
- About page: /about
- Projects page: /projects
- Contact page: /contact

When the user asks about a topic that has a dedicated page, suggest they can visit that page for more details.`;
  if (c.allowMarkdown) {
    result += '\n\nYou may use basic markdown for formatting.';
  } else {
    result += '\n\nNo markdown. Use plain text only.';
  }

  return result;
};

exports.chat = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Message is required' });
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const model = process.env.CLOUDFLARE_AI_MODEL || '@cf/meta/llama-3.1-8b-instruct';

    if (!accountId || !apiToken) {
      return res.status(501).json({ reply: 'Chatbot service not configured. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in backend .env' });
    }

    const [cv, config] = await Promise.all([
      buildCVContext(),
      ChatConfig.findOne({ isActive: true }),
    ]);

    const fallback = (config && config.fallbackResponse) || "I can only provide information about Omar's professional profile.";
    const maxHistory = (config && config.maxHistoryMessages) || 6;
    const temperature = (config && config.temperature) || 0.5;
    const maxTokens = (config && config.maxTokens) || 256;

    const systemPrompt = buildSystemPrompt(cv, config);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-maxHistory).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message.trim() },
    ];

    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error('Cloudflare AI error:', data.errors);
      return res.status(502).json({ reply: fallback });
    }

    const reply = (data.result?.response || '').trim();
    res.json({ reply: reply || fallback });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(502).json({ reply: 'Chatbot service is temporarily unavailable.' });
  }
};
