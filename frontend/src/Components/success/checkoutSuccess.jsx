import React, { useEffect } from 'react';
import './CheckoutSuccess.css';

const CheckoutSuccess = () => {

    useEffect(() => {
        
    }, []);

    return (
        <div className="container">
            <h2>Checkout Successful</h2>
            <p>Your order might take some time to process.</p>
            <p>Check your order status at your profile after about 10mins.</p>
            <p>
                Incase of any inquiries contact the support at{" "}
                <strong>support@CampExploreShop.com</strong>
            </p>
        </div>
    );
};

export default CheckoutSuccess;
