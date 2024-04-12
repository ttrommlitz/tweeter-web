import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";

export interface S3DaoInterface {
  uploadImage(alias: string, imageStringBase64: string): Promise<string>
}

export class S3Dao implements S3DaoInterface {
  private readonly client = new S3Client()

  // returns the URL of the uploaded image
  async uploadImage(alias: string, imageStringBase64: string): Promise<string> {
    const image: Uint8Array = Buffer.from(imageStringBase64, "base64")

    const params: PutObjectCommandInput = {
      Bucket: "tweeter-profile-picture-bucket-340",
      Key: `${alias}-profile.jpeg`,
      Body: image
    }
    
    const response = await this.client.send(new PutObjectCommand(params))

    const url = `https://tweeter-profile-picture-bucket-340.s3.amazonaws.com/${alias}-profile.jpeg`
    return url
  }
}