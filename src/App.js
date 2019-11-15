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

const initialState = {
   input: '',
      imageUrl: '',
      box: '',
      route: 'Signin',
      signedIn: false,
   user : {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
}

class App extends Component {

  constructor () {
    super ();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
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

  onImageSubmit = () => {
    // predict the contents of an image by passing in a url
    this.setState({imageUrl:this.state.input});
      fetch('https://radiant-everglades-57655.herokuapp.com/imageUrl',
                    { method: 'post', 
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({input:this.state.input})
                    })
      .then(res => res.json())
              .then( response => {
                if (response) {
                  fetch('https://radiant-everglades-57655.herokuapp.com/image',
                    { method: 'put', 
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify({id:this.state.user.id})
                    })
                  .then(response => response.json())
                  .then(count => { this.setState(Object.assign(this.state.user, {entries:count}) )})
                  .catch(console.log)
                }
                this.displayFaceBox(this.calculateFaceLocation(response))
              })         
              .catch(err => console.log(err));
  };

  onRouteChange = (route) => {
    if(route === 'home' || route === 'register') { this.setState({signedIn:true})} 
      else {this.setState(initialState)}
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
              <Rank name= {this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit = {this.onImageSubmit} />        
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : (
              route === 'Signin' ?
              <div> 
                <Navigation onRouteChange={this.onRouteChange} signedIn={signedIn}/>
                <Signin    loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
              </div> 
              : <div> <Navigation onRouteChange={this.onRouteChange} signedIn={signedIn}/>
                    <Register   onRouteChange={this.onRouteChange} loadUser={this.loadUser}/> 
                </div> 
            )
        }  
      </div>
    );
  }
}

export default App;
