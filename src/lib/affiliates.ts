
export const AFFILIATE_LINKS = {
    booking: {
        name: "Booking.com",
        baseUrl: "https://www.booking.com/searchresults.html",
        logo: "/logos/booking.png", // We can add logos later
        description: "Najděte si perfektní ubytování v cílové destinaci.",
        cta: "Hledat hotely"
    },
    airbnb: {
        name: "Airbnb",
        baseUrl: "https://www.airbnb.cz/s",
        logo: "/logos/airbnb.png",
        description: "Ubytujte se u místních a zažijte destinaci autenticky.",
        cta: "Najít ubytování"
    },
    agoda: {
        name: "Agoda",
        baseUrl: "https://www.agoda.com/cs-cz/search",
        logo: "/logos/agoda.png",
        description: "Najděte si perfektní ubytování za nejlepší ceny.",
        cta: "Najít ubytování"
    },
    rentalcars: {
        name: "Rentalcars",
        baseUrl: "https://www.rentalcars.com",
        logo: "/logos/rentalcars.png",
        description: "Půjčte si auto a prozkoumejte okolí na vlastní pěst.",
        cta: "Porovnat ceny aut"
    }
};

export const getBookingUrl = (destination: string) => {
    const query = encodeURIComponent(destination);
    // This is a basic search URL. Real affiliate link would have AID parameters.
    return `${AFFILIATE_LINKS.booking.baseUrl}?ss=${query}`;
};

export const getAirbnbUrl = (destination: string) => {
    const query = encodeURIComponent(destination);
    return `${AFFILIATE_LINKS.airbnb.baseUrl}/${query}/homes`;
};

export const getAgodaUrl = (destination: string, checkIn?: Date | string | null, checkOut?: Date | string | null) => {
    const baseUrl = AFFILIATE_LINKS.agoda.baseUrl;
    let url = `${baseUrl}?text=${encodeURIComponent(destination)}`;

    if (checkIn) {
        const checkInDate = typeof checkIn === 'string' ? new Date(checkIn) : checkIn;
        if (!isNaN(checkInDate.getTime())) {
            url += `&checkIn=${checkInDate.toISOString().split('T')[0]}`;
        }
    }

    if (checkOut) {
        const checkOutDate = typeof checkOut === 'string' ? new Date(checkOut) : checkOut;
        if (!isNaN(checkOutDate.getTime())) {
            url += `&checkOut=${checkOutDate.toISOString().split('T')[0]}`;
        }
    }

    return url;
};

export const getRentalcarsUrl = (destination?: string | null) => {
    const baseUrl = AFFILIATE_LINKS.rentalcars.baseUrl;
    if (destination) {
        return `${baseUrl}?preflang=cs&location=${encodeURIComponent(destination)}`;
    }
    // Rentalcars generic link for now, detail search is harder to construct without dates/coords
    return baseUrl;
};
