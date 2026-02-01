import React = require("react");
import { View, Text } from "react-native";
import Header from "./component/Header";
import { ScrollView } from "react-native-gesture-handler";
import { Button, HelperText, TextInput,Portal,Dialog,ActivityIndicator, Modal } from "react-native-paper";



const AddVideoScreen = ({navigation}:any) => {
    const [url, setUrl] = React.useState("");
    const [dialogVisible, setDialogVisible] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const hideDialog = () => setDialogVisible(false);
    const confirmUrl = () => {
        hideDialog();
        setIsLoading(true);
    };
    return (
        <ScrollView>
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                    <Dialog.Title>链接</Dialog.Title>
                    <Dialog.Content>
                        <TextInput mode="flat" value={url} onChangeText={setUrl} placeholder="请输入视频链接"/>
                        <HelperText type="info">支持抖音视频链接</HelperText>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => { hideDialog(); }}>取消</Button>
                        <Button onPress={confirmUrl}>确认</Button>
                    </Dialog.Actions>
                </Dialog>
                <Modal visible={isLoading} dismissable={true} onDismiss={() => setIsLoading(false)}>
                    <ActivityIndicator animating={isLoading} size={100} style={{position: 'absolute', top: '50%', left: '50%', marginLeft: -50, marginTop: -50}}/>
                </Modal>
            </Portal>
            <Header navigation={navigation} title="导入视频" />
            <Button onPress={() => setDialogVisible(true)} style={{borderRadius: 10}} mode="contained-tonal" contentStyle={{paddingVertical: 10}}>
                导入其他平台视频
            </Button>
            
        </ScrollView>
    );
}




export default AddVideoScreen;