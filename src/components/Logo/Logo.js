import React from 'react';
import Tilt from 'react-tilt';
import './logo.css';
import brain from './brain.png';

const Logo = () => {
	return (
		<div className = 'ma3 mt0'>
			<Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 125, width: 125 }} >
			<div className="Tilt-inner pa4"> <img src={brain} alt='logo'/> </div>
			</Tilt>
			</div>
		);
}

export default Logo;