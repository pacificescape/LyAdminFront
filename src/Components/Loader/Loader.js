import React from 'react';
// import { Redirect } from 'react-router-dom';
import styles from './Loader.module.css';

class Loader extends React.Component {
    tgButton = () => 'Ошибка'

    componentDidMount() {
        if (!this.props.isAuth) {

            let telegramButton = document.createElement('script');
            telegramButton.src = "https://telegram.org/js/telegram-widget.js?7"
            telegramButton.setAttribute('data-telegram-login', "lywebbot")
            telegramButton.setAttribute('data-size', 'large')
            telegramButton.setAttribute('data-radius', '20')
            telegramButton.setAttribute('data-request-access', "write")
            telegramButton.setAttribute('data-auth-url', "https://lyadmin.stickerstat.info/login")
            document.getElementById('authButton').appendChild(telegramButton)
        } else {
            document.getElementById('authButton').appendChild('Ошибка загрузки')
        }
    }

    render() {

        return (
            <div className={styles.bananaWrapper}>
                <div className={styles.bananaContainer}>
                    <div className={styles.banana}>
                        <img alt='ban' src='https://media.giphy.com/media/2yzIXo95cy4Y7sGCNM/giphy.gif' width="100" className=''></img>
                    </div>
                    {this.props.isAuth ? 'error' : <div id="authButton" className={styles.authButton} />}
                </div>
            </div>

        )
    }
}

export default Loader
