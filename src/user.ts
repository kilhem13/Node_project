import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'

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
        return true;
    }
    public static fromDb(username: string, value: any) {
        const [password, email] = value.split(":")
        console.log(password)
        return new User(username, email, password)
    }
}

export class UserHandler {
    public db: any

    constructor(path: string) {
        this.db = LevelDB.open(path)
    }

    public get(username: string, callback: (err: Error | null, result?: User) => void) {
        this.db.get(`user:${username}`, function (err: Error, data: any) {
            console.log(err)
            if(err){
                console.log("Inside")
                return callback(null)        
            }
            else if(data === undefined) return callback(null, data)
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
        this.db.put(`user:${user.username}`, `${user.getPassword()}:${user.email}`, (err: Error | null) => {
            callback(err)
        })
    }
    public delete(username: string, callback: (err: Error | null) => void) {
        // TODO
      }


    
}