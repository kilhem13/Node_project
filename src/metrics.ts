import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

export class MetricsHandler {
  private db: any 
  
  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }
  public closeDB() {
    this.db.close();
  }
  public save(key: string, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream
        .on('error', (err: Error) => {
            return callback(err)
        })
        .on('close', (err: Error) => {
            return callback(null)
        })    
    metrics.forEach((m: Metric) => {
        stream.write({ key:`metric:${key}:${m.timestamp}`, value: m.value })
    });
    stream.end()
  }
  
  public get(key: string, callback: (err: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream()
    var met: Metric[] = []
    
    stream
    .on('error', (err: Error) => {
      callback(err, met)
    })
      .on('data', (data: any) => {
        const [_, k, timestamp] = data.key.split(":")
        const value = data.value
        if (key != k) {
          console.log(`LevelDB error: ${data} does not match key ${key}`)
        } else {
          met.push(new Metric(timestamp, value))
        }
      })
      .on('end', (err: Error) => {
        callback(null, met)
      })
  }
  public getall(callback: (err: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream()
    var met: Metric[] = []
    
    stream.on('error', callback)
        .on('data', (data: any) => {
          console.log(data)
            const [_, k, timestamp] = data.key.split(":")
            const value = data.value
            met.push(new Metric(timestamp, value))
        })
        .on('end', (err: Error) => {
            callback(null, met)
        })
  }
  public delete(id: string, callback: (err: Error | null) => void) {
    const stream = this.db.createKeyStream()
    	.on('data', data => {
            if(data.split(":")[1] === id) {
                this.db.del(data, (err: Error) => {
                    if(err) throw err;
                });
            }
      })
	.on("error", err => {
		callback(err);
	})
	.on("close", () => {
		callback(null);
	});
  }

 public delete_by_timestamp(timestamp_del: any, callback: (err: Error | null) => void) {
    
    const stream = this.db.createKeyStream()
      .on('data', (data: any) => {
        console.log('data')
        const [_, k, timestamp] = data.split(":")
        console.log(timestamp);
        console.log(timestamp_del)
        if(timestamp === timestamp_del) {
            console.log(data)
            this.db.del(data, (err: Error)=>{
                if(err) throw err;
                callback(null);
			})
        }
			
      })
      .on("error", err => {
        callback(err);
      })
      .on("close", () => {
        callback(null);
      });
    }
    public modify(key: string, timestamp: string, value: any, callback: (err: Error | null) => void) {
      var met = new Metric(timestamp, value);
      const stream = WriteStream(this.db)
      stream
          .on('error', (err: Error) => {
              return callback(err)
          })
          .on('close', (err: Error) => {
              return callback(null)
          })    
     // metrics.forEach((m: Metric) => {
          stream.write({ key:`metric:${key}:${met.timestamp}`, value: met.value })
      stream.end()

    }
 
}

