const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes       = require('./routes/auth');
const profileRoutes    = require('./routes/profile');
const projectRoutes    = require('./routes/projects');
const certificationRoutes = require('./routes/certifications');
const themeRoutes      = require('./routes/theme');
const themesRoutes     = require('./routes/themes');
const messageRoutes    = require('./routes/messages');
const chatbotRoutes    = require('./routes/chatbot');
const chatConfigRoutes = require('./routes/chatConfig');
const uploadRoutes     = require('./routes/upload');
const newsletterRoutes = require('./routes/newsletter');
const visitorRoutes    = require('./routes/visitor');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api', globalLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/themes', themesRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/chat-config', chatConfigRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/visitor', visitorRoutes);
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
