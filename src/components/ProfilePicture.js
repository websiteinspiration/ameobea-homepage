import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

const styles = {
  root: {
    marginBottom: '1.45rem',
  },
  imageContainer: { display: 'flex', flex: 1, minWidth: 110 },
  imageStyle: {
    clipPath: 'circle(46% at center 50%)',
    objectPosition: 'center 37%',
  },
};

const ProfilePicture = ({ size = 150 }) => (
  <StaticQuery
    query={graphql`
      query {
        placeholderImage: file(relativePath: { eq: "face.jpg" }) {
          childImageSharp {
            fluid(maxWidth: 250, quality: 85) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={data =>
      console.log(data.placeholderImage.childImageSharp.fluid) || (
        <div style={{ ...styles.root, flexBasis: size }}>
          <Img
            fluid={data.placeholderImage.childImageSharp.fluid}
            imgStyle={styles.imageStyle}
            style={{ ...styles.imageContainer, height: size }}
          />
        </div>
      )
    }
  />
);
export default ProfilePicture;
