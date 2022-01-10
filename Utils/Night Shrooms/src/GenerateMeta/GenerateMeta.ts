/* eslint-disable @typescript-eslint/no-extra-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-loop-func */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { toTitleCase, transform } from '@alduino/humanizer/string';
import {
    Asset,
    AttributeOrder,
    ConfigurationMeta,
    ERC721Attribute,
    ERC721Meta,
    Layer,
    LayerType,
    LayerTypes,
} from './Types';
import { getOneOfOnes } from './OneOfOnes';

export const ASSETDIR = path.resolve('./src/Assets/Attributes');
export const CONFIGURATIONOUTDIR = `${path.resolve(
    './src/Assets'
)}/ConfigurationMeta`;
export const IMAGEOUTDIR = `${path.resolve('./src/Assets')}/CompiledImages`;
export const RARITIES = path.resolve('./src/Assets/Rarities/Traits.csv');

export const getDuplicateIndexes = (meta: ERC721Meta[]) => {
    const combos: { [x: string]: number } = {};
    const duplicateIndexes: number[] = [];

    for (let i = 0; i < meta.length; i++) {
        const key = meta[i].attributes.map((a) => a.value).join(' ');
        if (combos[key] !== undefined) duplicateIndexes.push(i);
        combos[key] = combos[key] !== undefined ? combos[key] + 1 : 0;
    }

    return duplicateIndexes;
};

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

const getAsset = (name: string, layerType: LayerType, layers: Layer[]) => {
    const layer = layers.find((l) => l.type === layerType);
    if (!layer) {
        throw new Error(`Layer not found: ${layerType}`);
    }

    const asset = layer.assets.find((a) => a.displayName === name);

    if (!asset) throw new Error(`Asset not found in ${layerType}: ${name}`);

    return asset;
};

const getAttribute = (nft: ERC721Meta, layer: LayerType) => {
    return nft.attributes.find((a) => a.trait_type === String(layer));
};

