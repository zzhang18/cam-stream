import React, { Component } from 'react';
import { Table, Button, Modal, Divider, Popconfirm, Form, Input, message, Result, Popover } from 'antd';
import _ from 'lodash';
// import { useTranslation, withTranslation } from 'react-i18next';
import axios from 'axios';
import ReactJson from 'react-json-view'
// import { VLCPlayer, VlCPlayerView } from 'react-native-vlc-player';

const { Search } = Input;
function CamView(props) {
  
  return (
    <div style={{ padding: 40 }}>
      <div style={{ marginBottom: 20 }}>
        <div >
          <h1 >Cam View</h1>
        </div>
        <div style={{ float: 'left' }}>
          {/* <Button type="primary" style={{ margin: '0 10px 10px 0' }} onClick={() => props.show()}>{t('addUser')}</Button>
          <Search
            placeholder='search user'
            onSearch={(value) => props.search(value)}
            style={{ width: 240 }}
          />
        </div>
        <div style={{ float: 'right' }}>
          <Button style={{ margin: '0 10px 10px 0' }} onClick={async () => {
            i18n.changeLanguage(t('targetLangCode'));
            // props.changeLocale();
          }}>{t('targetLang')}</Button> */}
          {/* <Button onClick={props.getChannelsInfo}>Get channels info</Button>
          <Button><a href='https://github.com/zzhang18/cam-stream'>GitHub</a></Button> */}
        </div>
        
      </div>




      {/* <h2>Server info</h2>  
      {props.serverInfo.length >0 ?
        <div>

        <h3>Server: {props.serverInfo.LiveQing.Body.Server} </h3>
        <h3>Running time: {props.serverInfo.LiveQing.Body.RunningTime} </h3>
        <h3>Hardware: {props.serverInfo.LiveQing.Body.Hardware}</h3>
        <h3>InterfaceVersion: {props.serverInfo.LiveQing.Body.InterfaceVersion}</h3>
      
        </div>
        :
        <div></div>
      } */}
        
        {/* <ReactJson src={props.serverInfo} /> */}
        {/* <h2 sytle={{float:'left'}}>Channel info</h2>   */}
        {/* <ReactJson src={props.channels} /> */}
      <h2 style={{ float: 'left' }}>Cam List</h2>
      <Table
        dataSource={props.channels}
        columns={[
          { title: 'Channel', dataIndex: 'Channel', key: 'Channel', width: 200, sorter: (a, b) => a.name > b.name },
          { title: 'Name', dataIndex: 'Name', key: 'Name', width: 160, sorter: (a, b) => a.mobile - b.mobile },
          { title: 'DeviceType', dataIndex: 'DeviceType', key: 'DeviceType', width: 160 },
          { title: 'SourceVideoCodecName', dataIndex: 'SourceVideoCodecName', key: 'SourceVideoCodecName', width: 160 },
          { title: 'SourceVideoFrameRate', dataIndex: 'SourceVideoFrameRate', key: 'SourceVideoFrameRate', width: 160 },
          { title: 'SourceVideoWidth', dataIndex: 'SourceVideoWidth', key: 'SourceVideoWidth', width: 160 },
          { title: 'SourceVideoHeight', dataIndex: 'SourceVideoHeight', key: 'SourceVideoHeight', width: 160 },
          { title: 'Snapshot', dataIndex: 'SnapURL', key: 'SnapURL', width: 160,
            render: (record) =><img src={props.endpoint + record} width="80px" height="80px" ></img>
          },
          { title: 'Recording', dataIndex: 'Recording', key: 'Recording', width: 160,
            render: (record) => record ? 'True' : 'False'
          },
          {
            title: 'Record', key: 'action', width: 160,
            render: (e,record) => {
              console.log('record',record);
              return (
                <div>
                  <a onClick={() => props.toggleRecord(record)}>{record.Recording ? 'End' : 'Start'}</a>
                </div>
              );
            },
          }
        ]}
      />

      <h2 style={{ float: 'left' }}>Record List</h2>
      <Table
        dataSource={props.records}
        columns={[
          { title: 'Id', dataIndex: 'id', key: 'id', width: 200 },
          { title: 'Name', dataIndex: 'name', key: 'name', width: 160 },
          { title: 'updatedAt', dataIndex: 'updateAt', key: 'updateAt', width: 160 }
        ]}
      />

      
      <h2 style={{ float: 'left' }}>Record Daily List ({props.recordsDaily.name})</h2>

      <Table
        dataSource={props.recordsDaily.list}
        columns={[
          { title: 'Index', dataIndex: 'id', key: 'id', width: 200, render: (e, record, index) => (index + 1), align: 'center'  },
          { title: 'startAt', dataIndex: 'startAt', key: 'startAt', width: 160 },
          { title: 'duration', dataIndex: 'duration', key: 'duration', width: 160 },
          { title: 'hls', dataIndex: 'hls', key: 'hls', width: 160 },
          { title: 'important', dataIndex: 'important', key: 'important', width: 160 }
        ]}
      />
      
      {/* <VLCPlayer
           ref={ref => (this.vlcPlayer = ref)}
           style={[styles.video]}
           videoAspectRatio="16:9"
           paused={this.state.paused}
           source={{ uri: this.props.uri}}
           onProgress={this.onProgress.bind(this)}
           onEnd={this.onEnded.bind(this)}
           onBuffering={this.onBuffering.bind(this)}
           onError={this._onError}
           onStopped={this.onStopped.bind(this)}
           onPlaying={this.onPlaying.bind(this)}
           onPaused={this.onPaused.bind(this)}
       /> */}

      <h3 style={{ float: 'right' }}>v.0.0.1</h3>
      <h3>Streams</h3>
      <h3>{props.stream}</h3>
    </div>
  );
}
let hoc = (WrappedComponent) => {
  return class EnhancedComponent extends Component {
    get t() { return this.props.t; }
    constructor(props) {
      super(props);
      this.state = {
        user: null,
        users: null,
        visible: false,
        title: 'Add user',
        endpoint: 'http://172.16.17.253:10800',
        serverInfo: [],
        channels:[],
        stream: null,
        records: [],
        recordsDaily:[]
      };
    }

    async componentDidMount() {
      // await this.fetchUsers();
      await this.getServerInfo();
      await this.getChannelsInfo();
      await this.getChannelStream(1);
      await this.getRecording();
      await this.getRecordingByChannelDaily();
    }

    async getServerInfo(){
      let result = await axios.get(this.state.endpoint + '/api/v1/getserverinfo');
      // console.log('type',typeof(serverInfo));
      // console.log('result',serverInfo);
      this.setState({serverInfo:result.data});
    }

    async getChannelsInfo(){
      let result = await axios.get(this.state.endpoint + '/api/v1/getchannels');
      // console.log('type',typeof(serverInfo));
      // console.log('result',serverInfo);
      this.setState({channels:result.data.LiveQing.Body.Channels});
    }

    async getChannelStream(index){
      // _.map(index, i=>{
      //   let result = await axios.get(this.state.endpoint + '/api/v1/getchannelstream?channel='+i);
      //   return result.data.LiveQing.Body.URL;
      // });
      let result = await axios.get(this.state.endpoint + '/api/v1/getchannelstream?channel=1');
      console.log('stream 1',result);
      this.setState({stream:result.data.LiveQing.Body.URL});
    }

    async toggleRecord(record){
      console.log('toggle channel',record);
      let result = await axios.get(this.state.endpoint + '/api/v1/' + record.Recording ? 'stop' : 'start' + 'record?channel='+record.Channel);
      console.log('stream 1',result);

    }

    async getRecording(){
      let result = await axios.get(this.state.endpoint + '/api/v1/record/querydevices');
      console.log('records',result);
      this.setState({records:result.data.rows});

    }

    async getRecordingByChannel(channel){
      let result = await axios.get(this.state.endpoint + '/api/v1/record/queryflags?id=1');
      console.log('records',result);
      this.setState({records:result.data.rows});

    }

    async getRecordingByChannelDaily(channel){
      let result = await axios.get(this.state.endpoint + '/api/v1/record/querydaily?id=1&period=20201202');
      console.log('records',result);
      this.setState({recordsDaily:result.data});

    }

    async fetchUsers() {
      let users = _.times(10, index => {
        return {
          "name": 'user' + index,
          "mobile": 'mobile' + index,
          "email": 'email' + index
        };
      }
      );
      this.setState({ users });
    }

    async search(value) {
      let users = _.times(10, index => {
        return {
          "name": 'user' + index,
          "mobile": 'mobile' + index,
          "email": 'email' + index
        };
      }
      );
      this.setState({ users: value ? _.filter(users, { 'name': value }) : users });
    }

    async show(user) {
      this.setState({ visible: true, user, title: user ? this.t('editUser') : this.t('addUser') });
    }

    async edit(user) {
      this.cancel();
    }

    async cancel() {
      this.setState({ visible: false, user: null });
    }

    async delete(user) {
      message.success('deleted');
    }

    render() {
      return <WrappedComponent
        user={this.state.user}
        users={this.state.users}
        title={this.state.title}
        visible={this.state.visible}
        endpoint={this.state.endpoint}
        serverInfo={this.state.serverInfo}
        channels={this.state.channels}
        stream={this.state.stream}
        records={this.state.records}
        recordsDaily={this.state.recordsDaily}
        cancel={() => this.cancel()}
        show={(user) => this.show(user)}
        edit={(user) => this.edit(user)}
        search={(value) => this.search(value)}
        getServerInfo={()=>this.getServerInfo()}
        getChannelsInfo={()=>this.getChannelsInfo()}
        toggleRecord={(record)=>this.toggleRecord(record)}
        getRecording={()=>this.getRecording()}
        getRecordingByChanne={()=>this.getRecordingByChannel()}

      />;
    }
  };
};

export default hoc(CamView);
