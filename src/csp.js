export const getCSP = (envVariables) => {
  const {
    REACT_APP_HOST,
    REACT_APP_LEARNER_AI_ORCHESTRATION_HOST,
    REACT_APP_CONTENT_SERVICE_APP_HOST,
    REACT_APP_LEARNER_AI_APP_HOST,
    REACT_APP_AWS_S3_BUCKET_URL,
    REACT_APP_AWS_S3_BUCKET_CONTENT_URL,
    REACT_APP_TRUSTED_ORIGIN,
  } = envVariables;
  return `
      default-src 'none';
      manifest-src 'self';
      script-src 'self' blob: 'nonce-def123456' ;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.cdnfonts.com/;
      font-src 'self' https://fonts.gstatic.com https://fonts.cdnfonts.com;
      img-src 'self' data: https://images.squarespace-cdn.com ${REACT_APP_AWS_S3_BUCKET_CONTENT_URL} ${REACT_APP_AWS_S3_BUCKET_URL};
      media-src 'self' blob: ${REACT_APP_AWS_S3_BUCKET_URL} ${REACT_APP_AWS_S3_BUCKET_CONTENT_URL};
      connect-src 'self' ${REACT_APP_HOST} ${REACT_APP_LEARNER_AI_ORCHESTRATION_HOST} ${REACT_APP_CONTENT_SERVICE_APP_HOST} ${REACT_APP_LEARNER_AI_APP_HOST} ${REACT_APP_AWS_S3_BUCKET_URL} ${REACT_APP_AWS_S3_BUCKET_CONTENT_URL} blob:;
      form-action 'self';
      frame-src 'self' https://www.google.com https://www.gstatic.com;
      object-src 'none';
      base-uri 'none';
      frame-ancestors 'self';
    `;
};
