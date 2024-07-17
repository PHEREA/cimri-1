import Header from '@/src/components/Header'
import React from 'react'

export default function login() {
    return (
        <div className='container mx-auto'>
            <Header />
            <div className='favbox'>
                <div className='favTitle text-left columns-2'>
                    <label for="title" className=''>Favorilerim</label>
                </div>
                <div className='favTitle text-right h8'>
                    <label for="title" className=''>Listeyi Boşalt</label>
                </div>
                <div id="horizontal-line"></div>

                <div id="anadiv" className='grid grid-cols-4 gap-4'>
                    <div>
                        <div className='productListWrapper'>
                            <div className='productWrapper'>
                                <div className='productListImageWrapper'>
                                    <img src='https://www.vhv.rs/dpng/d/17-179454_pubg-uc-png-transparent-png.png' className='productListImage' />
                                    <a className='productListFavButton'><img src='https://icons.iconarchive.com/icons/designbolts/free-valentine-heart/256/Heart-icon.png' className='productListFavButtonIcon' /></a>
                                </div>
                                <div className='productListInfo'>
                                    <div className='productListInfoPrice'>200 TL </div>
                                    <a className='productListButton align-middle'>İLANA GİT</a>
                                </div>
                            </div>
                            <a className='productListPriceWrapper'>
                                <div className='productListPriceInfo'>
                                    <div className='productListPriceBrand'>Oyuneks</div>
                                    <div className='productListPrice'>232,07 TL</div>
                                </div>
                                <div className='productListPriceIcon'>C<img src='' className='productListPriceIconImage' /></div>
                            </a>
                            <a className='productListPriceWrapper'>
                                <div className='productListPriceInfo'>
                                    <div className='productListPriceBrand'>Oyuneks</div>
                                    <div className='productListPrice'>232,07 TL</div>
                                </div>
                                <div className='productListPriceIcon'>C<img src='' className='productListPriceIconImage' /></div>
                            </a>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    )
}
