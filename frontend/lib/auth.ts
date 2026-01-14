import { NextAuthOptions } from 'next-auth';
import LinkedInProvider from 'next-auth/providers/linkedin';

export const authOptions: NextAuthOptions = {
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
      client: { token_endpoint_auth_method: 'client_secret_post' },
      issuer: 'https://www.linkedin.com',
      profile: (profile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }),
      wellKnown:
        'https://www.linkedin.com/oauth/.well-known/openid-configuration',
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
