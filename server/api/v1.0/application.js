import express from 'express';
import logger from '../../logger';
import Application from '../../mongodb/models/application';
import conf from '../../conf';
import i18n from '../../i18n';

const { __ } = i18n;
const router = express.Router();

/* =========================================
 GET /application/list
 ============================================ */
router.get('/list', async (req, res) => {
    try {
        const list = await Application.find({
            user: req.payload._id,
        });
        if (list) {
            return res.json(list);
        }
        return res.sendStatus(404);
    } catch (e) {
        return res.sendStatus(500);
    }
});

/* =========================================
 GET /application/:id
 ============================================ */
router.get('/:id', async (req, res) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
        });
        if (application) {
            return res.json(application);
        }
        return res.sendStatus(404);
    } catch (e) {
        return res.sendStatus(500);
    }
});


/* =========================================
 POST /application
 {
 user,
 name,
 origin,
 callback_url,
 }
 ============================================ */
router.post('/', async (req, res) => {
    const {
        user,
        name,
        origin,
        callback_url,
    } = req.body;

    try {
        const newApplication = await new Application({
            user,
            name,
            origin,
            callback_url,
        }).save();
        return res.json(newApplication);
    } catch (e) {
        return res.sendStatus(500);
    }
});

/* =========================================
 PUT /application/:id
 {
 name,
 origin,
 callback_url,
 }
 ============================================ */
router.put('/:id', async (req, res) => {
    const {
        name,
        origin,
        callback_url,
    } = req.body;

    try {
        const result = await Application.update({
            _id: req.params.id,
        }, {
            name,
            origin,
            callback_url,
        });
        if (result.n === 0) {
            return res.sendStatus(404);
        }
        if (result.nModified === 0) {
            return res.sendStatus(304);
        }
        return res.sendStatus(200);
    } catch (e) {
        return res.sendStatus(500);
    }
});

/* =========================================
 DELETE /application/:id
 ============================================ */
router.delete('/:id', async (req, res) => {
    try {
        const result = await Application.remove({
            _id: req.params.id,
        });
        if (result.result.n === 0) {
            return res.sendStatus(404);
        }

        if (result.result.ok === 0) {
            return res.sendStatus(304);
        }

        return res.sendStatus(200);
    } catch (e) {
        return res.sendStatus(500);
    }
});

export default router;
