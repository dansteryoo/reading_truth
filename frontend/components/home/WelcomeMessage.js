import React from "react";
import { Link } from "react-router-dom";

const WelcomeMessage = () => {
    return (
        <div id="welcome-layout">
            <div className="welcome-message">
                <div id="welcome-title">
                    <p>The grass withers, the flower fades,</p>
                    <p>but the word of our God will stand forever.</p>
                </div>
                <div id="welcome-body">
                    <br />
                    <p id="wb-1">
                        I hope this site helps you treasure His word as you
                        continue to cherish His presence.
                    </p>
                    <p id="wb-2">Grow in grace. Persevere with hope.</p>
                    <p id="wb-3">
                        And ultimately, taste and see the goodness of His love
                        for you today.
                    </p>
                    <br />
                    <p id="wb-4">—with all</p>
                </div>
            </div>
            <div className="continue-button">
                <Link to="/home">
                    <span id="continue-to-login">continue</span>
                </Link>
            </div>
        </div>
    );
};

export default WelcomeMessage;
