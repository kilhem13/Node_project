import { Metric, MetricsHandler } from '../src/metrics'
import { User, UserHandler } from '../src/user'
const new_user = new User("kilhem", "guilhemlauro@gmail.com",  "kilhem", true)
const db_user = new UserHandler('./db/users')

db_user.save(new_user, (err: Error | null) => {
  if (err) throw err
  console.log('Data populated')
})
const met = [
  new Metric(`${new Date('2019-11-04 14:00 UTC').getTime()}`, 8),
  new Metric(`${new Date('2019-11-04 14:15 UTC').getTime()}`, 10),
  new Metric(`${new Date('2019-11-04 14:30 UTC').getTime()}`, 12)
]

const db = new MetricsHandler('./db/metrics')

db.save('kilhem', met, (err: Error | null) => {
  if (err) throw err
  console.log('Data populated')
})
