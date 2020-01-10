import React from 'react';
// import { Redirect } from 'react-router-dom';
import styles from './Loader.module.css';
import { connect } from 'react-redux';

class Loader extends React.Component {
    tgButton = () => 'Ошибка'

    componentDidMount() {
        if (!this.props.isAuth) {

            let telegramButton = document.createElement('script');
            telegramButton.src = 'https://telegram.org/js/telegram-widget.js?6'
            telegramButton.setAttribute('data-telegram-login', 'LyAdminBot')
            telegramButton.setAttribute('data-size', 'large')
            telegramButton.setAttribute('data-radius', '20')
            telegramButton.setAttribute('data-auth-url', 'localhost:3000')
            document.getElementById('authButton').appendChild(telegramButton)
        } else {
            document.getElementById('authButton').appendChild('Ошибка загрузки')
        }
    }

    render() {

        return (
            <div className={styles.bananaWrapper}>
                <div className={styles.bananaContainer}>
                    {/* <Redirect from="/" to="/" /> */}
                    <div className={styles.banana}>
                        <img alt='ban' src='https://media.giphy.com/media/2yzIXo95cy4Y7sGCNM/giphy.gif' width="100" className=''></img>
                    </div>
                    <div id="authButton" className={styles.authButton} />
                </div>
            </div>

        )
    }
}

let mapStateToProps = (state) => {
    return {
        isAuth: state.App.isAuth,
        isFetching: state.App.isFetching,
        groups: state.App.groups
    }

}

let mapDispatchTooProps = () => {
    return {

    }
}


const LoaderContainer = connect(mapStateToProps, mapDispatchTooProps)(Loader)

export default LoaderContainer


                // <div className="mt-5">
                //     <Redirect from="/we" to="/" />
                //     <div className="mx-auto" style={{width: "fit-content"}}>
                //         <img alt='' src='https://media.giphy.com/media/2yzIXo95cy4Y7sGCNM/giphy.gif' width="100" className=''></img>
                //     </div>
                //     <div className="mx-auto" style={{width: "fit-content"}}>
                //         <h2 className="text-warning text-center">Войти</h2>
                //         <div id="authButton"></div>
                //     </div>
                // </div>
