import React from "react";
import "./Hero.css";
import hand_icon from "../Assets/hand_icon.png";
import arrow_icon from "../Assets/arrow.png";

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
        <div className="hero-text">
          <h1>Bienvenue dans notre boutique de camping en ligne</h1>
          <p>Découvrez une sélection exceptionnelle d'équipements de camping pour vivre des aventures inoubliables en plein air.</p>
          <div className="hero-latest-btn">
            <div>Commencer</div>
            <img src={arrow_icon} alt="Arrow icon" />
          </div>
        </div>
      </div>
      <div className="hero-right">
      </div>
    </div>
  );
};
export default Hero;
