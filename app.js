const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

app.use('/health', require('./routes/health'));
app.use('/auth', require('./routes/auth'));
app.use('/patients', require('./routes/patient'));
app.use('/appointments', require('./routes/appointment'));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});
