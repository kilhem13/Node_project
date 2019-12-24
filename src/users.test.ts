import { expect } from 'chai'
import { User, UserHandler } from './user'
import { LevelDB } from './leveldb'

const dbPath: string = 'db_test_users'
var dbUsers: UserHandler
dbUsers = new UserHandler(dbPath)

describe('Users', function () {
    before(function () {
        LevelDB.clear(dbPath)
        dbUsers = new UserHandler(dbPath)
    })
    after(function() {
        dbUsers.closeDB()
    })
})

describe('#get', function () {
    it('Should get empty on non existing User', function() {
        dbUsers.get("non_existing_user", function ( err: Error | null, result?: any) {
            expect(err).to.be.null
            expect(result).to.be.undefined
        })
    })
})

describe('#save', function () {
    it('Sould create a user', function(done) {
        const user_test: string = "user_test"
        const email: string = "user@test.fr"
        const passtest: string = "passtest"
        dbUsers.save(new User( user_test, email, passtest, true), function(err: Error |null) {
            expect(err).to.be.null
            dbUsers.get(user_test, function( err: Error |null, result?: User) {
                expect(err).to.be.null
                expect(result).to.not.be.undefined
                expect(result).to.not.be.null
                if(result)
                    expect(result.email).to.be.equal(email)
                done()
            })
        })
    })
})
describe('#delete', function () {
    it('Sould delete a user', function(done) {
        const user_test: string = "user_test"
        dbUsers.delete(user_test, function(err: Error |null) {
            expect(err).to.be.null
            dbUsers.get(user_test, function( err: Error |null, result?: User) {
                expect(err).to.be.null
                //expect(result).to.not.be.undefined
                expect(result).to.be.null
                
            })
        })
    done()
})
})
describe('#modify', function () {
    it('Sould modify a user', function(done) {
        const user_test: string = "user_test"
        const email: string = "modify_user@test.fr"
        const passtest: string = "modify_passtest"
        dbUsers.save(new User( user_test, email, passtest, true), function(err: Error |null) {
            expect(err).to.be.null
            dbUsers.get(user_test, function( err: Error |null, result?: User) {
                expect(err).to.be.null
                expect(result).to.not.be.undefined
                expect(result).to.not.be.null
                if(result) {
                    expect(result.email).to.be.equal(email)
                    expect(result.getPassword()).to.be.equal(passtest)
                }
                done()
            })
        })
    })
})