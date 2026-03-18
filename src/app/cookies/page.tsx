import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie policy for TrustedCollectibles. Learn about the cookies we use, why we use them, and how to manage your cookie preferences.",
  alternates: { canonical: `${SITE_URL}/cookies` },
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Cookie Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: March 2024</p>

      {/* 1. What Are Cookies */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        1. What Are Cookies
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Cookies are small text files that are placed on your device (computer,
        tablet, or mobile phone) when you visit a website. They are widely used
        to make websites work more efficiently, provide a better user
        experience, and supply information to the owners of the site.
      </p>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Cookies can be &quot;persistent&quot; (remaining on your device until
        they expire or are deleted) or &quot;session&quot; (deleted when you
        close your browser). They can be set by the website you are visiting
        (&quot;first-party cookies&quot;) or by third-party services operating
        on that website (&quot;third-party cookies&quot;).
      </p>
      <p className="text-gray-400 mb-4 leading-relaxed">
        This Cookie Policy explains what cookies we use on the
        TrustedCollectibles platform (&quot;Platform&quot;), why we use them,
        and how you can manage your preferences.
      </p>

      {/* 2. Cookies We Use */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        2. Cookies We Use
      </h2>

      {/* 2.1 Essential Cookies */}
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        2.1 Essential Cookies
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        These cookies are strictly necessary for the Platform to function. They
        enable core features such as user authentication and session management.
        The Platform cannot operate properly without these cookies.
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead className="bg-brand-card text-left text-xs font-medium uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.07]">
            <tr className="text-gray-400">
              <td className="px-4 py-3 font-mono text-xs">sb-access-token</td>
              <td className="px-4 py-3">Supabase</td>
              <td className="px-4 py-3">
                Stores the user authentication access token for session
                management
              </td>
              <td className="px-4 py-3">1 hour</td>
              <td className="px-4 py-3">Essential</td>
            </tr>
            <tr className="text-gray-400">
              <td className="px-4 py-3 font-mono text-xs">
                sb-refresh-token
              </td>
              <td className="px-4 py-3">Supabase</td>
              <td className="px-4 py-3">
                Stores the refresh token to maintain user sessions across page
                loads
              </td>
              <td className="px-4 py-3">7 days</td>
              <td className="px-4 py-3">Essential</td>
            </tr>
            <tr className="text-gray-400">
              <td className="px-4 py-3 font-mono text-xs">csrf-token</td>
              <td className="px-4 py-3">TrustedCollectibles</td>
              <td className="px-4 py-3">
                Protects against cross-site request forgery attacks
              </td>
              <td className="px-4 py-3">Session</td>
              <td className="px-4 py-3">Essential</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2.2 Functional Cookies */}
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        2.2 Functional Cookies
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        These cookies enable enhanced functionality and personalisation. They
        may be set by us or by third-party providers whose services we have
        added to our pages.
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead className="bg-brand-card text-left text-xs font-medium uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.07]">
            <tr className="text-gray-400">
              <td className="px-4 py-3 font-mono text-xs">user-preferences</td>
              <td className="px-4 py-3">TrustedCollectibles</td>
              <td className="px-4 py-3">
                Stores user preferences such as display settings and
                notification preferences
              </td>
              <td className="px-4 py-3">1 year</td>
              <td className="px-4 py-3">Functional</td>
            </tr>
            <tr className="text-gray-400">
              <td className="px-4 py-3 font-mono text-xs">theme</td>
              <td className="px-4 py-3">TrustedCollectibles</td>
              <td className="px-4 py-3">
                Remembers the user&apos;s preferred colour scheme (dark mode)
              </td>
              <td className="px-4 py-3">1 year</td>
              <td className="px-4 py-3">Functional</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2.3 Analytics Cookies */}
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        2.3 Analytics Cookies
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        We do not currently use analytics cookies. In the future, we may
        introduce privacy-respecting analytics to help us understand how users
        interact with the Platform and to improve our services. If we do, this
        Cookie Policy will be updated accordingly, and your consent will be
        sought before any analytics cookies are placed on your device.
      </p>

      {/* 2.4 Third-Party Cookies */}
      <h3 className="text-lg font-medium text-white mt-6 mb-3">
        2.4 Third-Party Cookies
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Third-party services integrated into the Platform may set their own
        cookies. These cookies are governed by the respective third party&apos;s
        privacy and cookie policies.
      </p>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm">
          <thead className="bg-brand-card text-left text-xs font-medium uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Purpose</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.07]">
            <tr className="text-gray-400">
              <td className="px-4 py-3 font-mono text-xs">__stripe_mid</td>
              <td className="px-4 py-3">Stripe</td>
              <td className="px-4 py-3">
                Used by Stripe for fraud prevention and secure payment
                processing
              </td>
              <td className="px-4 py-3">1 year</td>
              <td className="px-4 py-3">Third-party</td>
            </tr>
            <tr className="text-gray-400">
              <td className="px-4 py-3 font-mono text-xs">__stripe_sid</td>
              <td className="px-4 py-3">Stripe</td>
              <td className="px-4 py-3">
                Used by Stripe to maintain session state during payment
                processing
              </td>
              <td className="px-4 py-3">30 minutes</td>
              <td className="px-4 py-3">Third-party</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3. Managing Cookies */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        3. Managing Cookies
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Most web browsers allow you to control cookies through their settings.
        You can typically find cookie settings in the &quot;Options&quot;,
        &quot;Settings&quot;, or &quot;Preferences&quot; menu of your browser.
        The following links provide instructions for managing cookies in popular
        browsers:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <a
            href="https://support.google.com/chrome/answer/95647"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-amber hover:text-brand-amber-hover underline"
          >
            Google Chrome
          </a>
        </li>
        <li>
          <a
            href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-amber hover:text-brand-amber-hover underline"
          >
            Mozilla Firefox
          </a>
        </li>
        <li>
          <a
            href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-amber hover:text-brand-amber-hover underline"
          >
            Apple Safari
          </a>
        </li>
        <li>
          <a
            href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-amber hover:text-brand-amber-hover underline"
          >
            Microsoft Edge
          </a>
        </li>
      </ul>
      <p className="text-gray-400 mb-4 leading-relaxed">
        Please note that disabling or blocking certain cookies may affect the
        functionality of the Platform. Essential cookies cannot be disabled as
        they are required for the Platform to function.
      </p>

      {/* 4. Your Consent */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        4. Your Consent
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        When you first visit the Platform, you will be presented with a cookie
        consent banner that allows you to accept or manage your cookie
        preferences.
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Essential Cookies</strong> — These are
          required for the Platform to function and cannot be disabled. By using
          the Platform, you accept the use of essential cookies.
        </li>
        <li>
          <strong className="text-white">Functional and Analytics Cookies</strong>{" "}
          — These are opt-in. We will only place these cookies on your device if
          you give us your explicit consent. You can change your preferences at
          any time.
        </li>
      </ul>
      <p className="text-gray-400 mb-4 leading-relaxed">
        You can withdraw your consent for non-essential cookies at any time by
        adjusting your browser settings or by contacting us.
      </p>

      {/* 5. Contact */}
      <h2 className="text-xl font-semibold text-white mt-10 mb-4">
        5. Contact
      </h2>
      <p className="text-gray-400 mb-4 leading-relaxed">
        If you have any questions about this Cookie Policy or our use of
        cookies, please contact us:
      </p>
      <ul className="text-gray-400 mb-4 list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Email:</strong>{" "}
          privacy@trustedcollectibles.com
        </li>
        <li>
          <strong className="text-white">Company:</strong>{" "}
          TrustedCollectibles Ltd
        </li>
        <li>
          <strong className="text-white">Registered in:</strong> England and
          Wales
        </li>
      </ul>
    </div>
  );
}
