import mongoose, {Mongoose} from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL

interface Props{
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
}

let cached: Props = (global as any).mongoose

if(!cached){
    cached = (global as any).mongoose = {
        conn: null, promise: null
    }
}

export async function connectToDatabase(){
    if(cached.conn) return cached.conn
    if(!MONGODB_URL) throw new Error(
        "Tidak Bisa Tersambung"
    )
    cached.promise = cached.promise || mongoose.connect(
        MONGODB_URL, {dbName: "saas", bufferCommands: false}
    )
    cached.conn = await cached.promise

    return cached.conn
}