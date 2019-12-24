import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDB } from "./leveldb"

const dbPath: string = 'db_test'
var dbMet: MetricsHandler
dbMet = new MetricsHandler(dbPath)

describe('Metrics', function () {
  before(function () {
    LevelDB.clear(dbPath)
    dbMet = new MetricsHandler(dbPath)
  })

  after(function () {
    dbMet.closeDB()
  })

})
describe('#get', function () {
    it('should get empty array on non existing group', function () {
      dbMet.get("0", function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.empty
      })
    })
  })

  
/*describe('#save', function()  {
	it('should add metrics', function() {
		dbMet.save()
	})
}*/

describe("#delete", function() {
  it('should delete a metrics', function(done) {
    dbMet.delete("10", function (err: Error | null) {
      expect(err).to.be.null
      dbMet.get("10", function (err:Error | null, result?: Metric[]){
        expect(err).to.be.null
        expect(result).to.be.empty
        done()
      })
      
    })
  })
})	