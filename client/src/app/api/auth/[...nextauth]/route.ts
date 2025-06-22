import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account, trigger }) {
      if (account) {
        token.accessToken = account.access_token;
        // token.id_token = account.id_token;
        token.LoginType = "google";
        token.trigger = trigger;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      session.accessToken = token.accessToken;
      // session.id_token = token.id_token;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