const applyRules = (_NFT: ERC721Meta, originalLayers: Layer[]) => {
    let NFT = { ..._NFT, attributes: [..._NFT.attributes] } as ERC721Meta;

    let face = getAttribute(NFT, LayerType.Face);
    const targetFaces = ['HAL', 'KITT-Y'].map((a) =>
        getAsset(a, LayerType.Face, originalLayers)
    );
    if (targetFaces.map((f) => f.displayName).includes(face?.value || '____')) {
        const grey = crypto.randomInt(100) <= 50;
        const headSpots = getAsset(
            grey ? 'GREY' : 'ORANGE',
            LayerType['Head Spots'],
            originalLayers
        );

        const bodySpots = grey
            ? undefined
            : getAsset('ORANGE', LayerType['Body Spots'], originalLayers);

        const gills = getAsset(
            grey ? 'GREY' : 'ORANGE',
            LayerType.Gills,
            originalLayers
        );

        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (l) =>
                        l.trait_type !== String(LayerType['Body Spots']) &&
                        l.trait_type !== String(LayerType['Head Spots']) &&
                        l.trait_type !== String(LayerType.Gills)
                ),
                ...(headSpots
                    ? [
                          {
                              trait_type: String(LayerType['Head Spots']),
                              value: headSpots.displayName,
                          },
                      ]
                    : []),
                ...(bodySpots
                    ? [
                          {
                              trait_type: String(LayerType['Body Spots']),
                              value: bodySpots.displayName,
                          },
                      ]
                    : []),
                ...(gills
                    ? [
                          {
                              trait_type: String(LayerType.Gills),
                              value: gills.displayName,
                          },
                      ]
                    : []),
            ],
        };
    }

    const handItem = getAttribute(NFT, LayerType['Hand Item']);
    const greedo = getAsset('GREEDO', LayerType['Hand Item'], originalLayers);
    const tacVest = getAsset(
        'TAC VEST',
        LayerType['Body Gear'],
        originalLayers
    );
    const tacSweatshirt = getAsset(
        'TAC HOODIE',
        LayerType['Body Gear'],
        originalLayers
    );

    if (handItem?.value === greedo.displayName) {
        const hasTac = crypto.randomInt(100) <= 15;
        if (hasTac) {
            const hasSweat = crypto.randomInt(100) <= 50;
            NFT = {
                ...NFT,
                attributes: [
                    ...NFT.attributes.filter(
                        (l) => l.trait_type !== String(LayerType['Body Gear'])
                    ),
                    {
                        trait_type: String(LayerType['Body Gear']),
                        value: hasSweat
                            ? tacSweatshirt.displayName
                            : tacVest.displayName,
                    },
                ],
            };
        }
    }

    const foreground = getAttribute(NFT, LayerType.Foreground);
    const fireflies = getAsset(
        'FIREFLIES',
        LayerType.Foreground,
        originalLayers
    );
    const headlamp = getAsset('HEADLAMP', LayerType.Headgear, originalLayers);

    if (foreground?.value === fireflies.displayName) {
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (l) => l.trait_type !== String(LayerType.Headgear)
                ),
                {
                    trait_type: String(LayerType.Headgear),
                    value: headlamp.displayName,
                },
            ],
        };
    }

    // MATCH GILL COLOR
    const bodySpots = getAttribute(NFT, LayerType['Body Spots']);
    const headSpots = getAttribute(NFT, LayerType['Head Spots']);
    const gill = getAttribute(NFT, LayerType.Gills) as ERC721Attribute;
    const matchGill = crypto.randomInt(100) <= 80;

    let gillAsset = gill.value;

    if (matchGill && (headSpots || bodySpots)) {
        const targetColor = headSpots?.value || (bodySpots?.value as string);
        const gillValue = gill.value.split(' ');
        gillValue[0] = targetColor;

        gillAsset = gillValue.join(' ');
    }

    let headGear = getAttribute(NFT, LayerType.Headgear);
    if (headGear && headGear.value.includes('HALO')) {
        const targetColor = headGear.value.split(' ')[1];
        const gillValue = gill.value.split(' ');
        gillValue[0] = targetColor;

        gillAsset = gillValue.join(' ');
    }

    face = getAttribute(NFT, LayerType.Face);
    if (face?.value.includes('LEFT EYE')) {
        const targetColor = face.value.split(' ')[2];
        const gillValue = gill.value.split(' ');
        gillValue[0] = targetColor;

        gillAsset = gillValue.join(' ');
    } else if (face?.value.includes('BEAD') && crypto.randomInt(100) <= 50) {
        const targetColor = face.value.split(' ')[1];
        const gillValue = gill.value.split(' ');
        gillValue[0] = targetColor;

        gillAsset = gillValue.join(' ');
    } else if (
        face?.value.includes('X X SILENT') &&
        crypto.randomInt(100) <= 80
    ) {
        const targetColor = face.value.split(' ')[3];
        const gillValue = gill.value.split(' ');
        gillValue[0] = targetColor;

        gillAsset = gillValue.join(' ');
    } else if (face?.value.includes('X X GOO') && crypto.randomInt(100) <= 50) {
        const targetColor = face.value.split(' ')[3];
        const gillValue = gill.value.split(' ');
        gillValue[0] = targetColor;

        gillAsset = gillValue.join(' ');
    } else if (
        face?.value.includes('GOO ELECTRIC') &&
        crypto.randomInt(100) <= 50
    ) {
        const targetColor = face.value.split(' ')[2];
        const gillValue = gill.value.split(' ');
        gillValue[0] = targetColor;

        gillAsset = gillValue.join(' ');
    } else if (
        face?.value.includes('SOLID BEAM ELECTRIC') &&
        crypto.randomInt(100) <= 65
    ) {
        const targetColor = face.value.split(' ')[3];
        const gillValue = gill.value.split(' ');
        gillValue[0] = targetColor;

        gillAsset = gillValue.join(' ');
    } else if (face?.value.includes('REPTILE') && crypto.randomInt(100) <= 75) {
        const faceSections = face.value.split(' ');

        try {
            const targetColor = faceSections[faceSections.length - 2];
            const gillValue = gill.value.split(' ');
            gillValue[0] = targetColor;

            gillAsset = gillValue.join(' ');
            getAsset(gillAsset, LayerType.Gills, originalLayers);
        } catch (e) {
            const targetColor = faceSections[0];
            const gillValue = gill.value.split(' ');
            gillValue[0] = targetColor;

            gillAsset = gillValue.join(' ');
        }
    }

    const bodyGear = getAttribute(NFT, LayerType['Body Gear']);
    if (bodyGear?.value.includes('SLASHER') && (bodySpots || headSpots)) {
        const targetColor = (headSpots?.value || bodySpots?.value) as string;

        const gillValue = gill.value.split(' ');
        gillValue[0] = targetColor;

        gillAsset = gillValue.join(' ');
    }

    headGear = getAttribute(NFT, LayerType.Headgear);
    if (headGear?.value.includes('ANTLERS') && crypto.randomInt(100) <= 75) {
        const targetColor = headGear.value.split(' ')[1];

        const gillValue = gill.value.split(' ');
        gillValue[0] = targetColor;

        gillAsset = gillValue.join(' ');
    }

    let newGill: Asset;
    try {
        newGill = getAsset(gillAsset, LayerType.Gills, originalLayers);
    } catch (e) {
        newGill = getAsset(
            gillAsset.replace(' GLOW', ''),
            LayerType.Gills,
            originalLayers
        );
    }

    // assign new gill
    NFT = {
        ...NFT,
        attributes: [
            ...NFT.attributes.filter(
                (l) => l.trait_type !== String(LayerType.Gills)
            ),
            {
                trait_type: String(LayerType.Gills),
                value: newGill.displayName,
            },
        ],
    };

    return NFT;
};

