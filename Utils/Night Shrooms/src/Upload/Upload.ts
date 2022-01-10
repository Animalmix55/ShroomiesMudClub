import * as IPFS from 'ipfs-http-client';
import fs from 'fs';
import { ERC721Meta } from '../GenerateMeta/Types';

let _ipfs: IPFS.IPFSHTTPClient;
const getIPFS = () => {
    if (!_ipfs) {
        _ipfs = IPFS.create();
    } else if (!_ipfs.isOnline()) {
        _ipfs = IPFS.create();
    }

    return _ipfs;
};

const uploadNFT = async (
    tokenId: number,
    imagePath: string,
    meta: ERC721Meta,
    ipfsMetaDir: string
) => {
    if (!imagePath || !meta)
        throw new Error(`Missing data at: ${imagePath}, ${meta}`);

    const ipfs = getIPFS();
    fs.readFile(imagePath, async (err, data) => {
        try {
            if (err) {
                console.error(`Failed to read image at ${imagePath}`);
            } else if (data) {
                console.log(`Uploading image for token ${tokenId}...`);
                const { cid } = await ipfs.add(data, { cidVersion: 1 });

                const url = `ipfs.io/ipfs/${cid}`; // gateway
                console.log(`image for token ${tokenId} uploaded!`);

                const newMeta = { ...meta, image: url } as ERC721Meta;

                console.log(`Uploading meta for ${tokenId}`);
                await ipfs.files.write(
                    `${ipfsMetaDir}/${tokenId}`,
                    JSON.stringify(newMeta, null, 4),
                    { create: true, cidVersion: 1 }
                );
                await ipfs.pin.addAll([
                    { path: `${ipfsMetaDir}/${tokenId}` },
                    { cid },
                ]); // pin
                console.log(`Meta for token ${tokenId} uploaded!`);
            }
        } catch (e) {
            console.error(`Failed to upload asset for token ${tokenId}`, e);
            process.exit(1);
        }
    });
};

export const upload = async (
    imageDir: string,
    metadataFile: string,
    limit?: number
) => {
    if (!fs.existsSync(imageDir) || !fs.existsSync(metadataFile))
        throw new Error('Directories not found');

    const ipfs = getIPFS();
    if (ipfs.isOnline()) console.log('IPFS connected');
    const metaFile = JSON.parse(
        fs.readFileSync(metadataFile).toString()
    ) as ERC721Meta[];
    const imagesDirectory = fs
        .readdirSync(imageDir, { withFileTypes: true })
        .filter((f) => f.isFile());

    try {
        await ipfs.files.mkdir('/metadata');
    } catch (e) {
        console.warn(e);
    }

    imagesDirectory
        .slice(0, limit)
        .filter((i) => i.name.endsWith('.png'))
        .forEach((image) => {
            const nftId = Number(image.name.split('.')[0]);
            if (Number.isNaN(nftId))
                throw new Error(`Bad NFT id for ${image.name}`);

            uploadNFT(
                nftId,
                `${imageDir}/${image.name}`,
                metaFile[nftId - 1],
                '/metadata'
            );
        });
};

export default upload;
