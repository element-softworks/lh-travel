import React, { useState } from "react";
import { Link, StaticQuery } from "gatsby";
import { addDays, format } from "date-fns";
import BackgroundImage from "gatsby-background-image";
import Layout from "../components/layout";
import SEO from "../components/seo";
import DatePicker from "react-datepicker";
import useKonami from "react-use-konami";

// Style Import
import "../styles/_index.scss";
import "../styles/pages/_index.scss";
import { Search, Button } from "semantic-ui-react";
import distance from "@turf/distance";
import point from "turf-point";

import * as _airports from "../static/airports.json";
const airports = _airports.map(item => ({ ...item, key: item.code }));

const IndexPage = () => {
    const [isFalloutMode, setFalloutMode] = useState(false);
    const [isSearching, setSearching] = useState(false);
    const [dates, setDates] = useState([new Date(), addDays(new Date(), 1)]);
    const [locations, setLocations] = useState(["", ""]);
    const [results, setResults] = useState([]);
    const [isButtonLoading, setButtonLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    useKonami(() => {
        setFalloutMode(true);
    });

    function onSearchChange(e, { value }) {
        if (String(value).length < 2) {
            return;
        }

        let results = airports.filter(
            ({ title, key }) =>
                String(title)
                    .toLowerCase()
                    .includes(String(value).toLowerCase()) ||
                String(key)
                    .toLowerCase()
                    .includes(String(value).toLowerCase()),
        );

        return setResults(results);
    }

    function onResultSelect(result, place) {
        if (place === "depart") {
            let _locations = locations;
            _locations[0] = result.code;
            setLocations(_locations);
        } else {
            let _locations = locations;
            _locations[1] = result.code;
            setLocations(_locations);
        }

        setResults([]);
    }

    function onDateSelect(date, leg) {
        let _dates = dates;
        if (leg === "inbound") {
            _dates[1] = date;
            return setDates([..._dates]);
        } else {
            _dates[0] = date;
            return setDates([..._dates]);
        }
    }

    function retrieveResults() {
        setButtonLoading(true);
        const URL = `https://api.skypicker.com/flights?flyFrom=${locations[0]}&to=${
            locations[1]
        }&date_from=${format(dates[0], "dd/MM/yyyy")}&date_to=${format(
            dates[1],
            "dd/MM/yyyy",
        )}&max_stopovers=2&limit=25&curr=GBP&partner=picky`;
        fetch(URL)
            .then(response => response.json())
            .then(({ data }) => setSearchResults(data))
            .finally(() => setButtonLoading(false));
    }

    const outboundStr = new Intl.DateTimeFormat("en-GB").format(dates[0]);
    const inboundStr = new Intl.DateTimeFormat("en-GB").format(dates[1]);

    return (
        <React.Fragment>
            <SEO title="Flight Search" />
            <Layout>
                <BackgroundSection fallout={isFalloutMode}>
                    <section className="splash-container">
                        <h1 className="splash-title">
                            Jeff's big green {isFalloutMode ? "fallout" : "flight"} machine
                        </h1>
                        <div className="splash-search">
                            <div className="splash-place-container">
                                <Search
                                    resultRenderer={ResultComponent}
                                    onResultSelect={(_, { result }) =>
                                        onResultSelect(result, "depart")
                                    }
                                    results={results}
                                    loading={isSearching}
                                    onSearchChange={onSearchChange}
                                    placeholder="Departure"
                                    className="splash-placepicker"
                                />
                                <Search
                                    resultRenderer={ResultComponent}
                                    onResultSelect={(_, { result }) =>
                                        onResultSelect(result, "arrive")
                                    }
                                    results={results}
                                    loading={isSearching}
                                    onSearchChange={onSearchChange}
                                    placeholder="Arrival"
                                    className="splash-placepicker"
                                />
                            </div>
                            <div className="splash-date-container">
                                <DatePicker
                                    value={outboundStr}
                                    placeholderText="Departure Date"
                                    className="splash-datepicker splash-date-deperature"
                                    onChange={date => onDateSelect(date, "outbound")}
                                />
                                <DatePicker
                                    value={inboundStr}
                                    placeholderText="Return Date"
                                    className="splash-datepicker splash-date-arrival"
                                    onChange={date => onDateSelect(date, "inbound")}
                                />
                            </div>
                            <div className="splash-button-container">
                                <Button
                                    onClick={retrieveResults}
                                    loading={isButtonLoading}
                                    className="jeff-green"
                                >
                                    Search
                                </Button>
                            </div>
                        </div>
                    </section>
                </BackgroundSection>
                {searchResults.length > 0 && (
                    <SearchResults locations={locations} results={searchResults} />
                )}
            </Layout>
        </React.Fragment>
    );
};

const SearchResults = ({ results = [], locations = [] }) => {
    return (
        <section className="results-container">
            <h2>
                Search Results ({locations[0]} - {locations[1]})
            </h2>
            {results.map((result, index) => (
                <SingleSearchResult result={result} index={index} />
            ))}
        </section>
    );
};

const SingleSearchResult = ({ result, index }) => {
    let totalDistance = 0;
    if (Array.isArray(result.route)) {
        totalDistance = result.route
            .map(({ lngFrom, latFrom, lngTo, latTo }) => {
                let from = point([lngFrom, lngTo]);
                let to = point([lngFrom, latTo]);
                return distance(from, to, { units: "miles" });
            })
            .reduce((acc, curr) => acc + curr)
            .toFixed(2);
    }

    return (
        <article key={result.id} className="search-result">
            <div>
                <h5 style={{ marginBottom: 0 }}>Departure</h5>
                <p>
                    {result.cityFrom} ({result.flyFrom})
                </p>
            </div>
            <div>
                <h5 style={{ marginBottom: 0 }}>Stops</h5>
                <p>{result.route.length - 1}</p>
            </div>
            <div>
                <h5 style={{ marginBottom: 0 }}>Arrival</h5>
                <p>
                    {result.cityTo} ({result.flyTo})
                </p>
            </div>
            <div>
                <h5 style={{ marginBottom: 0 }}>Total Distance</h5>
                <p>
                    {totalDistance}
                    <sup>km</sup>
                </p>
            </div>
            <div>
                <h5 style={{ marginBottom: 0, fontWeight: "bolder" }}>
                    CO<sup>2</sup> Per Passenger
                </h5>
                <p>
                    <i>{(totalDistance * 0.1753).toFixed(2)}kg</i>
                </p>
            </div>
            <div>
                <h5 style={{ marginBottom: 0 }}>Price</h5>
                <p>£{result.price}</p>
            </div>
        </article>
    );
};

const ResultComponent = ({ ...rest }) => {
    return (
        <span key={rest.code}>
            {rest.title} - {rest.code}
        </span>
    );
};

const BackgroundSection = ({ className, children, fallout = false, ...props }) => {
    return (
        <StaticQuery
            query={graphql`
                query {
                    desktop: file(relativePath: { eq: "green_splash_2.jpg" }) {
                        childImageSharp {
                            fluid(quality: 100, maxWidth: 1920) {
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                }
            `}
            render={data => {
                // Set ImageData.
                const imageData = data.desktop.childImageSharp.fluid;
                return (
                    <BackgroundImage
                        Tag="section"
                        className={className}
                        fluid={imageData}
                        backgroundColor={`#040e18`}
                        style={{ backgroundPosition: "bottom center" }}
                    >
                        {children}
                    </BackgroundImage>
                );
            }}
        />
    );
};
export default IndexPage;
