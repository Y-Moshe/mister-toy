const { MONGODB_USER, MONGODB_PASSWORD } = process.env

module.exports = {
  'dbURL': `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@cluster0.rcaaixb.mongodb.net/?retryWrites=true&w=majority`,
}
