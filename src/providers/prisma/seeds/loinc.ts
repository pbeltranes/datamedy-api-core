// import fs from 'fs';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();
// const loincData = JSON.parse(fs.readFileSync('loinc_data.json', 'utf-8'));

// async function insertLOINC() {
//     for (const category in loincData) {
//         for (const item of loincData[category]) {
//             await prisma.observation.create({
//                 data: {
//                     code: item.code,
//                     description: item.description,
//                     unit: item.unit
//                 }
//             });
//         }
//     }
//     console.log("LOINC data inserted successfully!");
// }
