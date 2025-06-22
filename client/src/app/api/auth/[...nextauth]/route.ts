import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import dotenv from "dotenv";
dotenv.config();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      authorize: async (credentials) => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials),
            },
          );
          const data = await res.json();
          console.log("LOG: ~ authorize: ~ data:", data);

          return {
            accessToken: data.accessToken,
            ...data.user,
          };
        } catch (error) {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, account, user }) {
      if (account && account.provider === "google") {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.user = {
          ...user,
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }

      if (account?.provider === "credentials") {
        token.provider = account.provider;
        token.accessToken = user.accessToken;
        token.user = {
          ...user,
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      session.accessToken = token.accessToken;
      session.provider = token.provider;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
