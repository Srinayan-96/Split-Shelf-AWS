const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

// Controllers stay thin: take input, call the service, send output.
const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, ...result });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ success: true, ...result });
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.userId);
  res.json({ success: true, user });
});

const uploadAvatar = asyncHandler(async (req, res) => {
  const user = await authService.updateAvatar(req.userId, req.file);
  res.json({ success: true, user });
});

const getAvatar = asyncHandler(async (req, res) => {
  const result = await authService.getAvatarStream(req.params.userId);
  if (!result || !result.Body) {
    return res.status(404).json({ message: 'Avatar not found' });
  }
  res.setHeader('Content-Type', result.ContentType || 'image/jpeg');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  result.Body.pipe(res);
});

module.exports = { register, login, me, uploadAvatar, getAvatar };
