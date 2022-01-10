import { ERC721Meta, LayerType } from './Types';

interface OneOfOnes {
    [tokenId: number]: Omit<Omit<ERC721Meta, 'image'>, 'name'>;
}

const generateOneOfOne = (
    bg: string,
    texture: string | undefined,
    gills: string,
    bodySpots: string | undefined,
    headSpots: string | undefined,
    bodyGear: string | undefined,
    face: string,
    headGear: string | undefined,
    hat: string | undefined,
    foreground: string | undefined,
    extra: string | undefined
): OneOfOnes[number] => ({
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
        {
            trait_type: String(LayerType.Gills),
            value: gills,
        },
        ...(bodySpots
            ? [
                  {
                      trait_type: String(LayerType['Body Spots']),
                      value: bodySpots,
                  },
              ]
            : []),
        ...(headSpots
            ? [
                  {
                      trait_type: String(LayerType['Head Spots']),
                      value: headSpots,
                  },
              ]
            : []),
        ...(bodyGear
            ? [
                  {
                      trait_type: String(LayerType['Body Gear']),
                      value: bodyGear,
                  },
              ]
            : []),
        {
            trait_type: String(LayerType.Face),
            value: face,
        },
        ...(headGear
            ? [
                  {
                      trait_type: String(LayerType.Headgear),
                      value: headGear,
                  },
              ]
            : []),
        ...(hat
            ? [
                  {
                      trait_type: String(LayerType.Hat),
                      value: hat,
                  },
              ]
            : []),
        ...(foreground
            ? [
                  {
                      trait_type: String(LayerType.Foreground),
                      value: foreground,
                  },
              ]
            : []),
        ...(extra
            ? [
                  {
                      trait_type: String(LayerType.Extra),
                      value: extra,
                  },
              ]
            : []),
    ],
});

export const getOneOfOnes = (): OneOfOnes => {
    return {};
};

export default getOneOfOnes;
