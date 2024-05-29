import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
        //Only call when hit the matcher in middleware.js
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
        //Only call when the user do some action in signIn route
      try {
        const existingGuest = await getGuest(user.email);

        if (!existingGuest) {
            await createGuest({
                email: user.email,
                fullName: user.name
            });
        }

        return true;
      } catch {
        return false;
      }
    },
    async session({ session, user }) {
        //Only call when the user interacting with routes that require auth()
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;
      return session;
    },
  },
  pages: {
      //When user not logged in they will be automatically
      //redirect to this page when they hit the guest area
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
