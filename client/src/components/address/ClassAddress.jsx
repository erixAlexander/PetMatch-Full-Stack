import React, { Component } from "react";
import ClassBanner from "./ClassBanner";
import PlaceFinder from "./PlaceFinder";
import ReactSearchBox from "react-search-box";
import ClassPlace from "./ClassPlace";

export default class ClassAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geoLocation: {},
      geoError: null,
      searchResults: [],
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (e) => {
        this.setState({
          geoLocation: e.coords,
        });
      },
      async (err) => {
        this.setState({
          geoError: err,
        });
      }
    );
  }

  async onSearchChange(query) {
    if (query.length > 0) {
      let placeFinder = new PlaceFinder("Z4sVizoTQaGBmYPgQxKoJfCG26HsTzo9");
      let results = await placeFinder.getNearbyPlaces(
        query,
        this.state.geoLocation.latitude,
        this.state.geoLocation.longitude
      );
      this.setState({
        searchResults: results,
      });
    }
  }

  setPlace(key) {
    let place = this.state.searchResults.find((p) => p.id == key);
    this.setState({
      selectedPlace: place,
    });
  }

  render() {
    return (
      <div>
        <ClassBanner
          geoLocation={this.state.geoLocation}
          geoError={this.state.geoError}
        />

        <ReactSearchBox
          placeholder="Search for nearby places"
          matchedRecords={this.state.searchResults
            .map((result) => ({
              key: result.id,
              name: result.poi.name,
              dist: result.dist,
              value: `${result.poi.name} | ${(result.dist / 1000).toFixed(
                2
              )}km `,
            }))
            .sort((a, b) => a.dist - b.dist)}
          data={this.state.searchResults
            .map((result) => ({
              key: result.id,
              name: result.poi.name,
              dist: result.dist,
              value: result.poi.name,
            }))
            .sort((a, b) => a.dist - b.dist)}
          onSelect={(place) => this.setPlace(place.item.key)}
          autoFocus={true}
          onChange={(query) => this.onSearchChange(query)}
          fuseConfigs={{
            minMatchCharLength: 0,
            threshold: 1,
            distance: 100000,
            sort: false,
          }}
          keys={["name"]}
        />
        {this.state.selectedPlace ? (
          <ClassPlace
            className="place-box"
            data={this.state.selectedPlace}
          ></ClassPlace>
        ) : (
          <p>test</p>
        )}
      </div>
    );
  }
}
