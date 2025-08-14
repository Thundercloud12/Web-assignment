import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import { connectDb } from "./dbConnect";
import User from "../models/User";
import bcrypt from "bcryptjs";

export const authOptions= {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "email", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password")
                }

                try {
                    
                   console.log("🔗 Connecting to MongoDB...");
                    await connectDb();
                    console.log("✅ DB connected");
                   const user = await User.findOne({email: credentials.email})

                   if(!user) {
                     throw new Error("User is not registered")
                   }

                   const isValid = await bcrypt.compare(credentials.password, user.password)

                   if(!isValid) {
                    throw new Error("Invalid Password")
                   }

                   return {
                    id: user._id.toString(),
                    email: user.email
                   }

                } catch (error) {
                    console.log(error)
                    throw error
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if(user) {
                token.id = user.id;
                token.email = user.email
            }

            return token
        },
        async session({session, token}){
            
            if(session.user) {
                session.user.id = token.id 
                session.user.email = token.email
            }
            
            
            return session
        }
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 *60 *60
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
        error: "/login"
    }
}