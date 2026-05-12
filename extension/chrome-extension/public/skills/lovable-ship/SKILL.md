---
name: lovable-ship
description: "Pre-ship checklist — finds everything that would embarrass you when real users try your app."
---
# /lovable-ship

You think it's ready. Before you share the link, send this. First impressions from real users are hard to recover from — a broken mobile layout, a form that doesn't save, placeholder text still in the footer, or an error that shows a raw stack trace instead of a helpful message. These are fixable in 10 minutes now and unfixable once people have seen them.

Run a pre-ship audit across these six areas. For each problem found, write the Lovable prompt to fix it.

**1. The core flow — does it actually work?**
Walk through the main user journey as if you're a new user who has never seen the app. Sign up (or log in), complete the primary action, see the result. Does it work without any prior knowledge of how it was built? If anything requires explanation, it's broken.

**2. Mobile**
Open the app on a phone or use browser dev tools at 390px width. Check every screen. Common failures: text overflows its container, buttons are too small to tap, forms stack incorrectly, navigation disappears or overlaps content.

**3. Empty and error states**
What does the app show when there's no data yet? A blank white page is not acceptable — it looks broken. What does it show when something fails — a network error, a failed form submission, a Supabase error? Raw error messages must never reach the user.

**4. Placeholder content**
Search every screen for: "Lorem ipsum", "Sample text", "User name", "example@email.com", "Feature 1", "Coming soon". Any placeholder that a real user would see is unfinished work.

**5. Auth flows**
If the app has authentication: does the session persist after a page refresh? Does logging out clear all user data from the UI? Can a logged-out user access pages they shouldn't? Does the login redirect work correctly?

**6. Loading states**
Are there any actions that take time (form submissions, data fetches, API calls) that show no feedback? The user needs to know something is happening. Check every button that triggers a backend action.

Produce a numbered fix list with severity (blocks launch / should fix / polish). Write the Lovable prompt for every item that blocks launch. Do not share the link until the blockers are resolved.
