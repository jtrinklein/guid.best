"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");
const mime = require('mime');
const fs = require('fs');
const path = require("path");

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


const addFolderContents = (siteDir, prefix) => {
  for (let item of fs.readdirSync(siteDir)) {
    let filePath = path.join(siteDir, item);
    let isDir = fs.lstatSync(filePath).isDirectory();

    if (isDir) {
      const newPrefix = prefix ? path.join(prefix, item) : item;
      addFolderContents(filePath, newPrefix);
      continue;
    }
    let itemPath = prefix ? path.join(prefix, item) : item;
    itemPath = itemPath.replace(/\\/g,'/');
    
    let object = new aws.s3.BucketObject(itemPath, { 
      bucket: bucket,
      source: new pulumi.asset.FileAsset(filePath),     // use FileAsset to point to a file
      contentType: mime.getType(filePath) || undefined, // set the MIME type of the file
    });
  }
}
addFolderContents('www');

let bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
    bucket: bucket.bucket, // depends on siteBucket
    policy: bucket.bucket.apply(publicReadPolicyForBucket)
    // transform the siteBucket.bucket output property
});

exports.websiteUrl = bucket.websiteEndpoint; // output the endpoint as a stack output

// Export the name of the bucket
exports.bucketName = bucket.bucket;
