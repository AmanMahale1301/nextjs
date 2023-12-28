import User from "@/models/user";
import { connectToDB } from "@/utils/config";
import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [
    {
      id: "shopify",
      name: "Shopify",
      type: "oauth",
      version: "2.0",
      clientId: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
      clientSecret: process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET,
      authorization: {
        url: `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE}/admin/oauth/authorize`,
        params: {
          scope: "read_orders, read_all_orders",
          redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/auth/callback/shopify`,
        },
      },
    },
  ],
  jwt: {
    encryption: true,
    secret:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQSflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  },
  // callbacks: {
  //   async session({ session }) {
  //     try {
  //       const sessionUser = await User.findOne({
  //         email: session.user.email,
  //       });

  //       if (sessionUser) {
  //         session.user.id = sessionUser._id.toString();
  //       }

  //       return session;
  //     } catch (error) {
  //       console.error("Error fetching session user:", error);
  //       throw error;
  //     }
  //   },

  //   async signIn({ profile }) {
  //     try {
  //       await connectToDB();

  //       const userExists = await User.findOne({ email: profile.email });

  //       if (!userExists) {
  //         await User.create({
  //           email: profile.email,
  //           username: profile.name.replace(" ", "").toLowerCase(),
  //           image: profile.picture,
  //         });
  //       }

  //       return true;
  //     } catch (error) {
  //       console.error("Error during sign-in:", error);
  //       throw error;
  //     }
  //   },
  // },
});

export default handler;
