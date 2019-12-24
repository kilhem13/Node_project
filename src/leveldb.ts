import encoding from 'encoding-down'
import leveldown from 'leveldown'
import levelup from 'levelup'
import fs = require('fs')
import del = require('del')

export class LevelDB {
  static open(path: string) {
    if(!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
      }
    const encoded = encoding(
      leveldown(path),
      { valueEncoding: 'json' }
    )
    return levelup(encoded)
  }
  static clear(path: string) {
    if (fs.existsSync(path)) {
      del.sync(path, { force: true })
    }
  }
}
