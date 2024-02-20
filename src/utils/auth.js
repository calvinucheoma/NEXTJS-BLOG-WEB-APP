/*    NEXT-AUTH V4      */
import { PrismaAdapter } from '@auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
// import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import prisma from './connect';

// const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // ...add more providers here
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
};

export const getAuthSession = () => getServerSession(authOptions); // T0 get the current user session

/*    NEXT-AUTH V5      */
// import NextAuth from 'next-auth';
// import GitHub from 'next-auth/providers/github';
// import Google from 'next-auth/providers/google';

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   providers: [GitHub, Google],
// });
