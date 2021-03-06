/**
 * Created by looper on 2017/8/28.
 */
import React from 'react';
import { View, Text, Platform, FlatList, TouchableOpacity, Modal } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions/homeActions';
import WeiboItem from '../components/WeiboItem';
import Icon from 'react-native-vector-icons/Ionicons';

class Main extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const { setParams } = navigation;
    let isOpen;
    if ('params' in navigation.state) {
      isOpen = navigation.state.params.isOpen
    } else {
      isOpen = false
    }
    const iconName = isOpen ? 'md-arrow-dropup' : 'md-arrow-dropdown'
    const headerTitle = (
      <TouchableOpacity onPress={() => {
        setParams({ isOpen: !isOpen })
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: 3, fontSize: Platform.OS === 'ios' ? 17 : 20, }}>我的首页</Text>
          <Icon name={iconName} size={15}/>
        </View>
      </TouchableOpacity>
    )
    return ({
      headerTitle,
    })
  };

  componentWillReceiveProps(nextProps) {
    if ('params' in nextProps.navigation.state) {
      const { isOpen } = nextProps.navigation.state.params;
      if (isOpen) {
        console.log('打开')
      } else {
        console.log('关闭')
      }
    }
  }

  componentDidMount() {
    this.props.actions.getLocalData();
    this.props.actions.getUserGroup();
  }

  renderItem = ({ item, separators }) => {
    return (
      <WeiboItem
        item={item}
        separators={separators}
        onItemPress={() => this.props.navigation.navigate('Comment', { data: item })}
      />
    )
  }

  renderFooter = (loading) => {
    return (
      loading ?
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, color: '#666666', marginVertical: 10 }}>正在加载...</Text>
        </View> : null
    )
  }

  render() {
    const { data, refreshing, loading, error, actions, groups, groupError } = this.props;
    console.log(groups)
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={(item, index) => index}
          data={data}
          refreshing={refreshing}
          ItemSeparatorComponent={() => <View style={{ height: 6, backgroundColor: '#e5e5e5' }}/>}
          renderItem={this.renderItem}
          onRefresh={actions.getData}
          onEndReachedThreshold={0.5}
          onEndReached={() => {if (!refreshing && !loading) actions.getData(data[data.length - 1].id)}}
          ListFooterComponent={this.renderFooter(loading)}
        />
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    data: state.homeDataState.data,
    refreshing: state.homeDataState.refreshing,
    loading: state.homeDataState.loading,
    error: state.homeDataState.error,
    groups: state.homeDataState.groups,
    groupError: state.homeDataState.groupError,
  }
};

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);