import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, Spacer, TouchableHighlight, Image, Linking, Button } from 'react-native';


const REQUEST_URL_BASE  = 'https://leadershipquotes.mystagingwebsite.com/wp-json/';
const POSTS_URL_PATH    = 'wp/v2/media/';
const GET_MEDIA_IDS_PATH = 'media-ids/v1/get-all-media-ids';


//setting ukuran tampilan 
const windowSize = Dimensions.get('window');

export default class LeadershipCards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
    this.fetchData = this.fetchData.bind(this);
  }

  getInitialState() {
    return {
      
      // set variabel menjadi null sebagai default
      card: null,
      cardIDs: null,
      currentID: null
    };
  }

  componentDidMount() {
    this.getAllIDs();
  }

  getAllIDs() {
    fetch(REQUEST_URL_BASE + GET_MEDIA_IDS_PATH)
    .then((response) => response.json())
    .then((responseData) => {
        this.setState( {
            cardIDs: responseData
        } );
    })
    .then(this.fetchData)
    .done();
  }

  getRandID() {
    let currentID = this.state.cardIDs[Math.floor(Math.random()*this.state.cardIDs.length)];
    if ( this.state.currentID == currentID ) {
        currentID = this.getRandID();
    } else {
        this.setState( {
            currentID: currentID
        });
    }
    return currentID;
  }

  // mengambil data dari api
  fetchData() {
    let currentID = this.getRandID();
    this.setState({
      //reset state, sebelum tampil lagi
      card: null,
    });
    fetch(REQUEST_URL_BASE + POSTS_URL_PATH + currentID)
      .then((response) => response.json())
      .then((responseData) => {
        // setelah reset maka memasukan data baru
        this.setState({
          card: { pic: responseData.guid.rendered, content: responseData.title.rendered }
        });
      })
      .done();
  }


  render() {
    if ( !this.state.card ) {
      return this.renderLoadingView();
    }
    return this.renderCard();
  }

  // view loading untuk awalan
  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Tunggu Sebentar...
        </Text>
      </View>
    );
  }

   
  renderCard() {
    let quote = this.state.card.pic;
    return (
      <View style={styles.container}>

     
        <View style={styles.imageContainer}>
          <Image style={{width: windowSize.width, height: windowSize.height}} source={{uri: this.state.card.pic}}  />
         
        </View>

			

        <View style={styles.buttonContainer}>

          <TouchableHighlight
            style={styles.button}
            underlayColor='#ccc'
            onPress={this.fetchData}
          >
            <Text style={styles.buttonText}>Quote Selanjutnya</Text>
          </TouchableHighlight>
           
           <TouchableHighlight
			            	style={styles.button1}
				            underlayColor='#ccc'
				            onPress={ ()=>{ Linking.openURL(this.state.card.pic)}}>
				            <Text style={styles.buttonText}>Download Quote</Text>
          	</TouchableHighlight>

          
        </View>

      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 14,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  imageContainer: {
    alignItems: 'center',
    flex: 1,
    width: windowSize.width,
    height: windowSize.height,
  },
  buttonContainer: {
    bottom: 0,
    
    justifyContent: 'space-between',
     flexDirection: 'row',
    
    backgroundColor: '#1488BC',
  },
  button: {
    flex: 1,
    height : 50,
     width: '40%',
     alignItems: 'center',
  backgroundColor: '#f36765',
  },
  button1: {
    flex: 1,
height :50,
     width: '40%', alignItems: 'center',
    
  },
  buttonText: {
    fontSize: 20,
    color: '#FFFFFF', marginTop: 8,
  },
});
