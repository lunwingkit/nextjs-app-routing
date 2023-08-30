import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
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
})


export { handler as GET, handler as POST }