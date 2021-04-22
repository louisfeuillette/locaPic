import React, { useState, useEffect} from 'react';
import { View, ScrollView, KeyboardAvoidingView } from 'react-native';
import {Button, ListItem, Input} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import socketIOClient from "socket.io-client";
import {connect} from 'react-redux';

var socket = socketIOClient("http://172.17.1.196:3000");

function ChatScreen(props) {

  const [listMessage, setListMessage] = useState([])
  const [currentMessage, setCurrentMessage] = useState()

  // from front to back
  var handleSubmit = () => {
    console.log(currentMessage, '<---- from input to front to back ')
    socket.emit("sendMessage", {message: currentMessage, pseudo: props.pseudoFromStore})
    setCurrentMessage(" ")
  }

  // from back to front 
  useEffect(() => {
    socket.on('sendMessageAll', function(elementFromBack) {
      console.log(elementFromBack, '<---- from back to front ELEMENT')
      setListMessage([...listMessage, elementFromBack])
      // console.log(listMessage, "listMessage apres spread operator")
    });
  }, [listMessage]);

  var messageForScreen = listMessage.map((element, index)=>{

    let msgReg = element.message.replace(/fuck/i, "\u2022\u2022\u2022")
    element.message = msgReg

    element.message = element.message.replace(':)','\u263A')
    element.message = element.message.replace(':( ','\u2639')
    element.message = element.message.replace(':p','\uD83D\uDE1B')
    
    return <ListItem key={index} bottomDivider>
              <ListItem.Subtitle>{element.pseudo}</ListItem.Subtitle> 
              <ListItem.Title> {element.message} </ListItem.Title>   
            </ListItem> 
  })

  return (
    <View style={{flex:1}}>
       <ScrollView style={{flex:1, marginTop: 50}}>
        
          {messageForScreen}
        
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <Input
              containerStyle = {{marginBottom: 5}}
              placeholder='Your message'
              onChangeText={(valeur)=> setCurrentMessage(valeur)}
              value={currentMessage}
          />
          <Button
              icon={
                  <Icon
                  name="envelope-o"
                  size={20}
                  color="#ffffff"
                  />
              } 
              title="Send"
              buttonStyle={{backgroundColor: "#eb4d4b"}}
              type="solid"
              onPress={()=> handleSubmit()}
          />
      </KeyboardAvoidingView>
        
    </View>
  );
}

function mapStateToProps(state) {
  return { pseudoFromStore: state.pseudo }
 }
  
 export default connect(
  mapStateToProps,
  null
 )(ChatScreen);