const attributesInDomain = (
    _NFT: ERC721Meta,
    originalLayers: Layer[],
    validBackgrounds: string[] | true,
    validTextures: string[] | undefined | true,
    validGills: string[] | true,
    validBodies: string[] | true,
    validBodySpots: string[] | undefined | true,
    validHeadSpots: string[] | undefined | true,
    validBodyGears: string[] | undefined | true,
    validFaces: string[] | true,
    validHeadGears: string[] | undefined | true,
    validHats: string[] | undefined | true,
    validForegrounds: string[] | undefined | true,
    validExtras: string[] | undefined | true,
    validHandItems: string[] | undefined | true
) => {
    let NFT = { ..._NFT, attributes: [..._NFT.attributes] };

    const bg = getAttribute(NFT, LayerType.Background);
    const texture = getAttribute(NFT, LayerType.Texture);
    const gills = getAttribute(NFT, LayerType.Gills);
    const body = getAttribute(NFT, LayerType.Body);
    const bodySpots = getAttribute(NFT, LayerType['Body Spots']);
    const headSpots = getAttribute(NFT, LayerType['Head Spots']);
    const extra = getAttribute(NFT, LayerType.Extra);
    const bodyGear = getAttribute(NFT, LayerType['Body Gear']);
    const face = getAttribute(NFT, LayerType.Face);
    const headgear = getAttribute(NFT, LayerType.Headgear);
    const hat = getAttribute(NFT, LayerType.Hat);
    const foreground = getAttribute(NFT, LayerType.Foreground);
    const handItem = getAttribute(NFT, LayerType['Hand Item']);

    // test bg
    if (Array.isArray(validBackgrounds) && validBackgrounds.length === 0) {
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Background)
                ),
            ],
        };
    } else if (
        !(
            validBackgrounds === true ||
            (validBackgrounds &&
                validBackgrounds
                    .map((h) =>
                        getAsset(h, LayerType.Background, originalLayers)
                    )
                    .some((vb) => vb.displayName === bg?.value))
        )
    ) {
        const newBackground =
            validBackgrounds[crypto.randomInt(validBackgrounds.length)];
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Background)
                ),
                {
                    trait_type: String(LayerType.Background),
                    value: getAsset(
                        newBackground,
                        LayerType.Background,
                        originalLayers
                    ).displayName,
                },
            ],
        };
    }

    // test texture
    if (Array.isArray(validTextures) && validTextures.length === 0) {
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Texture)
                ),
            ],
        };
    } else if (
        !(
            validTextures === true ||
            (validTextures &&
                validTextures
                    .map((h) => getAsset(h, LayerType.Texture, originalLayers))
                    .some((vb) => vb.displayName === texture?.value))
        )
    ) {
        const newTexture =
            validTextures?.[crypto.randomInt(0, validTextures?.length || 1)];
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Texture)
                ),
                ...(newTexture
                    ? [
                          {
                              trait_type: String(LayerType.Texture),
                              value: getAsset(
                                  newTexture,
                                  LayerType.Texture,
                                  originalLayers
                              ).displayName,
                          },
                      ]
                    : []),
            ],
        };
    }

    // test gills
    if (Array.isArray(validGills) && validGills.length === 0) {
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Gills)
                ),
            ],
        };
    } else if (
        !(
            validGills === true ||
            (validGills &&
                validGills
                    .map((h) => getAsset(h, LayerType.Gills, originalLayers))
                    .some((vb) => vb.displayName === gills?.value))
        )
    ) {
        const newGills =
            validGills?.[crypto.randomInt(0, validGills?.length || 1)];
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Gills)
                ),
                ...(newGills
                    ? [
                          {
                              trait_type: String(LayerType.Gills),
                              value: getAsset(
                                  newGills,
                                  LayerType.Gills,
                                  originalLayers
                              ).displayName,
                          },
                      ]
                    : []),
            ],
        };
    }

    // test body
    if (Array.isArray(validBodies) && validBodies.length === 0) {
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Body)
                ),
            ],
        };
    } else if (
        !(
            validBodies === true ||
            (validBodies &&
                validBodies
                    .map((h) => getAsset(h, LayerType.Body, originalLayers))
                    .some((vb) => vb.displayName === body?.value))
        )
    ) {
        const newBody = validBodies[crypto.randomInt(validBodies.length)];
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Body)
                ),
                {
                    trait_type: String(LayerType.Body),
                    value: getAsset(newBody, LayerType.Body, originalLayers)
                        .displayName,
                },
            ],
        };
    }

    // test body spots
    if (Array.isArray(validBodySpots) && validBodySpots.length === 0) {
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType['Body Spots'])
                ),
            ],
        };
    } else if (
        !(
            validBodySpots === true ||
            (validBodySpots &&
                validBodySpots
                    .map((h) =>
                        getAsset(h, LayerType['Body Spots'], originalLayers)
                    )
                    .some((vb) => vb.displayName === bodySpots?.value))
        )
    ) {
        const newBodySpots =
            validBodySpots?.[crypto.randomInt(0, validBodySpots.length || 1)];
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType['Body Spots'])
                ),
                ...(newBodySpots
                    ? [
                          {
                              trait_type: String(LayerType['Body Spots']),
                              value: getAsset(
                                  newBodySpots,
                                  LayerType['Body Spots'],
                                  originalLayers
                              ).displayName,
                          },
                      ]
                    : []),
            ],
        };
    }

    // test head spots
    if (Array.isArray(validHeadSpots) && validHeadSpots.length === 0) {
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType['Head Spots'])
                ),
            ],
        };
    } else if (
        !(
            validHeadSpots === true ||
            (validHeadSpots &&
                validHeadSpots
                    .map((h) =>
                        getAsset(h, LayerType['Head Spots'], originalLayers)
                    )
                    .some((vb) => vb.displayName === headSpots?.value))
        )
    ) {
        const newHeadSpots =
            validHeadSpots?.[crypto.randomInt(0, validHeadSpots.length || 1)];
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType['Head Spots'])
                ),
                ...(newHeadSpots
                    ? [
                          {
                              trait_type: String(LayerType['Head Spots']),
                              value: getAsset(
                                  newHeadSpots,
                                  LayerType['Head Spots'],
                                  originalLayers
                              ).displayName,
                          },
                      ]
                    : []),
            ],
        };
    }

    // test body gear
    if (Array.isArray(validBodyGears) && validBodyGears.length === 0) {
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType['Body Gear'])
                ),
            ],
        };
    } else if (
        !(
            validBodyGears === true ||
            (validBodyGears &&
                validBodyGears
                    .map((h) =>
                        getAsset(h, LayerType['Body Gear'], originalLayers)
                    )
                    .some((vb) => vb.displayName === bodyGear?.value))
        )
    ) {
        const newBodyGear =
            validBodyGears?.[crypto.randomInt(0, validBodyGears.length || 1)];
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType['Body Gear'])
                ),
                ...(newBodyGear
                    ? [
                          {
                              trait_type: String(LayerType['Body Gear']),
                              value: getAsset(
                                  newBodyGear,
                                  LayerType['Body Gear'],
                                  originalLayers
                              ).displayName,
                          },
                      ]
                    : []),
            ],
        };
    }

    // test extra
    if (Array.isArray(validExtras) && validExtras.length === 0) {
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Extra)
                ),
            ],
        };
    } else if (
        !(
            validExtras === true ||
            (validExtras &&
                validExtras
                    .map((h) => getAsset(h, LayerType.Extra, originalLayers))
                    .some((vb) => vb.displayName === extra?.value))
        )
    ) {
        const newExtra =
            validExtras?.[crypto.randomInt(0, validExtras.length || 1)];
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Extra)
                ),
                ...(newExtra
                    ? [
                          {
                              trait_type: String(LayerType.Extra),
                              value: getAsset(
                                  newExtra,
                                  LayerType.Extra,
                                  originalLayers
                              ).displayName,
                          },
                      ]
                    : []),
            ],
        };
    }

    // test face
    if (Array.isArray(validFaces) && validFaces.length === 0) {
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Face)
                ),
            ],
        };
    } else if (
        !(
            validFaces === true ||
            (validFaces &&
                validFaces
                    .map((h) => getAsset(h, LayerType.Face, originalLayers))
                    .some((vb) => vb.displayName === face?.value))
        )
    ) {
        const newFace = validFaces[crypto.randomInt(0, validFaces.length || 1)];
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Face)
                ),
                {
                    trait_type: String(LayerType.Face),
                    value: getAsset(newFace, LayerType.Face, originalLayers)
                        .displayName,
                },
            ],
        };
    }

    // test headgear
    if (Array.isArray(validHeadGears) && validHeadGears.length === 0) {
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Headgear)
                ),
            ],
        };
    } else if (
        !(
            validHeadGears === true ||
            (validHeadGears &&
                validHeadGears
                    .map((h) => getAsset(h, LayerType.Headgear, originalLayers))
                    .some((vb) => vb.displayName === headgear?.value))
        )
    ) {
        const newHeadgear =
            validHeadGears?.[crypto.randomInt(0, validHeadGears.length || 1)];
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Headgear)
                ),
                ...(newHeadgear
                    ? [
                          {
                              trait_type: String(LayerType.Headgear),
                              value: getAsset(
                                  newHeadgear,
                                  LayerType.Headgear,
                                  originalLayers
                              ).displayName,
                          },
                      ]
                    : []),
            ],
        };
    }

    // test hat
    if (Array.isArray(validHats) && validHats.length === 0) {
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Hat)
                ),
            ],
        };
    } else if (
        !(
            validHats === true ||
            (validHats &&
                validHats
                    .map((h) => getAsset(h, LayerType.Hat, originalLayers))
                    .some((vb) => vb.displayName === hat?.value))
        )
    ) {
        const newHat = validHats?.[crypto.randomInt(0, validHats.length || 1)];
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Hat)
                ),
                ...(newHat
                    ? [
                          {
                              trait_type: String(LayerType.Hat),
                              value: getAsset(
                                  newHat,
                                  LayerType.Hat,
                                  originalLayers
                              ).displayName,
                          },
                      ]
                    : []),
            ],
        };
    }

    // test foreground
    if (Array.isArray(validForegrounds) && validForegrounds.length === 0) {
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Foreground)
                ),
            ],
        };
    } else if (
        !(
            validForegrounds === true ||
            (validForegrounds &&
                validForegrounds
                    .map((h) =>
                        getAsset(h, LayerType.Foreground, originalLayers)
                    )
                    .some((vb) => vb.displayName === foreground?.value))
        )
    ) {
        const newForeground =
            validForegrounds?.[
                crypto.randomInt(0, validForegrounds.length || 1)
            ];
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Foreground)
                ),
                ...(newForeground
                    ? [
                          {
                              trait_type: String(LayerType.Foreground),
                              value: getAsset(
                                  newForeground,
                                  LayerType.Foreground,
                                  originalLayers
                              ).displayName,
                          },
                      ]
                    : []),
            ],
        };
    }

    // test hand item
    if (Array.isArray(validHandItems) && validHandItems.length === 0) {
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType['Hand Item'])
                ),
            ],
        };
    } else if (
        !(
            validHandItems === true ||
            (validHandItems &&
                validHandItems
                    .map((h) =>
                        getAsset(h, LayerType['Hand Item'], originalLayers)
                    )
                    .some((vb) => vb.displayName === handItem?.value))
        )
    ) {
        const newHandItem =
            validHandItems?.[crypto.randomInt(0, validHandItems.length || 1)];
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType['Hand Item'])
                ),
                ...(newHandItem
                    ? [
                          {
                              trait_type: String(LayerType['Hand Item']),
                              value: getAsset(
                                  newHandItem,
                                  LayerType['Hand Item'],
                                  originalLayers
                              ).displayName,
                          },
                      ]
                    : []),
            ],
        };
    }

    return NFT;
};

