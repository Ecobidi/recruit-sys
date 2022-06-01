require('dotenv').config({path: __dirname + '/.env'})
let express = require('express')
let expressSession = require('express-session')
// let fileupload = require('express-fileupload')
let connectFlash = require('connect-flash')
let mongoose = require('mongoose')

let { APPNAME, PORT, dbhost, dbport, dbname, sessionsecret, domain, owner_mat_no, owner_name} = require('./config') 

// routes
const adminRouter = require('./routes/admin-router')
const applicantRouter = require('./routes/applicant-router')


// connect to mongodb database
// mongoose.connect(`mongodb://${dbhost}:${dbport}/${dbname}`)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qmunc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

try {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  console.log('connected to ' + process.env.DB_NAME + ' database.')
} catch (error) {
  console.log('Error connecting to ' + process.env.DB_NAME + ' database.')
  console.log(error)
}


// seed initial database counter variables
// const CounterModel = require('./models/db_counter')

// CounterModel.insertMany([{key: "users_id"}, {key: "companies_id"}, {key: "job_applicants_id"}, {key: "job_applications_id"}, {key: "job_offers_id"}])

// init express App
let app = express()

// view engine 
app.set('view engine', 'ejs')
app.set('views', './views')

// expressStatic
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/uploads'))

// bodyparser middlewares
app.use(express.json())
app.use(express.urlencoded())

// app.use(fileupload())

// express-session middleware
app.use(expressSession({
  secret: sessionsecret,
  saveUninitialized: true,
  resave: true,
}))
app.use(connectFlash())

app.use((req, res, next) => {
  res.locals.errors = req.flash('errors')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.success_msg = req.flash('success_msg')
  res.locals.user = req.session.user || { username: 'test' }
  app.locals.owner_name = owner_name
  app.locals.owner_mat_no = owner_mat_no
  app.locals.appname = APPNAME
  app.locals.port = PORT
  app.locals.domain = domain + ':' + PORT
  next()
})

// routes

// app.get('/logout', (req, res) => {
//   req.session.loggedIn = false
//   req.session.username = ''
//   res.redirect('/login')
// })

app.use('/admin', adminRouter)

app.use('/client', applicantRouter)

app.listen(PORT, () => { console.log(`${APPNAME} running on port ${PORT}`) })