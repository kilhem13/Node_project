import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'
import { on } from "cluster"
import { request } from "http"

export class User {
    public username: string
    public email: string
    private password: string = ""

    constructor(username: string, email:string, password: string, passwordHashed: boolean = false) {
        this.username = username;
        this.email = email
        if(!passwordHashed)
            this.setPassword(password)
        else 
            this.password = password
    }
    public setPassword(password: string) {
        console.log(password)
    }
    public getPassword() {
        return this.password
    }
    public validatePassword(toValidate: String): boolean {
        // return comparison with hashed password
        return toValidate === this.getPassword();
    }
    public static fromDb(username: string, value: any) {
        const [password, email] = value.split(":")
        console.log(password)
        return new User(username, email, password, true)
    }
}

export class UserHandler {
    public db: any

    constructor(path: string) {
        this.db = LevelDB.open(path)
    }
    public closeDB() {
        this.db.close();
      }

    public get(username: string, callback: (err: Error | null, result?: User) => void) {
        this.db.get(`user:${username}`, function (err: Error, data: any) {
            if(err){
                if(err.name == "NotFoundError")
                {
                    return callback(null, data)
                }
                else
                    return callback(err)        
            }
            else
                callback(null, User.fromDb(username, data))
        })
    }
    public getall(callback: (err: Error | null, result?: string) => void) {
        const stream = this.db.createReadStream()
        stream.on('error', callback)
            .on('data', (data: any) => {
                 console.log(data)
            })
            .on('end', (err: Error) => {
                callback(null, "")
            })
      }


    public save(user: User, callback : (err: Error | null) => void) {
        console.log("write")
        const stream = WriteStream(this.db)
    stream
        .on('error', (err: Error) => {
            return callback(err)
        })
        .on('close', (err: Error) => {
            return callback(null)
        }) 
        console.log(user.getPassword())
        stream.write( {key:`user:${user.username}`, value: `${user.getPassword()}:${user.email}`})
        stream.end()
    }
    public delete(username: string, callback: (err: Error | null) => void) {
        const stream = this.db.createKeyStream()
        .on('data', (data: any) => {
            const usr = data.split(":")[1];
            if(usr === username)
                this.db.del(data, (err: Error | null) => {
                    if(err) throw err;
                })
        })
      }


    
}