import fs from 'fs';
import {
    generateERC721Metadata,
    generateFinalizedMeta,
} from './GenerateMeta/GenerateMeta';
import { ERC721Meta } from './GenerateMeta/Types';

generateERC721Metadata(888, 'Night Shroom', undefined, false);

// const meta = JSON.parse(
//     fs
//         .readFileSync(
//             'C:/Users/Cory/source/repos/ShroomiesMudClub/Utils/Night Shrooms/src/Assets/ConfigurationMeta/tokenMeta_19.json'
//         )
//         .toString()
// ) as ERC721Meta[];

// const finalizedMeta = generateFinalizedMeta(
//     meta,
//     'placeholder',
//     'placeholder',
//     false
// );

// finalizedMeta.forEach((m, i) => {
//     fs.writeFileSync(
//         `C:/Users/Cory/source/repos/ShroomiesMudClub/Utils/Night Shrooms/src/Assets/FinalizedMeta/${
//             i + 1
//         }`,
//         JSON.stringify(m, null, 4)
//     );
// });
