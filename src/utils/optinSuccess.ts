// What every opt-in form does after a successful sign-up. These values come
// from the welcome-mat popup, so the popup, the in-article boxes, the sticky
// bar and the homepage forms all behave the same way. The code that uses them
// is window.cbeOptinSuccess() in src/layouts/Layout.astro.

import { BOOK_URL } from "./bookCta";

/** Where a new subscriber is sent: the book's sales page. */
export const OPTIN_OFFER_URL = BOOK_URL;

/** How long the success message stays up before the redirect, in ms. GA gets
 *  up to 1 second of this to confirm optin_submit (see cbeTrack). */
export const OPTIN_REDIRECT_DELAY_MS = 1200;

/** Shown after a successful sign-up, just before the redirect. */
export const OPTIN_SUCCESS_MESSAGE =
  "You're in! Redirecting you to a special offer...";

/** Lets the reader skip the offer and keep reading. */
export const OPTIN_SKIP_LABEL = "No thanks, I'll just browse";
