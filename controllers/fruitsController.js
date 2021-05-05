const express = require('express');
const router = express.Router();
const Fruit = require('../models/Fruit');

// Index
router.get('/', async (req, res) => {
    let filters;
    if(Object.keys(req.query).length > 0){
        filters = {...req.query}
    }
    try {
        if(!filters){
            const foundFruits = await Fruit.find({});
            res.status(200).json(foundFruits)
        } else {
            const foundFruits = await Fruit.find({...filters});
            res.status(200).json(foundFruits)
        }  
    }catch(error){
        res.status(400).json({
            msg: error.message
        })
    }
})

// Create
router.post('/', async (req, res) => {
    try {
        const createdFruit = await Fruit.create(req.body)
        res.status(200).json(createdFruit)
    } catch(err){
        res.status(400).json({
            msg: err.message
        })
    }
})

// Show
router.get('/:id', async (req, res) => {
    try {
        const foundFruit = await Fruit.findById(req.params.id);
        res.status(200).json(foundFruit)
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})

router.get('/byName/:name/', async (req, res) => {
    try {
        const foundFruit = await Fruit.findOne({ name: req.params.name });
        res.status(200).json(foundFruit)
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})

// Update

router.put('/:id', async (req, res) => {
    try {
        const updatedFruit = await Fruit.findByIdAndUpdate(req.params.id, req.body, { new: true } )
        res.status(200).json(updatedFruit);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const deletedFruit = await Fruit.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedFruit);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})




module.exports = router