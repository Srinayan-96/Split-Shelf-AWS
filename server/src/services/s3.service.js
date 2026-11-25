const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { env } = require('../config/env');

const s3 = new S3Client({
  region: env.AWS_REGION || 'us-east-1',
});

const BUCKET = env.S3_BUCKET || 'splitshelf-uploads';

async function uploadProfilePicture(userId, file) {
  const ext = file.originalname?.split('.').pop() || 'jpg';
  const key = `avatars/${userId}-${Date.now()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
  );

  return {
    avatarKey: key,
    avatarUrl: `/api/auth/avatar/${userId}`,
  };
}

async function getProfilePictureStream(key) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  return await s3.send(command);
}

module.exports = { uploadProfilePicture, getProfilePictureStream };
