import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

// instantiate a new Clarifai app passing in your api key.
const app = new Clarifai.App({
  apiKey: 'c5d9c08ddf524e6582e64322d4db904b'
});

const particleOptions = {
  particles: {
    number : {
      value : 90,
      density : { enable : true, value_area : 600}
    },

    shape : {
      type: 'star',
      stroke: {width:0, color: '#FFFFDD'},
      polygon:{nb_sides:6}
    }
  }
}

class App extends Component {

  constructor () {
    super ();
    this.state = {
      input: '',
      imageUrl: '',
      box: '',
      route: 'Signin',
      signedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height); 

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }

  }

  displayFaceBox = (box) => {
    this.setState({box:box});
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  onSubmit = () => {
    // predict the contents of an image by passing in a url
    this.setState({imageUrl:this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
              .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
              .catch(err => console.log(err));
  };

  onRouteChange = (route) => {
    if(route === 'home' || route === 'register') { this.setState({signedIn:true})} 
      else {this.setState({signedIn:false})}
    this.setState({route:route})
  }

  render() {
    const {signedIn, imageUrl, box, route} = this.state;
    
    return (
      <div className="App">
        <Particles className= 'particles' params={particleOptions} />
        {  route === 'home' ?
           <div > 
              <Navigation onRouteChange={this.onRouteChange} signedIn={signedIn}/>          
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit = {this.onSubmit} />        
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : (
              route === 'Signin' ?
              <div> 
                <Navigation onRouteChange={this.onRouteChange} signedIn={signedIn}/>
                <Signin    onRouteChange={this.onRouteChange}/> 
              </div> 
              : <div> <Navigation onRouteChange={this.onRouteChange} signedIn={signedIn}/>
                    <Register   onRouteChange={this.onRouteChange}/> 
                </div> 
            )
        }  
      </div>
    );
  }
}

export default App;
