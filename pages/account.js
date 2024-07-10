import Header from '@/src/components/Header'
import React from 'react'

export default function login() {
    return (
      <div className='container mx-auto'>
        <Header />
        <div className='acBox'>
        <form method='post'>
              <div className='acTitle text-left'>
                <label for="title" className=''>Hesabım</label>
              </div>
              <div id="horizontal-line"></div>
              <div className='formInner'>
                <div>
                  <label for="mail" className='formGroup' ></label>
                  <input type='email' placeholder='Mail adresi giriniz' name='Email' id='mail' className='formControl' />
                </div>
                <label for="password" className='formLabel'></label>
                <div className='passwordArea'>
                <input type='password'  placeholder="Şifrenizi giriniz" name='password' id='password' className='formControl' />   
                  </div>
                  <label for="password" className='formLabel'></label>
                <div className='passwordArea2'>
                <input type='password'  placeholder="Şifrenizi tekrar giriniz" name='password' id='password' className='formControl' />   
                  </div>
                  <h2 className='ltext text-xs text-slate-500'> · Şifreniz en az 6 karakter uzunluğunda olmalı. </h2>
                  <h2 className='ltext text-xs text-slate-500'> · En az bir harf ve sayı içermek zorundadır. </h2>
              </div>
              <div className='lbutton1'>
              <a href='xxxxx'><button type='submit' className='loginButton'>Şifremi Güncelle</button></a>
              </div>
        </form>




        </div>
        </div>
        )
        }
