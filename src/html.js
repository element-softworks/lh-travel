import React from "react";
import PropTypes from "prop-types";

export default function HTML(props) {
    return (
        <html {...props.htmlAttributes}>
        <head>
            <meta charSet="utf-8"/>
            <meta httpEquiv="x-ua-compatible" content="ie=edge"/>
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <link
                href="https://api.tiles.mapbox.com/mapbox-gl-js/v1.5.0/mapbox-gl.css"
                rel="stylesheet"
            />
            <meta name="description"
                  content="Fight carbon emissions! Find the most carbon neutral way to travel "/>
            <meta name="image" content="https://jeff.travel/preview.png"/>
            <meta itemProp="name" content="JEFF - Just an effiecent Flight Finder"/>
            <meta itemProp="description"
                  content="Fight carbon emissions! Find the most carbon neutral way to travel "/>
            <meta itemProp="image" content="https://jeff.travel/preview.png"/>
            <meta name="twitter:card" content="summary"/>
            <meta name="twitter:title" content="JEFF - Just an efficient Flight Finder"/>
            <meta name="twitter:description"
                  content="Fight carbon emissions! Find the most carbon neutral way to travel "/>
            <meta name="twitter:image:src" content="https://jeff.travel/preview.png"/>
            <meta name="og:title" content="JEFF - Just an efficient Flight Finder"/>
            <meta name="og:description"
                  content="Fight carbon emissions! Find the most carbon neutral way to travel "/>
            <meta name="og:image" content="https://jeff.travel/preview.png"/>
            <meta name="og:url" content="https://jeff.travel"/>
            <meta name="og:site_name" content="JEFF - Just an efficient Flight Finder"/>
            {props.headComponents}
        </head>
        <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <noscript key="noscript" id="gatsby-noscript">
            This app works best with JavaScript enabled.
        </noscript>
        <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
        </body>
        </html>
    );
}

HTML.propTypes = {
    htmlAttributes: PropTypes.object,
    headComponents: PropTypes.array,
    bodyAttributes: PropTypes.object,
    preBodyComponents: PropTypes.array,
    body: PropTypes.string,
    postBodyComponents: PropTypes.array,
};
