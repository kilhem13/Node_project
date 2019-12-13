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