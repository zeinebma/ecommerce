import React, { useContext, useEffect } from 'react'
import { ShopContext } from '../../Context/ShopContext';


const Profile = () => {

    const { user, fetchUserDetails } = useContext(ShopContext);

    useEffect(() => {
        fetchUserDetails();
    }, [])

    return (
        <div>
            Profile
        </div>
    )
}

export default Profile
