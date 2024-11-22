const express = require("express");
const router = express.Router();

const prisma = require("../prisma");

// Anyone can get to all tracks => this route is not protected!
router.get("/", async (req, res, next) => {
  try {
    const tracks = await prisma.track.findMany();
    res.json(tracks);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  const includeTracks = req.user ? { userId: req.user.id } : false;
  try {
    const track = await prisma.track.findUniqueOrThrow({
      where: { id: +id },
      include: { playlists: includeTracks },
    });
    res.json(track);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
