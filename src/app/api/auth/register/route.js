import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "../../../../lib/dbConnect";
import User from "../../../../models/User";
import bcrypt from "bcrypt";

export async function POST(request) {
    try {
        const {name, email, password} = await request.json();
    if(!email || !password || !name) {
        return NextResponse.json({
            error: "Email, Password and username is required"
        }, {status: 400})
    }

    await connectDb();
    const user = await User.findOne({email})
    if(user){
        return NextResponse.json({
            message: "User Already registered"
        }, {status: 400})
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({
        name,
        email,
        password: hashedPassword
    })
    return NextResponse.json({
        message: "User  registered"
    }, {status: 200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            error: "Error occured at register handler"
        }, {status: 500}) 
    }

}