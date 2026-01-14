const express = require("express");
const passport = require("passport");
const router = express.Router();

const EventObject = require("../models/event");
const ERROR_CODES = require("../utils/errorCodes");
const { capture } = require("../services/sentry");


router.post("/search", async (req, res) => {
  try {
    const { search, category, city, sort, direction, per_page, page } = req.body;

    let query = { status: "published", start_date: { $gte: new Date() } };

    if (search) {
      const searchValue = search.replace(/[#-.]|[[-^]|[?|{}]/g, "\\$&");
      query = {
        ...query,
        $or: [
          { title: { $regex: searchValue, $options: "i" } },
          { description: { $regex: searchValue, $options: "i" } },
          { venue: { $regex: searchValue, $options: "i" } },
          { city: { $regex: searchValue, $options: "i" } },
        ],
      };
    }

    if (category) query.category = category;
    if (city) query.city = { $regex: city, $options: "i" };

    const limit = per_page || 10;
    const offset = page ? (page - 1) * limit : 0;

    let sortObj = { start_date: 1 }; 
    if (sort && direction) {
      const sortDirection = direction === "desc" ? -1 : 1;
      sortObj = { [sort]: sortDirection };
    }

    const data = await EventObject.find(query)
      .skip(offset)
      .limit(limit)
      .sort(sortObj);

    const total = await EventObject.countDocuments(query);

    return res.status(200).send({ ok: true, data, total });
  } catch (error) {

    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await EventObject.findById(req.params.id);

    if (!data) return res.status(404).send({ ok: false, code: ERROR_CODES.NOT_FOUND });

    return res.status(200).send({ ok: true, data });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

router.post("/", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const {
      title,
      description,
      start_date,
      end_date,
      venue,
      address,
      city,
      country,
      capacity,
      price,
      currency,
      status,
      category,
      image_url,
      registration_deadline,
      requires_approval,
    } = req.body;

    if (!title || !start_date) {
      return res.status(400).send({ ok: false, code: "TITLE_AND_START_DATE_REQUIRED" });
    }

    const event = await EventObject.create({
      title,
      description,
      start_date,
      end_date,
      venue,
      address,
      city,
      country,
      capacity,
      available_spots: capacity || 0, 
      price,
      currency,
      status: status || "draft", 
      category,
      image_url,
      registration_deadline,
      requires_approval,
      organizer_id: req.user._id, 
      organizer_name: req.user.name, 
      organizer_email: req.user.email, 
    });

    return res.status(201).send({ ok: true, data: event });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

router.post("/my-events/search", passport.authenticate(["user", "admin"], { session: false }), async (req, res) => {
  try {
    const { search, status, category, sort, per_page, page } = req.body;

    let query = {};
    if (req.user.role === "user") {
      query.organizer_id = req.user._id;
    }
  
    if (search) {
      const searchValue = search.replace(/[#-.]|[[-^]|[?|{}]/g, "\\$&");
      query = {
        ...query,
        $or: [
          { title: { $regex: searchValue, $options: "i" } },
          { description: { $regex: searchValue, $options: "i" } },
          { venue: { $regex: searchValue, $options: "i" } },
        ],
      };
    }

    if (status) query.status = status;
    if (category) query.category = category;

    const limit = per_page || 10;
    const offset = page ? (page - 1) * limit : 0;

    const data = await EventObject.find(query)
      .skip(offset)
      .limit(limit)
      .sort(sort || { created_at: -1 });

    const total = await EventObject.countDocuments(query);

    return res.status(200).send({ ok: true, data, total });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});


router.put("/:id", passport.authenticate(["user", "admin"], { session: false }), async (req, res) => {
  try {
    const event = await EventObject.findById(req.params.id);
    if (!event) return res.status(404).send({ ok: false, code: ERROR_CODES.NOT_FOUND });

    const isOwner = event.organizer_id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).send({ ok: false, code: "FORBIDDEN" });
    }

    const updates = req.body;

    if (updates.capacity && updates.capacity !== event.capacity) {
      const bookedSpots = event.capacity - event.available_spots;
      updates.available_spots = updates.capacity - bookedSpots;
    }

    event.set(updates);
    await event.save();

    res.status(200).send({ ok: true, data: event });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});

router.delete("/:id", passport.authenticate(["user", "admin"], { session: false }), async (req, res) => {
  try {
    const event = await EventObject.findById(req.params.id);
    if (!event) return res.status(404).send({ ok: false, code: ERROR_CODES.NOT_FOUND });


    await EventObject.findByIdAndDelete(req.params.id);

    res.status(200).send({ ok: true });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
});


router.post("/duplicate/:id", passport.authenticate("user", { session: false }), async (req, res) => {
  try {
    const originalEvent = await EventObject.findById(req.params.id);
    if (!originalEvent) return res.status(404).send({ ok: false, code: ERROR_CODES.NOT_FOUND });


    const isOwner = originalEvent.organizer_id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).send({ ok: false, code: "FORBIDDEN" });
    }

    const duplicate = await EventObject.create({
      title: `${originalEvent.title} (Copy)`,
      description: originalEvent.description,
      start_date: originalEvent.start_date,
      end_date: originalEvent.end_date,
      venue: originalEvent.venue,
      address: originalEvent.address,
      city: originalEvent.city,
      country: originalEvent.country,
      capacity: originalEvent.capacity,
      available_spots: originalEvent.capacity || 0, 
      price: originalEvent.price,
      currency: originalEvent.currency,
      status: "draft", 
      category: originalEvent.category,
      image_url: originalEvent.image_url,
      registration_deadline: originalEvent.registration_deadline,
      requires_approval: originalEvent.requires_approval,
      organizer_id: req.user._id, 
      organizer_name: req.user.name,
      organizer_email: req.user.email,
    });

    return res.status(200).send({ ok: true, data: duplicate });
  } catch (error) {
    capture(error);
    res.status(500).send({ ok: false, code: ERROR_CODES.SERVER_ERROR, error });
  }
})


module.exports = router;
