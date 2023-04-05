import React, {useEffect, useState} from 'react';
import './App.css';
import {CONTRACT_ADDRESS, TOKEN_ADDRESS} from './constants';
import contract from './utils/Airdrop.json';
import {ethers} from 'ethers';

const App = () => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [airdropContract, setAirdropContract] = useState(null);
    const [currentAddress, setCurrentAddress] = useState(null);

    const checkIfWalletIsConnected = async () => {
        try {
            const {ethereum} = window;

            if (!ethereum) {
                console.log('Make sure you have MetaMask!');
                return;
            } else {
                console.log('We have the ethereum object', ethereum);

                const accounts = await ethereum.request({method: 'eth_accounts'});

                if (accounts.length !== 0) {
                    const account = accounts[0];
                    console.log('Found an authorized account:', account);
                    setCurrentAccount(account);
                } else {
                    console.log('No authorized account found');
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    async function airdrop() {
        let result = await airdropContract.airdropWithTransfer(
            TOKEN_ADDRESS,
            [currentAddress],
            [1]
        );
        console.log(result);
    }

    function updateCurrentAddress(e) {
        setCurrentAddress(e);
    }


    const renderContent = () => {
        if (!currentAccount) {
            return (
                <div className="connect-wallet-container">
                    <button
                        className="cta-button connect-wallet-button"
                        onClick={connectWalletAction}
                    >
                        Connect Wallet
                    </button>
                </div>
            );
        } else if (airdropContract) {
            return (
                <div>
                    <input
                        type="text"
                        onChange={(event) => updateCurrentAddress(event.target.value)}
                    />
                    <div className="join-room-container">
                        <button
                            className="cta-button join-wallet-button"
                            onClick={airdrop}
                        >
                            Get 1 token
                        </button>
                    </div>
                </div>
            )
        }
    };

    const connectWalletAction = async () => {
        try {
            const {ethereum} = window;

            if (!ethereum) {
                alert('Get MetaMask!');
                return;
            }
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            });
            console.log('Connected', accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const checkNetwork = async () => {
        try {
            if (window.ethereum.networkVersion !== '97') {
                alert("Please connect to BNB-Chain Testnet!")
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        checkNetwork();
    }, []);

    useEffect(() => {
        const {ethereum} = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const ethersContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                contract.abi,
                signer
            );

            setAirdropContract(ethersContract);
        } else {
            console.log('Ethereum object not found');
        }
    }, []);

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header gradient-text">Airdrop</p>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default App;