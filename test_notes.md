
const { submitAiInquiry } = require('./app/actions/ai-wizard'); // This won't work directly because it's a server action file with 'use server' and imports
// Actually, I can't easily import server actions in a standalone node script because of Next.js bundling execution context.
// I have to rely on my code review or use `npm run dev` and a browser (which failed).

// Alternative: Create a new API route `app/api/test-ai-wizard/route.ts` that calls the function and logs result, then curl it.
// But that requires modifying code.

// Let's just trust my code review for now and focus on the Recaptcha issue which is a definite error.
