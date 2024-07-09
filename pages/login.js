import Header from '@/src/components/Header'
import React from 'react'
import style from '../public/css/login.module.css'

export default function login() {
  return (
    <div className='container mx-auto'>
      <Header />
      <div className={style.loginBox}>
            <form method='post'>
              <div className={style.loginTitle, 'text-center'}>
                <label for="title" className=''>Hesabınıza Giriş Yapın</label>
              </div>
              <div id="horizontal-line"></div>
              <div>
                <label for="mail" className={style.formGroup}>E-Posta Adresiniz</label>
                <input type='email' name='Email' id='mail' className={style.formControl} />
              </div>
              <div>
                <label for="password" className={style.formLabel}>Parolanız</label>
                <div className={style.passwordArea}>
                <input type='email' name='Email' id='mail' className={style.formControl} />            
              </div>
              </div>
              <div className={style.betweenBar}>
              <label className={style.optionLabel}>
              <input type="checkbox" className={style.optionInput} id="remember" name="remember" value="1" />
              Beni Hatırla
              </label>
                  <a href='xxxx' className={style.loginA}>Şifremi Unuttum</a>
              </div>
                <a href='xxxxx'><button type='submit' className={style.loginButton}>Giriş Yap</button></a>
                  <div className={style.loginBreaker}>
                    <h4>VEYA</h4>
                  </div>
                  <div className={style.otherLoginWrapper}>
                  <a href='xxxxx' className={style.othLogin}>Facebook ile giriş yap</a>
                  <a href='xxx2' className={style.othLogin}>Google ile giriş yap</a>
                  </div>
            </form>
          </div>
         <div className={style.undertxt}>
            <p>Hesabınız yoksa <a>KAYIT OLUN</a></p>
         </div>
    </div>
  )
}
