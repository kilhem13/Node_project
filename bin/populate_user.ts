import { User, UserHandler } from '../src/user'

  const new_user = new User("kilhem", "guilhemlauro@gmail.com",  "kilhem", true)
const db = new UserHandler('./db/users')

db.save(new_user, (err: Error | null) => {
  if (err) throw err
  console.log('Data populated')
})