const isValid = (
    _NFT: ERC721Meta,
    id: number,
    previous: ERC721Meta[],
    originalLayers: Layer[]
) => {
    let NFT = { ..._NFT, attributes: [..._NFT.attributes] } as ERC721Meta;

    if (NFT.attributes.length === 0) return false;
    const last =
        previous.length > 0 ? previous[previous.length - 1] : undefined;

    // reject similar
    if (last) {
        const matchingAttributes = [] as ERC721Meta['attributes'];
        NFT.attributes.forEach((a) => {
            const lastAttr = last.attributes.find(
                (la) => a.trait_type === la.trait_type
            );
            if (!lastAttr) return;

            if (lastAttr.value === a.value) matchingAttributes.push(lastAttr);
        });
        if (matchingAttributes.length > 2) return false;
        if (
            matchingAttributes.some(
                (a) => a.trait_type === String(LayerType.Background)
            )
        )
            return false;
        if (
            matchingAttributes.some(
                (a) => a.trait_type === String(LayerType.Body)
            )
        )
            return false;

        if (getDuplicateIndexes([...previous, NFT]).length > 0) return false;
    }

    const body = NFT.attributes.find(
        (a) => a.trait_type === String(LayerType.Body)
    ) as ERC721Attribute;

    const jackOLantern = getAsset(
        'JACK O LANTERN GLOW',
        LayerType.Body,
        originalLayers
    );
    if (jackOLantern.displayName === body.value) {
        const legalHands = [
            `DON'T TAZE ME BRO`,
            'BAT YELLOW',
            'FLASHLIGHT',
            'GLOW STICK YELLOW',
            'GLOW STICK GREEN',
            'HULA HOOP GREEN',
            'HULA HOOP PINK AND GREEN',
            'GLOW BRACELET',
            'LIGHTSABER PEACE',
            'LIGHTSABER KNOWLEDGE',
            'NUNCHUCKS YELLOW GLOW',
            'NUNCHUCKS YELLOW',
            'NUNCHUCKS BLACK',
            'PLUTONIUM',
            'URANIUM',
            'STAR GREEN',
            'STAR YELLOW',
        ];

        const legalForeground = ['FIREFLY', 'FIREFLIES', 'LUNA MOTH'];

        const legalHats = ['BLACK CROWN', 'COOL GLOW-SWEATBANDS'];

        const legalHeadgear = [
            'HORNS YELLOW GLOW',
            'ANTLERS YELLOW GLOW',
            'BUG ANTENNAE GLOW',
            'HEADLAMP',
            'ANGLER',
            'CLUSTER GLOW',
            'HALO GREEN GLOW',
            'HALO YELLOW GLOW',
            '3 WORM FRIENDS YELLOW',
            '1 WORM FRIEND YELLOW',
            '3 WORM FRIENDS GREEN',
            '1 WORM FRIEND GREEN',
        ];

        const legalFaces = [
            '8 EYES BLACK',
            'BEAD GREEN',
            'BEAD YELLOW',
            'LEFT EYE GREEN',
            'LEFT EYE YELLOW 2',
            'NIGHT VISION',
            'SOLID BEAM ELECTRIC YELLOW',
            'SOLID BEAM ELECTRIC GREEN',
            'ORANGE REPTILE',
            'YELLOW REPTILE',
            'GREEN REPTILE',
            'RIKKI YELLOW REPTILE',
            'RIKKI GREEN REPTILE',
            'X X GOO GREEN',
            'X X SILENT GREEN',
            'X X SILENT YELLOW',
            'DUPLI',
            'GOO ELECTRIC GREEN',
            'GOO ELECTRIC YELLOW',
        ];

        const legalBodyGear = [
            'SLASHER GLOW',
            'SLASHER GREEN',
            'TAC HOODIE',
            'SAFETY VEST',
        ];

        const result = attributesInDomain(
            NFT,
            originalLayers,
            true,
            [],
            [],
            true,
            [],
            [],
            legalBodyGear,
            legalFaces,
            legalHeadgear,
            legalHats,
            legalForeground,
            [],
            legalHands
        );
        if (result) NFT = result;
        else return false;
    }

    const pepeOfEternalLight = getAsset(
        'PEPE OF ETERNAL LIGHT',
        LayerType.Body,
        originalLayers
    );
    if (pepeOfEternalLight.displayName === body.value) {
        const legalHands = [
            `DON'T TAZE ME BRO`,
            'BAT BLUE',
            'BAT YELLOW',
            'FLASHLIGHT',
            'GLOW STICK YELLOW',
            'GLOW STICK GREEN',
            'GLOW STICK PINK',
            'HULA HOOP PINK AND GREEN',
            'HULA HOOP PINK',
            'HULA HOOP GREEN',
            'GLOW BRACELET',
            'LIGHTSABER KNOWLEDGE',
            'NUNCHUCKS YELLOW GLOW',
            'PLUTONIUM',
            'URANIUM',
            'STAR TURQ',
            'STAR YELLOW',
        ];

        const legalForeground = ['FIREFLIES'];

        const legalHats = ['COOL GLOW-SWEATBANDS'];

        const legalHeadgear = [
            'HORNS YELLOW GLOW',
            'BUG ANTENNAE GLOW',
            'CATERPILLAR GLOW WORM',
            'HEADLAMP',
            'CLUSTER GLOW',
            'HALO GREEN GLOW',
            'HALO YELLOW GLOW',
            '3 WORM FRIENDS YELLOW',
            '1 WORM FRIEND YELLOW',
            '3 WORM FRIENDS GREEN',
            '1 WORM FRIEND GREEN',
        ];

        const legalFaces = [
            '8 EYES BLACK',
            'BEAD GREEN',
            'BEAD TURQ',
            'BEAD YELLOW',
            'BURGLAR',
            'LEFT EYE GREEN',
            'LEFT EYE YELLOW 2',
            'NIGHT VISION',
            'SOLID BEAM ELECTRIC YELLOW',
            'SOLID BEAM ELECTRIC GREEN',
            'ORANGE REPTILE',
            'PINK REPTILE',
            'TURQ REPTILE',
            'YELLOW REPTILE',
            'GREEN REPTILE',
            'RIKKI TURQ REPTILE',
            'RIKKI YELLOW REPTILE',
            'RIKKI GREEN REPTILE',
            'X X GOO GREEN',
            'X X SILENT GREEN',
            'X X SILENT YELLOW',
            'DUPLI',
            'GOO ELECTRIC ORANGE',
            'GOO ELECTRIC PURPLE',
            'GOO ELECTRIC PINK',
            'GOO ELECTRIC GREEN',
            'GOO ELECTRIC TURQ',
            'GOO ELECTRIC YELLOW',
        ];
        const legalBodyGear = ['SLASHER GLOW', 'SLASHER GREEN', 'TRACK GLOW'];

        const result = attributesInDomain(
            NFT,
            originalLayers,
            true,
            [],
            [],
            true,
            [],
            [],
            legalBodyGear,
            legalFaces,
            legalHeadgear,
            legalHats,
            legalForeground,
            [],
            legalHands
        );
        if (result) NFT = result;
        else return false;
    }

    const bleedingFairyHelmet = getAsset(
        'BLEEDING FAIRY HELMET',
        LayerType.Body,
        originalLayers
    );
    if (bleedingFairyHelmet.displayName === body.value) {
        const legalForeground = ['LUNA MOTH'];

        const legalHats = ['BEANIE BLACK', 'BLACK CROWN'];

        const legalHeadgear = [
            'LASER BATS',
            'BUG ANTENNAE GLOW',
            'CATERPILLAR GLOW WORM',
            'HEADLAMP',
            'ANGLER',
            'HALO PINK GLOW',
            'POISON DART FROG BLUE',
            'POISON DART FROG GREEN',
        ];

        const legalFaces = [
            '8 EYES BLACK',
            'BEAD PURPLE',
            'BEAD PINK',
            'BEAD TURQ',
            'BEAD YELLOW',
            'LEFT EYE PINK',
            'NIGHT VISION',
            'SOLID BEAM ELECTRIC PINK',
            'SOLID BEAM ELECTRIC PURPLE',
            'SOLID BEAM ELECTRIC GREEN',
            'PINK REPTILE',
            'PURPLE REPTILE',
            'TURQ REPTILE',
            'GREEN REPTILE',
            'RIKKI YELLOW REPTILE',
            'X X GOO PINK',
            'X X SILENT PINK',
            'DUPLI',
            'GOO ELECTRIC PINK',
        ];

        const legalBodyGear = ['SLASHER PINK', 'TAC HOODIE', 'EAT ME T PINK'];

        const result = attributesInDomain(
            NFT,
            originalLayers,
            true,
            [],
            [],
            true,
            [],
            [],
            legalBodyGear,
            legalFaces,
            legalHeadgear,
            legalHats,
            legalForeground,
            [],
            true
        );
        if (result) NFT = result;
        else return false;
    }

    const headgear = getAttribute(NFT, LayerType.Headgear);
    const hat = getAttribute(NFT, LayerType.Hat);
    const face = getAttribute(NFT, LayerType.Face);

    if (hat && headgear) {
        const keepHat = crypto.randomInt(100) <= 50;
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) =>
                        a.trait_type !==
                        String(keepHat ? LayerType.Headgear : LayerType.Hat)
                ),
            ],
        };
    }

    const eightEyesBlack = getAsset(
        '8 EYES BLACK',
        LayerType.Face,
        originalLayers
    );

    const headLamp = getAsset('HEADLAMP', LayerType.Headgear, originalLayers);

    if (
        face?.value === eightEyesBlack.displayName &&
        headgear?.value === headLamp.displayName
    )
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Headgear)
                ),
            ],
        };

    const nightVision = getAsset(
        'NIGHT VISION',
        LayerType.Face,
        originalLayers
    );

    const truckerHatBlack = getAsset(
        'TRUCKER HAT BLACK',
        LayerType.Hat,
        originalLayers
    );

    const threeWormFriends = [
        '3 WORM FRIENDS GREEN',
        '3 WORM FRIENDS BLUE',
        '3 WORM FRIENDS PINK',
        '3 WORM FRIENDS YELLOW',
    ].map((a) => getAsset(a, LayerType.Headgear, originalLayers));

    if (
        face?.value === nightVision.displayName &&
        hat &&
        hat.value !== truckerHatBlack.displayName
    )
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Hat)
                ),
            ],
        };

    if (
        face?.value === nightVision.displayName &&
        threeWormFriends
            .map((f) => f.displayName)
            .includes(headgear?.value || '____')
    )
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Headgear)
                ),
            ],
        };

    const gasMask = ['GAS MASK GREEN', 'GAS MASK GREY'].map((a) =>
        getAsset(a, LayerType.Face, originalLayers)
    );

    if (
        gasMask.map((f) => f.displayName).includes(face?.value || '___') &&
        headgear?.value === headLamp.displayName
    )
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Headgear)
                ),
            ],
        };

    const wormFriends = [
        '1 WORM FRIEND GREEN',
        '1 WORM FRIEND BLUE',
        '1 WORM FRIEND PINK',
        '1 WORM FRIEND YELLOW',
    ].map((a) => getAsset(a, LayerType.Headgear, originalLayers));

    const burglarFace = getAsset('BURGLAR', LayerType.Face, originalLayers);

    if (
        face?.value === burglarFace.displayName &&
        wormFriends.map((f) => f.displayName).includes(headgear?.value || '___')
    )
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Headgear)
                ),
            ],
        };

    let targetBodies = ['BLACK', 'BEAR BROWN', 'PURPLE', 'DARK BLUE'].map((b) =>
        getAsset(b, LayerType.Body, originalLayers)
    );
    let excludedFaces = [
        'OVAL EYES OPEN MOUTH',
        'OVAL EYES SILENT',
        'ARGUE',
    ].map((b) => getAsset(b, LayerType.Face, originalLayers));

    if (
        targetBodies.map((b) => b.displayName).includes(body.value) &&
        excludedFaces.map((f) => f.displayName).includes(face!.value)
    )
        return false;

    targetBodies = ['BLACK', 'BEAR BROWN', 'PURPLE'].map((b) =>
        getAsset(b, LayerType.Body, originalLayers)
    );
    let excludedHats = [
        'BEANIE BLUE',
        'COOL GLOW-SWEATBANDS',
        'ORANGE SWEAT',
    ].map((b) => getAsset(b, LayerType.Hat, originalLayers));

    if (
        targetBodies.map((b) => b.displayName).includes(body.value) &&
        excludedHats.map((f) => f.displayName).includes(hat?.value || '____')
    )
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Hat)
                ),
            ],
        };

    const bodyGear = getAttribute(NFT, LayerType['Body Gear']);

    const targetBodyGear = ['TAC VEST', 'TRACK GLOW', 'TRACK BLACK'].map((b) =>
        getAsset(b, LayerType['Body Gear'], originalLayers)
    );

    const excludedHandItems = originalLayers
        .find((l) => l.type === LayerType['Hand Item'])!
        .assets.filter((a) => a.displayName.includes('NUNCHUCKS'))
        .map((b) =>
            getAsset(b.displayName, LayerType['Hand Item'], originalLayers)
        );

    if (
        targetBodyGear
            .map((b) => b.displayName)
            .includes(bodyGear?.value || '____') &&
        excludedHandItems
            .map((f) => f.displayName)
            .includes(hat?.value || '____')
    )
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType['Hand Item'])
                ),
            ],
        };

    const targetHeadgear = ['BUG ANTENNAE GLOW', 'ANGLER', 'HEADLAMP'].map(
        (b) => getAsset(b, LayerType.Headgear, originalLayers)
    );
    excludedFaces = originalLayers
        .find((l) => l.type === LayerType.Face)!
        .assets.filter((a) => a.displayName.includes('SOLID BEAM'))
        .map((b) => getAsset(b.displayName, LayerType.Face, originalLayers));

    if (
        targetHeadgear
            .map((b) => b.displayName)
            .includes(headgear?.value || '____') &&
        excludedFaces.map((f) => f.displayName).includes(face?.value || '____')
    )
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Headgear)
                ),
            ],
        };

    const foreground = getAttribute(NFT, LayerType.Foreground);
    const solidBeamFace = originalLayers
        .find((l) => l.type === LayerType.Face)!
        .assets.filter((a) => a.displayName.includes('SOLID BEAM'))
        .map((b) => getAsset(b.displayName, LayerType.Face, originalLayers));

    if (
        foreground &&
        solidBeamFace.map((f) => f.displayName).includes(face?.value || '____')
    )
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Foreground)
                ),
            ],
        };

    targetBodies = ['BLACK', 'PURPLE'].map((b) =>
        getAsset(b, LayerType.Body, originalLayers)
    );

    excludedHats = ['BEANIE BLUE', 'COOL GLOW-SWEATBANDS'].map((b) =>
        getAsset(b, LayerType.Hat, originalLayers)
    );

    excludedFaces = [
        'OVAL EYES OPEN MOUTH',
        'ARGUE',
        'OVAL EYES SILENT',
        ...originalLayers
            .find((l) => l.type === LayerType.Face)!
            .assets.filter((a) => a.displayName.includes('LEFT EYE'))
            .map((f) => f.displayName),
    ].map((f) => getAsset(f, LayerType.Face, originalLayers));

    if (
        targetBodies.map((b) => b.displayName).includes(body.value) &&
        excludedHats.map((f) => f.displayName).includes(hat?.value || '____')
    )
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Hat)
                ),
            ],
        };

    if (
        targetBodies.map((b) => b.displayName).includes(body.value) &&
        excludedFaces.map((f) => f.displayName).includes(face?.value || '____')
    )
        return false;

    const extra = getAttribute(NFT, LayerType.Extra);
    const includedBodyGear = ['TAC VEST', 'TAC HOODIE', undefined].map((a) =>
        a ? getAsset(a, LayerType['Body Gear'], originalLayers) : undefined
    );

    if (
        extra &&
        !includedBodyGear.map((n) => n?.displayName).includes(bodyGear?.value)
    )
        NFT = {
            ...NFT,
            attributes: [
                ...NFT.attributes.filter(
                    (a) => a.trait_type !== String(LayerType.Extra)
                ),
            ],
        };

    const requiredFaces = ['KITT-Y', 'HAL'].map((a) =>
        getAsset(a, LayerType.Face, originalLayers)
    );
    const requiredBody = ['BLACK'].map((b) =>
        getAsset(b, LayerType.Body, originalLayers)
    );

    const greyGills = getAsset('GREY', LayerType.Gills, originalLayers);
    const gills = getAttribute(NFT, LayerType.Gills);

    if (
        gills?.value === greyGills.displayName &&
        (!requiredBody.map((b) => b.displayName).includes(body.value) ||
            !requiredFaces
                .map((f) => f.displayName)
                .includes(face?.value || '____'))
    )
        return false;

    return NFT;
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

        const path = `${ASSETDIR}/${layerName.toUpperCase()}`;
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

                const valid = isValid(NFT, i, NFTs, originalLayers);
                if (valid) {
                    NFT = valid;
                    break;
                }
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

            // // gets new rarity percentages
            // layers = updateRarities(
            //     originalLayers,
            //     occurances,
            //     mintQuanitity,
            //     numGenerated
            // );
            console.log(`Generated token metadata for id: ${i}`);
        } else {
            NFT = {
                ...oneOfOne,
                image: 'placeholder',
                name: `${NFTName} #${i}`,
            };
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
                .toFile(`${IMAGEOUTDIR}/${i}.png`)
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

export const regenerateImages = (
    meta: ERC721Meta[],
    outDir: string,
    max?: number
) => {
    const starter = buildStarterMeta();

    meta.slice(0, max).forEach((m) => {
        const id = Number(m.name.replace(/[^0-9]/g, '').trim());
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
            console.log(`Generating token image for id: ${id}`);
            const image = compileImages(paths);
            image
                .toFile(`${outDir}/${id}.webp`)
                .then(() => console.log(`Generated image for token id: ${id}`))
                .catch((e) => {
                    console.error(
                        `Failed to generate image for token id: ${id}`,
                        e
                    );
                    process.exit(1);
                });
        };

        build();
    });
};

/**
 * Adds the url and hides data (if placeholder) to the given meta.
 * @param meta the source metadata
 * @param baseURL the base uri of the meta's images (no trailing slash)
 * @param imageExt the ext of the images (without the period)
 * @param placeholder if the attributes should be hidden
 * @returns new meta
 */
export const generateFinalizedMeta = (
    meta: ERC721Meta[],
    baseURL: string,
    imageExt: string,
    placeholder?: boolean,
    nameMapper?: (index: number, currentName: string) => string
): ERC721Meta[] => {
    if (placeholder) {
        return meta.map((m, i) => ({
            name: nameMapper ? nameMapper(i, m.name) : m.name,
            description: m.description,
            attributes: [],
            image: baseURL,
        }));
    }

    return meta.map((m, i) => ({
        ...m,
        name: nameMapper ? nameMapper(i, m.name) : m.name,
        image: `${baseURL}/${i + 1}.${imageExt}`,
        attributes: m.attributes.map((a) => ({
            ...a,
            trait_type: transform(a.trait_type.toLowerCase(), toTitleCase),
            value: transform(a.value.toLowerCase(), toTitleCase),
        })),
    }));
};
