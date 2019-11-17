/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import PropTypes from "prop-types";
import { useStaticQuery, graphql } from "gatsby";

import Header from "./header";
import "./layout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const Layout = ({ children }) => {
    const data = useStaticQuery(graphql`
        query SiteTitleQuery {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `);

    return (
        <>
            <Header siteTitle={data.site.siteMetadata.title} />
            <div>
                <main>{children}</main>
                <footer className="footer">
                    <div>
                        <a href="https://github.com/LukeXF/emissions-calculator">
                            <FontAwesomeIcon icon={faGithub} size="2x" color="white" />
                        </a>
                    </div>
                    <span style={{color: 'white', fontWeight: 'bold', fontSize: 18}}> ElementSoftworks, ©{new Date().getFullYear()}</span>
                </footer>
            </div>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
