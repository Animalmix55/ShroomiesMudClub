import { ERC721Meta, LayerType } from './Types';

interface OneOfOnes {
    [tokenId: number]: Omit<ERC721Meta, 'image'>;
}

export const generateOneOfOne = (
    bg: string,
    texture: string | undefined,
    body: string,
    eyes: string,
    pinheads: string | undefined,
    headwear: string | undefined,
    accessory: string
): OneOfOnes[number] => ({
    name: 'Noob',
    attributes: [
        {
            trait_type: String(LayerType.Background),
            value: bg,
        },
        ...(texture
            ? [
                  {
                      trait_type: String(LayerType.Texture),
                      value: texture,
                  },
              ]
            : []),
        ...(pinheads
            ? [
                  {
                      trait_type: String(LayerType.Pinheads),
                      value: pinheads,
                  },
              ]
            : []),
        {
            trait_type: String(LayerType.Body),
            value: body,
        },
        {
            trait_type: String(LayerType.Eyes),
            value: eyes,
        },
        ...(headwear
            ? [
                  {
                      trait_type: String(LayerType.Headwear),
                      value: headwear,
                  },
              ]
            : []),
        ...(accessory
            ? [
                  {
                      trait_type: String(LayerType.Accessory),
                      value: accessory,
                  },
              ]
            : []),
    ],
});

export const getOneOfOnes = (): OneOfOnes => {
    return {};
};

export default getOneOfOnes;
