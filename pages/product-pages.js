const generateProductUrl = (seller, game, rawProductName) => {
    if (!rawProductName) return "#";

    const amountMatch = rawProductName.match(/\d+/);
    const amount = amountMatch ? amountMatch[0] : '';

    if (seller === "bynogame" && game === "PUBG Mobile") {
        return `https://www.bynogame.com/en/games/pubg/pubg-mobile-uc/${amount}-pubg-id-mobile-uc`;
    }
    if (seller === "joyalisveris" && game === "PUBG Mobile") {
        return `https://www.joyalisveris.com/pubg-mobile-${amount}-uc`;
    }
    if (seller === "sonteklif" && game === "PUBG Mobile" && rawProductName.includes("325 UC")) {
        return `https://www.sonteklif.com/pubg-325-uc-tr-id-p-232`;
    } else if (seller === "sonteklif" && game === "PUBG Mobile" && rawProductName.includes("60 UC")) {
        return `https://www.sonteklif.com/pubg-60-uc-tr-id-p-231`;
    }
    // Add more manual entries as needed

    if (seller === "dijipin" && game === "PUBG Mobile" && rawProductName.includes("325 UC")) {
        return `https://www.dijipin.com/pubg-325-uc-tr-id-p-232`;
    } else if (seller === "sonteklif" && game === "PUBG Mobile" && rawProductName.includes("60 UC")) {
        return `https://www.dijipin.com/pubg-60-uc-tr-id-p-231`;
    }

    if (seller === "epindigital" && game === "PUBG Mobile" && rawProductName.includes("325 UC")) {
        return `https://www.epindigital.com/pubg-325-uc-tr-id-p-232`;
    } else if (seller === "sonteklif" && game === "PUBG Mobile" && rawProductName.includes("60 UC")) {
        return `https://www.epindigital.com/pubg-60-uc-tr-id-p-231`;
    }

    if (seller === "dnzgame" && game === "PUBG Mobile") {
        const amountMatch = rawProductName.match(/\d+/);
        const amount = amountMatch ? amountMatch[0] : '';
        return `https://www.dnzgame.com/game/pubg-mobile/hizli-id-yukleme-tr/pubg-mobile-${amount}-uc`;
    }
    
    
    // Add more conditions for other sellers and games as needed
    return "#";
};
