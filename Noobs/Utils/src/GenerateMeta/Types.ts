export enum LayerType {
    Background = 'Background',
    Texture = 'Texture',
    Pinheads = 'Pinheads',
    Body = 'Body',
    Eyes = 'Eyes',
    Headwear = 'Headwear',
    Accessory = 'Accessory',
}

export const LayerTypes = [
    LayerType.Background,
    LayerType.Texture,
    LayerType.Pinheads,
    LayerType.Body,
    LayerType.Eyes,
    LayerType.Headwear,
    LayerType.Accessory,
];

export const AttributeOrder = LayerTypes;

if (LayerTypes.length !== AttributeOrder.length) {
    console.error('Invalid order versus types specified');
    process.exit();
}

export interface Asset {
    layer: LayerType;
    filePath: string;
    rarityPercent: number;
    displayName: string;
}

export interface Layer {
    type: LayerType;
    assets: Asset[];
}

export interface ConfigurationMeta {
    layers: Layer[];
}

interface ERC721Attribute {
    trait_type: string;
    value: string;
    /**
     * Special formatting in opensea.
     * @see https://docs.opensea.io/docs/metadata-standards
     */
    display_type?: 'number' | 'boost_percentage' | 'boost_number';
}

export interface ERC721Meta {
    description?: string;
    external_url?: string;
    image: string;
    name: string;
    attributes: ERC721Attribute[];
}
