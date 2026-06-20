const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Certification = require('../models/Certification');

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

const buildSystemPrompt = (cv) => {
  const p = cv || {};

  const skillsText = (p.skills || [])
    .map(s => `- ${s.name} (${s.category}, ${s.level}%)`).join('\n');
  const experienceText = (p.experience || [])
    .map(e => `- ${e.role} @ ${e.company} (${e.period}): ${e.description || ''}`).join('\n');
  const projectsList = (p.projects || []).slice(0, 6)
    .map(pr => `- ${pr.title}: ${pr.description} [${(pr.technologies || []).join(', ')}]`).join('\n');
  const educationText = (p.education || [])
    .map(ed => `- ${ed.degree}, ${ed.institution} (${ed.period})`).join('\n');
  const certsText = (p.certifications || [])
    .map(c => `- ${c.name} (${c.issuer}, ${c.date || 'N/A'})`).join('\n');
  const languagesText = (p.languages || [])
    .map(l => `- ${l.name}: ${l.level}`).join('\n');
  const servicesText = (p.services || [])
    .map(s => `- ${s.title}: ${s.description}`).join('\n');

  return `You are Omar Assistant — the official AI assistant of Omar KHECHAREM.

ROLE:
You represent a freelance Full-Stack Developer portfolio.

PERSONALITY:
- professional
- concise
- confident
- recruiter-friendly

RULES:
- ONLY answer questions about Omar: his skills, experience, projects, certifications, freelance services, education, and contact.
- If asked ANYTHING unrelated, respond with exactly:
  "I can only provide information about Omar's professional profile."
- Never hallucinate information. If you don't know, say so.
- Be brief. 2-3 sentences max. No markdown.
- If someone wants to hire or contact Omar, encourage them to visit the Contact page or email omar.khecharem@isimg.tn.

OMAR'S PROFILE DATA:
Name: ${p.name || 'Omar KHECHAREM'}
Title: ${p.title || 'Full-Stack Developer (MERN) | AI Enthusiast | Engineering Student'}
Location: ${p.location || 'Ariana, Tunisia'}
Email: ${p.email || 'omar.khecharem@isimg.tn'}
GitHub: ${(p.social && p.social.github) || 'https://github.com/Omar-khecharem'}
LinkedIn: ${(p.social && p.social.linkedin) || 'https://linkedin.com/in/omar-khecharem-373b16241'}
Available: ${p.available !== false ? 'Yes – open for freelance and internships' : 'Currently unavailable'}

SKILLS:
${skillsText || 'No skills data provided.'}

EXPERIENCE:
${experienceText || 'No experience data provided.'}

PROJECTS:
${projectsList || 'No projects data provided.'}

EDUCATION:
${educationText || 'No education data provided.'}

CERTIFICATIONS:
${certsText || 'No certifications data provided.'}

LANGUAGES:
${languagesText || 'No languages data provided.'}

SERVICES:
${servicesText || 'No services data provided.'}`;
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

    const cv = await buildCVContext();
    const systemPrompt = buildSystemPrompt(cv);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-6).map(m => ({ role: m.role, content: m.content })),
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
        max_tokens: 256,
        temperature: 0.5,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error('Cloudflare AI error:', data.errors);
      return res.status(502).json({ reply: 'Chatbot service is temporarily unavailable.' });
    }

    const reply = (data.result?.response || '').trim();
    res.json({ reply: reply || "I can only provide information about Omar's professional profile." });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(502).json({ reply: 'Chatbot service is temporarily unavailable.' });
  }
};
