import React, { useState } from "react";
import { Link, StaticQuery } from "gatsby";

import BackgroundImage from "gatsby-background-image";

import Layout from "../components/layout";
import Image from "../components/image";
import SEO from "../components/seo";

// Style Import
import "../styles/_index.scss";
import "../styles/pages/_index.scss";

import { Search, Button } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import useKonami from "react-use-konami";

import * as _airports from "../static/airports.json";
const airports = _airports.map(item => ({ ...item, key: item.code }));

const IndexPage = () => {
    const [isFalloutMode, setFalloutMode] = useState(false);
    const [isSearching, setSearching] = useState(false);
    const [dates, setDates] = useState([]);
    const [locations, setLocations] = useState(["", ""]);
    const [results, setResults] = useState([]);

    useKonami(() => {
        setFalloutMode(true);
    });

    function onSearchChange(e, { value }) {
        let results = airports.filter(
            ({ title, key }) => title.includes(value) || key.includes(value),
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
    }

    function onDateSelect(date, leg) {}

    return (
        <React.Fragment>
            <SEO title="Flight Search" />
            <Layout>
                <BackgroundSection fallout={isFalloutMode}>
                    <section className="splash-container">
                        <h1 className="splash-title">
                            Jeff's big green{" "}
                            {isFalloutMode ? "fallout" : "flight"} machine
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
                                    placeholder="Departure"
                                    className="splash-placepicker"
                                />
                            </div>
                            <div className="splash-date-container">
                                <DatePicker
                                    placeholderText="Departure Date"
                                    className="splash-datepicker splash-date-deperature"
                                    onChange={(...all) => console.log(all)}
                                />
                                <DatePicker
                                    placeholderText="Return Date"
                                    className="splash-datepicker splash-date-arrival"
                                    onChange={date => console.log(date)}
                                />
                            </div>
                            <div className="splash-button-container">
                                <Button className="jeff-green">Search</Button>
                            </div>
                        </div>
                    </section>
                </BackgroundSection>
                <h1>Hi people</h1>
                <p>Welcome to your new Gatsby site.</p>
                <p>Now go build something great.</p>
                <div className="test-div">
                    <Image />
                </div>
                <Link to="/page-2/">Go to page 2</Link>
            </Layout>
        </React.Fragment>
    );
};

const ResultComponent = ({ ...rest }) => {
    return (
        <span key={rest.code}>
            {rest.title} - {rest.code}
        </span>
    );
};

const BackgroundSection = ({
    className,
    children,
    fallout = false,
    ...props
}) => {
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
