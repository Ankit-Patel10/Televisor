import React, { Component } from 'react';
import SearchBox from './search';
import Card from './card';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      televisionID: 1402 // set initital load tv show to The Walking Dead
    }
  }
  render() {
    return (
      <div>
        <SearchBox fetchTelevisionID={this.fetchTelevisionID.bind(this)}/>
        <Card data={this.state}/>
      </div>
    )
  } 

  fetchApi(url) {

    fetch(url).then((res) => res.json()).then((data) => {
      this.setState({
        televisionID: data.id,
        original_title: data.original_title,
        overview: data.overview,
        homepage: data.homepage,
        poster: data.poster_path,
        genre: data.genres,
        release: data.first_air_date,
        vote: data.vote_average,
        runtime: data.number_of_seasons,
        status: data.status,
        backdrop: data.backdrop_path

      })
    })

  }

  fetchTelevisionID(televisionID) {
    let url = `https://api.themoviedb.org/3/tv/${televisionID}?&api_key=cfe422613b250f702980a3bbf9e90716`
    this.fetchApi(url)
  } 

  componentDidMount() {
    let url = `https://api.themoviedb.org/3/tv/${this.state.televisionID}?&api_key=cfe422613b250f702980a3bbf9e90716`
    this.fetchApi(url)

 
    let suggests = new Bloodhound({
      datumTokenizer: function(datum) {
        return Bloodhound.tokenizers.whitespace(datum.value);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: 'https://api.themoviedb.org/3/search/tv?query=%QUERY&api_key=cfe422613b250f702980a3bbf9e90716',
        filter: function(tvshow) {
          return $.map(tvshow.results, function(tvshow) {
            return {
              value: tvshow.original_name,
              id: tvshow.id
            };
          });
        }
      }
    });

    suggests.initialize();

    $('.typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 2
    }, {source: suggests.ttAdapter()}).on('typeahead:selected', function(obj, datum) {

      this.fetchTelevisionID(datum.id)
    }.bind(this));

  }
}
module.exports = App;
