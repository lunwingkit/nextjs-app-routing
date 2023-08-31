import { Account, PrismaClient } from '@prisma/client';
import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"
import GoogleProvider from "next-auth/providers/google"
import { upsertAccount } from '@/app/lib/prisma';

const prisma = new PrismaClient();

// export const authOptions =

const handler = NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID || "",
      clientSecret: process.env.TWITTER_ID || "",
      version: "2.0",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(user);
      console.log(account);
      console.log(profile);
      console.log(email);
      console.log(credentials);

      const newUser: Account = {
        accountId: -1,
        name: user.name as string,
        email: user.email as string,
        image: user.image as string,
        sub: profile?.sub as string || "",
        id: user.id as string,
        provider: account?.provider as string || "",
        createTime: new Date(),
      }
      const ret = await upsertAccount(newUser);
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = +user.id;
        token.jwt = user.jwt;
        token.name = user.name;
        token.email = user.email;
      }
      // console.log("jwt");
      // console.log(user);
      return token;

    },
    session: async ({ session, token,}: any) => {
      session.user.id = token.id; //unique id
      session.jwt = token.jwt;
      session.user.name = token.name;//** twitter id & google
      session.user.email = token.email;
      session.user.picture = token.picture; //** twitter profile pic google
      console.log("session")
      console.log(session);
      console.log(token);
      return session;
    },
  },
})
export { handler as GET, handler as POST };
// jwt
// undefined
// session
// {
//   name: 'Killian L',
//   email: 'lunwingkit@gmail.com',
//   picture: 'https://lh3.googleusercontent.com/a/AAcHTtfGkl8DuHov_yp4J3jCNOKvixqR5IIrKrcsCKUiz3djbA=s96-c',
//   sub: '112487951705894673653',
//   id: 112487951705894670000,
//   iat: 1693381007,
//   exp: 1695973007,
//   jti: '7b47775e-42d1-4403-9179-2918770cfb28'
// }
// jwt
// undefined
// session
// {
//   name: 'Killian L',
//   email: 'lunwingkit@gmail.com',
//   picture: 'https://lh3.googleusercontent.com/a/AAcHTtfGkl8DuHov_yp4J3jCNOKvixqR5IIrKrcsCKUiz3djbA=s96-c',
//   sub: '112487951705894673653',
//   id: 112487951705894670000,
//   iat: 1693381009,
//   exp: 1695973009,
//   jti: 'f8bc37c6-86fb-4909-96a2-f36437227a7b'
// }


// jwt
// undefined
// session
// {
//   name: 'Members Only',
//   picture: 'https://pbs.twimg.com/profile_images/1689300167336570880/fiRspH13_normal.jpg',
//   sub: '1519286004963700736',
//   id: 1519286004963700700,
//   iat: 1693381040,
//   exp: 1695973040,
//   jti: '9627dd60-a78d-489a-9055-1bb8613d2867'
// }
// jwt
// undefined
// session
// {
//   name: 'Members Only',
//   picture: 'https://pbs.twimg.com/profile_images/1689300167336570880/fiRspH13_normal.jpg',
//   sub: '1519286004963700736',
//   id: 1519286004963700700,
//   iat: 1693381041,
//   exp: 1695973041,
//   jti: '6c207d7d-b596-45e1-afbe-380a95e9d09d'
// }