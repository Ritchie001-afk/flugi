
import prisma from '../lib/db';
import * as dotenv from 'dotenv';
dotenv.config();

async function seedAirport() {
    try {
        console.log("Seeding Airport PRG...");

        const content = `
## Jsi na letišti poprvé? Žádný stres! 😌

Letiště Václava Havla (starší název Ruzyně) není žádné bludiště. Tady je tvůj "tahák", jak to zvládnout v pohodě.

### 1. Na který terminál jdu? 🏢
To je to nejdůležitější. Koukni do letenky nebo na tabuli:
*   **Terminál 1 (T1):** Lety MIMO Schengenský prostor (např. **Londýn, Egypt, Turecko, USA, Dubaj**). Tady procházíš pasovou kontrolou (ukaž pas/občanku policistovi).
*   **Terminál 2 (T2):** Lety UVNITŘ Schengenu (většina EU - **Španělsko, Itálie, Řecko, Francie**). Tady pasová kontrola není, jdeš rovnou k bezpečnostní kontrole.

### 2. Jak probíhá odbavení (Check-in)? 🧳
*   **Mám jen batoh:** Nemusíš k přepážce! Udělej si check-in doma na mobilu, stáhni si palubní lístek (QR kód) a jdi rovnou k bezpečnostní kontrole.
*   **Mám velký kufr:** Najdi na tabuli "Check-in" pro svůj let (číslo přepážky, např. 120-130). Tam ukážeš pas, odevzdáš kufr a dostaneš palubní lístek.

### 3. Bezpečnostní kontrola (Security) 👮‍♂️
Tady se kontroluje, jestli nemáš zbraně nebo moc tekutin.
*   **Tekutiny:** Všechny krémy, voňavky, pasty musí být v lahvičkách do **100 ml** a všechny se musí vejít do jednoho průhledného sáčku (1 litr).
*   **Elektronika:** Notebook, tablet a powerbanku vyndej z batohu do bedýnky.
*   **Oblečení:** Sundej pásek, hodinky, bundu. Někdy chtějí i boty (pokud mají vysokou podrážku).

### 4. Jdeme k bráně (Gate) 🚪
Po kontrole jsi v "trychtýři"duty free obchodů. Nenech se zlákat a **najdi nejdřív svoji bránu (Gate)**. Číslo (např. C12) svítí na obrazovkách. K bráně doraz nejpozději **30 minut před odletem**.
        `;

        await prisma.airport.upsert({
            where: { iata: 'PRG' },
            create: {
                iata: 'PRG',
                name: 'Letiště Václava Havla Praha',
                city: 'Praha',
                country: 'Česká republika',
                content: content,
                facilities: ['Wi-Fi zdarma', 'Restaurace Runwway (levné jídlo)', 'Billa', 'Sprchy', 'Dětský koutek'],
                transport: [
                    JSON.stringify({
                        type: 'bus',
                        name: 'Trolejbus 59',
                        price: '30 Kč (Lítačka)',
                        duration: '17 min',
                        description: 'Nejrychlejší spojení na metro A (Nádraží Veleslavín). Jezdí každých pár minut.'
                    }),
                    JSON.stringify({
                        type: 'bus',
                        name: 'Autobus 100',
                        price: '30 Kč',
                        duration: '18 min',
                        description: 'Spojení na metro B (Zličín). Ideální, pokud jedeš na západ Prahy.'
                    }),
                    JSON.stringify({
                        type: 'train',
                        name: 'AE (Airport Express)',
                        price: '100 Kč',
                        duration: '40 min',
                        description: 'Přímý autobus na Hlavní nádraží. Neplatí zde Lítačka, lístek koupíš u řidiče.'
                    }),
                    JSON.stringify({
                        type: 'taxi',
                        name: 'Uber Airport',
                        price: 'cca 450-600 Kč',
                        duration: '30 min',
                        description: 'Oficiální partner letiště. Objednáš v aplikaci nebo v kiosku v příletové hale.'
                    })
                ]
            },
            update: {
                content: content,
                facilities: ['Wi-Fi zdarma', 'Restaurace Runwway (levné jídlo)', 'Billa', 'Sprchy', 'Dětský koutek'],
                transport: [
                    JSON.stringify({
                        type: 'bus',
                        name: 'Trolejbus 59',
                        price: '30 Kč (Lítačka)',
                        duration: '17 min',
                        description: 'Nejrychlejší spojení na metro A (Nádraží Veleslavín). Jezdí každých pár minut.'
                    }),
                    JSON.stringify({
                        type: 'bus',
                        name: 'Autobus 100',
                        price: '30 Kč',
                        duration: '18 min',
                        description: 'Spojení na metro B (Zličín). Ideální, pokud jedeš na západ Prahy.'
                    }),
                    JSON.stringify({
                        type: 'train',
                        name: 'AE (Airport Express)',
                        price: '100 Kč',
                        duration: '40 min',
                        description: 'Přímý autobus na Hlavní nádraží. Neplatí zde Lítačka, lístek koupíš u řidiče.'
                    }),
                    JSON.stringify({
                        type: 'taxi',
                        name: 'Uber Airport',
                        price: 'cca 450-600 Kč',
                        duration: '30 min',
                        description: 'Oficiální partner letiště. Objednáš v aplikaci nebo v kiosku v příletové hale.'
                    })
                ]
            }
        });

        console.log("Done.");
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

seedAirport();
