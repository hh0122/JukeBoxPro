const express = require("express")
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

const {authenticate} = require("./auth")

router.get("/", authenticate, async (req,res,next) => {
  try {
    const playlists = await prisma.playlist.findMany({
      where: { userId: req.user.id},
      include: { playlist: true},
    });
    res.json(playlists);
  }catch(e){
    next(e);
  }
});

router.post("/", authenticate, async ( req, res, next) => {
  const { playlistId} = req.body;
  try {
    const playlist = await prisma.playlist.create({
      data: {
        playlistId: +playlistId,
        userId: req.user.id,
      },
    });
    res.status(201).json(playlist);
  } catch(e){
    next(e);
  }
})