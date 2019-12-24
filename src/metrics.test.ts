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

  
describe('#save', function()  {
	it('should add metrics', function() {
    var timestamp = "000000000000"
    var met = new Metric(timestamp, 30)
		dbMet.save('test', [met], function (err: Error | null) {
        expect(err).to.be.null
        dbMet.get("test", function (err: Error | null, result?: Metric[]) {
          expect(err).to.be.null
          console.log(result)
          expect(result).to.not.be.empty
          expect(result).to.not.be.undefined
          if(result !== undefined)
            expect(result[0].timestamp).to.be.equal(timestamp)
          
        })
      })

    })
  })
  describe('#modify', function()  {
    it('should modify metrics', function() {
      var timestamp = "000000000000"
      dbMet.modify('test', timestamp, 24, function (err: Error | null) {
          expect(err).to.be.null
          dbMet.get("test", function (err: Error | null, result?: Metric[]) {
            expect(err).to.be.null
            expect(result).to.not.be.empty
            expect(result).to.not.be.undefined
            if(result !== undefined)
              expect(result[0].timestamp).to.be.equal(timestamp)
            
          })
        })
  
      })
    })

describe("#delete", function() {
  it('should delete a metrics', function(done) {
    dbMet.delete("test", function (err: Error | null) {
      expect(err).to.be.null
      dbMet.get("test", function (err:Error | null, result?: Metric[]){
        expect(err).to.be.null
        expect(result).to.be.empty
        done()
      })
      
    })
  })
})	