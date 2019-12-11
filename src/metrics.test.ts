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
  describe('#save', function () {
    it('should add a metrics', function () {
      dbMet.save("-1", [{ "timestamp":"1234", "value": 20 }], function (err: Error | null) {
        expect(err).to.be.null
        /*dbMet.get("10", function (err: Error | null, result?: Metric[]) {
          expect(err).to.be.null
          //expect(result).to.not.be.undefined
          expect(result).to.be.undefined
          if(result)
            expect(result).to.be.equal("123")
          //expect(result).to.not.be.empty
      })*/
    })
      })

  })