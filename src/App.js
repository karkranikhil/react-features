import React, { Component } from 'react';
import './App.css';

import Search from './components/Search/Search'
import Table from './components/Table/Table'
import Filter from './components/Filter/Filter'

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
const list = [
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const isSearched = searchTerm => item =>
  item.title.toLowerCase().includes(searchTerm.toLowerCase());

//{list.filter(isSearched(pattern)).map(item =>
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      filterString:'',
      initialResult:[],
      searchTerm: DEFAULT_QUERY,
    };
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }
  setSearchTopStories(result) {
    this.setState({ result:result,initialResult:result });
  }
  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
    event.preventDefault();
  }
  fetchSearchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error);
  }
  componentDidMount() {
      const { searchTerm } = this.state;
      this.fetchSearchTopStories(searchTerm);
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onFilterChange =(event)=>{
    this.setState({filterString:event.target.value});
    var updatedList = this.state.initialResult;
    updatedList = updatedList.hits.filter(function(item){
      return item.title.toLowerCase().search(
          event.target.value.toLowerCase()) !== -1;
    });
    this.setState({result: Object.assign({}, this.state.result, { hits: updatedList })});
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotId);
    this.setState({ 
      result: Object.assign({}, this.state.result, { hits: updatedHits }) 
      //result: { ...this.state.result, hits: updatedHits }
    });

  }

  render() {
    const { searchTerm, result, filterString } = this.state;
    if (!result) { return null; }
    return (
      <div className="page">
        <div className="interactions">
          <div className="col-50">
            <Filter value={filterString} onChange={this.onFilterChange}></Filter>
          </div>
          <div className="col-50">
            <Search value={searchTerm} onChange={this.onSearchChange} onSubmit={this.onSearchSubmit}>Search</Search>
          </div>
        </div>
        <Table list={result.hits} onDismiss={this.onDismiss}/>
      </div>
    );
  }
}






export default App;