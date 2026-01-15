import { XMLParser } from 'fast-xml-parser';
import prisma from '@/lib/db';

interface InviaTour {
    tour_id: string;
    tour_title: string;
    hotel?: {
        '#text': string;
        '@_hotel_kat'?: string;
    };
    destinace?: {
        zeme?: {
            '@_name': string;
            lokalita?: {
                '@_name': string;
            }[] | { '@_name': string };
        }[] | { '@_name': string };
    };
    popisy?: {
        popis: { '#text': string, '@_name': string }[];
    };
    fotky?: {
        fotka: { '@_url': string }[];
    };
    term_group?: {
        term?: {
            '@_id': string; // unique term id if available
            cena?: { '#text': number }; // Simplified for now, real XML might vary
            date_start?: string;
            date_end?: string;
        }[];
        strava?: { '@_name': string };
        doprava?: { '@_name': string };
    }[];
}

export async function parseAndImportInviaXML(xmlContent: string) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_"
    });

    const jsonObj = parser.parse(xmlContent);
    const tours = jsonObj.zajezdy?.zajezd;

    if (!tours) {
        console.log("No tours found in XML");
        return { count: 0, errors: ["Invalid XML structure"] };
    }

    const toursArray = Array.isArray(tours) ? tours : [tours];
    let count = 0;

    for (const tour of toursArray) {
        try {
            // Extract basic info
            const title = tour.tour_title;
            const hotelName = tour.hotel?.['#text'] || '';
            const stars = tour.hotel?.['@_hotel_kat'] || '';

            // Extract destination (simplified logic)
            let destination = "Neznámá destinace";
            if (tour.destinace?.zeme) {
                const zeme = Array.isArray(tour.destinace.zeme) ? tour.destinace.zeme[0] : tour.destinace.zeme;
                destination = zeme['@_name'];
                // Check if locality exists
                /* 
                if (zeme.lokalita) {
                    const lok = Array.isArray(zeme.lokalita) ? zeme.lokalita[0] : zeme.lokalita;
                    destination += `, ${lok['@_name']}`;
                }
                */
            }

            // Extract Description
            let description = "";
            if (tour.popisy?.popis) {
                const popisy = Array.isArray(tour.popisy.popis) ? tour.popisy.popis : [tour.popisy.popis];
                description = popisy.map((p: any) => `**${p['@_name']}**: ${p['#text']}`).join('\n\n');
            }

            // Extract Image
            let image = "";
            if (tour.fotky?.fotka) {
                const fotky = Array.isArray(tour.fotky.fotka) ? tour.fotky.fotka : [tour.fotky.fotka];
                if (fotky.length > 0) image = fotky[0]['@_url'];
            }

            // Extract Terms (This is tricky in Invia XML, logic greatly simplified here)
            // We usually look for the first valid term group
            // In a real implementation we would loop through all terms and create deals for each valid date

            // ... Mapping logic to be expanded as we see real price data structure ...

            // Placeholder for creating the deal
            /*
            await prisma.deal.upsert({
                where: { externalId: tour.tour_id },
                update: { ... },
                create: { ... }
            });
            */

            count++;

        } catch (e) {
            console.error(`Failed to parse tour ${tour.tour_id}:`, e);
        }
    }

    return { count, errors: [] };
}
