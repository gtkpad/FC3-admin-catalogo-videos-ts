import { IStorage } from 'core/shared/application/storage.interface';
import { Storage as GoogleCloudStorageSdk } from '@google-cloud/storage';

export class GoogleCloudStorage implements IStorage {
  constructor(
    private readonly storageSdk: GoogleCloudStorageSdk,
    private readonly bucketName: string,
  ) {}

  async store(object: {
    data: Buffer;
    mime_type?: string;
    id: string;
  }): Promise<void> {
    const bucket = this.storageSdk.bucket(this.bucketName);
    const file = bucket.file(object.id);

    return file.save(object.data, {
      metadata: {
        contentType: object.mime_type,
      },
    });
  }

  async get(id: string): Promise<{ data: Buffer; mime_type?: string }> {
    const file = this.storageSdk.bucket(this.bucketName).file(id);

    const [metadata, content] = await Promise.all([
      file.getMetadata(),
      file.download(),
    ]);

    return {
      data: content[0],
      mime_type: metadata[0].contentType,
    };
  }
}
