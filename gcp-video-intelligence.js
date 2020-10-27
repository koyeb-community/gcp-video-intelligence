/** @format */

"use strict";
const VideoIntelligence = require("@google-cloud/video-intelligence").v1p3beta1;
const S3 = require("aws-sdk/clients/s3");

const videoIntelligenceFeatures = {
  LABEL_DETECTION: {
    responseScope: "segmentLabelAnnotations",
  },
  FACE_DETECTION: {
    responseScope: "faceDetectionAnnotations",
  },
  LOGO_RECOGNITION: {
    responseScope: "logoRecognitionAnnotations",
  },
  PERSON_DETECTION: {
    responseScope: "personDetectionAnnotations",
  },
  SPEECH_TRANSCRIPTION: {
    responseScope: "speechTranscriptions",
  },
};

const prefix =
  process.env.VIDEO_INTELLIGENCE_FILE_REFIX || "gcp-video-intelligence";

const executeVideoIntelligenceFeature = async (
  videoIntelligenceInstance,
  s3Instance,
  objectBody,
  key,
  bucket
) => {
  try {
    const videoIntelligenceFeature =
      process.env.VIDEO_INTELLIGENCE_FEATURE || "LABEL_DETECTION";

    const request = {
      inputContent: objectBody.toString("base64"),
      features: [videoIntelligenceFeature],
      videoContext: {
        speechTranscriptionConfig: {
          languageCode: "en-US",
          enableAutomaticPunctuation: true,
          enableSpeakerDiarization: true,
        },
      },
    };

    if (!(videoIntelligenceFeature in videoIntelligenceFeatures)) {
      throw new Error("Uknown video intelligence feature.");
    }

    const [operation] = await videoIntelligenceInstance.annotateVideo(request);

    const results = await operation.promise();

    const resultsData =
      results[0].annotationResults[0][
        videoIntelligenceFeatures[videoIntelligenceFeature].responseScope
      ];

    await s3Instance
      .upload({
        Bucket: bucket,
        Key: `${prefix}-${videoIntelligenceFeature}-${key}.json`,
        Body: JSON.stringify({ results: resultsData }, null, 4),
        ContentType: "application/json",
      })
      .promise();
  } catch (error) {
    throw error;
  }
};

const getSourceObject = async (s3Instance, bucket, key) => {
  try {
    const response = await s3Instance
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();

    return response.Body;
  } catch (error) {
    throw error;
  }
};

const getS3Configuration = (sourceBucket) => {
  return {
    accessKeyId: process.env[`KOYEB_STORE_${sourceBucket}_ACCESS_KEY`],
    secretAccessKey: process.env[`KOYEB_STORE_${sourceBucket}_SECRET_KEY`],
    region: process.env[`KOYEB_STORE_${sourceBucket}_REGION`],
    endpoint: process.env[`KOYEB_STORE_${sourceBucket}_ENDPOINT`],
  };
};

const validateEnvironment = (sourceBucket) => {
  if (!sourceBucket) {
    throw new Error("Bucket name not present in event payload.");
  }

  if (
    !process.env?.[`KOYEB_STORE_${sourceBucket}_ACCESS_KEY`] ||
    !process.env?.[`KOYEB_STORE_${sourceBucket}_SECRET_KEY`] ||
    !process.env[`KOYEB_STORE_${sourceBucket}_REGION`] ||
    !process.env[`KOYEB_STORE_${sourceBucket}_ENDPOINT`]
  ) {
    throw new Error(
      `One of the following environment variables are missing: KOYEB_STORE_${sourceBucket}_ACCESS_KEY, KOYEB_STORE_${sourceBucket}_SECRET_KEY, KOYEB_STORE_${sourceBucket}_ENDPOINT, KOYEB_STORE_${sourceBucket}_REGION.`
    );
  }

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error(
      "Environment variables GOOGLE_APPLICATION_CREDENTIALS must be set."
    );
  }
};

const handler = async (event) => {
  const bucket = event?.bucket?.name;
  const key = event?.object?.key;

  if (key.startsWith(prefix)) {
    return;
  }

  validateEnvironment(bucket);

  const s3Instance = new S3(getS3Configuration(bucket));
  const videoIntelligenceInstance = new VideoIntelligence.VideoIntelligenceServiceClient();

  const objectBody = await getSourceObject(s3Instance, bucket, key);

  await executeVideoIntelligenceFeature(
    videoIntelligenceInstance,
    s3Instance,
    objectBody,
    key,
    bucket
  );
};

module.exports.handler = handler;
