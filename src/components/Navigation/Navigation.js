import React from 'react';

const Navigation = ({onRouteChange, signedIn}) => {

		if (signedIn) {
			return (
			<div> 
				<nav style={{display: 'flex' , justifyContent: 'flex-end'}}  >
					<p onClick = {()=>onRouteChange('Signin')} className = 'f3 link dim black underline pa3 pointer'> Sign out </p>
				</nav>
			</div> );
		} else {
			return (
				<nav style={{display: 'flex' , justifyContent: 'flex-end'}}  >
					<p onClick = {()=>onRouteChange('Signin')} className = 'f3 link dim black underline pa3 pointer'> Sign in </p>
					<p onClick = {()=>onRouteChange('register')} className = 'f3 link dim black underline pa3 pointer'> Register </p>
				</nav> 
				);
		}
}

export default Navigation;