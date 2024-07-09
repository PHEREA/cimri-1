import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const Home = () => {
    const [data, setData] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(true); 
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [tooltip, setTooltip] = useState({ visible: false, text: '', top: 0, left: 0 });

    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios('/api/products');
            setData(result.data);
            setRandomProduct(result.data);
        };
        fetchData();
    }, []);

    const setRandomProduct = (products) => {
        if (products.length > 0) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            setSelectedGame(randomProduct.Game);
            setSelectedProduct(randomProduct['Product Name']);
        }
    };

    const setRandomProductForGame = (game) => {
        const gameProducts = data.filter(item => item.Game === game);
        if (gameProducts.length > 0) {
            const randomProduct = gameProducts[Math.floor(Math.random() * gameProducts.length)];
            setSelectedProduct(randomProduct['Product Name']);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories((prevCategories) => 
            prevCategories.includes(category)
                ? prevCategories.filter((c) => c !== category)
                : [...prevCategories, category]
        );
    };

    const handleGameChange = (game) => {
        setSelectedGame(game);
        if (game === "Metin2") {
            setSelectedCategories(["EPIN", "EP", "EMERALD"]);
        } else {
            setSelectedCategories(["GOLD", "CASH", "PREMIUM"]);
        }
        setRandomProductForGame(game);
    };

    const handleMouseEnter = (e, text) => {
        const rect = e.target.getBoundingClientRect();
        setTooltip({
            visible: true,
            text: text,
            top: rect.top + window.scrollY + 12,
            left: rect.right + window.scrollX + 10 // Adjusted positioning
        });
    };
    
    const handleMouseLeave = () => {
        setTooltip({ visible: false, text: '', top: 0, left: 0 });
    };

    const games = useMemo(() => {
        return [...new Set(data.map(item => item.Game))]
            .filter(Boolean) 
            .sort((a, b) => {
                const order = [
                    "Rise Online",
                    "Knight Online",
                    "Metin2",
                    "PUBG Mobile",
                    "Valorant",
                    "League of Legends",
                    "Mobile Legends",
                    "Clash of Clans",
                    "Brawl Stars",
                    "Black Desert Online"
                ];
                return order.indexOf(a) - order.indexOf(b);
            });
    }, [data]);

    const parseAmount = (productName) => {
        if (!productName) return 0;
        const match = productName.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    };

    const riseOnlineCategories = {
        GOLD: ["Galia 1M", "Mantis 1M", "Aarvad 1M"],
        CASH: ["1020 CASH", "10500 CASH", "2050 CASH", "3090 CASH", "4140 CASH", "500 CASH", "5200 CASH"],
        PREMIUM: ["Complete Premium", "Farm Premium", "XP Premium", "Battle Premium", "Elite Premium"]
    };

    const knightOnlineCategories = {
        GOLD: product => product.endsWith('M') || product.endsWith('GB'),
        CASH: product => product.toLowerCase().endsWith('cash'),
        PREMIUM: product => product.toLowerCase().endsWith('premium')
    };

    const metin2Categories = {
        EPIN: ["9 TL E-PIN", "18 TL E-PIN", "45 TL E-PIN", "90 TL E-PIN", "450 TL E-PIN"],
        EP: ["30 EP", "60 EP", "180 EP", "450 EP", "1275 EP", "3000 EP"],
        EMERALD: ["30 GÜN EMERALD", "90 GÜN EMERALD", "180 GÜN EMERALD"],
    };

    const sortRiseOnlineProducts = (products) => {
        const customOrder = [
            "Galia 1M",
            "Mantis 1M",
            "Aarvad 1M",
            "Complete Premium",
            "Farm Premium",
            "XP Premium",
            "Battle Premium",
            "Elite Premium"
        ];

        const sortedProducts = products.sort((a, b) => {
            const aIndex = customOrder.indexOf(a);
            const bIndex = customOrder.indexOf(b);
            if (aIndex === -1 && bIndex === -1) {
                return a.localeCompare(b); 
            }
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            return aIndex - bIndex;
        });

        return sortedProducts;
    };

    const products = useMemo(() => {
        if (!selectedGame) return [];
        let filteredProducts = data
            .filter(item => item.Game === selectedGame)
            .map(item => item['Product Name'])
            .filter((value, index, self) => value && self.indexOf(value) === index && value !== "N/A");

        if (selectedGame === "Rise Online") {
            filteredProducts = filteredProducts.filter(product =>
                selectedCategories.some(category => riseOnlineCategories[category].includes(product))
            );
        } else if (selectedGame === "Knight Online") {
            filteredProducts = filteredProducts.filter(product =>
                selectedCategories.some(category => knightOnlineCategories[category](product))
            );
        } else if (selectedGame === "Metin2") {
            filteredProducts = filteredProducts.filter(product =>
                selectedCategories.some(category => Array.isArray(metin2Categories[category]) && metin2Categories[category].includes(product))
            );
        } else {
            filteredProducts.sort((a, b) => parseAmount(a) - parseAmount(b));
        }

        return filteredProducts;
    }, [selectedGame, selectedCategories, data]);

    const groupProductsByCategory = (products, categories) => {
        const goldProducts = Array.isArray(categories.GOLD)
            ? products.filter(product => categories.GOLD.some(g => product.includes(g)))
            : products.filter(product => categories.GOLD ? categories.GOLD(product) : false);

        const premiumProducts = Array.isArray(categories.PREMIUM)
            ? products.filter(product => categories.PREMIUM.some(p => product.includes(p)))
            : products.filter(product => categories.PREMIUM ? categories.PREMIUM(product) : false);

        const cashProducts = Array.isArray(categories.CASH)
            ? products.filter(product => categories.CASH.some(c => product.includes(c)))
            : products.filter(product => categories.CASH ? categories.CASH(product) : false)
                .sort((a, b) => {
                    const amountA = parseInt(a.match(/\d+/)[0]);
                    const amountB = parseInt(b.match(/\d+/)[0]);
                    return amountA - amountB;
                });

        const epinProducts = Array.isArray(categories.EPIN)
            ? products.filter(product => categories.EPIN.some(e => product.includes(e)))
            : products.filter(product => categories.EPIN ? categories.EPIN(product) : false);

        const epProducts = Array.isArray(categories.EP)
            ? products.filter(product => categories.EP.some(e => product.includes(e)))
            : products.filter(product => categories.EP ? categories.EP(product) : false);

        const emeraldProducts = Array.isArray(categories.EMERALD)
            ? products.filter(product => categories.EMERALD.some(e => product.includes(e)))
            : products.filter(product => categories.EMERALD ? categories.EMERALD(product) : false);

        return {
            gold: goldProducts,
            premium: premiumProducts,
            cash: cashProducts,
            epin: epinProducts,
            ep: epProducts,
            emerald: emeraldProducts
        };
    };

    const groupedProducts = useMemo(() => {
        if (selectedGame === "Rise Online") {
            return groupProductsByCategory(products, riseOnlineCategories);
        } else if (selectedGame === "Knight Online") {
            return groupProductsByCategory(products, knightOnlineCategories);
        } else if (selectedGame === "Metin2") {
            return groupProductsByCategory(products, metin2Categories);
        } else {
            return { gold: [], premium: [], cash: [], epin: [], ep: [], emerald: [] };
        }
    }, [products, selectedGame]);

    const filteredData = useMemo(() => {
        if (!selectedGame || !selectedProduct) return [];

        const filtered = data.filter(
            item =>
                item.Game === selectedGame &&
                item['Product Name'] === selectedProduct
        );

        const lowestSellPriceItem = filtered.reduce((lowest, item) => {
            if (lowest === null || item['Sell Price'] < lowest['Sell Price']) {
                return item;
            }
            return lowest;
        }, null);

        const highestBuyPriceItem = filtered.reduce((highest, item) => {
            if (highest === null || (item['Buy Price'] !== null && item['Buy Price'] > highest['Buy Price'])) {
                return item;
            }
            return highest;
        }, null);

        return filtered.map(item => ({
            ...item,
            isLowestSell: item === lowestSellPriceItem,
            isHighestBuy: item === highestBuyPriceItem,
        })).sort((a, b) => {
            const aPrice = parseFloat(a['Sell Price'].replace(/[^\d.-]/g, ''));
            const bPrice = parseFloat(b['Sell Price'].replace(/[^\d.-]/g, ''));
            return aPrice - bPrice;
        });
    }, [selectedGame, selectedProduct, data]);

    const totalProducts = data.length;
    const vendorNumber = new Set(data.map(item => item.Seller)).size;
    const gameCategoryNumber = games.length;

    const NewTabIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
            <path fill="currentColor" d="M14 2h7v7h-2V4.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V2zm4 15v4H5V5h4V3H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2v-4h-2z"/>
        </svg>
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [currentPage, filteredData]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Determine if there are any buy prices in the filtered data
    const hasBuyPrices = filteredData.some(item => item['Buy Price'] && item['Buy Price'] !== '-');

    const averageSellPrice = useMemo(() => {
        if (!filteredData.length) return 0;
        const total = filteredData.reduce((sum, item) => sum + parseFloat(item['Sell Price'].replace(/[^\d.-]/g, '')), 0);
        return (total / filteredData.length).toFixed(2);
    }, [filteredData]);

    return (
        <div className="container">
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <a href="https://www.oyuneks.com/" target="_blank" rel="noopener noreferrer">
                            <img src="/images/oyuneks-ad.jpg" alt="Instagram Ad" style={{ width: '100%', height: 'auto' }} />
                        </a>
                        <button onClick={() => setShowModal(false)}>Kapat</button>
                    </div>
                </div>
            )} 
            <header>
                <a href="http://localhost:3000/">
                    <img src="/images/cimri-pin-logo.png" alt="Cimri Pin Logo" className="logo" />
                </a>
                <p className="by-oyuneks">by Oyuneks</p>
            </header>
            <main>
                <h3><span className="highlight">{`${vendorNumber}`}</span> satıcıdan <span className="highlight">{`${gameCategoryNumber}`}</span> oyuna dair, <span className="highlight">{`${totalProducts}`}</span> ürünün fiyatını canlı takip et!</h3>

                <div className="games">
                    {games.map((game, index) => (
                        <button
                            key={index}
                            className={`game-button ${selectedGame === game ? 'selected' : ''}`}
                            onClick={() => handleGameChange(game)}
                        >
                            <img src={`/images/game-icons/${game.toLowerCase().replace(/\s/g, '-')}.webp`} alt={game} />
                        </button>
                    ))}
                </div>
                {selectedGame && (
                    <>
                        <h2><span className="selected-game">{selectedGame}</span> oyununa dair fiyatlar...</h2>
                        {selectedGame === "Rise Online" && (
                            <div className="category-filters">
                                {Object.keys(riseOnlineCategories).map((category, index) => (
                                    <label key={index} className="switch">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                        />
                                        <span className="slider"></span>
                                        <span>{category}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        {selectedGame === "Knight Online" && (
                            <div className="category-filters">
                                {Object.keys(knightOnlineCategories).map((category, index) => (
                                    <label key={index} className="switch">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                        />
                                        <span className="slider"></span>
                                        <span>{category}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        {selectedGame === "Metin2" && (
                            <div className="category-filters">
                                {Object.keys(metin2Categories).map((category, index) => (
                                    <label key={index} className="switch">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => handleCategoryChange(category)}
                                        />
                                        <span className="slider"></span>
                                        <span>{category}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </>
                )}
             <div className="products-container">
    {selectedGame === "Rise Online" || selectedGame === "Knight Online" || selectedGame === "Metin2" ? (
        <div className="product-categories">
            {selectedGame !== "Metin2" && selectedCategories.length > 0 && (
                <>
                    {selectedCategories.includes("GOLD") && (
                        <div className="product-category">
                            <h4>GOLD</h4>
                            <div className="products">
                                {groupedProducts.gold.map((product, index) => (
                                    <button
                                        key={index}
                                        className={`product-button ${selectedProduct === product ? 'selected' : ''}`}
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        {product}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedCategories.includes("PREMIUM") && (
                        <div className="product-category">
                            <h4>PREMIUM</h4>
                            <div className="products">
                                {groupedProducts.premium.map((product, index) => (
                                    <button
                                        key={index}
                                        className={`product-button ${selectedProduct === product ? 'selected' : ''}`}
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        {product}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedCategories.includes("CASH") && (
                        <div className="product-category">
                            <h4>CASH</h4>
                            <div className="products">
                                {groupedProducts.cash.map((product, index) => (
                                    <button
                                        key={index}
                                        className={`product-button ${selectedProduct === product ? 'selected' : ''}`}
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        {product}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
            {selectedGame === "Metin2" && selectedCategories.length > 0 && (
                <>
                    {selectedCategories.includes("EPIN") && (
                        <div className="product-category">
                            <h4>E-PIN</h4>
                            <div className="products">
                                {groupedProducts.epin.map((product, index) => (
                                    <button
                                        key={index}
                                        className={`product-button ${selectedProduct === product ? 'selected' : ''}`}
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        {product}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedCategories.includes("EP") && (
                        <div className="product-category">
                            <h4>EP</h4>
                            <div className="products">
                                {groupedProducts.ep.map((product, index) => (
                                    <button
                                        key={index}
                                        className={`product-button ${selectedProduct === product ? 'selected' : ''}`}
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        {product}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {selectedCategories.includes("EMERALD") && (
                        <div className="product-category">
                            <h4>EMERALD</h4>
                            <div className="products">
                                {groupedProducts.emerald.map((product, index) => (
                                    <button
                                        key={index}
                                        className={`product-button ${selectedProduct === product ? 'selected' : ''}`}
                                        onClick={() => setSelectedProduct(product)}
                                    >
                                        {product}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    ) : (
        <div className="products">
            {products.map((product, index) => (
                <button
                    key={index}
                    className={`product-button ${selectedProduct === product ? 'selected' : ''}`}
                    onClick={() => setSelectedProduct(product)}
                >
                    {product}
                </button>
            ))}
        </div>
    )}
</div>


                <table key={`${selectedGame}-${selectedProduct}`} className="price-table">
                    <thead>
                        <tr>
                            <th>Satıcı</th>
                            <th>Satış Fiyatı (Ortalama {averageSellPrice} ₺)</th>
                            {hasBuyPrices && <th>Alış Fiyatı</th>}
                        </tr>
                    </thead>
                    <tbody>
    {paginatedData.map((item, index) => (
        <tr
            key={index}
            className={`${index % 2 === 0 ? 'even-row' : 'odd-row'}`}
            onMouseEnter={() => setHoveredRow(index)}
            onMouseLeave={() => setHoveredRow(null)}
        >
            <td>
                <a href={item['Product URL'] || item['url']}
 target="_blank" rel="noopener noreferrer">
                    <img src={`/images/seller-logos/${item.Seller}.png`} alt={item.Seller} className="seller-logo" />
                </a>
            </td>
            <td style={{ position: 'relative' }}>
                <a
                    className={`price-shadow ${item.isLowestSell ? 'highlight-lowest-sell' : ''}`}
                    href={item['Product URL']}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                    onMouseEnter={(e) => handleMouseEnter(e, 'Ürüne gitmek için tıklayınız...')}
                    onMouseLeave={handleMouseLeave}
                >
                    {item['Sell Price']}&nbsp;
                    <span className={item.isLowestSell ? 'highlight-lowest-sell' : ''}>
                        <NewTabIcon />
                    </span>
                </a>
            </td>
            {hasBuyPrices && (
                <td style={{ position: 'relative' }}>
                    <span
                        className={item.isHighestBuy ? 'highlight-highest-buy' : ''}
                        onMouseEnter={(e) => handleMouseEnter(e, 'Ürüne gitmek için tıklayınız...')}
                        onMouseLeave={handleMouseLeave}
                    >
                        {item['Buy Price'] || '-'}
                    </span>
                </td>
            )}
        </tr>
    ))}
</tbody>

                </table>
                
                <div className="pagination">
                    {[...Array(totalPages).keys()].map(page => (
                        <button
                            key={page}
                            className={`page-button ${currentPage === page + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            {page + 1}
                        </button>
                    ))}
                </div>
            </main>
            <footer>
                <a href="https://www.oyuneks.com/" target="_blank" rel="noopener noreferrer">
                    <img src="/images/oyuneks-logo-dark.png" alt="Oyuneks Logo" />
                </a>
                <p>© 2024 Tüm hakları saklıdır.</p>
            </footer>

            {tooltip.visible && (
                <div
                    className="tooltip"
                    style={{
                        top: tooltip.top,
                        left: tooltip.left
                    }}
                >
                    {tooltip.text}
                </div>
            )}
        </div>
    );
}

export default Home;
