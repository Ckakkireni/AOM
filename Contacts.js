import React, { useEffect, useState } from "react";
import { Button, FlatList, Modal, Text, TextInput, View, Linking, Share } from "react-native";
import { appStyles } from './globals/appStyles'
import * as contactsDBService from './ContactsDBService'
//import Icon from 'react-native-vector-icons/MaterialIcons';

class ContactInfo {
    constructor(name, mobile, email) {

        this.name = name;
        this.mobile = mobile;
        this.email = email;
    }
}
const initContact = new ContactInfo("", "", "");

function Contacts() {

    const [data, setData] = useState([]);
    const [contact, setContact] = useState(initContact);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {

        loadData();

    }, [])

    async function loadData() {
        try {
            const promise =  contactsDBService.getConnection();
            console.log("loaddata", promise);

            promise.then(async (db) => {
                await contactsDBService.createTable(db);
                const contacts = await contactsDBService.fetchContacts(db);
                console.log("contacts", contacts);
                setData(contacts);

            })

        } catch (error) {
            console.log(error);
        }


    }

    async function mailTo(email) {
        console.log("Test")
        try {
            Alert.alert("Message", "Check Mail Apps");
            const result = await Linking.canOpenURL(`mailTo://${email}`);
            await Linking.openURL(`mailTo://${email}`)
        } catch (error) {
            Alert.alert("Message", "No Mail Apps");
        }

    }

    async function share(contact) {

        try {
            const result = await Share.share({
                message:
                    'React Native | A framework for building native apps using React',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    Alert.alert("Message", "sharedAction");
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                Alert.alert("Message", "dismissedAction");
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }

    }


    function renderContact() {
        return (

            <FlatList
                data={data} keyExtractor={item => item.email}
                renderItem={(result => (
                    <View style={appStyles.itemContainer}>
                        <Text style={{ color: 'darkblue', fontSize: 18, textAlign: 'center', marginBottom: 6 }}>{result.item.name}</Text>
                        <Text style={{ color: 'mediumslateblue', fontSize: 17, marginBottom: 6 }}>{`mobile: ${result.item.mobile}`}</Text>
                        <Text style={{ color: 'mediumpurple', fontSize: 17, marginBottom: 6 }}>{`Email: ${result.item.email}`}</Text>
                        <View style={appStyles.actionContainer}>
                            {/*  <Button title="Call" onPress={() => { Linking.openURL(`tel://${result.item.mobile}`) }} />
                            <Button title="Email" onPress={() => mailTo(result.item.email)} />
                            <Button title="Text" onPress={() => { Linking.openURL(`sms://${result.item.mobile}`) }} />
                            <Button title="Share" onPress={() => share(result.item)} /> */}

                         {/*    <Icon.Button name="phone" size={30} color="blue" backgroundColor="white"></Icon.Button>
                            <Icon.Button name="email" size={30} color="blue" backgroundColor="white"></Icon.Button>
                            <Icon.Button name="textsms" size={30} color="blue" backgroundColor="white"></Icon.Button>
                            <Icon.Button name="share" size={30} color="blue" backgroundColor="white"></Icon.Button> */}
                        </View>
                    </View>
                ))} />
        )
    }

    function handleChange(propertyName, value) {

        const copy_of_contact = { ...contact };
        copy_of_contact[propertyName] = value;
        setContact(copy_of_contact);
    }

    async function saveContact() {

        try {
            setData([...data, contact]);
            setContact(initContact);
            setIsModalVisible(false);

            const promise =  contactsDBService.getConnection();
            console.log("loaddata", promise);

            promise.then(async (db) => {
                const message = await contactsDBService.saveContact(db, contact);
                console.log("contacts", message);

            })


        } catch (error) {
            console.log("saveContact", error);
        }

    }
    return (
        <View style={appStyles.container}>
            <Text style={appStyles.titleText}>Contacts - Android</Text>
            <View style={appStyles.actionContainer}>
                <Button title="Add New" onPress={() => setIsModalVisible(true)} />

            </View>
            <View>
                {data.length > 0 ? renderContact() : <Text style={appStyles.infoText}>No Contacts</Text>}
            </View>

            <View>
                <Modal visible={isModalVisible}
                    animationType="fade"
                    transparent={true}
                    style={{ borderColor: "red" }}>
                    <View style={appStyles.modalContainer}>
                        <Text style={appStyles.titleText}>New Contact</Text>

                        <TextInput style={appStyles.textInput}
                            placeholder="Name" keyboardType="default" value={contact.name} onChangeText={(value) => handleChange("name", value)} />
                        <TextInput style={appStyles.textInput} placeholder="mobile"
                            keyboardType="number-pad" value={contact.mobile} onChangeText={(value) => handleChange("mobile", value)} />
                        <TextInput style={appStyles.textInput} placeholder="Email"
                            keyboardType="email-address" value={contact.email} onChangeText={(value) => handleChange("email", value)} />
                        <View style={appStyles.actionContainer}>
                            <Button title="Save" onPress={saveContact} />
                            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    )
}

export default Contacts;