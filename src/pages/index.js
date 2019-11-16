import React from "react";
import { Link, StaticQuery } from "gatsby";

import BackgroundImage from "gatsby-background-image";

import Layout from "../components/layout";
import Image from "../components/image";
import SEO from "../components/seo";

// Style Import
import "../styles/pages/_index.scss";
import "semantic-ui-css/semantic.min.css";

import { Search } from "semantic-ui-react";

const IndexPage = () => (
    <React.Fragment>
        <SEO title="Flight Search" />
        <Layout>
            <BackgroundSection />
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

const BackgroundSection = ({ className }) => (
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
                    style={{ backgroundPosition: "top center" }}
                >
                    <section className="splash-container">
                        <h1 className="splash-title">
                            Jeff's big green flight machine
                        </h1>
                        <div className="splash-search">
                            <Search placeholder="Departure" />
                            <Search placeholder="Arrival" />
                        </div>
                    </section>
                </BackgroundImage>
            );
        }}
    />
);

const countryOptions = [
    { key: "af", value: "af", flag: "af", text: "Afghanistan" },
    { key: "ax", value: "ax", flag: "ax", text: "Aland Islands" },
    { key: "al", value: "al", flag: "al", text: "Albania" },
    { key: "dz", value: "dz", flag: "dz", text: "Algeria" },
    { key: "as", value: "as", flag: "as", text: "American Samoa" },
    { key: "ad", value: "ad", flag: "ad", text: "Andorra" },
    { key: "ao", value: "ao", flag: "ao", text: "Angola" },
    { key: "ai", value: "ai", flag: "ai", text: "Anguilla" },
    { key: "ag", value: "ag", flag: "ag", text: "Antigua" },
    { key: "ar", value: "ar", flag: "ar", text: "Argentina" },
    { key: "am", value: "am", flag: "am", text: "Armenia" },
    { key: "aw", value: "aw", flag: "aw", text: "Aruba" },
    { key: "au", value: "au", flag: "au", text: "Australia" },
    { key: "at", value: "at", flag: "at", text: "Austria" },
    { key: "az", value: "az", flag: "az", text: "Azerbaijan" },
    { key: "bs", value: "bs", flag: "bs", text: "Bahamas" },
    { key: "bh", value: "bh", flag: "bh", text: "Bahrain" },
    { key: "bd", value: "bd", flag: "bd", text: "Bangladesh" },
    { key: "bb", value: "bb", flag: "bb", text: "Barbados" },
    { key: "by", value: "by", flag: "by", text: "Belarus" },
    { key: "be", value: "be", flag: "be", text: "Belgium" },
    { key: "bz", value: "bz", flag: "bz", text: "Belize" },
    { key: "bj", value: "bj", flag: "bj", text: "Benin" },
];

export default IndexPage;
