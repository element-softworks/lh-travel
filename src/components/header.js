import React from "react";
import PropTypes from "prop-types";
import Img from "gatsby-image";
import { Link, useStaticQuery } from "gatsby";

import "../styles/components/_header.scss";

const Header = ({ siteTitle }) => (
    <header className="header">
        <div className="header-container">
            <Link to="/">
                <Logo className="header-logo" />
            </Link>
        </div>
    </header>
);

Header.propTypes = {
    siteTitle: PropTypes.string,
};

Header.defaultProps = {
    siteTitle: ``,
};

const Logo = ({ ...props }) => {
    const data = useStaticQuery(graphql`
        query {
            placeholderImage: file(relativePath: { eq: "logo.png" }) {
                childImageSharp {
                    fluid(maxWidth: 300) {
                        ...GatsbyImageSharpFluid
                    }
                }
            }
        }
    `);

    return (
        <Img {...props} fluid={data.placeholderImage.childImageSharp.fluid} />
    );
};

export default Header;
