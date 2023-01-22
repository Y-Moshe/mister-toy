const dbService = require('../../services/db.service')
const { ObjectId } = require('mongodb')

module.exports = {
  query,
  getById,
  remove,
  save,
  addReview,
  removeReview
}

async function query(filterBy) {
  const collection = await dbService.getCollection('toy')
  const criteria = _buildCriteria(filterBy)

  const sortBy = {}
  sortBy[filterBy?.sortBy?.toLowerCase() || 'name'] = 1
  const toys =  await collection
    .find(criteria)
    .sort(sortBy)
    .toArray()

  return toys.map(_mapToyObj)
}

async function getById(toyId) {
  const collection = await dbService.getCollection('toy')
  const toy = await collection.findOne({ _id: ObjectId(toyId) })
  if (!toy) return Promise.reject('invalid toy id')

  return _mapToyObj(toy)
}

async function save(toy) {
  const collection = await dbService.getCollection('toy')
  const { _id: toyId } = toy

  delete toy._id
  return await collection.updateOne(
    { _id: ObjectId(toyId) },
    { $set: toy },
    { upsert: true }
  )
}

async function addReview(toyId, review) {
  const collection = await dbService.getCollection('toy')
  await collection.updateOne(
    { _id: ObjectId(toyId) },
    { $push: { reviews: review }}
  )

  return review
}

async function removeReview(toyId, reviewId) {
  const collection = await dbService.getCollection('toy')
  return await collection.updateOne(
    { _id: ObjectId(toyId) },
    { $pull: { reviews: { _id: ObjectId(reviewId) }}}
  )
}

async function remove(toyId) {
  const collection = await dbService.getCollection('toy')
  return await collection.deleteOne({ _id: ObjectId(toyId) }) 
}

// Private

function _mapToyObj(toy) {
  return {
    ...toy,
    createdAt: ObjectId(toy._id).getTimestamp()
  }
}

function _buildCriteria(filterBy = {}) {
  const criteria = {}

  if (filterBy?.keyword) {
    criteria.name = { $regex: filterBy.keyword, $options: 'i' }
  }

  if (filterBy?.tags && filterBy.tags.length) {
    criteria.tags = { $in: filterBy.tags }
  }

  if (filterBy?.status) {
    criteria.inStock = { $eq: filterBy.status === 'In-stock' ? true : false }
  }

  return criteria
}
