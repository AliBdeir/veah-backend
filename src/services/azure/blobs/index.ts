import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

class BlobsServiceClass {
    private blobServiceClient: BlobServiceClient;
    private containerClient: ContainerClient;

    constructor(connectionString: string, containerName: string) {
        this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        this.containerClient = this.blobServiceClient.getContainerClient(containerName);
    }

    async uploadBlob(blobName: string, buffer: Buffer): Promise<string> {
        try {
            const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
            const uploadBlobResponse = await blockBlobClient.uploadData(buffer, {
                blobHTTPHeaders: { blobContentType: 'audio/mpeg' },
            });
            console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
            return blockBlobClient.url;
        } catch (error) {
            console.error('Error uploading blob:', error);
            throw error;
        }
    }
}

const BlobsService = new BlobsServiceClass(process.env.VEAH_BLOB_CS!, 'audio-files');
export default BlobsService;
