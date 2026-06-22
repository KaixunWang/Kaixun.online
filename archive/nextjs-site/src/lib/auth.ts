import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      authorization: {
        params: { scope: "read:user user:email" },
      },
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please provide both email and password.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password.");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email address before signing in.");
        }

        const isValid = await compare(credentials.password, user.passwordHash);

        if (!isValid) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          role: user.role,
          displayId: user.displayId ?? undefined,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        (token as any).role = (user as any).role ?? "USER";
        (token as any).displayId = (user as any).displayId ?? null;
      }
      if (token.sub && ((token as any).role === undefined || (token as any).displayId === undefined)) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true, displayId: true },
        });
        if (dbUser) {
          (token as any).role = dbUser.role;
          (token as any).displayId = dbUser.displayId ?? null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub as string;
        (session.user as any).role = (token as any).role ?? "USER";
        (session.user as any).displayId = (token as any).displayId ?? null;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        if (url.includes("/auth/login") && !url.includes("error=")) return `${baseUrl}/`;
        return url;
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
};

