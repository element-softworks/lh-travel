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

const IndexPage = () => {
    const [isFalloutMode, setFalloutMode] = useState(false);
    const [dates, setDates] = useState([]);

    useKonami(() => {
        setFalloutMode(true);
        console.log("oof");
    });

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
                                    placeholder="Departure"
                                    className="splash-placepicker"
                                />
                                <Search
                                    placeholder="Arrival"
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
                                    onChange={(...all) => console.log(all)}
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
