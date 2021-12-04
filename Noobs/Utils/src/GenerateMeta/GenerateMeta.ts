import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import {
    Asset,
    AttributeOrder,
    ConfigurationMeta,
    ERC721Meta,
    Layer,
    LayerType,
    LayerTypes,
} from './Types';
import { getOneOfOnes } from './OneOfOnes';
import { isExcluded } from './Exclusions';

export const ASSETDIR = path.resolve('./src/Assets/Attributes');
export const CONFIGURATIONOUTDIR = `${path.resolve(
    './src/Assets'
)}/ConfigurationMeta`;
export const IMAGEOUTDIR = `${path.resolve('./src/Assets')}/CompiledImages`;
export const RARITIES = path.resolve('./src/Assets/Rarities/Traits.csv');

const pickRandomAttribute = (attribute: Layer) => {
    const { assets } = attribute;
    const attributeLocation = crypto.randomInt(100000000) / 1000000;
    let selectedAttribute: Asset | undefined;

    let currentValue = 0;
    assets.forEach((a) => {
        if (selectedAttribute) return;
        currentValue += a.rarityPercent;
        if (currentValue > attributeLocation) {
            selectedAttribute = a;
        }
    });

    return selectedAttribute;
};

const compileImages = (paths: string[]) => {
    const base = sharp(paths[0]);

    base.composite(paths.slice(1).map((f) => ({ input: f }))).webp();

    return base;
};

