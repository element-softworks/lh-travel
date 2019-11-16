import React from "react";
import { Link, StaticQuery } from "gatsby";

import BackgroundImage from "gatsby-background-image";

import Layout from "../components/layout";
import Image from "../components/image";
import SEO from "../components/seo";

// Style Import
import "../styles/pages/_index.scss";
import "semantic-ui-css/semantic.min.css";

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
                >
                    <section className="splash-container">
                        <h1 className="splash-title">Hello gatsby-background-image</h1>
                    </section>
                </BackgroundImage>
            );
        }}
    />
);

export default IndexPage;
