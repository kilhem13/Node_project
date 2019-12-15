import express = require('express')
import { MetricsHandler } from './metrics'
import path = require('path')
import bodyparser = require('body-parser')
import morgan = require('morgan')
import session = require('express-session')
import levelSession = require('level-session-store')
import { UserHandler, User } from './user'

const dbUser: UserHandler = new UserHandler('./db/users')
const authRouter = express.Router()
const LevelStore = levelSession(session)
const userRouter = express.Router()
const app = express()
const port: string = process.env.PORT || '8080'
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

app.use(morgan('dev'))
app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))

app.use(express.static(path.join(__dirname, '/../public')))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))
app.use(authRouter)
app.use('/user', userRouter)

const authCheck = function (req: any, res: any, next: any) {
  if(req.session.loggedIn)
    next()
  else
    res.redirect('/login')
}

app.get('/', authCheck,(req: any, res: any) => {
  res.render('index', { name: req.session.user.username, email: req.session.user.email })
} )

app.post('/login', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (err) next(err)
    console.log(result)
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } else {
      
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
})

app.post('/signup', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    //if (err) next(err)
    if(req.body.password != req.body.password_repeate || result !== undefined || req.body.username == null || req.body.email == null || req.body.password == null)
    {
      res.redirect('/signup')
    }
    else {
      const new_usr = new User(req.body.username, req.body.email, req.body.password, true)
      dbUser.save(new_usr,  (err: Error | null) => {
      if(err) throw err
      res.status(200).send()
    })
  }
  })

})

app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');

authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
})
authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})

authRouter.get('/signup', (req: any, res: any) => {
  res.render('signup')
})

authRouter.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})



app.get('/', (req: any, res: any) => {
  res.write('Hello world')
  res.end()
})

app.get('/hello/:name', (req: any, res: any) => {
  res.render('hello.ejs', {name: req.params.name})
})

app.get('/metrics/:id', (req: any, res: any) => {
  dbMet.get(req.params.id, (err: Error | null, result?: any) => {
    console.log(result[0].timestamp)
    if (err) throw err
    res.json(result)
    
  })
})
app.get('/metrics', (req: any, res: any) => {
  dbMet.getall( (err: Error | null, result?: any) => {
    if (err) throw err
    res.json(result)
  })
})
app.post('/metrics/:id', (req: any, res: any) => {
  console.log(req.body);
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send()
  })
})
app.delete('/metrics/:id', (req: any, res: any) => {
  dbMet.delete(req.params.id, (err: Error | null) => {
    if (err) throw err;
    //res.json(result)
    dbMet.get(req.params.id, (err: Error | null, result?: any) => {
      if (err) throw err
      res.json(result)
    //res.sendStatus(200);
   
    })
  });
  })
  
app.listen(port, (err: Error) => {
  if (err) throw err
  console.log(`Server is running on http://localhost:${port}`)
})



userRouter.post('/', (req: any, res: any, next: any) => {
  dbUser.get(req.body.username, function (err: Error | null, result?: User) {
    if (!err || result !== undefined) {
     res.status(409).send("user already exists")
    } else {
      dbUser.save(req.body, function (err: Error | null) {

if (err) next(err)

else res.status(201).send("user persisted")
      })
    }
  })
})

userRouter.get('/:username', (req: any, res: any, next: any) => {
  dbUser.get(req.params.username, function (err: Error | null, result?: User) {
    if (err || result === undefined) {
      res.status(404).send("user not found")
    } else res.status(200).json(result)
  })
})
app.get('/users', (req: any, res: any) => {
  dbUser.getall( (err: Error | null, result?: any) => {
    if (err) throw err
    res.json(result)
  })
})