const updateRarities = (
    layers: Layer[],
    occurances: Occurances,
    mintQuanitity: number,
    numGenerated: number
) => {
    const newLayers = layers.map((layer) => {
        const { assets, type } = layer;
        const attributeName = String(type);

        const newAssets = assets.map((asset) => {
            const originalRarity = asset.rarityPercent / 100;
            const expectedNumber = mintQuanitity * originalRarity;
            // console.log('Expected', expectedNumber);

            const assetOccurances =
                occurances[attributeName]?.[asset.displayName] || 0;
            const remaining = Math.max(0, expectedNumber - assetOccurances);

            const rarityPercent =
                (remaining / (mintQuanitity - numGenerated)) * 100;
            return { ...asset, rarityPercent };
        });

        return { ...layer, assets: newAssets };
    });

    return newLayers as Layer[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const applyRules = (NFT: ERC721Meta, _layers: Layer[]) => {
    // NOTHING FOR NOW
    return NFT;
};

const isValid = (NFT: ERC721Meta, id: number, last?: ERC721Meta) => {
    if (NFT.attributes.length === 0) return false;

    // reject similar Roos
    if (last) {
        const matchingAttributes = [] as ERC721Meta['attributes'];
        NFT.attributes.forEach((a) => {
            const lastAttr = last.attributes.find(
                (la) => a.trait_type === la.trait_type
            );
            if (!lastAttr) return;

            if (lastAttr.value === a.value) matchingAttributes.push(lastAttr);
        });
        if (matchingAttributes.length > 1) return false;
        if (
            matchingAttributes.some(
                (a) =>
                    a.trait_type === String(LayerType.Background) ||
                    a.trait_type === String(LayerType.Body)
            )
        )
            return false;
    }

    return !isExcluded(NFT);
};

type Rarities = { [layer: string]: { [assetId: string]: number } };
/**
 * Returns rarities in a 2 dimentional matrix where the
 * first index is the type index (hopefully the source is ordered the same as the type folders)
 * and the second index points to the asset (again, hope the files are ordered)
 */
export const getRarities = (): Rarities => {
    const file = fs.readFileSync(RARITIES).toString();

    const lines = file.split('\r\n');

    const rarities: Rarities = {};

    lines.slice(1).forEach((line) => {
        const columns = line.split(',');
        columns.forEach((col, colNum) => {
            if (colNum % 2 === 0 || !col) return; // skip

            const name = columns[colNum - 1];
            if (name === 'Total') return;

            const x = Math.floor(colNum / 2);
            const layerType = String(LayerTypes[x]);

            if (!rarities[layerType]) rarities[layerType] = {};

            const assetId = name.toLowerCase().replace(/[^A-Za-z0-9]/g, '');
            const rarityPercent = Number(col.replace('%', ''));
            if (Number.isNaN(rarityPercent))
                throw new Error(`Invalid rarity value: ${col}`);

            rarities[layerType][assetId] = rarityPercent;
        });
    });

    return rarities;
};

export const buildStarterMeta = () => {
    const layers: Layer[] = [];
    const rarities = getRarities();

    AttributeOrder.forEach((f) => {
        const layerName = String(f);
        const sectionRarities = rarities[layerName];

        const type = f;
        if (type === undefined)
            throw new Error(`Layer type not found for ${layerName}`);
        const layer: Layer = {
            type,
            assets: [],
        };

        const path = `${ASSETDIR}/${layerName}`;
        const files = fs.readdirSync(path, { withFileTypes: true });

        files
            .filter((af) => af.isFile())
            .forEach((assetFile) => {
                const filePath = `${path}/${assetFile.name}`;
                const displayName = assetFile.name.replace(/\.[A-Za-z]+$/, '');

                const rarityPercent =
                    sectionRarities[
                        displayName.toLowerCase().replace(/[^A-Za-z0-9]/g, '')
                    ]; // ensure the rarity file name matches the fileName
                if (rarityPercent === undefined)
                    throw new Error(
                        `Rarity percent not found for ${displayName} in ${type}`
                    );

                layer.assets.push({
                    filePath,
                    layer: type,
                    rarityPercent,
                    displayName,
                });
            });

        layers.push(layer);
    });

    try {
        fs.mkdirSync(CONFIGURATIONOUTDIR);
    } catch (e) {
        // nothing
    }
    fs.writeFileSync(
        `${CONFIGURATIONOUTDIR}/output_${
            new Date().getMonth() + 1
        }${new Date().getDate()}.json`,
        JSON.stringify({ layers } as ConfigurationMeta, null, 4)
    );

    return layers;
};

interface Occurances {
    [attribute: string]: {
        [value: string]: number;
    };
}

const sortAttributesByLayer = (attributes: ERC721Meta['attributes']) => {
    return [...attributes].sort((a, b): number => {
        const aIndex = LayerTypes.findIndex((o) => String(o) === a.trait_type);
        const bIndex = LayerTypes.findIndex((o) => String(o) === b.trait_type);

        if (aIndex < 0 || bIndex < 0) {
            console.error('Attribute layer order not found');
            process.exit();
        }
        return aIndex - bIndex;
    });
};

const sortAttributesByRarity = (attributes: ERC721Meta['attributes']) => {
    return [...attributes].sort((a, b): number => {
        const aIndex = AttributeOrder.findIndex(
            (o) => String(o) === a.trait_type
        );
        const bIndex = AttributeOrder.findIndex(
            (o) => String(o) === b.trait_type
        );

        if (aIndex < 0 || bIndex < 0) {
            console.error('Attribute rarity order not found');
            process.exit();
        }
        return aIndex - bIndex;
    });
};

export const generateERC721Metadata = (
    mintQuanitity = 5500,
    NFTName: string,
    seedMeta?: ERC721Meta[],
    generateImages?: boolean
) => {
    const originalLayers = buildStarterMeta();
    const oneOfOnes = getOneOfOnes();

    let layers = originalLayers;

    const occurances: Occurances = {};

    try {
        fs.mkdirSync(IMAGEOUTDIR);
    } catch (e) {
        // nada
    }

    let numGenerated = Object.keys(oneOfOnes).length;
    // start by filling in rarity for one of ones
    Object.keys(oneOfOnes).forEach((o) =>
        oneOfOnes[Number(o)].attributes.forEach((attribute) => {
            occurances[attribute.trait_type] = {
                ...occurances[attribute.trait_type],
                [attribute.value]:
                    (occurances[attribute.trait_type]?.[attribute.value] || 0) +
                    1,
            };
        })
    );

    // gets new rarity percentages
    layers = updateRarities(
        originalLayers,
        occurances,
        mintQuanitity,
        numGenerated
    );

    const NFTs: ERC721Meta[] = [];
    for (let i = 1; i <= mintQuanitity; i++) {
        let imagePaths: string[] = [];
        let NFT: ERC721Meta;

        const oneOfOne = oneOfOnes[i];

        if (!oneOfOne) {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                NFT = {
                    name: `${NFTName} #${i}`,
                    image: 'placeholder',
                    attributes: [],
                };

                imagePaths = [];

                const attributes: ERC721Meta['attributes'] = [];
                layers.forEach((layer) => {
                    const { type } = layer;
                    const attributeName = String(type);

                    if (seedMeta?.[i - 1]) {
                        const attr = seedMeta[i - 1].attributes.find(
                            (a) => a.trait_type === attributeName
                        );

                        if (attr && attr?.value !== 'None') {
                            attributes.push(attr);
                        }
                        return;
                    }

                    const selectedAttribute = pickRandomAttribute(layer);
                    if (!selectedAttribute) return;
                    attributes.push({
                        trait_type: attributeName,
                        value: selectedAttribute.displayName,
                    });
                });
                NFT.attributes = attributes;

                if (seedMeta?.[i - 1]) break;

                NFT = applyRules(NFT, layers);
                if (isValid(NFT, i, NFTs[NFTs.length - 1])) break;
            }

            numGenerated += 1;
            // update occurances
            NFT.attributes.forEach((attribute) => {
                occurances[attribute.trait_type] = {
                    ...occurances[attribute.trait_type],
                    [attribute.value]:
                        (occurances[attribute.trait_type]?.[attribute.value] ||
                            0) + 1,
                };
            });

            // gets new rarity percentages
            layers = updateRarities(
                originalLayers,
                occurances,
                mintQuanitity,
                numGenerated
            );
            console.log(`Generated token metadata for id: ${i}`);
        } else {
            NFT = { ...oneOfOne, image: 'placeholder' };
        }

        // sort attributes
        NFT = { ...NFT, attributes: sortAttributesByRarity(NFT.attributes) };

        // eslint-disable-next-line no-loop-func
        sortAttributesByLayer(NFT.attributes).forEach((attribute) => {
            const path = layers
                .find((l) => String(l.type) === attribute.trait_type)
                ?.assets.find(
                    (a) => a.displayName === attribute.value
                )?.filePath;
            if (!path)
                throw new Error(
                    `One of one (id: ${i}) attribute not found: ${attribute.value}`
                );
            imagePaths.push(path);
        });

        NFTs.push(NFT);

        if (generateImages) {
            const image = compileImages(imagePaths);
            image
                .toFile(`${IMAGEOUTDIR}/${i}.webp`)
                .then(() => console.log(`Generated image for token id: ${i}`))
                .catch((e) => {
                    console.error(
                        `Failed to generate image for token id: ${i}`,
                        e
                    );
                    process.exit(1);
                });
        }
    }
    fs.writeFileSync(
        `${CONFIGURATIONOUTDIR}/tokenMeta_${
            new Date().getMonth() + 1
        }${new Date().getDate()}.json`,
        JSON.stringify(NFTs, null, 4)
    );

    const rarity = Object.keys(occurances).reduce((prev, cur) => {
        const attributeOccurances = Object.keys(occurances[cur]).reduce(
            (prevAttr, curAttr) => {
                return {
                    ...prevAttr,
                    [curAttr]:
                        Math.round(
                            (occurances[cur][curAttr] / mintQuanitity) * 10000
                        ) / 100,
                };
            },
            {}
        );
        return { ...prev, [cur]: attributeOccurances };
    }, {});
    fs.writeFileSync(
        `${CONFIGURATIONOUTDIR}/tokenRarity_${
            new Date().getMonth() + 1
        }${new Date().getDate()}.json`,
        JSON.stringify(rarity, null, 4)
    );

    console.log('Generated Rarities:');
    console.log(rarity);

    return NFTs;
};

export const regenerateImages = (meta: ERC721Meta[], max?: number) => {
    const starter = buildStarterMeta();

    meta.slice(0, max).forEach((m, i) => {
        const paths = [] as string[];

        sortAttributesByLayer(m.attributes).forEach((a) => {
            const target = starter
                .find((s) => String(s.type) === a.trait_type)
                ?.assets.find((ass) => ass.displayName === a.value);
            if (!target)
                throw new Error(
                    `Cannot find target image from data ${a.trait_type} ${a.value}`
                );
            paths.push(target.filePath);
        });

        const build = async () => {
            console.log(`Generating token image for id: ${i + 1}`);
            const image = compileImages(paths);
            image
                .toFile(`${IMAGEOUTDIR}/${i + 1}.webp`)
                .then(() =>
                    console.log(`Generated image for token id: ${i + 1}`)
                )
                .catch((e) => {
                    console.error(
                        `Failed to generate image for token id: ${i + 1}`,
                        e
                    );
                    process.exit(1);
                });
        };

        build();
    });
};
