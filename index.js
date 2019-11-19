"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");
const mime = require('mime')

// Create an S3 Bucket Policy to allow public read of all objects in bucket
// This reusable function can be pulled out into its own module
function publicReadPolicyForBucket(bucketName) {
    return JSON.stringify({
      Version: "2012-10-17",
      Statement: [{
        Effect: "Allow",
        Principal: "*",
        Action: [
          "s3:GetObject"
        ],
        Resource: [
          `arn:aws:s3:::${bucketName}/*` // policy refers to bucket name explicitly
        ]
      }]
    })
  }

  
// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("guid-best-site-bucket", {
    website: {
      indexDocument: "index.html",
    },
  });

const siteDir = 'www';

for (let item of require("fs").readdirSync(siteDir)) {
    let filePath = require("path").join(siteDir, item);
    let object = new aws.s3.BucketObject(item, { 
      bucket: bucket,
      source: new pulumi.asset.FileAsset(filePath),     // use FileAsset to point to a file
      contentType: mime.getType(filePath) || undefined, // set the MIME type of the file
    });
}

let bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
    bucket: bucket.bucket, // depends on siteBucket
    policy: bucket.bucket.apply(publicReadPolicyForBucket)
    // transform the siteBucket.bucket output property
});

exports.websiteUrl = bucket.websiteEndpoint; // output the endpoint as a stack output

// Export the name of the bucket
exports.bucketName = bucket.bucket;
