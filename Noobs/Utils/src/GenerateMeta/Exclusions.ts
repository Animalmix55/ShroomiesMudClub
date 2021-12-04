import { ERC721Meta, LayerType } from './Types';

export interface Exclusion {
    if: {
        type: LayerType;
        value: string;
    };
    exclude: { [type: string]: string[] };
}

export const Exclusions: Exclusion[] = [
    {
        if: {
            type: LayerType.Body,
            value: 'GOLDEN SCRUFFY',
        },
        exclude: {
            [String(LayerType.Eyes)]: [
                'CHEEZ',
                'BURGLAR',
                'LEFT EYE PINK',
                'LEFT EYE BLUE',
                'REPTILE PINK',
                'REPTILE BLUE',
                'SLEEPING',
                'SQUINT',
            ],
            [String(LayerType.Headwear)]: [
                'ANTS',
                'LADYBUG GOLD',
                'LADYBUG ORANGE',
                'LADYBUG RED',
                'LADYBUG PINK',
                'LADYBUG BLUE',
                'FLY BLUE',
                'FLY YELLOW',
                'FLY BLACK',
            ],
            [String(LayerType.Accessory)]: [
                'STAR BELLY GOLD',
                'STAR BELLY BLUE',
                'STAR BELLY ELECTRIC GREEN',
                'STAR BELLY ELECTRIC PINK',
            ],
        },
    },
    {
        if: {
            type: LayerType.Body,
            value: 'ELECTRIC GOLDEN SCRUFFY',
        },
        exclude: {
            [String(LayerType.Eyes)]: [
                'CHEEZ',
                'BURGLAR',
                'LEFT EYE PINK',
                'LEFT EYE BLUE',
                'REPTILE PINK',
                'REPTILE BLUE',
                'SLEEPING',
                'SQUINT',
            ],
            [String(LayerType.Headwear)]: [
                'ANTS',
                'LADYBUG GOLD',
                'LADYBUG ORANGE',
                'LADYBUG RED',
                'LADYBUG PINK',
                'LADYBUG BLUE',
                'FLY BLUE',
                'FLY YELLOW',
                'FLY BLACK',
            ],
            [String(LayerType.Accessory)]: [
                'STAR BELLY GOLD',
                'STAR BELLY BLUE',
                'STAR BELLY ELECTRIC GREEN',
                'STAR BELLY ELECTRIC PINK',
            ],
        },
    },
];

export const isExcluded = (NFT: ERC721Meta) => {
    return Exclusions.some((exclusion) => {
        const match = NFT.attributes.some(
            (a) =>
                a.trait_type === exclusion.if.type &&
                a.value === exclusion.if.value
        );

        if (!match) return false;
        return NFT.attributes.some((attribute) => {
            const excludeList = exclusion.exclude[attribute.trait_type];
            if (!excludeList) return false;

            return excludeList.some((ex) => ex === attribute.value);
        });
    });
};
