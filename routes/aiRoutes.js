const express = require('express');
const router = express.Router();

// POST /api/ai/generate-description (Practical 13)
router.post('/generate-description', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required to generate a description' });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // If an OpenAI API key is provided, attempt live AI completion
    if (apiKey && apiKey !== 'your_openai_or_gemini_key_here') {
      try {
        const { default: OpenAI } = await import('openai');
        const client = new OpenAI({ apiKey });
        const completion = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an AI task assistant. Output a concise 1-2 sentence actionable description for the task title given.'
            },
            {
              role: 'user',
              content: `Write a short task description for: "${title.trim()}"`
            }
          ],
          max_tokens: 60,
        });

        const aiText = completion.choices[0]?.message?.content?.trim();
        if (aiText) {
          return res.status(200).json({
            title: title.trim(),
            description: aiText,
            source: 'openai-live',
          });
        }
      } catch (aiErr) {
        console.warn('[AI API Warning] Live AI call failed, falling back to local heuristic generator:', aiErr.message);
      }
    }

    // High-quality contextual heuristic fallback for offline or student development mode
    const heuristics = [
      `Review requirements, organize implementation steps, and verify outcomes for "${title.trim()}".`,
      `Design and execute actionable milestones to successfully complete "${title.trim()}".`,
      `Implement core logic, conduct unit tests, and document completion for "${title.trim()}".`
    ];
    const suggestedDesc = heuristics[Math.floor(Math.random() * heuristics.length)];

    return res.status(200).json({
      title: title.trim(),
      description: suggestedDesc,
      source: 'heuristic-ai-fallback',
      note: 'Graceful fallback active (configure OPENAI_API_KEY in .env for live model responses)',
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Failed to generate task description',
      details: err.message,
    });
  }
});

module.exports = router;
