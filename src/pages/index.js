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
import { Search, Button, Modal } from "semantic-ui-react";
import distance from "@turf/distance";
import point from "turf-point";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlaneDeparture, faCar, faTruck, faTrain, faBus, faTree } from "@fortawesome/pro-regular-svg-icons";
import * as _airports from "../static/airports.json";

const airports = _airports.map(item => ({ ...item, key: item.code }));
const jeff_green = "#b7e778";
const EU_COUNTRIES = [
    "AT",
    "BE",
    "BG",
    "HR",
    "CY",
    "CZ",
    "DK",
    "EE",
    "FI",
    "FR",
    "DE",
    "EL",
    "HU",
    "IE",
    "LV",
    "LU",
    "MT",
    "NL",
    "PL",
    "PT",
    "RO",
    "SK",
    "SI",
    "ES",
    "SE",
    "UK",
    "GB",
];

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
        const URL = `https://api.skypicker.com/flights?flyFrom=${locations[0]}&to=${locations[1]}&date_from=${format(
            dates[0],
            "dd/MM/yyyy",
        )}&date_to=${format(dates[1], "dd/MM/yyyy")}&max_stopovers=1&limit=5&curr=GBP&partner=picky`;
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
                                    onResultSelect={(_, { result }) => onResultSelect(result, "depart")}
                                    results={results}
                                    loading={isSearching}
                                    onSearchChange={onSearchChange}
                                    placeholder="Departure"
                                    className="splash-placepicker"
                                />
                                <Search
                                    resultRenderer={ResultComponent}
                                    onResultSelect={(_, { result }) => onResultSelect(result, "arrive")}
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
                                <Button onClick={retrieveResults} loading={isButtonLoading} className="jeff-green">
                                    Search
                                </Button>
                            </div>
                        </div>
                    </section>
                </BackgroundSection>
                {searchResults.length > 0 && <SearchResults locations={locations} results={searchResults} />}
            </Layout>
        </React.Fragment>
    );
};

const SearchResults = ({ results = [], locations = [] }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    function toggleModal() {
        setModalOpen(!isModalOpen);
    }

    return (
        <section className="results-container">
            <div className="results-title-area">
                <h2 style={{ marginBottom: 0 }}>
                    Search Results ({locations[0]} - {locations[1]})
                </h2>
                <Button onClick={toggleModal}>Show on Map</Button>
            </div>
            <AngryCO2Warning
                locations={locations}
                route={results[0].route}
                from={results[0].countryFrom}
                to={results[0].countryTo}
            />
            {results.map((result, index) => (
                <SingleSearchResult result={result} index={index} />
            ))}
            <Modal open={isModalOpen} onClose={toggleModal}>
                My Modal
            </Modal>
        </section>
    );
};

const AngryCO2Warning = ({ from, to, route, locations }) => {
    let startLocation = airports.find(({ code }) => code === locations[0]);
    let endLocation = airports.find(({ code }) => code === locations[1]);

    console.log(startLocation, endLocation);
    const airDistance = route
        .map(({ lngFrom, latFrom, lngTo, latTo }) => {
            let from = point([lngFrom, latFrom]);
            let to = point([lngTo, latTo]);
            return distance(from, to, { units: "kilometers" });
        })
        .reduce((acc, curr) => acc + curr)
        .toFixed(2);
    const groundDistance = distance(
        point([startLocation.lon, startLocation.lat]),
        point([endLocation.lon, endLocation.lat]),
        { units: "kilometers" },
    );

    let isJourneyInEU = EU_COUNTRIES.includes(from.code) && EU_COUNTRIES.includes(to.code);

    if (isJourneyInEU) {
        return (
            <section className="jeff-informs-you">
                <h3 className="text-center">
                    {from.code === to.code ? (
                        <i>
                            This flight is domestic! Here's how much CO<sub>2</sub> you could've produced.
                        </i>
                    ) : (
                        <i>
                            This flight is in the EU! Here's how much CO<sub>2</sub> you could've produced.
                        </i>
                    )}
                </h3>
                <div className="jeff-informs-data">
                    <div>
                        <FontAwesomeIcon icon={faPlaneDeparture} color={jeff_green} size="2x" />
                        <p>
                            <b>Plane</b>
                            <br />
                            <b>
                                <i>{(airDistance * 0.1753).toFixed(2)}kg</i>
                            </b>
                        </p>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faCar} color={jeff_green} size="2x" />
                        <p>
                            <b>Small Car</b>
                            <br />
                            <b>
                                <i>{(groundDistance * 0.1276).toFixed(2)}kg</i>
                            </b>
                        </p>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faTruck} color={jeff_green} size="2x" />
                        <p>
                            <b>Large Car</b>
                            <br />
                            <b>
                                <i>{(groundDistance * 0.257).toFixed(2)}kg</i>
                            </b>
                        </p>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faTrain} color={jeff_green} size="2x" />
                        <p>
                            <b>Train</b>
                            <br />
                            <b>
                                <i>{(groundDistance * 0.06).toFixed(2)}kg</i>
                            </b>
                        </p>
                    </div>
                    <div>
                        <FontAwesomeIcon icon={faBus} color={jeff_green} size="2x" />
                        <p>
                            <b>Bus</b>
                            <br />
                            <b>
                                <i>{(groundDistance * 0.089).toFixed(2)}kg</i>
                            </b>
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    const treeAmount = new Array(Math.floor((airDistance * 0.1753).toFixed(2) / 21)).fill(faTree);

    return (
        <section className="jeff-informs-you">
            <h3 className="text-center">
                That's a long flight! Here's how many trees you'd need to absorb your carbon for just this flight!
            </h3>
            <div className="jeff-tree-holder">
                {treeAmount.map(tree => (
                    <FontAwesomeIcon icon={tree} color="#b7e778" size="2x" />
                ))}
            </div>
            <h6 style={{ marginBottom: 5 }} className="text-center">
                ({treeAmount.length} trees!)
            </h6>
        </section>
    );
};

const SingleSearchResult = ({ result, index }) => {
    let totalDistance = 0;
    if (Array.isArray(result.route)) {
        totalDistance = result.route
            .map(({ lngFrom, latFrom, lngTo, latTo }) => {
                let from = point([lngFrom, latFrom]);
                let to = point([lngTo, latTo]);
                return distance(from, to, { units: "kilometers" });
            })
            .reduce((acc, curr) => {
                return acc + curr;
            })
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
                    CO<sub>2</sub> Per Passenger
                </h5>
                <p>
                    <i>{(totalDistance * 0.1753).toFixed(2)}kg</i>
                </p>
            </div>
            <div>
                <h5 style={{ marginBottom: 0 }}>Price</h5>
                <p>£{result.price}</p>
            </div>
            <div>
                <a href={result.deep_link} target="_blank" rel="noopener noreferrer">
                    <Button className="jeff-green">
                        <span>Purchase</span>
                        <FontAwesomeIcon style={{ marginLeft: 5 }} icon={faPlaneDeparture}></FontAwesomeIcon>
                    </Button>
                </a>
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
                        style={{ backgroundPosition: "bottom center", opacity: 1 }}
                    >
                        {children}
                    </BackgroundImage>
                );
            }}
        />
    );
};
export default IndexPage;
