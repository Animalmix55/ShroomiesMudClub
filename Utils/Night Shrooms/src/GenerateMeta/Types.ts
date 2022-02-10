export enum LayerType {
    Background = 'Background',
    Texture = 'Texture',
    Gills = 'Gills',
    Body = 'Body',
    'Body Spots' = 'Body Spots',
    'Head Spots' = 'Head Spots',
    'Top Spots' = 'Top Spots',
    Extra = 'Extra',
    'Body Gear' = 'Body Gear',
    Face = 'Face',
    Headgear = 'Headgear',
    Hat = 'Hat',
    Foreground = 'Foreground',
    'Hand Item' = 'Hand Item',
}

export const LayerTypes = [
    LayerType.Background,
    LayerType.Texture,
    LayerType.Gills,
    LayerType.Body,
    LayerType['Body Spots'],
    LayerType['Head Spots'],
    LayerType['Top Spots'],
    LayerType.Extra,
    LayerType['Body Gear'],
    LayerType.Face,
    LayerType.Headgear,
    LayerType.Hat,
    LayerType.Foreground,
    LayerType['Hand Item'],
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

export interface ERC721Attribute {
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
