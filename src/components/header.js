import React from "react";
import PropTypes from "prop-types";
import Img from "gatsby-image";
import { Link, useStaticQuery } from "gatsby";

import "../styles/components/_header.scss";

const Header = ({ siteTitle }) => (
    <header className="header">
        <div className="header-container">
            <Link style={{ minWidth: 150 }} to="/">
                <Logo className="header-logo" />
            </Link>
            <span style={{ color: "#b7e778" }}>
                <i>Helping to remove your orangutan guilt.</i>
            </span>
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

    return <Img {...props} fluid={data.placeholderImage.childImageSharp.fluid} />;
};

export default Header;
