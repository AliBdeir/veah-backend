"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_blob_1 = require("@azure/storage-blob");
class BlobsServiceClass {
    constructor(connectionString, containerName) {
        this.blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
        this.containerClient = this.blobServiceClient.getContainerClient(containerName);
    }
    uploadBlob(blobName, buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
                const uploadBlobResponse = yield blockBlobClient.uploadData(buffer, {
                    blobHTTPHeaders: { blobContentType: 'audio/mpeg' },
                });
                console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
                return blockBlobClient.url;
            }
            catch (error) {
                console.error('Error uploading blob:', error);
                throw error;
            }
        });
    }
}
const BlobsService = new BlobsServiceClass(process.env.VEAH_BLOB_CS, 'audio-files');
exports.default = BlobsService;
