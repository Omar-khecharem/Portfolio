function buildSystemPrompt(cv) {
  const p = cv || {};

  const skillsText = (p.skills || [])
    .map(s => `- ${s.name} (${s.category}, ${s.level}%)`)
    .join('\n');

  const experienceText = (p.experience || [])
    .map(e => `- ${e.role} @ ${e.company} (${e.period}): ${e.description || ''}`)
    .join('\n');

  const projectsList = (p.projects || []).slice(0, 6)
    .map(pr => `- ${pr.title}: ${pr.description} [${(pr.technologies || []).join(', ')}]`)
    .join('\n');

  const educationText = (p.education || [])
    .map(ed => `- ${ed.degree}, ${ed.institution} (${ed.period})`)
    .join('\n');

  const certsText = (p.certifications || [])
    .map(c => `- ${c.name} (${c.issuer}, ${c.date || 'N/A'})`)
    .join('\n');

  const languagesText = (p.languages || [])
    .map(l => `- ${l.name}: ${l.level}`)
    .join('\n');

  const servicesText = (p.services || [])
    .map(s => `- ${s.title}: ${s.description}`)
    .join('\n');

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
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return Response.json({ reply: 'Method not allowed. Send a POST request.' }, {
        status: 405,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    try {
      const body = await request.json();
      const message = body.message;
      const cv = body.cv || {};
      const history = body.history || [];

      if (!message || typeof message !== 'string' || !message.trim()) {
        return Response.json({ reply: 'Please ask me a question about Omar.' }, {
          status: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
        });
      }

      const systemPrompt = buildSystemPrompt(cv);

      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message.trim() },
      ];

      const model = env.AI_MODEL || '@cf/meta/llama-3.1-8b-instruct';

      const response = await env.AI.run(model, {
        messages,
        max_tokens: 256,
        temperature: 0.5,
      });

      const rawReply = (response.response || '').trim();

      const cleanReply = rawReply || 'I can only provide information about Omar\'s professional profile.';

      return Response.json({ reply: cleanReply }, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (err) {
      console.error('Worker error:', err);
      return Response.json({
        reply: "I'm sorry, I'm experiencing a temporary issue. Please reach out to Omar directly at omar.khecharem@isimg.tn and he'll get back to you shortly.",
      }, {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};
