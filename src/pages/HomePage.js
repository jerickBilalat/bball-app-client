import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";
import {Link} from "react-router-dom";
import {connect} from "react-redux";

import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';

// utils
import {capitalize} from "../utils/index";

// selectors
import {rankPlayers, sortAlphabetically} from "../selectors/playerSelectors";

// actions
import { loadPlayers } from "../actions/playerActions";
import { loadGames } from "../actions/gameActions";

import RankedPlayersTable from "../components/RankedPlayersTable";
import GameRecordsTable from "../components/GameRecordsTable";

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  tabRoot: {
    flexGrow: 1,
  },
  tableContainer: {
		maxHeight: 320,
		marginBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 3,
  },
});


class RankingPage extends React.Component {

  state = {
    isShowRankedPlayers: true,
    value: 0,
  }

  // todo add this to view or edit players on the table
  doGoToManagePlayerPage = (id) => {
    this.props.history.push(`/manage_player/${id}`);
  }

  doGoToManageGamePage = (id) => {
    this.props.history.push(`/manage_game/${id}`);
  }
  componentDidMount() {
    this.props.dispatch(loadPlayers());
    this.props.dispatch(loadGames());
  }
  handleTabChange = ( event, value) => {
    this.setState({value})
  }
  handleTableChange = (e) => {
    this.setState({isShowRankedPlayers : !this.state.isShowRankedPlayers})
  }
  render() {
    const { classes, players, rankedPlayers, games, user} = this.props,
          {value} = this.state;
    return (
      <Fragment>
        <Paper className={classes.tabRoot}>
          <Tabs
            value={this.state.value}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Rankings" />
            <Tab label="Game Records" />
          </Tabs>
        </Paper>
          {value === 0 && <div className={classes.tableContainer}>
              <RankedPlayersTable doGoToManagePlayerPage={this.doGoToManagePlayerPage} players={players} rankedPlayers={rankedPlayers}/>          
            </div>
          }
          {value === 1 && <div className={classes.tableContainer}>
          <GameRecordsTable doGoToManageGamePage={this.doGoToManageGamePage} games={games}/>
        </div>}
        {user && 
          <Fab color="primary" aria-label="Add" component={Link} to={"/manage_game"} className={classes.fab}>
            <AddIcon />
          </Fab>
        }
        
      </Fragment>
    );
  }
}

RankingPage.propTypes = {
  classes: PropTypes.object.isRequired,
};


function mapStateToProps(state, ownProps) {
  let players = [...state.players],
      user =  state.user ? Object.assign({}, state.user) : state.user,
      games = [...state.games.gameList],
      rankedPlayers = [...rankPlayers([...state.players], state.games.mostPlayedGameType)]
  return {
    user,
    games,
    players,
    rankedPlayers
  }
}

export default connect(mapStateToProps)(withRouter(withStyles(styles, {withTheme: true})(RankingPage)));