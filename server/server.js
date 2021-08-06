const express = require('express');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql/schema');
const cors = require('cors');
const { graphqlUploadExpress } = require('graphql-upload');
const nodemailer = require('nodemailer');
const config = require('config');
const cookieParser = require('cookie-parser');
const initChatbox = require('./helpers/chatbox');
const buildLoaders = require('./graphql/loaders/buildLoaders');
const { clearAccountsSchedule } = require('./helpers/database');

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.get('gmailUser'),
    pass: config.get('gmailPass'),
  },
});

const app = express();

app.get('/', (req, res) => {
  res.send('Plan-Szkolny API');
});

app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:3001',
      'http://localhost:3000',
      'https://www.plan-szkolny.kodario.pl',
      'https://plan-szkolny.kodario.pl',
    ],
  })
);

app.use(
  '/graphql',
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  cookieParser(),
  require('./middleware/auth'),
  graphqlHTTP((req) => {
    return {
      context: {
        user: req.user,
        transporter,
        loaders: buildLoaders(),
      },
      schema,
      graphiql: true,
    };
  })
);

// Confirm routes
app.use('/confirm', require('./routes/confirm'));

const PORT = process.env.NODE_ENV !== 'production' ? 5000 : 4001;

mongoose.connect(
  config.get('mongoURI'),
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => console.log('MongoDB Connected...')
);

const server = app.listen(PORT, () =>
  console.log(`Server started on port: ${PORT}...`)
);

initChatbox(server);
clearAccountsSchedule();
